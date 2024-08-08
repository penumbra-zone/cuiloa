"use client";

import { type ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export interface EventColumns {
  height: bigint
  created_at: string,
  tx_hash: string,
};

// TODO: try out createColumnHelper for configurating columns
// TODO: might be worthy making any aggregate-like value linkable, returning a table view of all similarly associated values (ie all blocks for a given timestamp, chain_id, etc).
export const columns : Array<ColumnDef<EventColumns>> = [
  {
    accessorKey: "height",
    header: () => <div className="text-sm">Height</div>,
    cell: ({ row }) => {
      const ht : bigint = row.getValue("height");
      return <Link href={`/block/${ht}`} className="text-link text-sm"><pre>{ht.toString()}</pre></Link>;
    },
  },
  {
    accessorKey: "created_at",
    header: () => <div className="text-sm">Timestamp</div>,
    cell: ({ row }) => {
      const timestamp : string = row.getValue("created_at");
      return <pre className="text-sm break-all">{timestamp}</pre>;
    },
  },
  {
    accessorKey: "tx_hash",
    header: () => <div className="text-sm">Hash</div>,
    cell: ({ row }) => {
      const tx_hash : string = row.getValue("tx_hash");
      return <Link href={`/transaction/${tx_hash}`} className="text-link text-sm"><pre className="sm:max-w-full max-w-24 overflow-hidden overflow-ellipsis">{tx_hash}</pre></Link>;
    },
  },
];
