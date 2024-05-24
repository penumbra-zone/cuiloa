import { type FC } from "react";
import { TransactionView as TransactionViewSchema, type Transaction, TransactionBodyView as TransactionBodyViewSchema, MemoView } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/transaction/v1/transaction_pb";
import { makeActionView } from "@/lib/protobuf";
import { TransactionBodyView } from "./TransactionBodyView";
import { FlexRow } from "../ui/flex";
import { ActionRow } from "../ActionView";

const BindingSig = ActionRow;
const MerkleRoot = ActionRow;

const makeTransactionView = ({ body, ...tx }: Transaction) : TransactionViewSchema => {

  const actionViews = body?.actions.map((action) => makeActionView(action)).flatMap(view => view ? [view] : []) ?? undefined;

  const bodyView = body ? new TransactionBodyViewSchema({
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

  return new TransactionViewSchema({
    bodyView,
    anchor: tx.anchor,
    bindingSig: tx.bindingSig,
  });
};

interface TransactionViewProps {
  tx: Transaction
}

export const TransactionView : FC<TransactionViewProps> = ({ tx }) => {
  const txView = makeTransactionView(tx);
  return (
    <FlexRow className="flex-wrap justify-start w-full">
      <p className="font-semibold sm:text-lg">Transaction View</p>
      {txView.bodyView ? <TransactionBodyView bodyView={txView.bodyView}/> : "None"}
      {txView.bindingSig ? <BindingSig label="Binding Signature" value={txView.bindingSig.inner}/> : null}
      {txView.anchor ? <MerkleRoot label="Anchor" value={txView.anchor.inner}/> : null}
    </FlexRow>
  );
};
