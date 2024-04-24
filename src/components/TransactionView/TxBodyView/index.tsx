import { type FC } from "react";
import { type TransactionBodyView } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/transaction/v1/transaction_pb";
import { ActionView } from "../../ActionView";

interface TxBodyViewProps {
  bodyView: TransactionBodyView,
}

const TxBodyView : FC<TxBodyViewProps> = ({ bodyView }) => {
  return (
    <div className="flex flex-col sm:items-start items-center w-full gap-y-1">
      <p>Action Views</p>
      {bodyView.actionViews.length !== 0 ?
        bodyView.actionViews.map((action, i) => (<ActionView key={i} action={action}/>))
      : null}
    </div>
  );
};

export default TxBodyView;