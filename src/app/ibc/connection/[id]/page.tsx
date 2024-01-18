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
  const { id: connectionId } = params;
  const { data, isFetched, isError } = useQuery({
    queryFn: async () => {
      console.log(`Fetching: GET /api/ibc/connection/${connectionId}`);
      const { data } = await axios.get(`/api/ibc/connection?q=${connectionId}`);
      console.log("Fetched result:", data);
      return data as { clientId: string, channelIds: string[]};
      // TODO: enforce validation
      // const result = IbcConnectionValidator.safeParse(data);
    },
    queryKey: ["IbcConnection", connectionId],
    retry: false,
    meta: {
      errorMessage: "Failed to query IBC Connection by id. Please try again.",
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
          <h1 className="text-3xl mx-auto py-5 font-semibold">IBC Connection</h1>
        {// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        data  ? (
          <div className="bg-white rounded-sm flex flex-wrap justify-between p-5 max-w-2xl ml-auto mr-auto gap-2">
            <div className="flex justify-start w-full">
              <p className="w-1/5">Connection ID</p>
              <pre>{connectionId}</pre>
            </div>
            <div className="flex justify-start w-full">
              <p className="w-1/5">Client ID</p>
              <Link href={`/ibc/client/${data.clientId}`} className="underline"><pre>{data.clientId}</pre></Link>
            </div>
            <div className="flex justify-start w-full">
              <p className="w-1/5">Channel IDs</p>
              <div className="">
                {data.channelIds.map(( channelId, i ) => <Link href={`/channel/${channelId}`} key={i} className="underline"><pre>{channelId}</pre></Link>)}
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