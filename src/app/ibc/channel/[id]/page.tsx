import { type FC } from "react";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Channel } from "@/components/ibc/Channel";
import { getQueryClient } from "@/lib/utils";
import { getIbcChannel } from "@/components/ibc/Channel/getIbcChannel";

interface PageProps {
  params: {
    id: string,
  }
}

const Page : FC<PageProps> = ({ params }) => {
  const { id: channelId } = params;
  const queryClient = getQueryClient();

  const endpoint = "/api/ibc/channel";
  const queryName = "IbcChannel";
  const errorMessage = "Failed to query IBC Channel by id. Please try again.";
  queryClient.prefetchQuery({
    queryFn: () => getIbcChannel({ endpoint, channelId }),
    queryKey: [queryName, channelId],
    meta: {
      errorMessage,
    },
  });

  return (
    <div className="bg-primary flex flex-col gap-5 pt-5 items-center ">
      <h1 className="font-medium">IBC Channel</h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="sm:w-11/12 w-full">
          <Channel {...{endpoint, queryName, channelId}}/>
        </div>
      </HydrationBoundary>
    </div>
  );
};

export default Page;
