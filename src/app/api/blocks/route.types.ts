/** Types generated for queries found in "src/app/api/blocks/route.ts" */
export type NumberOrString = number | string;

/** 'GetBlocksByDesc' parameters type */
export interface IGetBlocksByDescParams {
  pageOffset: NumberOrString;
  queryLimit: NumberOrString;
}

/** 'GetBlocksByDesc' return type */
export interface IGetBlocksByDescResult {
  created_at: Date;
  height: string;
  rowid: string;
}

/** 'GetBlocksByDesc' query type */
export interface IGetBlocksByDescQuery {
  params: IGetBlocksByDescParams;
  result: IGetBlocksByDescResult;
}

/** 'GetBlocksCount' parameters type */
export type IGetBlocksCountParams = void;

/** 'GetBlocksCount' return type */
export interface IGetBlocksCountResult {
  _count: number | null;
}

/** 'GetBlocksCount' query type */
export interface IGetBlocksCountQuery {
  params: IGetBlocksCountParams;
  result: IGetBlocksCountResult;
}

