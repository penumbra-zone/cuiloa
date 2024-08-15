"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { getIbcConnection } from "./getIbcConnection";
import Link from "next/link";
import { FC } from "react";

interface ConnectionProps {
  endpoint: string,
  queryName: string,
  connectionId: string,
}

export const Connection : FC<ConnectionProps> = ({ endpoint, queryName, connectionId }) => {
  const { data } : {
    data: Array<{
      connection_id: string,
      client_id: string,
      channel_ids: string[],
    }>,
  } = useSuspenseQuery({
    queryKey: [queryName, connectionId],
    queryFn: () => getIbcConnection({ endpoint, connectionId }),
  });

  // TODO: API should be returning that first row by default.
  const { connection_id, client_id, channel_ids } = data.at(0) ?? { connection_id: "", client_id: "", channel_ids: [] };

  return (
    <div className="flex flex-col justify-start gap-y-5 w-full">
      <div className="flex flex-wrap justify-start w-full">
        <p className="sm:w-1/6 w-full font-semibold">Connection ID</p>
        <pre className="sm:w-0 w-full">{connection_id}</pre>
      </div>
      <div className="flex flex-wrap justify-start w-full">
        <p className="sm:w-1/6 w-full font-semibold">Client ID</p>
        <Link
          href={`/ibc/client/${client_id}`}
          className="underline sm:w-0 w-full"
        >
          <pre>{client_id}</pre>
        </Link>
      </div>
      <div className="flex flex-wrap justify-start w-full">
        <p className="sm:w-1/6 w-full font-semibold">Channel IDs</p>
        <div className="">
          {channel_ids.map((channelId, i) => (
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
