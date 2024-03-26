import { type FC } from "react";
import { TransactionView, type Transaction, TransactionBodyView, MemoView } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/transaction/v1/transaction_pb";
import { makeActionView } from "./TxActionView";

const makeTxView = ( { body, ...tx}: Transaction) : TransactionView => {

  const actionViews = body?.actions.map((action) => makeActionView(action)).flatMap(view => view ? [view] : []) ?? undefined;

  const bodyView = body ? new TransactionBodyView({
    actionViews,
    transactionParameters: body.transactionParameters,
    detectionData: body.detectionData,
    memoView: body.memo && new MemoView({
      memoView: {
        case: "opaque",
        value: {
          ciphertext: body.memo,
        },
      },
    }),
  }) : undefined;

  return new TransactionView({
    bodyView,
    anchor: tx.anchor,
    bindingSig: tx.bindingSig,
  });
};

interface TxViewProps {
  tx: Transaction
}

const TxView : FC<TxViewProps> = ({ tx }) => {
  const txView = makeTxView(tx);
  return (
  <div>
    <pre>{JSON.stringify(txView.toJson(), null, 2)}</pre>
  </div>
  );
};

export default TxView;