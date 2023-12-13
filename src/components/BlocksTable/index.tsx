"use server";

import { columns } from "./columns";
import { BlocksTableQuery } from "@/lib/validators/table";
import axios from "axios";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { PaginatedDataTable, type TableQueryKey } from "../ui/paginated-data-table";
import getBlocks from "./getBlocks";

export interface BlocksTableRow {
  height: number,
  createdAt: Date,
  // TODO: It would be nice to associate all events with a given row. Need to get testnet setup again and pull in example data for building this out.
  // events: any[],
};

const BlocksTable = async () => {
  const queryClient = new QueryClient();

  const defaultQueryOptions = {
    pageIndex: 1,
    pageSize: 10,
  };

  const queryKey: TableQueryKey = ["BlocksTable", defaultQueryOptions];
  const endpoint = "/api/blocks";

  await queryClient.prefetchQuery({
    queryFn: async () => await getBlocks({ endpoint, pageIndex: 0}),
    queryKey,
    meta: {
      errorMessage: "Failed to query data while trying to generate blocks table, please try reloading the page.",
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PaginatedDataTable queryKey={queryKey} columns={columns} fetcher={getBlocks} endpoint={endpoint}/>
    </HydrationBoundary>
  );
};

export default BlocksTable;