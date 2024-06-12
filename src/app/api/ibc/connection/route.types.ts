/** Types generated for queries found in "src/app/api/ibc/connection/route.ts" */
export type stringArray = (string)[];

/** 'GetConnectionInfo' parameters type */
export interface IGetConnectionInfoParams {
  connectionId: string;
}

/** 'GetConnectionInfo' return type */
export interface IGetConnectionInfoResult {
  channel_ids: stringArray;
  client_id: string;
  connection_id: string;
}

/** 'GetConnectionInfo' query type */
export interface IGetConnectionInfoQuery {
  params: IGetConnectionInfoParams;
  result: IGetConnectionInfoResult;
}

