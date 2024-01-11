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
      let tx = getValue() as Array<{ key: string, value: string | null }>;
      // TODO: styling are attrocious and has no labeling.
      // For Also, for labeling data, might be better to transform data at API instead of UI containing string checking lol.
      tx = tx.map(({key, value: _value}) => {
        // Not sure when/if value will actually be Null but this seems like an OK work around until restyled.
        const value = _value ?? "";
        if (key === "client_id") {
          return { key: "client", value };
        } else if (key === "client_type") {
          return { key: "type", value };
        } else if (key === "consensus_height") {
          return { key: "consensus height", value };
        }
        return {key, value};
      });
      return (
        <ul>
          {tx.map(({key, value}, index) => (<li key={index}>{key}: {value}</li>))}
        </ul>
      );
    },
  },
];