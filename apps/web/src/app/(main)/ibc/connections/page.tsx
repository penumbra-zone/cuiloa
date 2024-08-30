export const dynamic = "force-dynamic";
import ConnectionsTable from "@/components/ibc/connections/ConnectionsTable";
import { getIbcConnections } from "@/components/ibc/connections/getIbcConnections";
import { getQueryClient } from "@/lib/utils";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

const Page = () => {
  const queryClient = getQueryClient();

  const defaultQueryOptions = {
    pageIndex: 0,
    pageSize: 0,
  };

  const endpoint = "api/ibc/connections";
  const queryName = "IbcConnections";
  const errorMessage = "Failed to query for IBC Connections. Please try again.";

  queryClient.prefetchQuery({
    queryKey: [queryName, defaultQueryOptions.pageIndex],
    queryFn: () => getIbcConnections({ endpoint, pageIndex: defaultQueryOptions.pageIndex }),
    meta: {
      errorMessage,
    },
  });

  return (
    <div className="flex flex-col gap-8 px-6 items-center">
      <div className="flex w-full justify-start items-center">
        <h1 className="text-lg font-medium">IBC Connections</h1>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ConnectionsTable
          className="sm:w-11/12 w-full"
          queryName={queryName}
          defaultQueryOptions={defaultQueryOptions}
          endpoint={endpoint}
          errorMessage={errorMessage}/>
      </HydrationBoundary>
    </div>
  );
};

export default Page;
