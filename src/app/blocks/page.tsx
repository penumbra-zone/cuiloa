import { BlocksTable } from "@/components/BlocksTable";
import getBlocks from "@/components/BlocksTable/getBlocks";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";

export const dynamic = "force-dynamic";

const Page = () => {
  const queryClient = new QueryClient();

  const defaultQueryOptions = {
    pageIndex: 0,
    pageSize: 10,
  };

  const queryName = "BlocksTable";
  const endpoint = "/api/blocks";
  const errorMessage = "Failed to query data while trying to generate blocks table, please try reloading the page.";

  queryClient.prefetchQuery({
    queryFn: () => getBlocks({ endpoint, pageIndex: 0}),
    queryKey: [queryName, defaultQueryOptions.pageIndex],
    meta: {
      errorMessage,
    },
  });

  return (
    <div className="bg-primary flex flex-col gap-5 pt-5">
      <h1 className="sm:text-2xl font-bold self-center">Recent Blocks</h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <BlocksTable
          className="self-center sm:w-2/3 w-full"
          queryName={queryName}
          defaultQueryOptions={defaultQueryOptions}
          endpoint={endpoint}
          errorMessage={errorMessage}/>
      </HydrationBoundary>
    </div>
  );
};

export default Page;
