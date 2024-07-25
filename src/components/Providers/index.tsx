"use client";

import React, { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { createGrpcWebTransport } from "@connectrpc/connect-web";
import { TransportProvider } from "@connectrpc/connect-query";
import { Toaster } from "../ui/toaster";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { getQueryClient } from "@/lib/utils";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

const penumbraTransport = createGrpcWebTransport({
  baseUrl: process.env?.PENUMBRA_GRPC_ENDPOINT ?? "http://localhost:8080",
});


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
