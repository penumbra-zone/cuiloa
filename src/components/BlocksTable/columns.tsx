"use client";

import { type ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export interface BlocksColumns {
  height: bigint
  created_at: string,
};

// TODO: see comments in TransactionsTable/columns.tsx
export const columns : Array<ColumnDef<BlocksColumns>> = [
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
      return <p className="text-xs text-center">{timestamp}</p>;
    },
  },
];