export const dynamic = "force-dynamic";
import { BlocksTable } from "@/components/BlocksTable";
import { getBlocks } from "@/components/BlocksTable/getBlocks";
import { getQueryClient } from "@/lib/utils";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";


const Page = () => {
  const queryClient = getQueryClient();

  const defaultQueryOptions = {
    pageIndex: 0,
    pageSize: 10,
  };

  const queryName = "BlocksTable";
  const endpoint = "api/blocks";
  const errorMessage = "Failed to query data while trying to generate blocks table, please try reloading the page.";

  queryClient.prefetchQuery({
    queryFn: () => getBlocks({ endpoint, pageIndex: 0}),
    queryKey: [queryName, defaultQueryOptions.pageIndex],
    staleTime: 0,
    meta: {
      errorMessage,
    },
  });

  return (
    <div className="flex flex-col gap-8 items-center">
      <div className="sm:w-11/12 w-full">
        <h1 className="text-lg font-medium">Recent Blocks</h1>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <BlocksTable
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
