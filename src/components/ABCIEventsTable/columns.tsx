"use client";

import { type ColumnDef } from "@tanstack/react-table";

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface ABCIEventsColumns {
  key: string,
  value: string | null,
};

export const makeColumns = ( header: string ) => {
  const columns : Array<ColumnDef<ABCIEventsColumns>> = [
    {
      id: "type",
      header: () => <div className="font-semibold text-gray-800 text-center sm:break-normal break-all sm:text-base text-xs">{header}</div>,
      columns: [
        {
          accessorKey: "key",
          cell: ({ getValue }) => {
            const abciKey = getValue() as string;
            return <pre className="text-center sm:text-sm text-xs">{abciKey}</pre>;
          },
        },
        {
          accessorKey: "value",
          cell: ({ getValue }) => {
            const abciValue : string = getValue() as string | null ?? "None";
            return <pre className="text-center  break-all whitespace-pre-wrap sm:w-auto sm:px-0 px-2 sm:text-sm text-xs">{abciValue}</pre>;
          },
        },
      ],
    },
  ];
  return columns;
};