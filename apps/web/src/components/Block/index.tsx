"use client";

import Link from "next/link";
import { type FC } from "react";
import ABCIEventsTable from "../ABCIEventsTable";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getBlock } from "./getBlock";

interface BlockProps {
  endpoint: string,
  queryName: string,
  ht: string,
}

export const Block : FC<BlockProps> = ({ endpoint, queryName, ht }) => {

  const { data } = useSuspenseQuery({
    queryKey: [queryName, ht],
    queryFn: () => getBlock({ endpoint, ht }),
  });

  const { created_at, tx_hashes, events } = data;

  return (
    <div className="flex flex-wrap justify-between sm:gap-y-10 gap-y-5 w-full">
      <div className="flex flex-wrap justify-start w-full">
        <p className="sm:w-1/6 w-full font-semibold">Block Height</p>
        <pre className="sm:w-0 w-full">{ht}</pre>
      </div>
      <div className="flex flex-wrap justify-start w-full">
        <p className="w-1/6 font-semibold">Timestamp</p>
        <pre className="sm:w-0 w-full">{created_at}</pre>
      </div>
      <div className="flex justify-start flex-wrap w-full">
        <p className="sm:w-1/6 w-full font-bold">Transactions</p>
        {/* eslint-disable-next-line @typescript-eslint/naming-convention */}
        {tx_hashes.length !== 0 ? (
          tx_hashes.map((hash, i) => (
            <Link href={`/transaction/${hash}`} key={i}>
              <pre className="underline sm:max-w-full max-w-[200px] overflow-hidden overflow-ellipsis sm:text-base">
                {hash}
              </pre>
            </Link>
          ))
        ) : (
          <p className="sm:w-0 w-full overflow-hidden text-ellipsis">None</p>
        )}
      </div>
      <div className="flex justify-start flex-wrap w-full gap-y-5">
        <p className="font-bold text-base">Block Event Attributes</p>
        {events.length !== 0 ? (
          events.map(({ type, attributes }, i) => (
            <div
              key={i}
              className="flex flex-col sm:items-start items-center w-full gap-y-1"
            >
              <ABCIEventsTable
                className="sm:w-2/3 w-full"
                type={type}
                attributes={attributes}
              />
            </div>
          ))
        ) : (
          <p>None</p>
        )}
      </div>
    </div>
  );
};
