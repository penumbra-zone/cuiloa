"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";

interface AttributeTableProps<TData, TValue> {
  className?: string,
  header?: string,
  columns: Array<ColumnDef<TData, TValue>>,
  columnVisibility?: VisibilityState,
  data: TData[],
}

export function AttributeTable<TData, TValue>({
  className,
  columns,
  columnVisibility,
  data,
}: AttributeTableProps<TData, TValue>) {

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    initialState: {
      columnVisibility,
    },
  });

  return (
    <div className={`${className ?? ""}`}>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups()[0].headers.map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {
                    <TableHead key={headerGroup.id} colSpan={2} className="bg-muted rounded-t-md">
                      {headerGroup.isPlaceholder
                        ? null
                        : flexRender(
                            headerGroup.column.columnDef.header,
                            headerGroup.getContext(),
                          )}
                    </TableHead>
                }
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
