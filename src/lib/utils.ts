import { toast } from "@/components/ui/use-toast";
import { createGrpcWebTransport } from "@connectrpc/connect-web";
import { QueryCache, QueryClient, defaultShouldDehydrateQuery, isServer } from "@tanstack/react-query";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

export const getQueryClient = () => {
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


export const penumbraTransport = createGrpcWebTransport({
  baseUrl: process.env.PENUMBRA_GRPC_ENDPOINT ?? "http://localhost:8080",
});


export function getBaseURL() {
  if (!isServer) {
    return "";
  }
  if (process?.env?.APP_URL !== undefined) {
    return `${process.env.APP_URL}`;
  }
  return "http://localhost:3000";
}
