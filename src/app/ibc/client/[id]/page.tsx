"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { type FC } from "react";

interface PageProps {
  params: {
    id: string
  }
}

const Page : FC<PageProps> = ({ params }) => {
  const { id } = params;
  const { data , isFetched, isError } = useQuery({
    queryFn: async () => {
      console.log("Fetching: GET /api/ibc/client");
      const { data } = await axios.get(`/api/ibc/client?q=${id}`);
      console.log("Fetched result:", data);
      // TODO: enforce validation
      // const result = IbcClientValidator.safeParse(data);
      return data as { channelId: string, connectionId: string, clientId: string, clientType: string, consensusHeight: string, header: string };
    },
    queryKey: ["IbcClient", id],
    retry: false,
    meta: {
      errorMessage: "Failed to query IBC Client by id. Please try again.",
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
          <h1 className="text-3xl mx-auto py-5 font-semibold">IBC Client</h1>
        {// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        data  ? (
          <div className="bg-white rounded-sm flex flex-wrap justify-between p-5 max-w-5xl ml-auto mr-auto gap-2">
            <div className="flex justify-start w-full">
              <p className="w-1/6">Client ID</p>
              <pre>{data.clientId}</pre>
            </div>
            <div className="flex justify-start w-full">
              <p className="w-1/6">Client Type</p>
              <pre>{data.clientType}</pre>
            </div>
            <div className="flex justify-start w-full">
              <p className="w-1/6">Counterparty Height</p>
              <pre>{data.consensusHeight}</pre>
            </div>
            <div className="flex justify-start w-full">
              <p className="w-1/6">Channel ID</p>
              <Link href={`/ibc/channel/${data.channelId}`} className="underline"><pre>{data.clientId}</pre></Link>
            </div>
            <div className="flex justify-start w-full">
              <p className="w-1/6">Connection IDs</p>
              <Link href={`/ibc/connection/${data.connectionId}`} className="underline"><pre>{data.connectionId}</pre></Link>
            </div>
            {/* <div className="flex justify-start w-full">
              <p className="w-1/6">Header</p>
              <div className="overflow-hidden">
                {data.recentTransactions.map(({ hash }, i) => <Link href={`/transaction/${hash}`} key={i} className="underline"><pre>{hash}</pre></Link>)}
              </div>
            </div> */}
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