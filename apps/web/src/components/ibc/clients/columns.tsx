"use client";

import { type ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export interface ClientsColumns {
  client_id: string,
  last_updated_at: string,
  block_id: bigint,
  consensus_height: string | null,
};

// TODO formating, styling, etc
export const columns : Array<ColumnDef<ClientsColumns>> = [
  {
    accessorKey: "client_id",
    header: () => <div className="text-sm">Client ID</div>,
    cell: ({ getValue }) => {
      const clientId: string = getValue() as string;
      return <Link href={`/ibc/client/${clientId}`} className="text-link text-sm"><pre>{clientId}</pre></Link>;
    },
  },
  {
    accessorKey: "block_id",
    header: () => <div className="text-sm">Height</div>,
    cell: ({ getValue }) => {
      const ht: bigint = getValue() as bigint;
      return <Link href={`/block/${ht}`} className="text-link text-sm"><pre>{ht.toString()}</pre></Link>;
    },
  },
  {
    accessorKey: "last_updated_at",
    header: () => <div className="text-sm">Last Updated</div>,
    cell: ({ getValue }) => {
      const timestamp : string = getValue() as string;
      return <pre className="text-sm break-all">{timestamp}</pre>;
    },
  },
  {
    accessorKey: "consensus_height",
    header: () => <div className="text-sm">Last Consensus Height</div>,
    cell: ({ getValue }) => {
      const consesusHeight: string = getValue() as string | null ?? "None";
      return <pre className="text-sm break-all">{consesusHeight}</pre>;
    },
  },
];
