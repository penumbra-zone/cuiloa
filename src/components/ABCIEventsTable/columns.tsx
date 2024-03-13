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
    header: () => <div className="font-semibold text-gray-800 text-center sm:text-base text-sm">Type</div>,
    cell: ({ getValue }) => {
      const abciType = getValue() as string;
      return <pre className="text-center sm:whitespace-normal whitespace-pre-wrap sm:break-normal break-all sm:w-auto sm:text-sm text-xs">{abciType}</pre>;
    },
  },
  {
    accessorKey: "key",
    header: () => <div className="font-semibold text-gray-800 text-center sm:text-base text-sm">Key</div>,
    cell: ({ getValue }) => {
      const abciKey = getValue() as string;
      return <pre className="sm:whitespace-normal whitespace-pre-wrap sm:break-normal break-all text-center sm:text-sm text-xs">{abciKey}</pre>;
    },
  },
  {
    accessorKey: "value",
    header: () => <div className="font-semibold text-gray-800 text-center sm:text-base text-sm">Value</div>,
    cell: ({ getValue }) => {
      const abciValue : string = getValue() as string | null ?? "None";
      return <pre className="text-center break-all whitespace-pre-wrap sm:w-auto w-[120px] sm:text-sm text-xs">{abciValue}</pre>;
    },
  },
];