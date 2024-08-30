export const dynamic = "force-dynamic";
import { ChannelsTable } from "@/components/ibc/channels/ChannelsTable";
import { getIbcChannels } from "@/components/ibc/channels/getIbcChannels";
import { getQueryClient } from "@/lib/utils";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

const Page = () => {
  const queryClient = getQueryClient();

  const defaultQueryOptions = {
    pageIndex: 0,
    pageSize: 0,
  };

  const endpoint = "api/ibc/channels";
  const queryName = "IbcChannels";
  const errorMessage = "Failed to query for IBC Channels. Please try again.";

  queryClient.prefetchQuery({
    queryKey: [queryName, defaultQueryOptions.pageIndex],
    queryFn: () => getIbcChannels({ endpoint, pageIndex: defaultQueryOptions.pageIndex }),
    meta: {
      errorMessage,
    },
  });

  return (
    <div className="flex flex-col gap-8 px-6 items-center">
      <div className="sm:w-11/12 w-full">
        <h1 className="text-lg font-medium">IBC Channels</h1>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ChannelsTable
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
