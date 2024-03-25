import { type FC } from "react";
import { type TransactionView } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/transaction/v1/transaction_pb";

interface TxViewProps {
  tx: TransactionView
}

const TxView : FC<TxViewProps> = ( tx ) => {
  return (
  <div>

  </div>
  );
};

export default TxView;