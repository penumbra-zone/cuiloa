"use client";

import { type ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export interface ChannelsColumns {
  blocks: {
    created_at: string,
    height: bigint,
  },
  attributes: Array<{
    key: string,
    value: string | null,
  }>,
};

// TODO formating, styling, etc
export const columns : Array<ColumnDef<ChannelsColumns>> = [
  {
    accessorKey: "blocks.height",
    header: () => <div className="font-semibold text-gray-800">Block</div>,
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
    accessorKey: "attributes",
    header: () => <div className="font-semibold text-gray-800 text-center">Channel ID</div>,
    cell: ({ getValue }) => {
      const attributes = getValue() as Array<{ key: string, value: string | null }>;
      // TODO: styling
      const channelId = attributes.find(({ key }) => key==="channel_id");
      return (
        <div className="text-center">
          <p>{channelId?.value}</p>
        </div>
      );
    },
  },
];