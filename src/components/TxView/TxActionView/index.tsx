import { type FC } from "react";
import { SwapView, SwapView_Opaque, SwapClaimView, SwapClaimView_Opaque } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/component/dex/v1/dex_pb";
import { SpendView, SpendView_Opaque, OutputView, OutputView_Opaque } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/component/shielded_pool/v1/shielded_pool_pb";
import { type Action, ActionView } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/transaction/v1/transaction_pb";

export const makeActionView = ({ action }: Action) : ActionView | undefined => {
  // TODO: Enumerate more cases, please
  switch (action.case) {
    case "spend":
      return new ActionView({
        actionView: {
          case: "spend",
          value: new SpendView({
            spendView: {
              case: "opaque",
              value: new SpendView_Opaque({
                spend: action.value,
              }),
            },
          }),
        },
      });
    case "output":
      return new ActionView({
        actionView: {
          case: "output",
          value: new OutputView({
            outputView: {
              case: "opaque",
              value: new OutputView_Opaque({
                output: action.value,
              }),
            },
          }),
        },
      });
    case "swap":
      return new ActionView({
        actionView: {
          case: "swap",
          value: new SwapView({
            swapView: {
              case: "opaque",
              value: new SwapView_Opaque({
                swap: action.value,
              }),
            },
          }),
        },
      });
    case "swapClaim":
      return new ActionView({
        actionView: {
          case: "swapClaim",
          value: new SwapClaimView({
            swapClaimView: {
              case: "opaque",
              value: new SwapClaimView_Opaque({
                swapClaim: action.value,
              }),
            },
          }),
        },
      });
    case "ics20Withdrawal":
    case "delegate":
    case "undelegate":
      return new ActionView({
        actionView: action,
      });
    default:
      return undefined;
  }
};

interface TxActionViewProps {
  action: ActionView,
}

const TxActionView : FC<TxActionViewProps> = ({ action }) => {
  return (
    <div>
    </div>
  );
};

export default TxActionView;