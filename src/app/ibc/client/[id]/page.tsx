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
        <div className="flex flex-col items-center gap-5 pt-5">
          <h1 className="sm:text-2xl text-lg font-bold">IBC Client</h1>
        {// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        data  ? (
          <div className="sm:w-11/12 w-full bg-white rounded-sm shadow-md">
            <div className="flex flex-col justify-start p-5 gap-y-5 w-full">
              <div className="flex flex-wrap justify-start w-full">
                <p className="sm:w-1/6 w-full font-semibold">Client ID</p>
                <pre className="sm:w-0 w-full">{data.clientId}</pre>
              </div>
              <div className="flex flex-wrap justify-start w-full">
                <p className="sm:w-1/6 w-full font-semibold">Client Type</p>
                <pre className="sm:w-0 w-full">{data.clientType}</pre>
              </div>
              <div className="flex flex-wrap justify-start w-full">
                <p className="sm:w-1/6 w-full font-semibold">Counterparty Height</p>
                <pre className="sm:w-0 w-full">{data.consensusHeight}</pre>
              </div>
              <div className="flex flex-wrap justify-start w-full">
                <p className="sm:w-1/6 w-full font-semibold">Channel ID</p>
                <Link href={`/ibc/channel/${data.channelId}`} className="underline sm:w-0 w-full"><pre>{data.clientId}</pre></Link>
              </div>
              <div className="flex flex-wrap justify-start w-full">
                <p className="sm:w-1/6 w-full font-semibold">Connection IDs</p>
                <Link href={`/ibc/connection/${data.connectionId}`} className="underline sm:w-0 w-full"><pre>{data.connectionId}</pre></Link>
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