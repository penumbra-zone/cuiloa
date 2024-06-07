/** Types generated for queries found in "src/app/api/block/route.ts" */
export type stringArray = (string)[];

/** 'GetBlock' parameters type */
export interface IGetBlockParams {
  ht?: bigint | number | null | void;
}

/** 'GetBlock' return type */
export interface IGetBlockResult {
  created_at: Date | null;
  key: string;
  tx_hashes: stringArray | null;
  type: string;
  value: string | null;
}

/** 'GetBlock' query type */
export interface IGetBlockQuery {
  params: IGetBlockParams;
  result: IGetBlockResult;
}

