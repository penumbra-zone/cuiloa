"use client";

import React, { useState } from "react";
import { QueryCache, QueryClient, QueryClientProvider, defaultShouldDehydrateQuery, isServer  } from "@tanstack/react-query";
import { createGrpcWebTransport } from "@connectrpc/connect-web";
import { TransportProvider } from "@connectrpc/connect-query";
import { Toaster } from "../ui/toaster";
import { toast } from "../ui/use-toast";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

const penumbraTransport = createGrpcWebTransport({
  baseUrl: "https://grpc.testnet.penumbra.zone",
});

let browserQueryClient: QueryClient | undefined = undefined;

const makeQueryClient = () => {
  // const { toast } = useToast();
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Direct suggestion by tanstack, to prevent over-eager refetching from the client.
        staleTime: 60 * 1000,
      },
      dehydrate: {
        // only successful and pending Queries are included per defaults
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
    },
    queryCache: new QueryCache({
      onError: (error, query) => {
        // TODO: Overall model is fine but need to change how meta is used.
        // Idea: Add a `errorTitle` field instead that can be used in place of "Error" below. This gives a top level, succinct explanation.
        //       `description` becomes whatever value we store inside our error value. This is what needs to be refactored to make all queries play nicely.
        //       This allows each error to clearly signal its nature while also giving detail where appropriate. The issue of that detail is delegated to the useQuery callsite
        //       and any component/route that throws errors.
        // There may be a more elegant way of expressing this but the general typing of onError's `error` and `query` arguments requires some amount of refinement for safety.
        // https://tanstack.com/query/latest/docs/react/reference/QueryCache
        let errorMessage = "";
        const meta = query?.meta ?? undefined ;
        if (meta) {
          // Precondition for this type cast: meta is of type Record<string, unknown> where any query with a meta object containing the property `errorMessage` has a value of type string.
          errorMessage = meta?.errorMessage as string ?? "";
        }
        if (errorMessage !== "") {
          toast({
            variant: "destructive",
            title: "Error",
            description: `${errorMessage}`,
          });
        } else {
          // TODO: Realistically, this will not be a useful error and should be improved further.
          toast({
            variant: "destructive",
            title: "Error",
            description: `${error.message}`,
          });
        }
      },
    }),
  });
};

const getQueryClient = () => {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
};


const Providers = ({ children } : { children: React.ReactNode }) => {
  // NOTE: there is a very explicit warning in the TanStack docs about using useState for handling QueryClient (de)hydration within the provider in the scenario where
  //       there is no Suspense boundary between the instantiation (here) and the context that is being wrapped; however, it is more or less considered best practice to
  //       use useState for QueryClient because... this is how you keep a stable reference to the client. I believe it is safe to use useState here because
  //       NextJS, in theory, injects a React.Suspense boundary around app/page.tsx when loading.tsx is provided (as I have). This is a detail that goes undocumented and
  //       unconnected in the reference docs for using this functionality with NextJS itself. If this note is confusing/unnerving, then you are having a healthy response
  //       to the current state of the core React ecosystem. I am being serious. This is what passes for non-beta software.
  const [ queryClient ] = useState(() => getQueryClient());

  return (
    <TransportProvider transport={penumbraTransport}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster/>
        </ThemeProvider>
      </QueryClientProvider>
    </TransportProvider>
  );
};

export default Providers;
