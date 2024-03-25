import { type FC } from "react";
import { type TransactionBodyView } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/transaction/v1/transaction_pb";

interface TxBodyViewProps {
  bodyView: TransactionBodyView,
}

const TxBodyView : FC<TxBodyViewProps> = ( bodyView ) => {
  return (
    <div>

    </div>
  );
};

export default TxBodyView;