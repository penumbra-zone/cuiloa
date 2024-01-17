"use client";

import { type FC } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

interface PageProps {
  params: {
    id: string,
  }
}

const Page : FC<PageProps> = ({ params }) => {
  const { id: channelId } = params;
  const { data, isFetched, isError } = useQuery({
    queryFn: async () => {
      console.log(`Fetching: GET /api/ibc/channel/${channelId}`);
      const { data } = await axios.get(`/api/ibc/channel?q=${channelId}`);
      console.log("Fetched result:", data);
      return data as { connectionId: string, clientId: string, consensusHeight: string, recentTransactions: Array<{hash: string}>};
      // TODO: enforce validation
      // const result = IbcChannelValidator.safeParse(data);
    },
    queryKey: ["IbcChannel", channelId],
    retry: false,
    meta: {
      errorMessage: "Failed to query IBC Channel by id. Please try again.",
    },
  });

  if (isError) {
    return (
      <div className="py-5 flex justify-center">
        <h1 className="text-4xl font-semibold">No results found.</h1>
      </div>
    );
  }

  return (
    <div>
      {isFetched ? (
        <div className="flex flex-col justify-center w-full">
          <h1 className="text-3xl mx-auto py-5 font-semibold">IBC Channel</h1>
        {// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        data  ? (
          <div className="bg-white rounded-sm flex flex-wrap justify-between p-5 max-w-5xl ml-auto mr-auto gap-2">
            <div className="flex justify-start w-full">
              <p className="w-1/6">Channel ID</p>
              <pre>{channelId}</pre>
            </div>
            <div className="flex justify-start w-full">
              <p className="w-1/6">Client ID</p>
              <Link href={`/ibc/client/${data.clientId}`} className="underline"><pre>{data.clientId}</pre></Link>
            </div>
            <div className="flex justify-start w-full">
              <p className="w-1/6">Counterparty Height</p>
              <pre>{data.consensusHeight}</pre>
            </div>
            <div className="flex justify-start w-full">
              <p className="w-1/6">Connection IDs</p>
              <Link href={`/ibc/connection/${data.connectionId}`} className="underline"><pre>{data.connectionId}</pre></Link>
            </div>
            <div className="flex justify-start w-full">
              <p className="w-1/6">Recent Transactions</p>
              <div className="overflow-hidden">
                {data.recentTransactions.map(({ hash }, i) => <Link href={`/transaction/${hash}`} key={i} className="underline"><pre>{hash}</pre></Link>)}
              </div>
            </div>
          </div>
        ) : (
          <p>No results</p>
        )}
       </div>
      ) : (
        <p>loading...</p>
      )}
    </div>
  );
};

export default Page;