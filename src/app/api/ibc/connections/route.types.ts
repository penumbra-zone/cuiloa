/** Types generated for queries found in "src/app/api/ibc/connections/route.ts" */

/** 'GetConnections' parameters type */
export type IGetConnectionsParams = void;

/** 'GetConnections' return type */
export interface IGetConnectionsResult {
  connection_id: string;
}

/** 'GetConnections' query type */
export interface IGetConnectionsQuery {
  params: IGetConnectionsParams;
  result: IGetConnectionsResult;
}

