"use client";

import { type ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export interface ClientsColumns {
  client_id: string,
  last_updated_at: string,
  block_id: bigint,
  hash: string,
  consensus_height: string | null,
};

// TODO formating, styling, etc
export const columns : Array<ColumnDef<ClientsColumns>> = [
  {
    accessorKey: "client_id",
    header: () => <div className="font-semibold text-gray-800 sm:text-lg text-sm text-center">Client ID</div>,
    cell: ({ getValue }) => {
      const clientId: string = getValue() as string;
      return <Link href={`/ibc/client/${clientId}`} className="underline sm:text-base text-xs"><p className="text-center">{clientId}</p></Link>;
    },
  },
  {
    accessorKey: "block_id",
    header: () => <div className="font-semibold text-gray-800 sm:text-lg text-sm text-center">Height</div>,
    cell: ({ getValue }) => {
      const ht: bigint = getValue() as bigint;
      return <Link href={`/block/${ht}`} className="underline sm:text-base text-xs"><p className="text-center">{ht.toString()}</p></Link>;
    },
  },
  {
    accessorKey: "last_updated_at",
    header: () => <div className="font-semibold text-gray-800 text-center sm:text-lg text-sm">Last Updated</div>,
    cell: ({ getValue }) => {
      const timestamp : string = getValue() as string;
      return <p className="sm:text-sm text-xs text-center break-all">{timestamp}</p>;
    },
  },
  {
    accessorKey: "hash",
    header: () => <div className="font-semibold text-gray-800 text-center sm:text-lg text-sm">Transaction Hash</div>,
    cell: ({ getValue }) => {
      const hash = getValue() as string;
      return <Link href={`/transaction/${hash}`} className="underline sm:text-base text-xs text-center"><pre className="sm:max-w-full max-w-[45px] overflow-hidden overflow-ellipsis">{hash}</pre></Link>;
    },
  },
  {
    accessorKey: "consensus_height",
    header: () => <div className="font-semibold text-gray-800 text-center sm:text-lg text-sm">Last Consensus Height</div>,
    cell: ({ getValue }) => {
      const consesusHeight: string = getValue() as string | null ?? "None";
      return <p className="sm:text-sm text-xs text-center break-all">{consesusHeight}</p>;
    },
  },
];
