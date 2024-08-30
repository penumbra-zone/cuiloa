"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";
import { type FC } from "react";
import { getIbcChannel } from "./getIbcChannel";

interface ChannelProps {
  endpoint: string,
  queryName: string,
  channelId: string,
}

export const Channel : FC<ChannelProps> = ({ endpoint, queryName, channelId }) => {
  const { data } : {
    data: {
      connectionId: string, clientId: string, consensusHeight: string, recentTxs: string[]
    }
  } = useSuspenseQuery({
    queryKey: [queryName, channelId],
    queryFn: () => getIbcChannel({ endpoint, channelId }),
  });

  return (
    <div className="flex flex-col justify-start gap-5 w-full">
      <div className="flex flex-wrap justify-start w-full">
        <p className="sm:w-1/6 w-full font-medium">Channel ID</p>
        <pre className="sm:w-0 w-full">{channelId}</pre>
      </div>
      <div className="flex flex-wrap justify-start w-full">
        <p className="sm:w-1/6 w-full font-medium">Client ID</p>
        <Link
          href={`/ibc/client/${data.clientId}`}
          className="sm:w-0 w-full text-link"
        >
          <pre>{data.clientId}</pre>
        </Link>
      </div>
      <div className="flex flex-wrap justify-start w-full">
        <p className="sm:w-1/6 w-full font-medium">Counterparty Height</p>
        <pre className="sm:w-0 w-full">{data.consensusHeight}</pre>
      </div>
      <div className="flex flex-wrap justify-start w-full">
        <p className="sm:w-1/6 w-full font-medium">Connection IDs</p>
        <Link
          href={`/ibc/connection/${data.connectionId}`}
          className="sm:w-0 w-full text-link"
        >
          <pre>{data.connectionId}</pre>
        </Link>
      </div>
      <div className="flex flex-wrap justify-start w-full">
        <p className="sm:w-1/6 w-full font-medium">Recent Transactions</p>
        <div className="sm:w-5/6 w-full">
          {data.recentTxs.map((hash, i) => (
            <Link href={`/transaction/${hash}`} key={i} className="text-link">
              <pre className="sm:font-base font-sm overflow-hidden overflow-ellipsis">
                {hash}
              </pre>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
