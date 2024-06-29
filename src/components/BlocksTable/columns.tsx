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
      return <pre className="text-sm">{timestamp}</pre>;
    },
  },
];
