import { type FC } from "react";
import { Block } from "@/components/Block";
import { getBlock } from "@/components/Block/getBlock";
import { getQueryClient } from "@/lib/utils";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface PageProps {
  params: {
    ht: string
  }
}

const Page : FC<PageProps> = ({ params }) => {
  const { ht } = params;

  const queryClient = getQueryClient();

  const endpoint = "api/block/";
  const queryName = "htQuery";
  const errorMessage = "Failed to query block with provided height, please check height or try a different query";

  queryClient.prefetchQuery({
    queryKey: ["htQuery", ht],
    queryFn: () => getBlock({ endpoint, ht }),
    meta: {
      errorMessage,
    },
  });

  return (
    <div className="bg-primary rounded-sm shadow-md">
      <div className="flex flex-col gap-5 pt-5 items-center">
        <h1 className="sm:text-2xl text-lg font-bold">Block Summary</h1>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <div className="sm:w-11/12 w-full">
            <Block {...{endpoint, queryName, ht }}/>
          </div>
        </HydrationBoundary>
      </div>
    </div>
  );
};

export default Page;
