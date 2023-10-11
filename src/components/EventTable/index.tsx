/* 
  TODO: This component is going to be what represents data query results.
  
  Could try extracting out a minimal data table representation that can then be modified for different query types (Blocks vs Transaction Results vs Transaction Results, etc) but
  starting with plain transaction events or block events will probably be the way to go for now.
*/

export type TransactionType = "tx" | "action_spend" | "action_output" | "action_delegate" | "action_undelegate" | "action_postion_open"| "action_postion_close" | "action_swap" | "action_swap_claim" | "action_position_withdraw" | "action_spend" ;
export type TransactionKey = "amount" | "hash" | "height" | "note_commitment" | "nullifier" | "position_id" | "reserves_1" | "reserves_2" | "trading_fee" | "trading_p1" | "trading_p2" | "trading_pair" | "validator";

export interface TransactionEvent {
  height: number,
  hash?: string,
  chain_id: string,
  type: TransactionType,
  key: TransactionKey,
  value: string | number,
  createdAt: Date,
};