"use client";

import { type ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export interface ChannelsColumns {
  channel_id: string,
  client_id: string,
  connection_id: string,
  client_type: string,
  counterparty_client_id: string,
  consensus_height: bigint
}

export const columns : Array<ColumnDef<ChannelsColumns>> = [
  {
    accessorKey: "channel_id",
    header: () => <div className="text-sm">Channel ID</div>,
    cell: ({ getValue }) => {
      const channelId = getValue() as string;
      return <Link href={`/ibc/channel/${channelId}`} className="text-link text-sm"><pre>{channelId}</pre></Link>;
    },
  },
  {
    accessorKey: "connection_id",
    header: () => <div className="text-sm">Connection IDs</div>,
    cell: ({ getValue }) => {
      const connection_id = getValue() as string;
      return <Link href={`/ibc/connection/${connection_id}`} className="text-link text-sm"><pre>{connection_id}</pre></Link>;
    },
  },
  {
    accessorKey: "client_id",
    header: () => <div className="text-sm">Client ID</div>,
    cell: ({ getValue }) => {
      const clientId = getValue() as string;
      return <Link href={`/ibc/client/${clientId}`} className="text-link text-sm"><pre>{clientId}</pre></Link>;
    },
  },
  {
    accessorKey: "counterparty_client_id",
    header: () => <div className="text-sm">Counterparty Client ID</div>,
    cell: ({ getValue }) => {
      const counterparty_client_id = getValue() as string;
      return <pre className="text-sm">{counterparty_client_id}</pre>;
    },
  },
  {
    accessorKey: "client_type",
    header: () => <div className="text-sm">Counterparty Chain</div>,
    cell: ({ getValue }) => {
      const client_type = getValue() as string;
      return <pre className="text-sm">{client_type}</pre>;
    },
  },
  {
    accessorKey: "consensus_height",
    header: () => <div className="text-sm">Counterparty Height</div>,
    cell: ({ getValue }) => {
      const consensus_height = getValue() as string;
      return <pre className="text-sm">{consensus_height}</pre>;
    },
  },
];
