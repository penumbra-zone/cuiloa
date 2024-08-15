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
    <div className="bg-primary/60 flex flex-col gap-5 pt-5 items-center">
      <h1 className="sm:text-2xl font-bold">Recent Transactions</h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <TransactionsTable
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
