import { Client } from "@/components/ibc/Client";
import { getIbcClient } from "@/components/ibc/Client/getIbcClient";
import { getQueryClient } from "@/lib/utils";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { type FC } from "react";

interface PageProps {
  params: {
    id: string
  }
}

const Page : FC<PageProps> = ({ params }) => {
  const { id: clientId } = params;
  const queryClient = getQueryClient();

  const endpoint = "api/ibc/client";
  const queryName = "IbcClient";
  const errorMessage = "Failed to query IBC Client by id. Please try again.";
  queryClient.prefetchQuery({
    queryFn: () => getIbcClient({ endpoint, clientId }),
    queryKey: [queryName, clientId],
    meta: {
      errorMessage,
    },
  });

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-lg font-medium">IBC Client</h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="w-full">
          <Client {...{endpoint, queryName, clientId}}/>
        </div>
      </HydrationBoundary>
    </div>
  );
};

export default Page;
