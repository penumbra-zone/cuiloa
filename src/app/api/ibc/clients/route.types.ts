/** Types generated for queries found in "src/app/api/ibc/clients/route.ts" */

/** 'GetClients' parameters type */
export type IGetClientsParams = void;

/** 'GetClients' return type */
export interface IGetClientsResult {
  block_id: bigint;
  client_id: string;
  consensus_height: string | null;
  hash: string;
  last_updated_at: Date;
}

/** 'GetClients' query type */
export interface IGetClientsQuery {
  params: IGetClientsParams;
  result: IGetClientsResult;
}

