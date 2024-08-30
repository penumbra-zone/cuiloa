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
      header: () => <div className="text-sm text-foreground overflow-scroll">{header}</div>,
      columns: [
        {
          accessorKey: "key",
          cell: ({ getValue }) => {
            const abciKey = getValue() as string;
            return <pre className="text-sm text-muted-foreground">{abciKey}</pre>;
          },
        },
        {
          accessorKey: "value",
          cell: ({ getValue }) => {
            const abciValue : string = getValue() as string | null ?? "None";
            return <pre className="break-all whitespace-pre-wrap text-sm">{abciValue}</pre>;
          },
        },
      ],
    },
  ];
  return columns;
};
