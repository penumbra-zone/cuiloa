import { TxResult } from "@buf/cosmos_cosmos-sdk.bufbuild_es/tendermint/abci/types_pb";
// import { MsgCreateClient } from "@buf/cosmos_ibc.bufbuild_es/ibc/core/client/v1/tx_pb";
import { Transaction } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/transaction/v1/transaction_pb";
// import { IbcRelay } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/component/ibc/v1alpha1/ibc_pb";


export const transactionFromBytes = (txBytes : Buffer) => {
  const txResult = TxResult.fromBinary(txBytes);
  return Transaction.fromBinary(txResult.tx);
};

// NOTE: As of now, cannot completely decode the Protobuf data for an IBC client related transaction
//       due to ibc.core.client.v1.MsgCreateClient not having a defined URL protobuf schema that can be resolved.
//       What data that can be returned by decoding from TxResult and Transaction is not all that useful.
export const ibcEventFromBytes = (txBytes : Buffer) : [Transaction, TxResult] => {
  const ibcEvent = TxResult.fromBinary(txBytes);
  const tx = Transaction.fromBinary(ibcEvent.tx);
  return [tx, ibcEvent];
};