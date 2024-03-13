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
        <div className="flex flex-col items-center gap-5 pt-5">
          <h1 className="sm:text-2xl text-lg font-bold">IBC Connection</h1>
        {// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        data  ? (
          <div className="sm:w-11/12 w-full bg-white rounded-sm shadow-md">
            <div className="flex flex-col justify-start p-5 gap-y-5 w-full">
              <div className="flex flex-wrap justify-start w-full">
                <p className="sm:w-1/6 w-full font-semibold">Connection ID</p>
                <pre className="sm:w-0 w-full">{connectionId}</pre>
              </div>
              <div className="flex flex-wrap justify-start w-full">
                <p className="sm:w-1/6 w-full font-semibold">Client ID</p>
                <Link href={`/ibc/client/${data.clientId}`} className="underline sm:w-0 w-full"><pre>{data.clientId}</pre></Link>
              </div>
              <div className="flex flex-wrap justify-start w-full">
                <p className="sm:w-1/6 w-full font-semibold">Channel IDs</p>
                <div className="">
                  {data.channelIds.map(( channelId, i ) => <Link href={`/channel/${channelId}`} key={i} className="underline sm:w-0 w-full"><pre>{channelId}</pre></Link>)}
                </div>
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