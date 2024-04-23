import { TxResult } from "@buf/cometbft_cometbft.bufbuild_es/cometbft/abci/v1/types_pb";
import { OutputView, OutputView_Opaque, SpendView, SpendView_Opaque } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/component/shielded_pool/v1/shielded_pool_pb";
import { type AddressView } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/keys/v1/keys_pb";
import { type Action, ActionView, Transaction } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/transaction/v1/transaction_pb";
import { createGetter } from "./getter/create-getter";
import { SwapView, SwapView_Opaque, SwapClaimView, SwapClaimView_Opaque } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/component/dex/v1/dex_pb";
import { DelegatorVoteView, DelegatorVoteView_Opaque } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/component/governance/v1/governance_pb";

export const makeActionView = ({ action }: Action): ActionView | undefined => {
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
    case "delegatorVote":
      return new ActionView({
        actionView: {
          case: "delegatorVote",
          value: new DelegatorVoteView({
            delegatorVote: {
              case: "opaque",
              value: new DelegatorVoteView_Opaque({
                delegatorVote: action.value,
              }),
            },
          }),
        },
      });
    // TODO: None of these actions have *View equivalents. Is exhausitively constructing an ActionView from them OK?
    case "validatorDefinition":
    case "ibcRelayAction":
    case "proposalSubmit":
    case "proposalWithdraw":
    case "validatorVote":
    case "proposalDepositClaim":
    case "positionOpen":
    case "positionClose":
    case "positionWithdraw":
    case "positionRewardClaim":
    case "communityPoolSpend":
    case "communityPoolOutput":
    case "communityPoolDeposit":
    case "undelegateClaim":
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


export const getWalletId = createGetter((addressView?: AddressView) =>
  addressView?.addressView.case === "decoded" && addressView.addressView.value.walletId
  ? addressView.addressView.value.walletId
  : undefined,
);

export const getSpendNote = createGetter((spendView?: SpendView) =>
  spendView?.spendView.case === "visible" ? spendView.spendView.value?.note : undefined,
);

export const getSpend = createGetter((spendView?: SpendView) =>
  spendView?.spendView.value?.spend ? spendView.spendView.value.spend : undefined,
);

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