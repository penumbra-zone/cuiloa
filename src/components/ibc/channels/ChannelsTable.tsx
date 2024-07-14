"use client";

import { columns } from "./columns";
import { useState, type FC } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PaginationState, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { getIbcChannels } from "./getIbcChannels";
import { cn } from "@/lib/utils";
import { PaginatedDataTable } from "@/components/ui/paginated-data-table";

export interface QueryOptions {
  pageIndex: number,
  pageSize: number,
}

interface ChannelsTableProps {
  className?: string,
  queryName: string,
  defaultQueryOptions: QueryOptions,
  endpoint: string,
  errorMessage: string,
}

export const ChannelsTable : FC<ChannelsTableProps> = ({className, queryName, defaultQueryOptions, endpoint, errorMessage }) => {

  const [pagination, setPagination] = useState<PaginationState>({...defaultQueryOptions});

  const { data } : {
      data: { results: Array<{
        channel_id: string,
        client_id: string,
        connection_id: string,
        client_type: string,
        counterparty_client_id: string,
        consensus_height: bigint,
      }>,
      pages: number,
    }
  } = useSuspenseQuery({
    queryKey: [queryName, pagination.pageIndex],
    queryFn: () => getIbcChannels({ endpoint, pageIndex: pagination.pageIndex }),
    meta: {
      errorMessage,
    },
  });


  const { pages: pageCount, results: channelsData } = data ?? { pages: 0, results: []};

  const table = useReactTable({
    data: channelsData,
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
