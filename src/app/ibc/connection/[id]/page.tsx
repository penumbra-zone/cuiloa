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
  const { id } = params;
  const { data, isFetched, isError } = useQuery({
    queryFn: async () => {
      console.log(`Fetching: GET /api/ibc/connection/${id}`);
      const { data } = await axios.get(`/api/ibc/connection?q=${id}`);
      console.log("Fetched result:", data);
      return data as Array<{ connection_id: string, client_id: string, channel_ids: string[] }>;
      // TODO: enforce validation
      // const result = IbcConnectionValidator.safeParse(data);
    },
    queryKey: ["IbcConnection", id],
    retry: false,
    meta: {
      errorMessage: "Failed to query IBC Connection by id. Please try again.",
    },
  });

  if (isError || !data) {
    return (
      <div className="py-5 flex justify-center">
        <h1 className="text-4xl font-semibold">No results found.</h1>
      </div>
    );
  }

  const { connection_id: connectionId, client_id: clientId, channel_ids: channelIds } = data[0];

  return (
    <div className="bg-primary rounded-sm shadow-md">
      {isFetched ? (
        <div className="flex flex-col items-center gap-5 pt-5">
          <h1 className="sm:text-2xl text-lg font-bold">IBC Connection</h1>
          <div className="sm:w-11/12 w-full">
            <div className="flex flex-col justify-start p-5 gap-y-5 w-full">
              <div className="flex flex-wrap justify-start w-full">
                <p className="sm:w-1/6 w-full font-semibold">Connection ID</p>
                <pre className="sm:w-0 w-full">{connectionId}</pre>
              </div>
              <div className="flex flex-wrap justify-start w-full">
                <p className="sm:w-1/6 w-full font-semibold">Client ID</p>
                <Link href={`/ibc/client/${clientId}`} className="underline sm:w-0 w-full"><pre>{clientId}</pre></Link>
              </div>
              <div className="flex flex-wrap justify-start w-full">
                <p className="sm:w-1/6 w-full font-semibold">Channel IDs</p>
                <div className="">
                  {channelIds.map(( channelId, i ) => <Link href={`/ibc/channel/${channelId}`} key={i} className="underline sm:w-0 w-full"><pre>{channelId}</pre></Link>)}
                </div>
              </div>
            </div>
          </div>
       </div>
      ) : (
        <p>loading...</p>
      )}
    </div>
  );
};

export default Page;
