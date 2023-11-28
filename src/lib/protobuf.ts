import { TxResult } from "@buf/cosmos_cosmos-sdk.bufbuild_es/tendermint/abci/types_pb";
import { Transaction } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/transaction/v1alpha1/transaction_pb";

export const transactionFromBytes = (txBytes : Buffer) => {
  const txResult = TxResult.fromBinary(txBytes);
  return Transaction.fromBinary(txResult.tx);
};