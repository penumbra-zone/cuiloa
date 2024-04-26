import type { FC } from "react";
import type { SwapView as SwapViewT, SwapClaimView as SwapClaimViewT } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/component/dex/v1/dex_pb";
import type { Output as OutputT, NoteView as NoteViewT, Spend as SpendT, NotePayload as NotePayloadT } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/component/shielded_pool/v1/shielded_pool_pb";
import type { ActionView as ActionViewT } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/transaction/v1/transaction_pb";
import { type DelegatorVoteView, DelegatorVoteView_Opaque, type DelegatorVoteView_Visible } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/component/governance/v1/governance_pb";
import { getAddress, getAddressIndex } from "@penumbra-zone/getters/src/address-view";
import type { Address as AddressT, AddressIndex as AddressIndexT, WalletId as WalletIdT, PayloadKey as PayloadKeyT } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/keys/v1/keys_pb";
import { getOutput, getOutputKey, getOutputNote, getSpend, getSpendNote, getWalletId } from "@/lib/protobuf";
import type { BalanceCommitment as BalanceCommitmentT } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/asset/v1/asset_pb";

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

const PayloadKey: FC<{ payloadKey: PayloadKeyT }> = ({ payloadKey }) => {
  return (
    <div className="flex">
      <p>Payload Key</p>
      <pre>{payloadKey.inner}</pre>
    </div>
  );
};

const GenericKey: FC<{ name: string, _key: Uint8Array }> = ({ name, _key }) => {
  return (
    <div className="flex">
      <p>{name}</p>
      <pre>{_key}</pre>
    </div>
  );
};

const OvkWrappedKey = GenericKey;
const WrappedMemoKey = GenericKey;
const EphemeralKey = GenericKey;

const NotePayload: FC<{ notePayload: NotePayloadT }> = ({ notePayload }) => {
  return (
    <div className="flex">
      <p>NotePayload</p>
      <div className="flex">
        {notePayload.noteCommitment ? (
          <div className="flex">
            <p>Note Commitment</p>
            <pre>{notePayload.noteCommitment.inner}</pre>
          </div>
        ) : null}
        <EphemeralKey _key={notePayload.ephemeralKey} name="Ephemeral Key"/>
        {notePayload.encryptedNote ? (
          <div className="flex">
            <p>Encrypted Note</p>
            <pre>{notePayload.encryptedNote.inner}</pre>
          </div>
        ) : null}
      </div>
    </div>
  );
};

const BalanceCommittment: FC<{ balance: BalanceCommitmentT }> = ({ balance }) => {
  return (
    <div className="flex">
      <p>Balance Commitment</p>
      <pre>{balance.inner}</pre>
    </div>
  );
};

const Output: FC<{ output: OutputT }> = ({ output }) => {
  const body = output.body;
  return (
    <div className="flex flex-col">
      {body ? (
        <div className="flex">
          <p>OutputBody</p>
          {body.notePayload ? (
            <NotePayload notePayload={body.notePayload}/>
          ) : null}
          {body.balanceCommitment ? (
            <BalanceCommittment balance={body.balanceCommitment}/>
          ) : null}
          <WrappedMemoKey _key={body.wrappedMemoKey} name="Wrapped Memo Key"/>
          <OvkWrappedKey _key={body.ovkWrappedKey} name="Ovk Wrapped Key"/>
        </div>
      ) : null}
      {output.proof ? (
        <div className="flex">
          <p>Proof</p>
          <pre>{output.proof.inner}</pre>
        </div>
      ) : null}
    </div>
  );
};

const Spend : FC<{spend: SpendT}>= ({spend}) => {
  const spendBody = spend.body;
  return (
    <div className="flex flex-col">
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

const Address :FC<{ address: AddressT }> = ({ address }) => {
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

const AddressIndex : FC<{ index: AddressIndexT }> = ({ index }) => {
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

const WalletId : FC<{ walletId: WalletIdT }> = ({ walletId }) => {
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


const NoteView : FC<{note: NoteViewT}>= ({ note }) => {
  const address = getAddress.optional()(note.address);
  const walletId = getWalletId.optional()(note.address);
  const addressIndex = getAddressIndex.optional()(note.address);

  return (
    <div className="flex flex-col">
      <p>TxNote</p>
      {address ? (
        <div className="flex flex-col">
          <p>Address</p>
          <Address address={address}/>
          {walletId ? <WalletId walletId={walletId}/> : null}
          {addressIndex ? <AddressIndex index={addressIndex}/> : null}
        </div>
      ) : null}
      <div className="flex flex-col">
        <p>rseed</p>
        <pre>{note.rseed}</pre>
      </div>
    </div>
  );
};

const SpendView : FC<{ spend: SpendT, noteView?: NoteViewT}> = ({spend, noteView}) => {
  return (
    <div className="flex flex-col">
      <p>Spend View</p>
      <Spend spend={spend} />
      {noteView ? (
        <NoteView note={noteView}/>
      ) : null}
    </div>
  );
};

const OutputView: FC<{ output: OutputT, noteView?: NoteViewT, payloadKey?: PayloadKeyT }> = ({ output, noteView, payloadKey }) => {
  return (
    <div className="flex flex-col">
      <p>Output View</p>
      <Output output={output} />
      {noteView !== undefined ? (
        <NoteView note={noteView}/>
      ) : null}
      {payloadKey ? (
        <PayloadKey payloadKey={payloadKey}/>
      ) : null}
    </div>
  );
};

export const getActionView = ({ actionView } : ActionViewT) => {
  switch (actionView.case) {
    case "spend": {
      const spendView = getSpend(actionView.value);
      const noteView = getSpendNote.optional()(actionView.value);
      return <SpendView spend={spendView} noteView={noteView}/>;
    }
    case "output": {
      const outputView = getOutput(actionView.value);
      const noteView = getOutputNote.optional()(actionView.value);
      const outputKey = getOutputKey.optional()(actionView.value);
      return <OutputView output={outputView} noteView={noteView} payloadKey={outputKey}/>;
    }
    case "swap": {
      return undefined;
    }
    case "swapClaim": {
      return undefined;
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

interface ActionViewProps {
  action: ActionViewT,
}


export const ActionView : FC<ActionViewProps> = ({ action }) => {
  return (
    <div className="flex flex-wrap w-full">
      {getActionView(action)}
    </div>
  );
};
