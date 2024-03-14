"use client";

import { type ColumnDef } from "@tanstack/react-table";

export type ABCIEventsColumns = Record<number, {
  type: string,
  key: string,
  value: string | null,
}>;

export const columns : Array<ColumnDef<ABCIEventsColumns>> = [
  {
    accessorKey: "key",
    header: () => <div className="font-semibold text-gray-800 text-center text-sm">Key</div>,
    cell: ({ getValue }) => {
      const abciKey = getValue() as string;
      return <pre className="text-center sm:text-sm text-xs">{abciKey}</pre>;
    },
  },
  {
    accessorKey: "value",
    header: () => <div className="font-semibold text-gray-800 text-center text-sm">Value</div>,
    cell: ({ getValue }) => {
      const abciValue : string = getValue() as string | null ?? "None";
      return <pre className="text-center  break-all whitespace-pre-wrap sm:w-auto sm:px-0 px-2 sm:text-sm text-xs">{abciValue}</pre>;
    },
  },
];