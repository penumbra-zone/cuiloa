/** Types generated for queries found in "src/app/api/ibc/connections/route.ts" */

/** 'GetConnections' parameters type */
export interface IGetConnectionsParams {
  pageLimit?: bigint | number | null | void;
  pageOffset: bigint | number;
}

/** 'GetConnections' return type */
export interface IGetConnectionsResult {
  connection_id: string;
}

/** 'GetConnections' query type */
export interface IGetConnectionsQuery {
  params: IGetConnectionsParams;
  result: IGetConnectionsResult;
}

/** 'GetConnectionsCount' parameters type */
export type IGetConnectionsCountParams = void;

/** 'GetConnectionsCount' return type */
export interface IGetConnectionsCountResult {
  count: number;
}

/** 'GetConnectionsCount' query type */
export interface IGetConnectionsCountQuery {
  params: IGetConnectionsCountParams;
  result: IGetConnectionsCountResult;
}

