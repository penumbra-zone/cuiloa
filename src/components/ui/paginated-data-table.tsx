"use client";
 
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type PaginationState,
} from "@tanstack/react-table";
 
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";

import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { type z } from "zod";

export interface QueryOptions {
  pageIndex: number,
  pageSize: number,
}

export type TableQueryKey = [string, QueryOptions];

interface FetcherParams {
  endpoint: string,
  pageIndex: number
};

type Fetcher<Z extends z.ZodTypeAny> = ({ endpoint, pageIndex} : FetcherParams) => Promise<z.infer<Z>>;

interface PaginatedDataTableProps<TData, TValue, Z extends z.ZodTypeAny> {
  columns: Array<ColumnDef<TData, TValue>>
  queryKey: TableQueryKey,
  endpoint: string,
  fetcher: Fetcher<Z>,
}
 
export function PaginatedDataTable<TData, TValue, Z extends z.ZodTypeAny>({
  columns,
  queryKey,
  endpoint,
  fetcher,
}: PaginatedDataTableProps<TData, TValue, Z>) {

  const options = queryKey[1];

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({...options});

  const { data } = useQuery({
    queryKey,
    queryFn: async () => await fetcher({ endpoint, pageIndex }),
    meta: {
      errorMessage: "Failed to query paginated data to populate table. Please try again.",
    },
  });

  const [pageCount, tableData] : z.infer<Z> = data ?? [0, []];
  console.log("pageCount", pageCount);
  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  );

  const table = useReactTable({
    data: tableData as TData[],
    columns,
    pageCount,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-slate-200">
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
                  className="bg-white"
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {table.previousPage()}}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {table.nextPage()}}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
     </div>
  );
}