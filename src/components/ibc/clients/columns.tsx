"use client";

import { type ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export interface ClientsColumns {
  tx_results: {
    tx_hash: string | null,
  },
  blocks: {
    created_at: string,
    height: bigint,
  },
  attributes: Array<{
    key: string,
    value: string,
  }>,
};

// TODO formating, styling, etc
export const columns : Array<ColumnDef<ClientsColumns>> = [
  {
    accessorKey: "blocks.height",
    header: () => <div className="font-semibold text-gray-800">Height</div>,
    cell: ({ getValue }) => {
      const ht: bigint = getValue() as bigint;
      return <Link href={`/block/${ht}`} className="underline">{ht.toString()}</Link>;
    },
  },
  {
    accessorKey: "blocks.created_at",
    header: () => <div className="font-semibold text-gray-800 text-center">Timestamp</div>,
    cell: ({ getValue }) => {
      const timestamp : string = getValue() as string;
      return <p className="text-xs text-center">{timestamp}</p>;
    },
  },
  {
    accessorKey: "tx_results",
    header: () => <div className="font-semibold text-gray-800 text-center">Hash</div>,
    cell: ({ getValue }) => {
      const tx = getValue() as { tx_hash : string | null };
      if (tx.tx_hash !== null) {
        return <p className="text-xs text-center">{tx.tx_hash}</p>;
      }
    },
  },
  {
    accessorKey: "attributes",
    header: () => <div className="font-semibold text-gray-800 text-center">info</div>,
    cell: ({ getValue }) => {
      const tx = getValue() as Array<{ key: string, value: string | null }>;
      // TODO: besides styling itself, do better re: null value case for value
      return (
        <ul>
          {tx.map(({key, value}, index) => (<li key={index}>{key}{value}</li>))}
        </ul>
      );
    },
  },
];