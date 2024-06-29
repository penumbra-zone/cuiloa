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
      return data as Array<{ channels: string[], connection_id: string, client_id: string, events: string }>;
    },
    queryKey: ["IbcClient", id],
    retry: false,
    meta: {
      errorMessage: "Failed to query IBC Client by id. Please try again.",
    },
  });

  // Not the best.
  if (isError || data?.length === undefined) {
    return (
      <div className="py-5 flex justify-center">
        <h1 className="text-4xl font-semibold">No results found.</h1>
      </div>
    );
  }
  // ... Still Not The Best.
  const { client_id: clientId, connection_id: connectionId, channels, events: eventsJSON} = data[0];
  const events: Array<{ key: string, value: string }> = JSON.parse(eventsJSON);
  const consensusHeight = events.find(({ key }) => key === "consensus_height")?.value ?? "NONE";
  const clientType = events.find(({ key }) => key === "client_type")?.value ?? "NONE";
  // TODO: Do we just want a header and not the whole transaction decoded? packets?
  // const header = events.find(({ key }) => key === "header")?.value ?? "NONE";

  return (
    <div className="bg-primary rounded-sm shadow-md">
      {isFetched ? (
        <div className="flex flex-col items-center gap-5 pt-5">
          <h1 className="sm:text-2xl text-lg font-bold">IBC Client</h1>
          <div className="sm:w-11/12 w-full">
            <div className="flex flex-col justify-start p-5 gap-y-5 w-full">
              <div className="flex flex-wrap justify-start w-full">
                <p className="sm:w-1/6 w-full font-semibold">Client ID</p>
                <pre className="sm:w-0 w-full">{clientId}</pre>
              </div>
              <div className="flex flex-wrap justify-start w-full">
                <p className="sm:w-1/6 w-full font-semibold">Client Type</p>
                <pre className="sm:w-0 w-full">{clientType}</pre>
              </div>
              <div className="flex flex-wrap justify-start w-full">
                <p className="sm:w-1/6 w-full font-semibold">Counterparty Height</p>
                <pre className="sm:w-0 w-full">{consensusHeight}</pre>
              </div>
              <div className="flex flex-wrap justify-start w-full">
                <p className="sm:w-1/6 w-full font-semibold">Connection IDs</p>
                <Link href={`/ibc/connection/${connectionId}`} className="underline sm:w-0 w-full"><pre>{connectionId}</pre></Link>
              </div>
              <div className="flex flex-wrap justify-start w-full">
                <p className="sm:w-1/6 w-full font-semibold">Channel IDs</p>
                <div className="">
                  {channels.map(( channelId, i ) => <Link href={`/ibc/channel/${channelId}`} key={i} className="underline sm:w-0 w-full"><pre>{channelId}</pre></Link>)}
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
