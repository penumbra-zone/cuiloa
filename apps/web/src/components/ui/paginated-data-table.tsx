import { ColumnDef, Table as TableT, flexRender } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./Table";
import { Button } from "./button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginatedDataTableProps<TData, TValue> {
  table: TableT<TData>,
  columns: Array<ColumnDef<TData, TValue>>
}

export function PaginatedDataTable<TData, TValue> ({ table, columns } : PaginatedDataTableProps<TData, TValue> ) {

  return (
    <div>
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                className="hover:bg-muted/80"
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
    <div className="flex items-center justify-center sm:justify-end py-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {table.previousPage()}}
        disabled={!table.getCanPreviousPage()}
      >
        <ChevronLeft className="w-4 h-4 mr-[1px] mt-[-1px]"/>
        <span className="align-middle">Previous</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {table.nextPage()}}
        disabled={!table.getCanNextPage()}
      >
        <span>Next</span>
        <ChevronRight className="w-4 h-4 ml-[1px] mt-[-1px]"/>
      </Button>
    </div>
   </div>
  );
}
