"use client";

import { type ColumnDef } from "@tanstack/react-table";

export type ABCIEventsColumns = Record<number, {
  type: string,
  key: string,
  value: string | null,
}>;

export const columns : Array<ColumnDef<ABCIEventsColumns>> = [
  {
    accessorKey: "type",
    header: () => <div className="font-semibold text-gray-800 text-center sm:text-lg text-sm">Type</div>,
    cell: ({ getValue }) => {
      const abciType = getValue() as string;
      return <pre className="text-center">{abciType}</pre>;
    },
  },
  {
    accessorKey: "key",
    header: () => <div className="font-semibold text-gray-800 text-center sm:text-lg text-sm">Key</div>,
    cell: ({ getValue }) => {
      const abciKey = getValue() as string;
      return <pre className="text-center">{abciKey}</pre>;
    },
  },
  {
    accessorKey: "value",
    header: () => <div className="font-semibold text-gray-800 text-center sm:text-lg text-sm">Value</div>,
    cell: ({ getValue }) => {
      const abciValue : string = getValue() as string | null ?? "None";
      return <pre className="text-center">{abciValue}</pre>;
    },
  },
];