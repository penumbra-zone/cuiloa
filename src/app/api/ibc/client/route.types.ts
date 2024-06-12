/** Types generated for queries found in "src/app/api/ibc/client/route.ts" */
export type stringArray = (string)[];

/** 'GetClient' parameters type */
export interface IGetClientParams {
  clientIdParam: string;
}

/** 'GetClient' return type */
export interface IGetClientResult {
  channels: stringArray;
  client_id: string;
  connection_id: string;
  events: string;
}

/** 'GetClient' query type */
export interface IGetClientQuery {
  params: IGetClientParams;
  result: IGetClientResult;
}

