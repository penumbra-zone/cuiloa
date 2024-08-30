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

  const endpoint = "api/ibc/channel";
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
    <div className="flex flex-col gap-8 px-6 pb-8 items-center ">
      <div className="sm:w-11/12 w-full">
        <h1 className="text-lg font-medium">IBC Channel</h1>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        {/* TODO: don't forget to remove this extra pb-8 once Channel is cleaned up. */}
        <div className="sm:w-11/12 w-full">
          <Channel {...{endpoint, queryName, channelId}}/>
        </div>
      </HydrationBoundary>
    </div>
  );
};

export default Page;
