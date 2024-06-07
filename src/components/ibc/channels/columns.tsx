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

// TODO formating, styling, etc
export const columns : Array<ColumnDef<ChannelsColumns>> = [
  {
    accessorKey: "channel_id",
    header: () => <div className="font-semibold text-gray-800 text-center sm:text-lg text-sm">Channel ID</div>,
    cell: ({ getValue }) => {
      const channelId = getValue() as string;
      return <Link href={`/ibc/channel/${channelId}`} className="underline sm:text-base text-xs"><p className="text-center">{channelId}</p></Link>;
    },
  },
  {
    accessorKey: "connection_id",
    header: () => <div className="font-semibold text-gray-800 text-center sm:text-lg text-sm">Connection IDs</div>,
    cell: ({ getValue }) => {
      const connection_id = getValue() as string;
      return <Link href={`/ibc/connection/${connection_id}`}><p className="underline text-center sm:text-base text-xs">{connection_id}</p></Link>;
    },
  },
  {
    accessorKey: "client_id",
    header: () => <div className="font-semibold text-gray-800 text-center sm:text-lg text-sm">Client ID</div>,
    cell: ({ getValue }) => {
      const clientId = getValue() as string;
      return <Link href={`/ibc/client/${clientId}`}><p className="underline text-center sm:text-base text-xs">{clientId}</p></Link>;
    },
  },
  {
    accessorKey: "counterparty_client_id",
    header: () => <div className="font-semibold text-gray-800 text-center sm:text-lg text-sm">Counterparty Chain</div>,
    cell: ({ getValue }) => {
      const counterparty_client_id = getValue() as string;
      return (
        <div className="text-center sm:text-base text-xs">
          <p>{counterparty_client_id}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "client_type",
    header: () => <div className="font-semibold text-gray-800 text-center sm:text-lg text-sm">Counterparty Chain</div>,
    cell: ({ getValue }) => {
      const client_type = getValue() as string;
      return (
        <div className="text-center sm:text-base text-xs">
          <p>{client_type}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "consensus_height",
    header: () => <div className="font-semibold text-gray-800 text-center sm:text-lg text-sm">Counterparty Height</div>,
    cell: ({ getValue }) => {
      const consensus_height = getValue() as string;
      return (
        <div className="text-center sm:text-base text-xs">
          <p>{consensus_height}</p>
        </div>
      );
    },
  },
];
