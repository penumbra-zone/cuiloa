/** Types generated for queries found in "src/app/api/transactions/route.ts" */

/** 'GetTransactions' parameters type */
export interface IGetTransactionsParams {
  pageLimit: bigint | number;
  pageOffset: bigint | number;
}

/** 'GetTransactions' return type */
export interface IGetTransactionsResult {
  created_at: Date;
  height: bigint;
  tx_hash: string;
}

/** 'GetTransactions' query type */
export interface IGetTransactionsQuery {
  params: IGetTransactionsParams;
  result: IGetTransactionsResult;
}

/** 'GetTransactionsCount' parameters type */
export type IGetTransactionsCountParams = void;

/** 'GetTransactionsCount' return type */
export interface IGetTransactionsCountResult {
  count: number;
}

/** 'GetTransactionsCount' query type */
export interface IGetTransactionsCountQuery {
  params: IGetTransactionsCountParams;
  result: IGetTransactionsCountResult;
}

