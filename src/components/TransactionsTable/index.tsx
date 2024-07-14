"use client";

import { columns } from "./columns";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PaginatedDataTable } from "../ui/paginated-data-table";
import { getTransactions } from "./getTransactions";
import { useState } from "react";
import { PaginationState, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { cn } from "@/lib/utils";

export interface QueryOptions {
  pageIndex: number,
  pageSize: number,
}

interface TransactionsTableProps {
  className?: string,
  queryName: string,
  defaultQueryOptions: QueryOptions,
  endpoint: string,
  errorMessage: string,
}
// NOTE: There isn't a good place to put this so I'll write it here. The reason why cuiloa has all these wrapper components around
//       PaginatedDataTable instead of passing the querying and pagination logic into PaginatedDataTable is because of the limitations
//       of how NextJS handles hydration + logic of React.Suspense + how tanstack/query implements Suspense for server hydration.
//       TL;DR, without having explicit code splitting that handles isServer/isBrowser instantiations, NextJS completely breaks.
//       A more pragmatic compromise would be to write a generic getter instead of trying to pass a query function.
//       This would eliminate the need for intermediate *Table components and flatten the component tree, too.
export function TransactionsTable ({
  className,
  queryName,
  defaultQueryOptions,
  endpoint,
  errorMessage,
} : TransactionsTableProps) {

  const [pagination, setPagination] = useState<PaginationState>({...defaultQueryOptions});

  const { data } = useSuspenseQuery({
    queryKey: [queryName, pagination.pageIndex],
    queryFn: () => getTransactions({ endpoint, pageIndex: pagination.pageIndex }),
    meta: {
      errorMessage,
    },
  });

  const { pages: pageCount, results: tableData } = data ?? { pages: 0, results: []};

  const table = useReactTable({
    data: tableData,
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
    <div className={cn(className)} >
      <PaginatedDataTable table={table} columns={columns}/>
    </div>
  );
};
