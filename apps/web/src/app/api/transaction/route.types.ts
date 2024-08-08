/** Types generated for queries found in "src/app/api/transaction/route.ts" */
export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

/** 'GetTransaction' parameters type */
export interface IGetTransactionParams {
  hash: string;
}

/** 'GetTransaction' return type */
export interface IGetTransactionResult {
  created_at: Date;
  events: Json;
  height: bigint;
  tx_hash: string;
  tx_result: Buffer;
}

/** 'GetTransaction' query type */
export interface IGetTransactionQuery {
  params: IGetTransactionParams;
  result: IGetTransactionResult;
}

