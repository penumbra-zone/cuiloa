import { type FC } from "react";
import { type TransactionBodyView as TransactionBodyViewSchema } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/transaction/v1/transaction_pb";
import { ActionView } from "../../ActionView";
import { FlexCol } from "@/components/ui/flex";

interface TransactionBodyViewProps {
  bodyView: TransactionBodyViewSchema,
}

// TODO: memoView & detectionData
export const TransactionBodyView : FC<TransactionBodyViewProps> = ({ bodyView }) => {
  return (
    <FlexCol className="items-center w-full gap-y-1">
      <p className="sm:text-base text-sm text-center">Transaction Body View</p>
      <p className="text-center">Action Views</p>
      {bodyView.actionViews.length !== 0 ?
        bodyView.actionViews.map((action, i) => (<ActionView key={i} action={action}/>))
      : null}
    </FlexCol>
  );
};
