/** Types generated for queries found in "src/app/api/ibc/channels/route.ts" */

/** 'GetIbcChannels' parameters type */
export type IGetIbcChannelsParams = void;

/** 'GetIbcChannels' return type */
export interface IGetIbcChannelsResult {
  channel_id: string | null;
  client_id: string | null;
  client_type: string | null;
  connection_id: string | null;
  consensus_height: string | null;
  counterparty_client_id: string | null;
}

/** 'GetIbcChannels' query type */
export interface IGetIbcChannelsQuery {
  params: IGetIbcChannelsParams;
  result: IGetIbcChannelsResult;
}
