import { type FC } from "react";
import { SwapView, SwapView_Opaque, SwapClaimView, SwapClaimView_Opaque, type SwapView_Visible, type SwapClaimView_Visible } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/component/dex/v1/dex_pb";
import { SpendView, SpendView_Opaque, OutputView, OutputView_Opaque, type OutputView_Visible, type NoteView, type Spend } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/component/shielded_pool/v1/shielded_pool_pb";
import { type Action, ActionView } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/transaction/v1/transaction_pb";
import { DelegatorVoteView, DelegatorVoteView_Opaque, type DelegatorVoteView_Visible } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/component/governance/v1/governance_pb";
import { getAddress, getAddressIndex } from "@penumbra-zone/getters/src/address-view";
import type { Address, AddressIndex, WalletId } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/keys/v1/keys_pb";
import { getSpend, getSpendNote, getWalletId } from "@/lib/protobuf";

export const makeActionView = ({ action }: Action) : ActionView | undefined => {
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


const getOutputView = ({ outputView } : OutputView) : OutputView_Opaque | OutputView_Visible => {
  switch (outputView.case) {
    case "opaque":
      return outputView.value;
    case "visible":
      return outputView.value;
    default:
      throw new Error("OutputView exhaustive check failed. This should be impossible.");
  }
};

const getSwapView = ({ swapView } : SwapView) : SwapView_Opaque | SwapView_Visible => {
  switch (swapView.case) {
    case "opaque":
      return swapView.value;
    case "visible":
      return swapView.value;
    default:
      throw new Error("SwapView exhaustive check failed. This should be impossible.");
  }
};

const getDelegatorVoteView = ({ delegatorVote } : DelegatorVoteView) : DelegatorVoteView_Opaque | DelegatorVoteView_Visible => {
  switch (delegatorVote.case) {
    case "opaque":
      return delegatorVote.value;
    case "visible":
      return delegatorVote.value;
    default:
      throw new Error("DelegatorVoteView exhaustive check failed. This should be impossible.");
  }
};

const getSwapClaimView = ({ swapClaimView } : SwapClaimView) : SwapClaimView_Opaque | SwapClaimView_Visible => {
  switch (swapClaimView.case) {
    case "opaque":
      return swapClaimView.value;
    case "visible":
      return swapClaimView.value;
    default:
      throw new Error("SwapClaimView exhaustive check failed. This should be impossible.");
  }
};

const TxSpend : FC<{spend: Spend}>= ({spend}) => {
  const spendBody = spend.body;
  return (
    <div className="flex flex-col">
      <p>Spend</p>
      <div className="flex flex-col">
        {spend.proof ? (
          <div className="flex">
            <p>Proof</p>
            <pre>{spend.proof.inner}</pre>
          </div>
        ) : null}
        {spend.authSig ? (
        <div className="flex">
          <p>AuthSig</p>
          <pre>{spend.authSig.inner}</pre>
        </div>
        ) : null}
        {spendBody ? (
          <div className="flex">
            <p>Body</p>
            <div className="flex">
              {spendBody.nullifier ? (
                <div className="flex">
                  <p>Nullifier</p>
                  <pre>{spendBody.nullifier.inner}</pre>
                </div>
              ) : spendBody.rk ? (
                <div className="flex">
                  <p>Randomized Validating Key</p>
                  <pre>{spendBody.rk.inner}</pre>
                </div>
              ) : <p>None</p>}
            </div>
          </div>
        ): null}
      </div>
    </div>
  );
};

const TxAddress :FC<{ address: Address }> = ({ address }) => {
  return (
    <div className="flex flex-col">
      <div className="flex">
        <p>Altbech32</p>
        <p>{address.altBech32m}</p>
      </div>
      <div className="flex">
        <p>Inner</p>
        <pre>{address.inner}</pre>
      </div>
    </div>
  );
};

const TxAddressIndex : FC<{ index: AddressIndex }> = ({ index }) => {
  return (
    <div className="flex flex-col">
      <div className="flex">
        <p>Account</p>
        <p>{index.account}</p>
      </div>
      <div className="flex">
        <p>Randomizer</p>
        <pre>{index.randomizer}</pre>
      </div>
    </div>
  );
};

const TxWalletId : FC<{ walletId: WalletId }> = ({ walletId }) => {
  return (
    <div className="flex flex-col">
      <p>WalletID</p>
      <div className="flex">
        <p>WalletID inner</p>
        <pre>{walletId.inner}</pre>
      </div>
    </div>
  );
};



const TxNoteView : FC<{note: NoteView}>= ({ note }) => {
  const address = getAddress.optional()(note.address);
  const walletId = getWalletId.optional()(note.address);
  const addressIndex = getAddressIndex.optional()(note.address);



  return (
    <div className="flex flex-col">
      <p>TxNote</p>
      {address ? (
        <div className="flex flex-col">
          <p>Address</p>
          <TxAddress address={address}/>
          {walletId !== undefined ? <TxWalletId walletId={walletId}/> : null}
          {addressIndex ? <TxAddressIndex index={addressIndex}/> : null}
        </div>
      ) : null}
      <div className="flex flex-col">
        <p>rseed</p>
        <pre>{note.rseed}</pre>
      </div>
    </div>
  );
};

const TxSpendView : FC<{ spend: Spend, noteView?: NoteView}> = ({spend, noteView}) => {
  return (
    <div className="flex flex-col">
      <p>Spend View</p>
      <TxSpend spend={spend} />
      {noteView !== undefined ? (
        <TxNoteView note={noteView}/>
      ) : null}
    </div>
  );
};

export const getActionView = ({ actionView } : ActionView) => {
  switch (actionView.case) {
    case "spend": {
      const spendView = getSpend(actionView.value);
      const noteView = getSpendNote.optional()(actionView.value);
      return <TxSpendView spend={spendView} noteView={noteView}/>;
    }
    case "output": {
      const outputView = getOutputView(actionView.value);
      if (outputView instanceof OutputView_Opaque) {
        return (
          <div>
          </div>
        );
      } else {
        return (
          <div>
          </div>
        );
      }
    }
    case "swap": {
      const outputView = getSwapView(actionView.value);
      if (outputView instanceof SwapView_Opaque) {
        return (
          <div>
          </div>
        );
      } else {
        return (
          <div>
          </div>
        );
      }
    }
    case "swapClaim": {
      const outputView = getSwapClaimView(actionView.value);
      if (outputView instanceof SwapClaimView_Opaque) {
        return (
          <div>
          </div>
        );
      } else {
        return (
          <div>
          </div>
        );
      }
    }
    case "delegatorVote": {
      const outputView = getDelegatorVoteView(actionView.value);
      if (outputView instanceof DelegatorVoteView_Opaque) {
        return (
          <div>
          </div>
        );
      } else {
        return (
          <div>
          </div>
        );
      }
    }
    case "validatorDefinition": {
      return (
        <div>
          {}
        </div>
      );
    }
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
    case "undelegate": {
      return (<div></div>);
    }
    default:
      return undefined;
  }
};

interface TxActionViewProps {
  action: ActionView,
}


export const TxActionView : FC<TxActionViewProps> = ({ action }) => {
  // const getSpendView = createGetter((action: ActionView))
  return (
    <div className="flex flex-wrap w-full">
      {getActionView(action)}
    </div>
  );
};