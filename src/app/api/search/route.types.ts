/** Types generated for queries found in "src/app/api/search/route.ts" */

/** 'GetBlockSearch' parameters type */
export interface IGetBlockSearchParams {
  blockParam: bigint | number;
}

/** 'GetBlockSearch' return type */
export interface IGetBlockSearchResult {
  height: bigint;
}

/** 'GetBlockSearch' query type */
export interface IGetBlockSearchQuery {
  params: IGetBlockSearchParams;
  result: IGetBlockSearchResult;
}

/** 'GetTransactionSearch' parameters type */
export interface IGetTransactionSearchParams {
  txParam: string;
}

/** 'GetTransactionSearch' return type */
export interface IGetTransactionSearchResult {
  hash: string;
}

/** 'GetTransactionSearch' query type */
export interface IGetTransactionSearchQuery {
  params: IGetTransactionSearchParams;
  result: IGetTransactionSearchResult;
}

/** 'GetClientSearch' parameters type */
export interface IGetClientSearchParams {
  clientId: string;
}

/** 'GetClientSearch' return type */
export interface IGetClientSearchResult {
  hash: string;
  type: string;
}

/** 'GetClientSearch' query type */
export interface IGetClientSearchQuery {
  params: IGetClientSearchParams;
  result: IGetClientSearchResult;
}

/** 'GetChannelSearch' parameters type */
export interface IGetChannelSearchParams {
  channelId: string;
}

/** 'GetChannelSearch' return type */
export interface IGetChannelSearchResult {
  hash: string;
  type: string;
}

/** 'GetChannelSearch' query type */
export interface IGetChannelSearchQuery {
  params: IGetChannelSearchParams;
  result: IGetChannelSearchResult;
}

/** 'GetConnectionSearch' parameters type */
export interface IGetConnectionSearchParams {
  connectionId: string;
}

/** 'GetConnectionSearch' return type */
export interface IGetConnectionSearchResult {
  hash: string;
  type: string;
}

/** 'GetConnectionSearch' query type */
export interface IGetConnectionSearchQuery {
  params: IGetConnectionSearchParams;
  result: IGetConnectionSearchResult;
}

