import { type FC } from "react";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Transaction } from "@/components/Transaction";
import { getTransaction } from "@/components/Transaction/getTransaction";
import { getQueryClient } from "@/lib/utils";

interface PageProps {
  params: {
    hash: string
  }
}

const Page : FC<PageProps> = ({ params }) => {
  const { hash } = params;

  const queryClient = getQueryClient();

  const endpoint = "api/transaction/";
  const queryName = "txQuery";
  const errorMessage = "Failed to query transaction, please try reloading the page.";

  queryClient.prefetchQuery({
    queryKey: [queryName, hash],
    queryFn: () => getTransaction({ endpoint, hash }),
    meta: {
      errorMessage,
    },
  });

  return (
    <div className="flex flex-col gap-8 items-center ">
      <div className="sm:w-11/12 w-full">
        <h1 className="text-lg font-medium">Transaction Summary</h1>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="sm:w-11/12 w-full">
          <Transaction {...{endpoint, queryName, hash}}/>
        </div>
      </HydrationBoundary>
    </div>
  );
};

export default Page;
