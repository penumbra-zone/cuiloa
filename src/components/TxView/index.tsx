import { type FC } from "react";
import { TransactionView, type Transaction, TransactionBodyView, MemoView } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/transaction/v1/transaction_pb";
import { makeActionView } from "@/lib/protobuf";
import TxBodyView from "./TxBodyView";

const makeTxView = ({ body, ...tx }: Transaction) : TransactionView => {

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
  // console.log("TransactionView", txView);
  return (
    <div className="flex flex-col sm:items-start items-center w-full gap-y-1">
      <div>
        <p className="text-sm font-semibold">TxBodyView</p>
        {txView.bodyView ? (<TxBodyView bodyView={txView.bodyView}/>) : "None"}
      </div>
      <div>
        <p>Binding Signature</p>
        <pre>{txView.bindingSig ? txView.bindingSig.inner : "None"}</pre>
      </div>
      <div>
        <p>Anchor</p>
        <pre>{txView.anchor ? txView.anchor.inner : "None"}</pre>
      </div>
    </div>
  );
};

export default TxView;