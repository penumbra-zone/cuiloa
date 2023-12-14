"use server";

import { columns } from "./columns";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { PaginatedDataTable } from "../ui/paginated-data-table";
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
    pageIndex: 0,
    pageSize: 10,
  };
  const queryName = "BlocksTable";
  const endpoint = "/api/blocks";
  const errorMessage = "Failed to query data while trying to generate blocks table, please try reloading the page.";

  await queryClient.prefetchQuery({
    queryFn: async () => await getBlocks({ endpoint, pageIndex: 0}),
    queryKey: [queryName, defaultQueryOptions],
    meta: {
      errorMessage,
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PaginatedDataTable
        queryName={queryName}
        defaultQueryOptions={defaultQueryOptions}
        columns={columns}
        fetcher={getBlocks}
        endpoint={endpoint}
        errorMessage={errorMessage}/>
    </HydrationBoundary>
  );
};

export default BlocksTable;