import { columns } from "./columns";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { PaginatedDataTable } from "../ui/paginated-data-table";
import getTransactions from "./getTransactions";

// TODO: resolve these typings and that with zod and how to navigate between them.
// NOTE: is it possible to derive a tuple type that encodes the valid combinations of event attributes and their types?
export type TransactionType = "tx" | "action_spend" | "action_output" | "action_delegate" | "action_undelegate" | "action_position_open"| "action_postion_close" | "action_swap" | "action_swap_claim" | "action_position_withdraw" | "action_spend" ;

export type TransactionKey = "amount" | "hash" | "height" | "note_commitment" | "nullifier" | "position_id" | "reserves_1" | "reserves_2" | "trading_fee" | "trading_p1" | "trading_p2" | "trading_pair" | "validator";

export interface Attribute {
  key: TransactionKey,
  value: string | number,
}

export interface Event {
  type: TransactionType,
  attributes: Attribute[],
}

export interface TransactionResult {
  height: number,
  createdAt: Date,
  chain_id: string,
  hash: string,
  // TODO: is string actually wanted here for the representation of this buffer 
  result: string,
  events: Event[],
};

// TODO: Could try extracting out a minimal data table representation that can then be modified for different query types
//       such as Blocks vs Block Events vs Transaction Results vs Transaction Events etc.
const TransactionsTable = async ({ className } : { className?: string })  => {
  const queryClient = new QueryClient();

  const defaultQueryOptions = {
    pageIndex: 0,
    pageSize: 10,
  };

  const endpoint = "/api/transactions";
  const queryName = "TransactionsTable";
  const errorMessage = "Failed to query data while trying to generate event table, please try reloading the page.";
  await queryClient.prefetchQuery({
    queryFn: async () => await getTransactions({ endpoint, pageIndex: 0}),
    queryKey: [queryName, defaultQueryOptions],
    meta: {
      errorMessage,
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PaginatedDataTable
        className={className}
        queryName={queryName}
        defaultQueryOptions={defaultQueryOptions}
        columns={columns}
        endpoint={endpoint}
        fetcher={getTransactions}
        errorMessage={errorMessage}/>
    </HydrationBoundary>
  );
};

export default TransactionsTable;