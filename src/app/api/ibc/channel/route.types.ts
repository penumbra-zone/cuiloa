/** Types generated for queries found in "src/app/api/ibc/channel/route.ts" */
export type stringArray = (string)[];

/** 'GetChannelInfo' parameters type */
export interface IGetChannelInfoParams {
  channelIdParam: string;
}

/** 'GetChannelInfo' return type */
export interface IGetChannelInfoResult {
  block_id: bigint | null;
  client_id: string;
  connection_id: string;
  consensus_height: string | null;
  counterparty_client_id: string | null;
  tx_hashs: stringArray | null;
}

/** 'GetChannelInfo' query type */
export interface IGetChannelInfoQuery {
  params: IGetChannelInfoParams;
  result: IGetChannelInfoResult;
}

