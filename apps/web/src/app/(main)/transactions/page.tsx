import { TransactionsTable } from "@/components/TransactionsTable";
import { getTransactions } from "@/components/TransactionsTable/getTransactions";
import { getQueryClient } from "@/lib/utils";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

// TODO: do we want this anymore? what is the story of caching between the client and events.
export const dynamic = "force-dynamic";

const Page = () => {
  const queryClient = getQueryClient();

  const defaultQueryOptions = {
    pageIndex: 0,
    pageSize: 10,
  };

  const endpoint = "api/transactions/";
  const queryName = "TransactionsTable";
  const errorMessage = "Failed to query data while trying to generate event table, please try reloading the page.";

  queryClient.prefetchQuery({
    queryFn: () => getTransactions({ endpoint, pageIndex: 0}),
    queryKey: [queryName, defaultQueryOptions.pageIndex],
    staleTime: 0,
    meta: {
      errorMessage,
    },
  });

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-lg font-medium">Recent Transactions</h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <TransactionsTable
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
