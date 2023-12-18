"use client";

import { QueryKind } from "@/lib/validators/search";
import { type ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export interface SearchResultsColumns {
  kind: string,
  created_at?: string,
  value?: string | bigint
};

export const columns : Array<ColumnDef<SearchResultsColumns>> = [
  {
    accessorKey: "kind",
    header: () => <div className="font-semibold text-gray-800">Kind</div>,
    cell: ({ row }) => {
      const kind : string = row.getValue("kind");
      return <p className="">{kind}</p>;
    },
  },
  {
    accessorKey: "created_at",
    header: () => <div className="font-semibold text-gray-800 text-center">Timestamp</div>,
    cell: ({ row }) => {
      const createdAt : string = row.getValue("created_at");
      return <p className="text-xs text-center">{createdAt}</p>;
    },
  },
  {
    accessorKey: "value",
    header: () => <div className="font-semibold text-gray-800 text-center">value</div>,
    cell: ({ row }) => {
      console.log(row);
      const kind : string = row.getValue("kind");
      if (kind === QueryKind.BlockHeight) {
        const height: bigint = row.getValue("value");
        return <Link href={`/block/${height}`} className="underline">{height.toString()}</Link>;
      } else if (kind === QueryKind.TxHash) {
        const txHash: string = row.getValue("value");
        return <Link href={`/transaction/${txHash}`} className="underline">{txHash}</Link>;
      }
    },
  },
];