"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";
import { type FC } from "react";
import { getIbcClient } from "./getIbcClient";

interface ClientProps {
  endpoint: string,
  queryName: string,
  clientId: string,
}

export const Client : FC<ClientProps> = ({ endpoint, queryName, clientId }) => {
  const { data } : {
    data: Array<{
      channels: string[],
      connection_id: string,
      client_id: string,
      events: string
    }>
  } = useSuspenseQuery({
    queryKey: [queryName, clientId],
    queryFn: () => getIbcClient({ endpoint, clientId }),
  });

  // TODO: return only one row, just like connections.
  const { client_id, connection_id: connectionId, channels, events: eventsJSON } = data.at(0) ?? { channels: [], connection_id: "", client_id: "", events: ""};
  // TODO: Not The Best. Maybe do this on the API endpoint, at least?
  const events: Array<{ key: string, value: string }> = JSON.parse(eventsJSON);
  const consensusHeight = events.find(({ key }) => key === "consensus_height")?.value ?? "NONE";
  const clientType = events.find(({ key }) => key === "client_type")?.value ?? "NONE";
  // TODO: Do we just want a header and not the whole transaction decoded? packets?
  // const header = events.find(({ key }) => key === "header")?.value ?? "NONE";

  return (
    <div className="flex flex-col justify-start gap-5 w-full">
      <div className="flex flex-wrap justify-start w-full">
        <p className="sm:w-1/6 w-full font-medium">Client ID</p>
        <pre className="sm:w-0 w-full">{client_id}</pre>
      </div>
      <div className="flex flex-wrap justify-start w-full">
        <p className="sm:w-1/6 w-full font-medium">Client Type</p>
        <pre className="sm:w-0 w-full">{clientType}</pre>
      </div>
      <div className="flex flex-wrap justify-start w-full">
        <p className="sm:w-1/6 w-full font-medium">Counterparty Height</p>
        <pre className="sm:w-0 w-full">{consensusHeight}</pre>
      </div>
      <div className="flex flex-wrap justify-start w-full">
        <p className="sm:w-1/6 w-full font-medium">Connection IDs</p>
        <Link
          href={`/ibc/connection/${connectionId}`}
          className="underline sm:w-0 w-full"
        >
          <pre>{connectionId}</pre>
        </Link>
      </div>
      <div className="flex flex-wrap justify-start w-full">
        <p className="sm:w-1/6 w-full font-medium">Channel IDs</p>
        <div className="">
          {channels.map((channelId, i) => (
            <Link
              href={`/ibc/channel/${channelId}`}
              key={i}
              className="underline sm:w-0 w-full"
            >
              <pre>{channelId}</pre>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
