import { type FC } from "react";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Connection } from "@/components/ibc/Connection";
import { getIbcConnection } from "@/components/ibc/Connection/getIbcConnection";
import { getQueryClient } from "@/lib/utils";

interface PageProps {
  params: {
    id: string,
  }
}

const Page : FC<PageProps> = ({ params }) => {
  const { id: connectionId } = params;

  const queryClient = getQueryClient();

  const endpoint = "api/ibc/connection";
  const queryName = "IbcConnection";
  const errorMessage = "Failed to query IBC Connection by id. Please try again.";
  queryClient.prefetchQuery({
    queryFn: () => getIbcConnection({ endpoint, connectionId }),
    queryKey: ["IbcConnection", connectionId],
    meta: {
      errorMessage,
    },
  });

  return (
    <div className="flex flex-col gap-8 items-center">
      <div className="sm:w-11/12 w-full">
        <h1 className="text-lg font-medium">IBC Connection</h1>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="sm:w-11/12 w-full pb-8">
          <Connection {...{endpoint, queryName, connectionId}}/>
        </div>
      </HydrationBoundary>
    </div>
  );
};

export default Page;
