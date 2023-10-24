"use client";

import { type ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export interface EventColumns {
  height: number,
  createdAt: Date,
  chain_id: string,
  hash: string,
};

// TODO: try out createColumnHelper for configurating columns
// TODO: might be worthy making any aggregate-like value linkable, returning a table view of all similarly associated values (ie all blocks for a given timestamp, chain_id, etc).
export const columns : Array<ColumnDef<EventColumns>> = [
  {
    accessorKey: "height",
    header: () => <div className="font-semibold text-gray-800">Height</div>,
    cell: ({ row }) => {
      const ht : number = row.getValue("height");
      return <Link href={`/block/${ht}`} className="underline">{ht}</Link>;
    },
  },
  {
    accessorKey: "createdAt",
    header: () => <div className="font-semibold text-gray-800 text-center">Timestamp</div>,
    cell: ({ row }) => {
      const timestamp : Date = row.getValue("createdAt");
      return <p className="text-xs">{timestamp.toISOString()}</p>;
    },
  },
  {
    accessorKey: "chain_id",
    header: () => <div className="font-semibold text-gray-800 text-center">Chain</div>,
  },
  {
    accessorKey: "hash",
    header: () => <div className="font-semibold text-gray-800 text-center">Hash</div>,
    cell: ({ row }) => {
      const tx : string = row.getValue("hash");
      return <Link href={`/tx/${tx}`} className="underline">{tx}</Link>;
    },
  },
];