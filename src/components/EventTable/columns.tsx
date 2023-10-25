"use client";

import { type ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export interface EventColumns {
  height: bigint
  created_at: string,
  chain_id: string,
  tx_results: Array<{
    tx_hash: string,
  }>,
};

// TODO: try out createColumnHelper for configurating columns
// TODO: might be worthy making any aggregate-like value linkable, returning a table view of all similarly associated values (ie all blocks for a given timestamp, chain_id, etc).
export const columns : Array<ColumnDef<EventColumns>> = [
  {
    accessorKey: "height",
    header: () => <div className="font-semibold text-gray-800">Height</div>,
    cell: ({ row }) => {
      const ht : bigint = row.getValue("height");
      return <Link href={`/block/${ht}`} className="underline">{ht.toString()}</Link>;
    },
  },
  {
    accessorKey: "created_at",
    header: () => <div className="font-semibold text-gray-800 text-center">Timestamp</div>,
    cell: ({ row }) => {
      const timestamp : string = row.getValue("created_at");
      return <p className="text-xs">{timestamp}</p>;
    },
  },
  {
    accessorKey: "chain_id",
    header: () => <div className="font-semibold text-gray-800 text-center">Chain</div>,
  },
  {
    accessorKey: "tx_results",
    header: () => <div className="font-semibold text-gray-800 text-center">Hash</div>,
    cell: ({ row }) => {
      const tx : Array<{ tx_hash: string }>= row.getValue("tx_results");
      return <Link href={`/tx/${tx[0].tx_hash}`} className="underline">{tx[0].tx_hash}</Link>;
    },
  },
];