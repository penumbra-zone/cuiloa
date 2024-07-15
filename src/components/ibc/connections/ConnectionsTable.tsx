"use client";
import { columns } from "./columns";
import { useState, type FC } from "react";
import { PaginatedDataTable } from "@/components/ui/paginated-data-table";
import { cn } from "@/lib/utils";
import { PaginationState, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { getIbcConnections } from "./getIbcConnections";
import { useSuspenseQuery } from "@tanstack/react-query";

export interface QueryOptions {
  pageIndex: number,
  pageSize: number,
}

interface ConnectionsTableProps {
  className?: string,
  queryName: string,
  defaultQueryOptions: QueryOptions,
  endpoint: string,
  errorMessage: string,
}

const ConnectionsTable : FC<ConnectionsTableProps> = ({ className, queryName, defaultQueryOptions, endpoint, errorMessage }) => {
  const [pagination, setPagination] = useState<PaginationState>({...defaultQueryOptions});

  const { data } : {
      data: { results: Array<{
        connection_id: string,
      }>,
      pages: number,
    }
  } = useSuspenseQuery({
    queryKey: [queryName, pagination.pageIndex],
    queryFn: () => getIbcConnections({ endpoint, pageIndex: pagination.pageIndex }),
    meta: {
      errorMessage,
    },
  });


  const { pages: pageCount, results: connectionsData } = data ?? { pages: 0, results: []};

  const table = useReactTable({
    data: connectionsData,
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
    <div className={cn(className)}>
      <PaginatedDataTable table={table} columns={columns}/>
    </div>
  );
};

export default ConnectionsTable;
