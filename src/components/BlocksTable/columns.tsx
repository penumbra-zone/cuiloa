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
    header: () => <div className="font-semibold text-gray-800 text-center sm:text-lg text-sm">Height</div>,
    cell: ({ row }) => {
      const ht : bigint = row.getValue("height");
      return <Link href={`/block/${ht}`} className="underline sm:text-base text-xs"><p className="text-center">{ht.toString()}</p></Link>;
    },
  },
  {
    accessorKey: "created_at",
    header: () => <div className="font-semibold text-gray-800 text-center sm:text-lg text-sm">Timestamp</div>,
    cell: ({ row }) => {
      const timestamp : string = row.getValue("created_at");
      return <p className="sm:text-base text-xs text-center">{timestamp}</p>;
    },
  },
];