"use client";

import { type ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export type ChannelsColumns = Record<number, {
    key: string,
    value: string | null,
  }>;

// TODO formating, styling, etc
export const columns : Array<ColumnDef<ChannelsColumns>> = [
  {
    id: "connectionId",
    accessorFn: (row) => row[0].value,
    header: () => <div className="font-semibold text-gray-800">Channel ID</div>,
    cell: ({ getValue }) => {
      // Precondition: value should never be null for `connection_id`
      const channelId = getValue() as string;
      return <Link href={`/ibc/channel/${channelId}`} className="underline">{channelId}</Link>;
    },
  },
  {
    id: "clientId",
    accessorFn: (row) => row[1].value,
    header: () => <div className="font-semibold text-gray-800 text-center">Client ID</div>,
    cell: ({ getValue }) => {
      const clientId = getValue() as string;
      return <Link href={`/ibc/client/${clientId}`}><p className="underline text-center">{clientId}</p></Link>;
    },
  },
  {
    id: "connectionIds",
    accessorFn: (row) => row[3].value,
    // TODO: There can be multiple connections for a given channel, something to handle/worry about later.
    header: () => <div className="font-semibold text-gray-800 text-center">Connection IDs</div>,
    cell: ({ getValue }) => {
      const connectionId = getValue() as string;
      // TODO: styling
      // const channelId = attributes.find(({ key }) => key==="channel_id");
      return (
        <div className="text-center">
          <p>{connectionId}</p>
        </div>
      );
    },
  },
  {
    id: "counterpartyId",
    accessorFn: (row) => row[2].value,
    header: () => <div className="font-semibold text-gray-800 text-center">Counterparty Chain</div>,
    cell: ({ getValue }) => {
      const counterpartyId = getValue() as string;
      return (
        <div className="text-center">
          <p>{counterpartyId}</p>
        </div>
      );
    },
  },
  {
    id: "counterpartyHeight",
    accessorFn: (row) => row[4].value,
    header: () => <div className="font-semibold text-gray-800 text-center">Counterparty Height</div>,
    cell: ({ getValue }) => {
      const counterpartyHeight = getValue() as string;
      return (
        <div className="text-center">
          <p>{counterpartyHeight}</p>
        </div>
      );
    },
  },
];