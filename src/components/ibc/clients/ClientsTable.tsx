"use client";
import { columns } from "./columns";
import { useState, type FC } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getIbcClients } from "./getIbcClients";
import { PaginationState, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { PaginatedDataTable } from "@/components/ui/paginated-data-table";

export interface QueryOptions {
  pageIndex: number,
  pageSize: number,
}

interface ClientsTableProps {
  className?: string,
  queryName: string,
  defaultQueryOptions: QueryOptions,
  endpoint: string,
  errorMessage: string,
}

export const ClientsTable : FC<ClientsTableProps> = ({className, queryName, defaultQueryOptions, endpoint, errorMessage}) => {

  const [pagination, setPagination] = useState<PaginationState>({...defaultQueryOptions});

  const { data } : {
      data: {
        results: Array<{
          client_id: string,
          block_id: bigint,
          last_updated_at: string,
          consensus_height: string | null
        }>,
      pages: number
    }
  } = useSuspenseQuery({
    queryKey: [queryName, pagination.pageIndex],
    queryFn: () => getIbcClients({ endpoint, pageIndex: pagination.pageIndex }),
    meta: {
      errorMessage,
    },
  });


  const { pages: pageCount, results: clientsData } = data ?? { pages: 0, results: []};

  const table = useReactTable({
    data: clientsData,
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
