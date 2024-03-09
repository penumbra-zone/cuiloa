"use client";

import { type ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export type ConnectionsColumns = Record<number, {
    key: string,
    value: string,
  }>;

// TODO formating, styling, etc
export const columns : Array<ColumnDef<ConnectionsColumns>> = [
  {
    id: "connectionId",
    // accessorFn: (row) => row[0].value,
    accessorKey: "value",
    header: () => <div className="font-semibold text-gray-800 text-center sm:text-lg text-sm">Channel ID</div>,
    cell: ({ getValue }) => {
      // Precondition: value should never be null for `connection_id`
      const connectionId = getValue() as string;
      return <Link href={`/ibc/connection/${connectionId}`} className="underline"><p className="text-center">{connectionId}</p></Link>;
    },
  },
];