export const dynamic = "force-dynamic";
import { ClientsTable } from "@/components/ibc/clients/ClientsTable";
import { getIbcClients } from "@/components/ibc/clients/getIbcClients";
import { getQueryClient } from "@/lib/utils";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

const Page = () => {
  const queryClient = getQueryClient();

  const defaultQueryOptions = {
    pageIndex: 0,
    pageSize: 0,
  };

  const endpoint = "api/ibc/clients";
  const queryName = "IbcClients";
  const errorMessage = "Failed to query for IBC Clients. Please try again.";

  queryClient.prefetchQuery({
    queryKey: [queryName, defaultQueryOptions.pageIndex],
    queryFn: () => getIbcClients({ endpoint, pageIndex: defaultQueryOptions.pageIndex }),
    meta: {
      errorMessage,
    },
  });

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-lg font-medium">IBC Clients</h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ClientsTable
          className="w-full"
          queryName={queryName}
          defaultQueryOptions={defaultQueryOptions}
          endpoint={endpoint}
          errorMessage={errorMessage}/>
      </HydrationBoundary>
    </div>
  );
};

export default Page;
