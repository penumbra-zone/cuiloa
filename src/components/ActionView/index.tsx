import { type FC } from "react";
import React from "react";
import { type SwapView as SwapViewT, type SwapClaimView as SwapClaimViewT, type TradingPair as TradingPairT, type SwapPayload as SwapPayloadT, type BatchSwapOutputData as BatchSwapOutputDataT, type SwapPlaintext as SwapPlaintextT, type PositionOpen as PositionOpenT, type Position as PositionT, type TradingFunction as TradingFunctionT, PositionState_PositionStateEnum, type PositionClose as PositionCloseT, type PositionWithdraw as PositionWithdrawT, type PositionRewardClaim as PositionRewardClaimT} from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/component/dex/v1/dex_pb";
import type { NoteView as NoteViewT, NotePayload as NotePayloadT, SpendView as SpendViewT, OutputView as OutputViewT} from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/component/shielded_pool/v1/shielded_pool_pb";
import type { ActionView as ActionViewT } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/transaction/v1/transaction_pb";
import { type ValidatorVote as ValidatorVoteT, type ChangedAppParameters as ChangeAppParametersT, type DelegatorVoteView as DelegatorVoteViewT, type ProposalSubmit as ProposalSubmitT, type ProposalWithdraw as ProposalWithdrawT, type Proposal_CommunityPoolSpend, type Proposal_Emergency, type Proposal_FreezeIbcClient, type Proposal_ParameterChange, type Proposal_Signaling, type Proposal_UnfreezeIbcClient, type Proposal_UpgradePlan, type ProposalDepositClaim as ProposalDepositClaimT, type CommunityPoolSpend as CommunityPoolSpendT, type CommunityPoolOutput as CommunityPoolOutputT, type CommunityPoolDeposit as CommunityPoolDepositT, type EncodedParameter as EncodedParameterT } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/component/governance/v1/governance_pb";
import { getAddressIndex } from "@penumbra-zone/getters/src/address-view";
import { getAsset1, getAsset2 } from "@penumbra-zone/getters/src/trading-pair";
import { getBatchSwapOutputDelta1Amount, getBatchSwapOutputDelta2Amount, getBatchSwapOutputTradingPair, getBatchSwapOutputLambda1Amount, getBatchSwapOutputLambda2Amount, getBatchSwapOutputUnfilled1Amount, getBatchSwapOutputUnfilled2Amount , getBatchSwapOutputData, getOutputViewKey, getOutputViewNote, getSpendNote, getSwapViewBodyAmounts, getSwapViewBodyFeeCommitment, getSwapViewBodyPayload, getSwapMetadata1, getSwapMetadata2, getWalletId, getOutputValue1FromSwapView, getOutputValue2FromSwapView, getSwapTransactionId, getSwapPlaintext, getSwapNoteViewOutput1, getSwapNoteViewOutput2, getSwapPlaintextTradingPair, getSwapPlaintextDelta1, getSwapPlaintextDelta2, getSwapPlaintextFee, getSwapPlaintextAddress, getFeeAmount, getFeeAssetId, getSwapClaimViewZKProof, getSwapClaimViewBody, getSwapClaimViewEpochDuration, getSwapClaimBodyNullifier, getSwapClaimBodyFee, getSwapClaimBodyOutput1Commitment, getSwapClaimBodyOutput2Commitment, getSwapClaimBodyBatchOutputData, getSwapClaimNoteOutput1, getSwapClaimNoteOutput2, getSwapClaimTransactionId, getDelegatorVoteViewBody, getDelegatorVoteViewAuthSig, getDelegatorVoteViewProof, getDelegatorVoteViewNote, getDelegatorVoteBodyProposal, getDelegatorVoteBodyStartPosition, getDelegatorVoteBodyVote, getDelegatorVoteBodyValue, getDelegatorVoteBodyUnbondedAmount, getDelegatorVoteBodyNullifier, getDelegatorVoteBodyRK, getValidatorIdentityKey, getValidatorConsensusKey, getValidatorName, getValidatorWebsite, getValidatorDescription, getValidatorEnabled, getValidatorFundingStream, getValidatorSequenceNumber, getValidatorGovernanceKey, getValidatorAuthSig, getFundingStreamToAddress, getFundingStreamRateBps, getProposalSubmitDepositAmount, getProposalId, getProposalTitle, getProposalDescription, getProposalPayload, getChangeAppSctParameter, getChangeAppCommunityPoolParameter, getChangeAppGovernanceParameter, getChangeAppIbcParameters, getChangeAppStakeParameters, getChangeAppFeeParameters, getChangeAppDistributionParameters, getChangeAppFundingParameters, getChangeAppShieldedParameters, getChangeAppDexParameters, getChangeAppAuctionParameters, getValidatorVoteBodyProposal, getValidatorVoteBodyVote, getValidatorVoteBodyIdentityKey, getValidatorVoteBodyGovernanceKey, getValidatorVoteBodyReason, getValidatorVoteBody, getValidatorVoteAuthSig, getProposalDepositClaimAmount, getProposalDepositClaimOutcome, getProposalDepositClaimOutcomeReason, getPositionOpen, getPositionTradingFunction, getPositionNonce, getPositionState, getPositionStateSequence, getPositionReservesAmount1, getPositionReservesAmount2, getPositionCloseOnFill, getTradingFunctionFee, getTradingFunctionAmountQ, getTradingFunctionAmountP, getTradingFunctionPair, getPositionClosePositionId, getPositionWithdrawPositionId, getPositionWithdrawBalanceCommitment, getPositionWithdrawSequence, getPositionRewardClaimPositionId, getPositionRewardClaimBalanceCommitment, getCommunityPoolSpendValue, getCommunityPoolOutputValue, getCommunityPoolOutputAddress, getCommunityPoolDepositValue, getUndelegateClaimIdentityKey, getUndelegateClaimStartEpochIndex, getUndelegateClaimPenalty, getUndelegateClaimBalanceCommitment, getUndelegateClaimUnbondingStartHeight, getUndelegateClaimProof, getIcs20WithdrawalAmount, getIcs20WithdrawalDenom, getIcs20WithdrawalDestinationAddress, getIcs20WithdrawalReturnAddress, getIcs20WithdrawalTimeoutHeight, getIcs20WithdrawalTimeoutTime, getIcs20WithdrawalSourceChannel, getDelegateIdentityKey, getDelegateEpochIndex, getDelegateUnbondedAmount, getDelegateDelegationAmount, getUndelegateStartEpochIndex, getUndelegateUnbondedAmount, getUndelegateDelegationAmount, getUndelegateFromEpoch, getUndelegateIdentityKey, getInputFromActionDutchAuctionScheduleView, getOutputIdFromActionDutchAuctionScheduleView, getMaxOutputFromActionDutchAuctionScheduleView, getMinOutputFromActionDutchAuctionScheduleView, getStartHeightFromActionDutchAuctionScheduleView, getEndHeightFromActionDutchAuctionScheduleView, getStepCountFromActionDutchAuctionScheduleView, getNonceFromActionDutchAuctionScheduleView, getActionDutchAuctionScheduleViewAuctionId, getActionDutchAuctionScheduleViewInputMetadata, getActionDutchAuctionScheduleViewOutputMetadata, getAuctionIdFromActionDutchAuctionEnd, getReservesCommitmentFromActionDutchAuctionWithdrawView, getReservesFromActionDutchAuctionWithdrawView, getAuctionIdFromActionDutchAuctionWithdrawView, getSeqFromActionDutchAuctionWithdrawView, getSpendViewBodyNullifier, getSpendViewAuthSig, getSpendViewProof, getSpendViewBodySpendVerificationKey, getSpendViewBodyBalanceCommitment, getOutputViewBodyNotePayload, getOutputViewProof, getOutputViewBodyBalanceCommitment, getOutputViewBodyWrappedMemoKey, getOutputViewBodyOvkWrappedKey, getSwapViewProof, getSwapViewBodyTradingPair } from "@/lib/protobuf";
import { joinLoHiAmount } from "@penumbra-zone/types/src/amount";
import { uint8ArrayToBase64 } from "@penumbra-zone/types/src/base64";
import { getAssetId } from "@penumbra-zone/getters/src/metadata";
import { getAmount, getMetadata, getEquivalentValues, getExtendedMetadata, getAssetIdFromValueView } from "@penumbra-zone/getters/src/value-view";
import type { Address as AddressT, AddressIndex as AddressIndexT, AddressView as AddressViewT } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/keys/v1/keys_pb";
import { type AssetId as AssetIdT, type EquivalentValue as EquivalentValueT, type Metadata as MetadataT, type Value as ValueT, type ValueView as ValueViewT } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/asset/v1/asset_pb";
import { FlexCol, FlexRow } from "../ui/flex";
import type { Amount as AmountT } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/num/v1/num_pb";
import type { Fee as FeeT, GasPrices as GasPricesT } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/component/fee/v1/fee_pb";
import type { ValidatorDefinition as ValidatorDefinitionT, FundingStream as FundingStreamT, UndelegateClaim as UndelegateClaimT, Delegate as DelegateT, Undelegate as UndelegateT } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/component/stake/v1/stake_pb";
import type { IbcRelay, Ics20Withdrawal as Ics20WithdrawalT } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/component/ibc/v1/ibc_pb";
import type { Height as HeightT} from "@buf/cosmos_ibc.bufbuild_es/ibc/core/client/v1/client_pb";
import type { Epoch as EpochT } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/component/sct/v1/sct_pb";
import type { ActionDutchAuctionEnd as ActionDutchAuctionEndT, ActionDutchAuctionScheduleView as ActionDutchAuctionScheduleViewT, ActionDutchAuctionWithdrawView as ActionDutchAuctionWithdrawViewT } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/component/auction/v1/auction_pb";
import { cn } from "@/lib/utils";
import { useToast } from "../ui/use-toast";

// Explicit typing for the ProposalSubmit.payload field message variants.
type ProposalSubmitKind = {
  value: Proposal_Signaling;
  case: "signaling";
} | {
  value: Proposal_Emergency;
  case: "emergency";
} | {
  value: Proposal_ParameterChange;
  case: "parameterChange";
} | {
  value: Proposal_CommunityPoolSpend;
  case: "communityPoolSpend";
} | {
  value: Proposal_UpgradePlan;
  case: "upgradePlan";
} | {
  value: Proposal_FreezeIbcClient;
  case: "freezeIbcClient";
} | {
  value: Proposal_UnfreezeIbcClient;
  case: "unfreezeIbcClient";
} | {
  case: undefined;
  value?: undefined
};

function useCopyToClipboard() {
  const [copied, setCopied] = React.useState(false);
  const { toast } = useToast();
  React.useEffect(() => {
    setTimeout(() => {
      setCopied(false);
    }, 2000);
    if (copied) {
      toast({
        variant: "default",
        title: "Copied!",
        description: "Successfully copied value to clipboard.",
        duration: 2000,
      });
    }
  }, [copied]);
  async function copyToClipboard(value: string) {
    await navigator.clipboard.writeText(value);
    setCopied(true);
  }
  return copyToClipboard;
};

const TxRow: FC<{ label: string, value?: string | bigint | Uint8Array | number | boolean, className?: string }> = ({ label: name, value, className }) => {
  const copyToClipboard = useCopyToClipboard();
  let text : string;
  if (value !== undefined) {
    if (typeof value === "string") {
      text = value !== "" ? value : "N/A";
    } else if (typeof value === "number" || typeof value === "bigint" || typeof value === "boolean") {
      text = value.toString();
    } else if (Object.prototype.toString.call(value) === "[object Uint8Array]") {
      text = uint8ArrayToBase64(value);
    } else {
      text = "N/A";
    }
  } else {
    text = "N/A";
  }

  return (
    <FlexRow className={cn("flex-wrap w-full justify-between", className ?? "")}>
      <div className="w-1/2">
        <p className="text-start p-1">{name}</p>
      </div>
      <div className="w-1/2">
        <pre className="text-start p-1 overflow-hidden overflow-ellipsis"
          onClick={() => {
            void (async () => {
              await copyToClipboard(text);
            })();
        }}>{text}</pre>
      </div>
    </FlexRow>
  );
};

export const GenericKV: FC<{ label: string, value: Uint8Array, className?: string }> = ({ label: name, value, className }) => {

  const base64Value = uint8ArrayToBase64(value);
  const copyToClipboard = useCopyToClipboard();

  return (
    <FlexRow className={cn("flex-wrap w-full justify-between", className ?? "")}>
      <div className="w-1/2">
        <p className="text-start p-1">{name}</p>
      </div>
      <div className="w-1/2">
        <pre className="text-start p-1 overflow-hidden overflow-ellipsis"
          onClick={() => {
            void (async () => {
              await copyToClipboard(base64Value);
            })();
        }}>{base64Value}</pre>
      </div>
    </FlexRow>
  );
};

// TODO: Fold logic of GenericKV into TxRow and we eliminate all of this.
// TODO: Would also be useful because it would eliminate a lot of undefine checks while also visibly signaling that a field is missing.
const OvkWrappedKey = GenericKV;
const WrappedMemoKey = GenericKV;
const EphemeralKey = GenericKV;
const ZKSwapProof = GenericKV;
const StateCommitment = GenericKV;
const BalanceCommitment = GenericKV;
const EncryptedSwap = GenericKV;
const RSeed = GenericKV;
const TransactionId = GenericKV;
const Nullifier = GenericKV;
const SpendAuthSignature = GenericKV;
const SpendVerificationKey = GenericKV;
const SpendProof = GenericKV;
const ZKDelegatorVoteProof = GenericKV;
const AuthSignature = GenericKV;
const IdentityKey = GenericKV;
const GovernanceKey = GenericKV;
const ConsensusKey = GenericKV;
const PositionId = GenericKV;
const Penalty = GenericKV;
const UndelegateClaimProof = GenericKV;
const AuctionId = GenericKV;
const PayloadKey = GenericKV;
const WalletId = GenericKV;
const IndexRandomizer = GenericKV;
const AddressBytes = GenericKV;
const OutputProof = GenericKV;
const EncryptedNote = GenericKV;
const AssetIdBytes = GenericKV;
const Nonce = GenericKV;

const EquivalentValueView: FC<{ equivalentValue: EquivalentValueT }> = ({ equivalentValue }) => {
  return (
    <FlexCol className="w-full border-b">
      <p className="text-center bg-slate-200">Equivalent Value</p>
      <Amount amount={equivalentValue.equivalentAmount}/>
      {equivalentValue.numeraire ? <Metadata metaData={equivalentValue.numeraire}/> : null}
      <TxRow label="Height" value={equivalentValue.asOfHeight}/>
    </FlexCol>
  );
};

const Height: FC<{ height: HeightT }> = ({ height }) => {
  return (
    <FlexCol className="w-full">
      <p className="text-center">Height</p>
      <TxRow label="Revision Number" value={height.revisionNumber}/>
      <TxRow label="Revision Number" value={height.revisionHeight}/>
    </FlexCol>
  );
};

const Epoch: FC<{ epoch: EpochT, label?: string }> = ({ epoch, label }) => {
  const title = label !== undefined && label !== "" ? label : "Epoch";
  return (
    <FlexCol className="w-full border-b">
      <p className="text-center bg-slate-300">{title}</p>
      <TxRow label="Epoch Index" value={epoch.index}/>
      <TxRow label="Epoch Start Height" value={epoch.startHeight}/>
    </FlexCol>
  );
};

// NOTE: the way ValueView's opaque vs visible cases are handled is by the fact that metadata, equivalentValues, and extendedMetadata
//       should never be defined in the case of an UnknownAssetId and we only render assetId when valueView.case is unknownAssetId.
const ValueView: FC<{ valueView: ValueViewT, label?: string }> = ({ valueView, label }) => {
  const title = (label ?? "") ? label : "Value View";
  const amount = getAmount(valueView);
  const metadata = getMetadata.optional()(valueView);
  const equivalentValues = getEquivalentValues.optional()(valueView);
  const extendedMetadata = getExtendedMetadata.optional()(valueView);
  const assetId = getAssetIdFromValueView(valueView);
  return (
    <FlexCol className="w-full border-b">
      <p className="text-center bg-slate-300">{title}</p>
      <Amount amount={amount} label={(label ?? "") ? `${label} Amount` : "Amount"}/>
      {metadata ? <Metadata metaData={metadata} label={label}/> : null}
      {equivalentValues?.map((equivalentValue, i) => <EquivalentValueView equivalentValue={equivalentValue} key={i}/>)}
      <TxRow label="Extended Metadata" value={extendedMetadata?.toJsonString()}/>
      {valueView.valueView.case === "unknownAssetId" ? <AssetId assetId={assetId} label="Unknown Asset ID"/> : null}
    </FlexCol>
  );
};

const Value: FC<{ value?: ValueT, label?: string }> = ({ value, label }) => {
  const title = label !== undefined && label !== "" ? label : "Value";
  return (
    <FlexCol className="w-full border-b">
      <p className="text-center bg-slate-200">{title}</p>
      {!value ? <pre className="text-center">N/A</pre> : null}
      <Amount amount={value?.amount}/>
      <AssetId assetId={value?.assetId}/>
    </FlexCol>
  );
};

const NotePayload: FC<{ notePayload: NotePayloadT }> = ({ notePayload }) => {
  return (
    <FlexCol className="w-full border-b">
      <p className="text-center bg-slate-200">Note Payload</p>
      {notePayload.noteCommitment ? <StateCommitment label="Note Commitment" value={notePayload.noteCommitment.inner}/> : null}
      <EphemeralKey label="Ephemeral Key" value={notePayload.ephemeralKey}/>
      {notePayload.encryptedNote ? <EncryptedNote label="Encrypted Note" value={notePayload.encryptedNote.inner}/> : null}
    </FlexCol>
  );
};


const Address :FC<{ address?: AddressT }> = ({ address }) => {
  return (
    <FlexCol className="w-full border-b">
      <p className="text-center bg-slate-200">Address</p>
      {!address ? <pre className="text-center">N/A</pre> : null}
      {/* NOTE: Keep these components gated behind the address check */}
      {address ? <AddressBytes label="Address" value={address.inner}/> : null}
      {address ? <TxRow label="Altbech32-encoded Address" value={address.altBech32m}/> : null}
    </FlexCol>
  );
};

const AddressIndex : FC<{ index: AddressIndexT }> = ({ index }) => {
  return (
    <FlexCol className="w-full">
      <p className="text-center">Address Index</p>
      <TxRow label="Account" value={index.account}/>
      <IndexRandomizer label="Randomizer" value={index.randomizer}/>
    </FlexCol>
  );
};

const AddressView: FC<{ addressView: AddressViewT }> = ({ addressView }) => {
  const walletId = getWalletId.optional()(addressView);
  const addressIndex = getAddressIndex.optional()(addressView);
  return (
    <FlexCol className="w-full">
      <p className="text-center bg-slate-200">Address View</p>
      {addressIndex ? <AddressIndex index={addressIndex}/> : null}
      {walletId ? <WalletId label="WalletId" value={walletId.inner}/> : null}
    </FlexCol>
  );
};


const NoteView : FC<{note: NoteViewT}>= ({ note }) => {
  return (
    <FlexCol className="w-full border-b">
      <p className="text-center bg-slate-300">Note View</p>
      {note.address ? <AddressView addressView={note.address}/> : null}
      <RSeed label="RSeed" value={note.rseed}/>
    </FlexCol>
  );
};

const SpendView : FC<{ spendView: SpendViewT }> = ({ spendView }) => {
  const spendProof = getSpendViewProof.optional()(spendView);
  const spendAuthSig = getSpendViewAuthSig.optional()(spendView);
  const spendBodyNullifier = getSpendViewBodyNullifier.optional()(spendView);
  const spendBodyRk = getSpendViewBodySpendVerificationKey.optional()(spendView);
  const spendBodyBalance = getSpendViewBodyBalanceCommitment.optional()(spendView);
  const noteView = getSpendNote.optional()(spendView);

  return (
    <FlexCol className="w-full border">
      <p className="text-center bg-slate-400">Spend View</p>
      {spendProof ? <SpendProof label="Proof" value={spendProof.inner}/> : null}
      {spendAuthSig ? <AuthSignature label="AuthSig" value={spendAuthSig.inner}/> : null}
      {(spendBodyNullifier ?? spendBodyRk) ?? spendBodyBalance ? (
        <FlexCol className="w-full border-b">
          <p className="text-center bg-slate-300">Spend Body</p>
          {spendBodyNullifier ? <Nullifier label="Nullifier" value={spendBodyNullifier.inner} /> : null}
          {spendBodyRk ? <SpendVerificationKey label="Verification Key" value={spendBodyRk.inner} /> : null}
          {spendBodyBalance ? <BalanceCommitment label="Balance Commitment" value={spendBodyBalance.inner}/> : null}
        </FlexCol>
      ) : null}
      {noteView ? <NoteView note={noteView}/> : null}
    </FlexCol>
  );
};

const OutputView: FC<{ outputView: OutputViewT }> = ({ outputView }) => {
  // Output & OutputBody
  const bodyNotePayload = getOutputViewBodyNotePayload.optional()(outputView);
  const bodyBalanceCommitment = getOutputViewBodyBalanceCommitment.optional()(outputView);
  const bodyWrappedMemoKey = getOutputViewBodyWrappedMemoKey(outputView);
  const bodyOvkWrappedKey = getOutputViewBodyOvkWrappedKey(outputView);
  const outputProof = getOutputViewProof.optional()(outputView);
  // OutputView.Visible fields
  const noteView = getOutputViewNote.optional()(outputView);
  const payloadKey = getOutputViewKey.optional()(outputView);

  return (
    <FlexCol className="w-full border">
      <p className="text-center bg-slate-400">Output View</p>
      {noteView ? <NoteView note={noteView}/> : null}
      {payloadKey ? <PayloadKey label="Payload Key" value={payloadKey.inner}/> : null}
      <FlexCol className="w-full border-b">
        <p className="text-center bg-slate-300">Output Body</p>
        {bodyNotePayload ? <NotePayload notePayload={bodyNotePayload}/> : null}
        {bodyBalanceCommitment ? <BalanceCommitment value={bodyBalanceCommitment.inner} label="Balance Commitment"/> : null}
        <WrappedMemoKey value={bodyWrappedMemoKey} label="Wrapped Memo Key"/>
        <OvkWrappedKey value={bodyOvkWrappedKey} label="Ovk Wrapped Key"/>
        {outputProof ? <OutputProof label="Output Proof" value={outputProof.inner}/> : null}
      </FlexCol>
    </FlexCol>
  );
};

const AssetId: FC<{ assetId?: AssetIdT, label?: string }> = ({ assetId, label }) => {
  const title = label !== undefined && label !== "" ? label : "Asset ID";
  return (
    <FlexCol className="w-full">
      <p className="text-center">{title}</p>
      {!assetId ? <pre className="text-center">N/A</pre> : null}
      {assetId?.inner ? <AssetIdBytes label="Inner Bytes" value={assetId.inner}/> : null}
      <TxRow label="Alternative Bech32-Encoding of Inner Bytes" value={assetId?.altBech32m}/>
      <TxRow label="Alternative Base Denomination String" value={assetId?.altBaseDenom}/>
    </FlexCol>
  );
};

const TradingPair: FC<{ tradingPair?: TradingPairT }> = ({ tradingPair }) => {
  const asset1 = getAsset1(tradingPair);
  const asset2 = getAsset2(tradingPair);

  return (
    <FlexCol className="w-full">
      <p className="text-center">Trading Pair</p>
      <AssetId assetId={asset1} label="Asset 1"/>
      <AssetId assetId={asset2} label="Asset 2"/>
    </FlexCol>
  );
};

const Amount: FC<{ amount?: AmountT, label?: string }> = ({ amount, label }) => {
  const copyToClipboard = useCopyToClipboard();
  const title = label !== undefined && label !== "" ? label : "Amount";
  const amountText = amount ? joinLoHiAmount(amount).toString() : "N/A";

  return (
    <FlexRow className="w-full flex-wrap">
      <div className="w-1/2">
        <p className="p-1 text-start">{title}</p>
      </div>
      <div className="w-1/2">
        <pre className="text-start p-1 overflow-hidden overflow-ellipsis"
          onClick={() => {
            void (async () => {
              await copyToClipboard(amountText);
            })();
        }}>{amountText}</pre>
      </div>
    </FlexRow>
  );
};

const SwapPayload: FC<{ swapPayload: SwapPayloadT }> = ({ swapPayload }) => {
  return (
    <FlexCol className="w-full">
      <p className="text-center">Swap Payload</p>
      {swapPayload.commitment ? <StateCommitment value={swapPayload.commitment?.inner} label="Commitment"/> : null}
      <EncryptedSwap value={swapPayload.encryptedSwap} label="Encrypted Swap"/>
    </FlexCol>
  );
};

const BatchSwapOutputData: FC<{ batchSwapOutput: BatchSwapOutputDataT }> = ({ batchSwapOutput }) => {
  const delta1I = getBatchSwapOutputDelta1Amount(batchSwapOutput);
  const delta2I = getBatchSwapOutputDelta2Amount(batchSwapOutput);
  const lambda1 = getBatchSwapOutputLambda1Amount(batchSwapOutput);
  const lambda2 = getBatchSwapOutputLambda2Amount(batchSwapOutput);
  const unfilled1 = getBatchSwapOutputUnfilled1Amount(batchSwapOutput);
  const unfilled2 = getBatchSwapOutputUnfilled2Amount(batchSwapOutput);
  const tradingPair = getBatchSwapOutputTradingPair(batchSwapOutput);
  const height = batchSwapOutput.height;
  const startingEpoch = batchSwapOutput?.epochStartingHeight;
  const sctPositionPrefix = batchSwapOutput.sctPositionPrefix;
  return (
    <FlexCol className="w-full border-b">
      <p className="text-center bg-slate-200">Batch Swap Output Data</p>
      <Amount amount={delta1I} label="delta_1_i"/>
      <Amount amount={delta2I} label="delta_2_i"/>
      <Amount amount={lambda1} label="lambda_1"/>
      <Amount amount={lambda2} label="lambda_2"/>
      <Amount amount={unfilled1} label="unfilled_1"/>
      <Amount amount={unfilled2} label="unfilled_2"/>
      <TxRow label="Height" value={height}/>
      <TradingPair tradingPair={tradingPair}/>
      <TxRow label="Epoch Starting Height (DEPRECATED)" value={startingEpoch}/>
      <TxRow label="Sct Position Prefix" value={sctPositionPrefix}/>
    </FlexCol>
  );
};

const Metadata: FC<{ metaData: MetadataT, label?: string }> = ({ metaData, label }) => {
  const title = (label ?? "") ? label : "Asset Metadata";
  const assetId = getAssetId(metaData);
  return (
    <FlexCol className="w-full border-b">
      <p className="text-center bg-slate-200">{title}</p>
      <TxRow label="Name" value={metaData.name}/>
      <TxRow label="Description" value={metaData.description}/>
      <TxRow label="Symbol" value={metaData.symbol}/>
      <AssetId assetId={assetId} label="Penumbra Asset ID"/>
      <TxRow label="Display Denomination" value={metaData.display}/>
      <TxRow label="Base Denomination" value={metaData.base}/>
      {/* TODO: This needs to be fleshed out. Skipping aliases and information for exponents. Could easily blow up the UI without collapsable elements as it is. */}
      <FlexCol className="w-full">
        <p className="text-center">Denomination Units</p>
        {metaData.denomUnits.map((denomUnit, i) => <pre key={i}>{denomUnit.denom}</pre>)}
      </FlexCol>
      {/* TODO: Skipping AssetImage images field entirely */}
      <TxRow label="Asset Images" value="NOT CURRENTLY IMPLEMENTED"/>
    </FlexCol>
  );
};

const Fee: FC<{ fee: FeeT}> = ({ fee }) => {
  const amount = getFeeAmount(fee);
  const assetId = getFeeAssetId.optional()(fee);
  return (
    <FlexCol className="w-full">
      <p className="text-center">Fee</p>
      <Amount amount={amount}/>
      <AssetId assetId={assetId} label="Token ID"/>
    </FlexCol>
  );
};

const GasPrices: FC<{ gasPrices: GasPricesT, label: "Fixed Gas Prices" | "Fixed Alternative Gas Price" }> = ({ gasPrices, label }) => {
  return (
    <FlexCol className="w-full">
      <p className="text-center">{label}</p>
      <AssetId label="Asset ID" assetId={gasPrices.assetId}/>
      <TxRow label="Compact Block Space Price" value={gasPrices.compactBlockSpacePrice}/>
      <TxRow label="Verification Price" value={gasPrices.verificationPrice}/>
      <TxRow label="Execution Price" value={gasPrices.executionPrice}/>
    </FlexCol>
  );
};

const FundingStream: FC<{ fundingStream: FundingStreamT }> = ({ fundingStream }) => {
  const fundingStreamToAddress = getFundingStreamToAddress.optional()(fundingStream);
  const fundingStreamBps = getFundingStreamRateBps.optional()(fundingStream);
  if (fundingStreamToAddress !== undefined) {
    return (
      <FlexCol className="w-full border-b">
        <TxRow label="Recipient" value="To Address"/>
        <TxRow label="Destination Address" value={fundingStreamToAddress}/>
        <TxRow label="Reward BPS" value={fundingStreamBps}/>
      </FlexCol>
    );
  } else {
    return (
      <FlexCol className="w-full border-b">
        <TxRow label="Recipient" value="To Community Pool"/>
        <TxRow label="Reward BPS" value={fundingStreamBps}/>
      </FlexCol>
    );
  }
};

const SwapPlaintext: FC<{ swapPlaintext: SwapPlaintextT }> = ({ swapPlaintext }) => {
  const tradingPair = getSwapPlaintextTradingPair(swapPlaintext);
  const delta1I = getSwapPlaintextDelta1(swapPlaintext);
  const delta2I = getSwapPlaintextDelta2(swapPlaintext);
  const claimFee = getSwapPlaintextFee(swapPlaintext);
  const claimAddress = getSwapPlaintextAddress(swapPlaintext);
  return (
    <FlexCol className="w-full border-b">
      <p className="text-center bg-slate-200">Swap Plaintext</p>
      <TradingPair tradingPair={tradingPair}/>
      <Amount amount={delta1I} label="Delta 1"/>
      <Amount amount={delta2I} label="Delta 2"/>
      <Fee fee={claimFee}/>
      <Address address={claimAddress}/>
      <RSeed value={swapPlaintext.rseed} label="rseed"/>
    </FlexCol>
  );
};

const ChangeParameters: FC<{
  parameters: ChangeAppParametersT,
  label: "Old App Parameters (DEPRECATED)" | "New App Parameters (DEPRECATED)"
}> = ({ parameters, label }) => {
  const sctParameters = getChangeAppSctParameter.optional()(parameters);
  const communityPoolParameters = getChangeAppCommunityPoolParameter.optional()(parameters);
  const governanceParameters = getChangeAppGovernanceParameter.optional()(parameters);
  const ibcParameters = getChangeAppIbcParameters.optional()(parameters);
  const stakeParameters = getChangeAppStakeParameters.optional()(parameters);
  const feeParameters = getChangeAppFeeParameters.optional()(parameters);
  const distributionParameters = getChangeAppDistributionParameters.optional()(parameters);
  const fundingParameters = getChangeAppFundingParameters.optional()(parameters);
  const shieldedParameters = getChangeAppShieldedParameters.optional()(parameters);
  const dexParameters = getChangeAppDexParameters.optional()(parameters);
  const auctionParameters = getChangeAppAuctionParameters.optional()(parameters);
  return (
    <FlexCol className="w-full border-b">
      <p className="text-center bg-slate-200">{label}</p>
      {sctParameters ? (
        <FlexCol className="w-full">
          <p className="text-center">SCT Parameters</p>
          <TxRow label="Epoch Duration" value={sctParameters.epochDuration}/>
        </FlexCol>
      ) : null}
      {communityPoolParameters ? (
        <FlexCol className="w-full">
          <p className="text-center">Community Pool Parameters</p>
          <TxRow label="Community Pool Spend Proposals Enabled" value={communityPoolParameters.communityPoolSpendProposalsEnabled}/>
        </FlexCol>
      ) : null}
      {governanceParameters ? (
        <FlexCol className="w-full">
          <p className="text-center">Governance Parameters</p>
          <TxRow label="Proposal Voting Blocks" value={governanceParameters.proposalVotingBlocks}/>
          <Amount label="Proposal Deposit Amount" amount={governanceParameters.proposalDepositAmount}/>
          <TxRow label="Proposal Valid Quorum" value={governanceParameters.proposalValidQuorum}/>
          <TxRow label="Proposal Pass Threshold" value={governanceParameters.proposalPassThreshold}/>
          <TxRow label="Proposal Slash Threshold" value={governanceParameters.proposalSlashThreshold}/>
        </FlexCol>
      ) : null}
      {ibcParameters ? (
        <FlexCol className="w-full">
          <p className="text-center">IBC Parameters</p>
          <TxRow label="IBC Enabled" value={ibcParameters.ibcEnabled}/>
          <TxRow label="Inbound ICS-20 Transfers Enabled" value={ibcParameters.inboundIcs20TransfersEnabled}/>
          <TxRow label="Outbound ICS-20 Transfers Enabled" value={ibcParameters.outboundIcs20TransfersEnabled}/>
        </FlexCol>
      ) : null}
      {stakeParameters ? (
        <FlexCol className="w-full">
          <p className="text-center">Stake Parameters</p>
          <TxRow label="Unbonding Epochs" value={stakeParameters.unbondingEpochs}/>
          <TxRow label="Active Validator Limit" value={stakeParameters.activeValidatorLimit}/>
          <TxRow label="Base Reward Rate" value={stakeParameters.baseRewardRate}/>
          <TxRow label="Slashing Penalty Misbehavior" value={stakeParameters.slashingPenaltyMisbehavior}/>
          <TxRow label="Slashing Penalty Downtown" value={stakeParameters.slashingPenaltyDowntime}/>
          <TxRow label="Signed Blocks Window Length" value={stakeParameters.signedBlocksWindowLen}/>
          <TxRow label="Missed Blocks Maximum" value={stakeParameters.missedBlocksMaximum}/>
          <Amount label="Minimum Validator Stake" amount={stakeParameters.minValidatorStake}/>
          <TxRow label="Unbonding Delay" value={stakeParameters.unbondingDelay}/>
        </FlexCol>
      ) : null}
      {feeParameters ? (
        <FlexCol className="w-full">
          <p className="text-center">Fee Parameters</p>
          {feeParameters.fixedGasPrices
            ? <GasPrices label="Fixed Gas Prices" gasPrices={feeParameters.fixedGasPrices}/>
            : <TxRow label="Fixed Gas Prices"/>}
          {feeParameters.fixedAltGasPrices.length !== 0 ? (
            <FlexCol className="w-full">
              {feeParameters.fixedAltGasPrices.map((gasPrices, i) => <GasPrices label="Fixed Alternative Gas Price" gasPrices={gasPrices} key={i}/>)}
            </FlexCol>
          ) : <TxRow label="Fixed Alternative Gas Prices"/>}
        </FlexCol>
      ) : null}
      {distributionParameters ? (
        <FlexCol className="w-full">
          <p className="text-center">Distribution Parameters</p>
          <TxRow label="Staking Issuance Per Block" value={distributionParameters.stakingIssuancePerBlock}/>
        </FlexCol>
      ) : null}
      {fundingParameters ? (
        <FlexCol className="w-full">
          <p className="text-center">Funding Parameters</p>
          {/* TODO?: there are no fields to this message type */}
          <pre className="text-center">This message type currently has no fields defined by Penumbra.</pre>
        </FlexCol>
      ) : null}
      {shieldedParameters ? (
        <FlexCol className="w-full">
          <p className="text-center">Shielded Pool Parameters</p>
          {shieldedParameters.fixedFmdParams ? (
            <FlexCol className="w-full">
              <p className="text-center">FmdParameters</p>
              <TxRow label="Precision Bits" value={shieldedParameters.fixedFmdParams.precisionBits}/>
              <TxRow label="As of Block Height" value={shieldedParameters.fixedFmdParams.asOfBlockHeight}/>
            </FlexCol>
          ) : <TxRow label="FmdParameters"/>}
        </FlexCol>
      ) : null}
      {dexParameters ? (
        <FlexCol className="w-full">
          <p className="text-center">Dex Parameters</p>
          <TxRow label="Is Enabled" value={dexParameters.isEnabled}/>
          <FlexCol className="w-full">
            <p className="text-center">Fixed Candidates</p>
            {dexParameters.fixedCandidates.map((assetId, i) => <AssetId assetId={assetId} key={i}/>)}
          </FlexCol>
          <TxRow label="Max Hops" value={dexParameters.maxHops}/>
          <TxRow label="Max Positions Per Pair" value={dexParameters.maxPositionsPerPair}/>
        </FlexCol>
      ) : null}
      {auctionParameters ? (
        <FlexCol className="w-full">
          <p className="text-center">Auction Parameters</p>
          {/* TODO?: there are no fields to this message type */}
          <pre className="text-center">This message type currently has no fields defined by Penumbra.</pre>
        </FlexCol>
      ) : null}
    </FlexCol>
  );
};

const EncodedParameters: FC<{ encodedParameters: EncodedParameterT[], label: "Preconditions" | "Changes" }> = ({ encodedParameters, label }) => {
  const title = label === "Preconditions" ? "Encoded Parameter Precondition" : "Encoded Parameter Changes";
  return (
    <FlexCol className="w-full border-b">
      <p className="text-center bg-slate-200">{label}</p>
      {label === "Preconditions" && encodedParameters.length === 0 ? <pre className="text-center">None</pre> : null}
      {encodedParameters.map((parameter, i) => (
        <FlexCol className="w-full" key={i}>
          <p className="text-center">{title}</p>
          <TxRow label="Component Name" value={parameter.component}/>
          <TxRow label="Parameter Key" value={parameter.key}/>
          <TxRow label="Parameter Value" value={parameter.value}/>
        </FlexCol>
      ))}
    </FlexCol>
  );
};

const ProposalPayload: FC<{ payload: ProposalSubmitKind }> = ({ payload }) => {
  switch (payload.case) {
    case "signaling": {
      return (
        <FlexCol className="w-full border-b">
          <p className="text-center bg-slate-300">Signaling Proposal</p>
          <TxRow label="Commit" value={payload.value.commit}/>
        </FlexCol>
      );
    }
    case "emergency": {
      return (
        <FlexCol className="w-full border-b">
          <p className="text-center bg-gray-300">Emergency Proposal</p>
          <TxRow label="Halt Chain" value={payload.value.haltChain}/>
        </FlexCol>
      );
    }
    case "parameterChange":
      return (
        <FlexCol className="w-full border-b">
          <p className="text-center bg-slate-300">Parameter Change Proposal</p>
          {payload.value.oldParameters
            ? <ChangeParameters parameters={payload.value.oldParameters} label="Old App Parameters (DEPRECATED)"/>
            : null}
          {payload.value.newParameters
            ? <ChangeParameters parameters={payload.value.newParameters} label="New App Parameters (DEPRECATED)"/>
            : null}
          <EncodedParameters encodedParameters={payload.value.preconditions} label="Preconditions"/>
          <EncodedParameters encodedParameters={payload.value.changes} label="Changes"/>
        </FlexCol>
      );
    case "communityPoolSpend": {
      return (
        <FlexCol className="w-full border">
          <p className="text-center bg-slate-300">Community Pool Spend Proposal</p>
          <TxRow label="Transaction Plan" value={payload.value.transactionPlan?.toJsonString()}/>
        </FlexCol>
      );
    }
    case "upgradePlan": {
      return (
        <FlexCol className="w-full border-b">
          <p className="text-center bg-gray-300">Upgrade Plan Proposal</p>
          <TxRow label="Halt Chain" value={payload.value.height}/>
        </FlexCol>
      );
    }
    case "freezeIbcClient": {
      return (
        <FlexCol className="w-full border-b">
          <p className="text-center bg-gray-300">Freeze IBC Client Proposal</p>
          <TxRow label="Client ID" value={payload.value.clientId}/>
        </FlexCol>
      );
    }
    case "unfreezeIbcClient": {
      return (
        <FlexCol className="w-full border-b">
          <p className="text-center bg-gray-300">Unfreeze IBC Client Proposal</p>
          <TxRow label="Client ID" value={payload.value.clientId}/>
        </FlexCol>
      );
    }
    // TODO: start adding UI motifs/messaging for bad/unlikely outcomes when rendering queried data.
    default: {
      return (
        <FlexCol className="w-full border-b">
          <p className="text-center bg-gray-300">Proposal Payload</p>
          <pre className="text-center">N/A</pre>
        </FlexCol>
      );
    }
  }
};

const TradingFunction: FC<{ tradingFunction: TradingFunctionT }> = ({ tradingFunction }) => {
  const tradingFee = getTradingFunctionFee(tradingFunction);
  // TODO: protobuf defs say that each Amount is not actually an Amount but an integer with the same width of an Amount.
  //       How should these actually be represented?
  const amountQ = getTradingFunctionAmountQ.optional()(tradingFunction);
  const amountP = getTradingFunctionAmountP.optional()(tradingFunction);
  const tradingPair = getTradingFunctionPair.optional()(tradingFunction);
  return (
    <FlexCol className="w-full border-b">
      <p className="text-center bg-slate-200">Trading Function</p>
      <TxRow label="Fee" value={tradingFee}/>
      {/* TODO: Also, how should these values be communicated? Should BareTradingFunction be explicilty described. */}
      <Amount amount={amountQ} label="Q"/>
      <Amount amount={amountP} label="P"/>
      <TradingPair tradingPair={tradingPair}/>
    </FlexCol>
  );
};

const Position: FC<{ position: PositionT }> = ({ position }) => {
  const phi = getPositionTradingFunction.optional()(position);
  const nonce = getPositionNonce(position);
  const positionState = getPositionState.optional()(position);
  const positionSequence = getPositionStateSequence.optional()(position);
  const positionReservesAmount1 = getPositionReservesAmount1.optional()(position);
  const positionReservesAmount2 = getPositionReservesAmount2.optional()(position);
  const closeOnFill = getPositionCloseOnFill(position);

  const positionStateValue = positionState?.state === PositionState_PositionStateEnum.UNSPECIFIED ? "UNSPECIFIED"
    : positionState?.state === PositionState_PositionStateEnum.OPENED ? "OPENED"
    : positionState?.state === PositionState_PositionStateEnum.CLOSED ? "CLOSED"
    : positionState?.state === PositionState_PositionStateEnum.WITHDRAWN ? "WITHDRAWN"
    : positionState?.state === PositionState_PositionStateEnum.CLAIMED ? "CLAIMED"
    : undefined;
  const hasPositionSequence = positionSequence !== undefined && positionStateValue === "WITHDRAWN";

  return (
    <FlexCol className="w-full border-b">
      <p className="text-center bg-slate-300">Position</p>
      {phi ? <TradingFunction tradingFunction={phi}/> : null}
      <Nonce label="Nonce" value={nonce}/>
      {positionState ? (
        <FlexCol className="w-full border-b">
          <p className="text-center bg-slate-200">Position State</p>
          <TxRow label="State" value={positionStateValue}/>
          {/* NOTE: Keep gated behind  hasPositionSequence, only valid when WITHDRAWN is also true */}
          {hasPositionSequence ? <TxRow label="Sequence" value={positionSequence}/> : null}
        </FlexCol>
      ) : null}
      <FlexCol className="w-full border-b">
        <p className="text-center bg-slate-200">Reserves</p>
        <Amount amount={positionReservesAmount1} label="Asset 1 Amount"/>
        <Amount amount={positionReservesAmount2} label="Asset 2 Amount"/>
      </FlexCol>
      <TxRow label="Close on Fill" value={closeOnFill}/>
    </FlexCol>
  );
};

const SwapViewOpaque: FC<{ swapView: SwapViewT }> = ({ swapView }) => {
  const batchSwapOutput = getBatchSwapOutputData.optional()(swapView);
  const metadata1 = getSwapMetadata1.optional()(swapView);
  const metadata2 = getSwapMetadata2.optional()(swapView);
  const outputValue1 = getOutputValue1FromSwapView.optional()(swapView);
  const outputValue2 = getOutputValue2FromSwapView.optional()(swapView);
  return (
    <FlexCol className="w-full">
      {batchSwapOutput ? <BatchSwapOutputData batchSwapOutput={batchSwapOutput}/> : null}
      {outputValue1 ? <ValueView valueView={outputValue1} label="Asset 1 Value View"/> : null}
      {outputValue2 ? <ValueView valueView={outputValue2} label="Asset 2 Value View"/> : null}
      {metadata1 ? <Metadata metaData={metadata1} label="Asset 1"/> : null}
      {metadata2 ? <Metadata metaData={metadata2} label="Asset 2"/> : null}
    </FlexCol>
  );
};

const SwapViewVisible: FC<{ swapView: SwapViewT }> = ({ swapView }) => {
  const swapPlaintext = getSwapPlaintext(swapView);
  const transactionId = getSwapTransactionId.optional()(swapView);
  const batchSwapOutput = getBatchSwapOutputData.optional()(swapView);
  const noteOuput1 = getSwapNoteViewOutput1.optional()(swapView);
  const noteOuput2 = getSwapNoteViewOutput2.optional()(swapView);
  const metadata1 = getSwapMetadata1.optional()(swapView);
  const metadata2 = getSwapMetadata2.optional()(swapView);
  return (
    <FlexCol className="w-full">
      <SwapPlaintext swapPlaintext={swapPlaintext}/>
      {transactionId ? <TransactionId value={transactionId.inner} label="Transaction ID"/> : null}
      {batchSwapOutput ? <BatchSwapOutputData batchSwapOutput={batchSwapOutput}/> : null}
      {noteOuput1 ? <NoteView note={noteOuput1}/> : null}
      {noteOuput2 ? <NoteView note={noteOuput2}/> : null}
      {metadata1 ? <Metadata metaData={metadata1} label="Asset 1"/> : null}
      {metadata2 ? <Metadata metaData={metadata2} label="Asset 2"/> : null}
    </FlexCol>
  );
};

const SwapView: FC<{ swapView: SwapViewT }> = ({ swapView }) => {
  const swapProof = getSwapViewProof.optional()(swapView);
  const tradingPair = getSwapViewBodyTradingPair.optional()(swapView);
  const { delta1I, delta2I } = getSwapViewBodyAmounts(swapView);
  const feeCommitment = getSwapViewBodyFeeCommitment(swapView);
  const payload = getSwapViewBodyPayload(swapView);

  return (
    <FlexCol className="w-full">
      <p className="text-center bg-slate-400">Swap View</p>
        {swapProof? <ZKSwapProof label="ZK Proof" value={swapProof.inner}/> : null}
      <FlexCol className="w-full border-b">
        <p className="text-center bg-slate-300">Swap Body</p>
        <TradingPair tradingPair={tradingPair}/>
        <Amount amount={delta1I} label="delta_1_i"/>
        <Amount amount={delta2I} label="delta_2_i"/>
        <BalanceCommitment value={feeCommitment.inner} label="Fee Commitment"/>
        <SwapPayload swapPayload={payload}/>
      </FlexCol>
      {swapView.swapView.case === "visible" ? (
        <SwapViewVisible swapView={swapView}/>
      ) : swapView.swapView.case === "opaque" ? (
        <SwapViewOpaque swapView={swapView}/>
      ) : null}
    </FlexCol>
  );
};


const SwapClaimView: FC<{ swapClaimView: SwapClaimViewT}> = ({ swapClaimView }) => {
  // TODO: Need to clarify what is truly optional because the buf.build comments do not imply these are all optional
  //       but the source code for the protobufs has *everything* BUT EpochDuration as optional.
  // SwapClaim fields
  const swapClaimProof = getSwapClaimViewZKProof.optional()(swapClaimView);
  const swapClaimBody = getSwapClaimViewBody.optional()(swapClaimView);
  const swapEpochDuration = getSwapClaimViewEpochDuration(swapClaimView);
  // SwapClaimBody fields
  const bodyNullifier = getSwapClaimBodyNullifier.optional()(swapClaimView);
  const bodyFee = getSwapClaimBodyFee.optional()(swapClaimView);
  const bodyOutput1Commitment = getSwapClaimBodyOutput1Commitment.optional()(swapClaimView);
  const bodyOutput2Commitment = getSwapClaimBodyOutput2Commitment.optional()(swapClaimView);
  const bodyOutputData = getSwapClaimBodyBatchOutputData.optional()(swapClaimView);
  // SwapClaimView_Visible fields
  const isVisible = swapClaimView.swapClaimView.case === "visible";
  const swapClaimNoteOutput1 = getSwapClaimNoteOutput1.optional()(swapClaimView);
  const swapClaimNoteOutput2 = getSwapClaimNoteOutput2.optional()(swapClaimView);
  const swapClaimTxId = getSwapClaimTransactionId.optional()(swapClaimView);

  // NOTE: This might be a good model to copy for SwapView. Cleanly eliminates the unnecessary nesting of Opaque & Visible variants.
  return (
    <FlexCol className="w-full border">
      <p className="text-center bg-slate-400">Swap Claim View</p>
      <FlexCol className="w-full">
        {swapClaimProof ? <ZKSwapProof value={swapClaimProof.inner} label="Swap Claim Proof"/> : null}
        {swapClaimBody ? (
          <FlexCol className="w-full border-b">
            <p className="text-center bg-slate-300">Swap Claim Body</p>
            {bodyNullifier ? <Nullifier value={bodyNullifier.inner} label="Nullifier"/> : null}
            {bodyFee ? <Fee fee={bodyFee}/> : null}
            {bodyOutput1Commitment ? <StateCommitment value={bodyOutput1Commitment.inner} label="Output 1 Commitment"/> : null}
            {bodyOutput2Commitment ? <StateCommitment value={bodyOutput2Commitment.inner} label="Output 2 Commitment"/> : null}
            {bodyOutputData ? <BatchSwapOutputData batchSwapOutput={bodyOutputData}/> : null}
          </FlexCol>
        ) : null}
        <TxRow label="Epoch Duration" value={swapEpochDuration}/>
        {isVisible && swapClaimNoteOutput1 ? <NoteView note={swapClaimNoteOutput1}/> : null}
        {isVisible && swapClaimNoteOutput2 ? <NoteView note={swapClaimNoteOutput2}/> : null}
        {isVisible && swapClaimTxId ? <TransactionId value={swapClaimTxId.inner} label="Swap Transaction ID"/> : null}
      </FlexCol>
    </FlexCol>
  );
};

const DelegatorVoteView: FC<{ delegatorVoteView: DelegatorVoteViewT }> = ({ delegatorVoteView }) => {
  // DelegatorVoteView fields
  const delegatorVoteBody = getDelegatorVoteViewBody.optional()(delegatorVoteView);
  const delegatorVoteAuthSig = getDelegatorVoteViewAuthSig.optional()(delegatorVoteView);
  const delegatorVoteProof = getDelegatorVoteViewProof.optional()(delegatorVoteView);
  // DelegatorVoteBody fields
  // StartPosition and Proposal are the only non-optional fields but they're embedded in DelegatorVoteBody which, itself, is optional.
  const bodyProposal = getDelegatorVoteBodyProposal.optional()(delegatorVoteView);
  const bodyStartPosition = getDelegatorVoteBodyStartPosition.optional()(delegatorVoteView);
  const bodyVote = getDelegatorVoteBodyVote.optional()(delegatorVoteView);
  const bodyValue = getDelegatorVoteBodyValue.optional()(delegatorVoteView);
  const bodyUnboundedAmount = getDelegatorVoteBodyUnbondedAmount.optional()(delegatorVoteView);
  const bodyNullifier = getDelegatorVoteBodyNullifier.optional()(delegatorVoteView);
  const bodyRK = getDelegatorVoteBodyRK.optional()(delegatorVoteView);
  // DelegatorVoteView_Visible fields
  const isVisible = delegatorVoteView.delegatorVote.case === "visible";
  const delegatorVoteViewNote = getDelegatorVoteViewNote.optional()(delegatorVoteView);
  return (
    <FlexCol className="w-full border">
      <p className="text-center bg-slate-400">Delegator Vote View</p>
      <FlexCol className="w-full">
        {delegatorVoteBody ? (
          <FlexCol className="w-full border-b">
            <p className="text-center bg-slate-300">Delegator Vote Body</p>
            <TxRow label="Proposal" value={bodyProposal}/>
            <TxRow label="Proposal" value={bodyProposal}/>
            <TxRow label="Start Position" value={bodyStartPosition}/>
            <TxRow label="Vote" value={bodyVote?.vote.toString()}/>
            <Value value={bodyValue} label="Delegation Note Value"/>
            <Amount amount={bodyUnboundedAmount} label="Delegation Note Amount"/>
            {bodyNullifier ? <Nullifier value={bodyNullifier.inner} label="Input Note Nullifier"/> : null}
            {bodyRK ? <SpendVerificationKey value={bodyRK.inner} label="Validating Key"/> : null}
          </FlexCol>
        ) : null}
        {delegatorVoteAuthSig ? <SpendAuthSignature value={delegatorVoteAuthSig.inner} label="Auth Signature"/> : null}
        {delegatorVoteProof ? <ZKDelegatorVoteProof value={delegatorVoteProof.inner} label="Delegator Vote Proof"/> : null}
      </FlexCol>
      {isVisible && delegatorVoteViewNote ? <NoteView note={delegatorVoteViewNote}/> : null}
    </FlexCol>
  );
};

const ValidatorDefinition: FC<{ validatorDefinition: ValidatorDefinitionT }> = ({ validatorDefinition }) => {
  const validatorAuthSig = getValidatorAuthSig.optional()(validatorDefinition);
  // ValidatorDefinition.Validator fields
  const validatorIdKey = getValidatorIdentityKey.optional()(validatorDefinition);
  const validatorConsensusKey = getValidatorConsensusKey.optional()(validatorDefinition);
  // validatorName through validatorEnabled ought to be non-optional but do not currently have a consistent bailing out strategy yet.
  const validatorName = getValidatorName.optional()(validatorDefinition);
  const validatorWebsite = getValidatorWebsite.optional()(validatorDefinition);
  const validatorDescription = getValidatorDescription.optional()(validatorDefinition);
  const validatorEnabled = getValidatorEnabled.optional()(validatorDefinition);
  const validatorFundingStreams = getValidatorFundingStream.optional()(validatorDefinition);
  const validatorSequenceNumber = getValidatorSequenceNumber.optional()(validatorDefinition);
  const validatorGovernanceKey = getValidatorGovernanceKey.optional()(validatorDefinition);

  return (
    <FlexCol className="flex-wrap w-full border rounded-sm shadow-sm">
      <p className="w-full text-center font-semibold bg-slate-400">Validator Definition</p>
      {validatorIdKey ? <IdentityKey value={validatorIdKey.ik} label="Identity Verification Key"/> : null}
      {validatorConsensusKey ? <ConsensusKey value={validatorConsensusKey} label="Consensus PubKey"/> : null}
      <TxRow label="Name" value={validatorName}/>
      <TxRow label="Website" value={validatorWebsite}/>
      <TxRow label="Description" value={validatorDescription}/>
      <TxRow label="Enabled?" value={validatorEnabled?.toString() ?? undefined }/>
      {validatorFundingStreams?.length !== undefined ? (
        <FlexCol className="w-full border-b">
          <p className="text-center bg-gray-300">Funding Streams</p>
          {validatorFundingStreams.map((fundingStream, i) => <FundingStream fundingStream={fundingStream} key={i}/>)}
        </FlexCol>
      ) : null}
      <TxRow label="Sequence Number" value={validatorSequenceNumber}/>
      {validatorGovernanceKey ? <GovernanceKey value={validatorGovernanceKey.gk} label="Governance Key"/> : null}
      {validatorAuthSig ? <AuthSignature value={validatorAuthSig} label="Auth Signature"/> : null}
    </FlexCol>
  );
};

const IBCRelayAction: FC<{ ibcRelayAction: IbcRelay }> = ({ ibcRelayAction : { rawAction } }) =>{
  return (
    <FlexCol className="w-full border">
      <p className="text-center bg-slate-400">IBC Relay Action</p>
      <TxRow label="Raw Action" value={rawAction?.toJsonString()}/>
    </FlexCol>
  );
};

const ProposalSubmit: FC<{ proposalSubmit: ProposalSubmitT }> = ({ proposalSubmit }) => {
  const proposalSubmitAmount = getProposalSubmitDepositAmount.optional()(proposalSubmit);
  const proposalId = getProposalId(proposalSubmit);
  const proposalTitle = getProposalTitle(proposalSubmit);
  const proposalDescription = getProposalDescription(proposalSubmit);
  const proposalPayload = getProposalPayload.optional()(proposalSubmit);
  return (
    <FlexCol className="w-full border">
      <p className="text-center bg-slate-400">Proposal Submit</p>
      <TxRow label="ID" value={proposalId}/>
      <TxRow label="Title" value={proposalTitle}/>
      <TxRow label="Description" value={proposalDescription}/>
      {proposalPayload ? <ProposalPayload payload={proposalPayload}/> : null}
      <Amount amount={proposalSubmitAmount} label="Proposal Deposit Amount"/>
    </FlexCol>
  );

};

const ProposalWithdraw: FC<{ proposalWithdraw: ProposalWithdrawT }> = ({ proposalWithdraw }) => {
  return (
    <FlexCol className="w-full border">
      <p className="text-center bg-slate-400">Proposal Withdraw</p>
      <TxRow label="Proposal" value={proposalWithdraw.proposal}/>
      <TxRow label="Reason" value={proposalWithdraw.reason}/>
    </FlexCol>
  );
};

const ValidatorVote: FC<{ validatorVote: ValidatorVoteT }> = ({ validatorVote }) => {
  const voteAuthSig = getValidatorVoteAuthSig.optional()(validatorVote);
  const voteBody = getValidatorVoteBody.optional()(validatorVote);
  const bodyProposal = getValidatorVoteBodyProposal(validatorVote);
  const bodyVote = getValidatorVoteBodyVote.optional()(validatorVote);
  const bodyIdKey = getValidatorVoteBodyIdentityKey.optional()(validatorVote);
  const bodyGovernanceKey = getValidatorVoteBodyGovernanceKey.optional()(validatorVote);
  const bodyReason = getValidatorVoteBodyReason.optional()(validatorVote);

  return (
    <FlexCol className="w-full border">
      <p className="text-center bg-slate-400">Validator Vote</p>
      {voteBody ? (
        <FlexCol className="w-full border-b">
          <p className="text-center bg-slate-300">Validator Vote Body</p>
          <TxRow label="Proposal" value={bodyProposal}/>
          <TxRow label="Vote" value={bodyVote?.vote.toString()}/>
          {bodyIdKey ? <IdentityKey value={bodyIdKey.ik} label="Validator Identity"/> : null}
          {bodyGovernanceKey ? <GovernanceKey value={bodyGovernanceKey.gk} label="Governance Key"/> : null}
          <TxRow label="Reason" value={bodyReason?.reason}/>
        </FlexCol>
      ) : null}
      {voteAuthSig ? <AuthSignature value={voteAuthSig.inner} label="Auth Signature"/> : null}
    </FlexCol>
  );
};

const ProposalDepositClaim: FC<{ proposalDepositClaim: ProposalDepositClaimT }> = ({ proposalDepositClaim }) => {
  const proposal = proposalDepositClaim.proposal;
  const proposalDepositAmount = getProposalDepositClaimAmount.optional()(proposalDepositClaim);
  const proposalDepositOutcome = getProposalDepositClaimOutcome.optional()(proposalDepositClaim);
  const withdrawReason = getProposalDepositClaimOutcomeReason.optional()(proposalDepositClaim);
  const outcome = proposalDepositOutcome?.case === "passed" ? "Passed"
    : proposalDepositOutcome?.case === "failed" ? "Failed"
    : proposalDepositOutcome?.case === "slashed" ? "Slashed"
    : undefined;
  return (
    <FlexCol className="w-full border">
      <p className="text-center bg-slate-400">Proposal Deposit Claim</p>
      <TxRow label="Proposal" value={proposal}/>
      <Amount amount={proposalDepositAmount} label="Deposit Amount"/>
      {proposalDepositOutcome ? (
        <FlexCol className="w-full border-b">
          <p className="text-center bg-slate-300">Proposal Outcome</p>
          <TxRow label="Outcome" value={outcome}/>
          <TxRow label="Reason" value={withdrawReason}/>
        </FlexCol>
      ) : <TxRow label="Proposal Outcome"/>}
    </FlexCol>
  );
};

const PositionOpen: FC<{ positionOpen: PositionOpenT }> = ({ positionOpen }) => {
  const position = getPositionOpen.optional()(positionOpen);
  return (
    <FlexCol className="w-full border">
      <p className="text-center bg-slate-400">Position Open</p>
      {position ? (
        <Position position={position}/>
      ) : <TxRow label="Position"/>}
    </FlexCol>
  );
};

const PositionClose: FC<{ positionClose: PositionCloseT }> = ({ positionClose }) => {
  const positionId = getPositionClosePositionId.optional()(positionClose);
  return (
    <FlexCol className="w-full border">
      <p className="text-center bg-slate-400">Position Close</p>
      {positionId ? <PositionId value={positionId.inner} label="Position ID"/>: <pre className="text-center">N/A</pre>}
    </FlexCol>
  );
};

const PositionWithdraw: FC<{ positionWithdraw: PositionWithdrawT }> = ({ positionWithdraw }) => {
  const positionId = getPositionWithdrawPositionId.optional()(positionWithdraw);
  const balanceCommitment = getPositionWithdrawBalanceCommitment.optional()(positionWithdraw);
  const sequence = getPositionWithdrawSequence(positionWithdraw);
  return (
    <FlexCol className="w-full border">
      <p className="text-center bg-slate-400">Position Withdraw</p>
      {positionId ? <PositionId value={positionId.inner} label="Position ID"/> : <pre className="text-center">N/A</pre>}
      {balanceCommitment ? <BalanceCommitment label="Reserves Commitment" value={balanceCommitment.inner}/> : null}
      <TxRow label="Sequence" value={sequence}/>
    </FlexCol>
  );
};

// NOTE: DEPRECATED
const PositionRewardClaim: FC<{ positionRewardClaim: PositionRewardClaimT }> = ({ positionRewardClaim }) => {
  const positionId = getPositionRewardClaimPositionId.optional()(positionRewardClaim);
  const balanceCommitment = getPositionRewardClaimBalanceCommitment.optional()(positionRewardClaim);
  return (
    <FlexCol className="w-full border">
      <p className="text-center bg-slate-400">Position Reward Claim</p>
      {positionId ? <PositionId value={positionId.inner} label="Position ID"/>: null}
      {balanceCommitment ? <BalanceCommitment label="Rewards Commitment" value={balanceCommitment.inner}/> : null}
    </FlexCol>
  );
};

const CommunityPoolSpend: FC<{ communityPoolSpend: CommunityPoolSpendT }> = ({ communityPoolSpend }) => {
  const value = getCommunityPoolSpendValue.optional()(communityPoolSpend);
  return (
    <FlexCol className="w-full border">
      <p className="text-center bg-slate-400">Community Pool Spend</p>
      <Value value={value} label="Spend Value"/>
    </FlexCol>
  );
};

const CommunityPoolOutput: FC<{ communityPoolOutput: CommunityPoolOutputT }> = ({ communityPoolOutput }) => {
  const value = getCommunityPoolOutputValue.optional()(communityPoolOutput);
  const address = getCommunityPoolOutputAddress.optional()(communityPoolOutput);
  return (
    <FlexCol className="w-full">
      <p className="w-full">Community Pool Output</p>
      <Value value={value} label="Output Value"/>
      <Address address={address}/>
    </FlexCol>
  );
};

const CommunityPoolDeposit: FC<{ communityPoolDeposit: CommunityPoolDepositT }> = ({ communityPoolDeposit }) => {
  const value = getCommunityPoolDepositValue.optional()(communityPoolDeposit);
  return (
    <FlexCol className="w-full">
      <p className="w-full">Community Pool Deposit</p>
      <Value value={value} label="Desposit Value"/>
    </FlexCol>
  );
};

const UndelegateClaim: FC<{ undelegateClaim: UndelegateClaimT }> = ({ undelegateClaim }) => {
  const validatorID = getUndelegateClaimIdentityKey.optional()(undelegateClaim);
  // NOTE: DEPRECATED
  // NOTE: marked as Deprecated but protos mark it as non-optional so how do deprecations actually get handled at implementation?
  const startEpochIndex = getUndelegateClaimStartEpochIndex(undelegateClaim);
  const penalty = getUndelegateClaimPenalty.optional()(undelegateClaim);
  const balanceCommitment = getUndelegateClaimBalanceCommitment.optional()(undelegateClaim);
  const unbondingStartHeight = getUndelegateClaimUnbondingStartHeight(undelegateClaim);
  const undelegateClaimProof = getUndelegateClaimProof(undelegateClaim);
  return (
    <FlexCol className="w-full border">
      <p className="w-full">Undelegate Claim</p>
      {validatorID ? <IdentityKey value={validatorID.ik} label="Validator Identity Key"/> : null}
      <TxRow label="Start Epoch Index (DEPRECATED)" value={startEpochIndex}/>
      {penalty ? <Penalty value={penalty.inner} label="Penalty"/> : null}
      {balanceCommitment ? <BalanceCommitment value={balanceCommitment.inner} label="Balance Commitment"/> : null}
      <TxRow label="Unbonding Start Height" value={unbondingStartHeight}/>
      <UndelegateClaimProof value={undelegateClaimProof} label="Proof"/>
    </FlexCol>
  );
};

const Ics20Withdrawal: FC<{ ics20Withdrawal: Ics20WithdrawalT }> = ({ ics20Withdrawal }) => {
  const withdrawalAmount = getIcs20WithdrawalAmount.optional()(ics20Withdrawal);
  const denom = getIcs20WithdrawalDenom.optional()(ics20Withdrawal);
  const destinationAddress = getIcs20WithdrawalDestinationAddress(ics20Withdrawal);
  const returnAddress = getIcs20WithdrawalReturnAddress.optional()(ics20Withdrawal);
  const timeoutHeight = getIcs20WithdrawalTimeoutHeight.optional()(ics20Withdrawal);
  const timeoutTime = getIcs20WithdrawalTimeoutTime(ics20Withdrawal);
  const sourceChannel = getIcs20WithdrawalSourceChannel(ics20Withdrawal);

  return (
    <FlexCol className="w-full border">
      <p className="text-center bg-slate-400">ICS20 Withdrawal</p>
      <Amount amount={withdrawalAmount}/>
      <TxRow label="Denom" value={denom}/>
      <TxRow label="Destination Address" value={destinationAddress}/>
      {returnAddress ? (
        <FlexCol className="w-full">
          <p className="w-full">Return Address</p>
          <Address address={returnAddress}/>
        </FlexCol>
      ) : null}
      {timeoutHeight ? <Height height={timeoutHeight}/> : null}
      <FlexRow className="flex-wrap w-full">
        <p>Timeout Time</p>
        <pre>{timeoutTime.toString()}</pre>
      </FlexRow>
      <FlexRow className="flex-wrap w-full">
        <p>Source Channel</p>
        <pre>{sourceChannel}</pre>
      </FlexRow>
    </FlexCol>
  );
};

const Delegate: FC<{ delegate: DelegateT }> = ({ delegate }) => {
  const validatorID = getDelegateIdentityKey.optional()(delegate);
  const epochIndex = getDelegateEpochIndex(delegate);
  const unbondedAmount = getDelegateUnbondedAmount.optional()(delegate);
  const delegationAmount = getDelegateDelegationAmount.optional()(delegate);
  return (
    <FlexCol className="w-full border">
      <p className="text-center bg-slate-400">Delegate</p>
      {validatorID ? <IdentityKey value={validatorID.ik} label="Validator Identity Key"/> : null}
      <TxRow label="Epoch Index" value={epochIndex}/>
      <Amount amount={unbondedAmount} label="Unbonded Amount"/>
      <Amount amount={delegationAmount} label="Delegation Amount"/>
    </FlexCol>
  );
};

const Undelegate: FC<{ undelegate: UndelegateT }> = ({ undelegate }) => {
  const validatorID = getUndelegateIdentityKey.optional()(undelegate);
  // NOTE: DEPRECATED
  // NOTE: similar situation to UndelegateClaim, this field is deprecated but, also, non-optional in the protos def.
  const startEpochIndex = getUndelegateStartEpochIndex(undelegate);
  const unbondedAmount = getUndelegateUnbondedAmount.optional()(undelegate);
  const delegationAmount = getUndelegateDelegationAmount.optional()(undelegate);
  const fromEpoch = getUndelegateFromEpoch.optional()(undelegate);
  return (
    <FlexCol className="w-full border">
      <p className="text-center bg-slate-400">Undelegate</p>
      {validatorID ? <IdentityKey value={validatorID.ik} label="Validator Identity Key"/> : null}
      <TxRow label="Start Epoch Index (DEPRECATED)" value={startEpochIndex}/>
      <Amount amount={unbondedAmount} label="Unbonded Amount"/>
      <Amount amount={delegationAmount} label="Delegation Amount"/>
      {fromEpoch ? <Epoch epoch={fromEpoch} label="From Epoch"/> : null}
    </FlexCol>
  );
};

const ActionDutchActionScheduleView: FC<{ dutchAuctionScheduleView: ActionDutchAuctionScheduleViewT }> = ({ dutchAuctionScheduleView }) => {
  // AuctionDescription fields
  const input = getInputFromActionDutchAuctionScheduleView.optional()(dutchAuctionScheduleView);
  const outputId = getOutputIdFromActionDutchAuctionScheduleView.optional()(dutchAuctionScheduleView);
  const maxOutput = getMaxOutputFromActionDutchAuctionScheduleView.optional()(dutchAuctionScheduleView);
  const minOutput = getMinOutputFromActionDutchAuctionScheduleView.optional()(dutchAuctionScheduleView);
  const startHeight = getStartHeightFromActionDutchAuctionScheduleView(dutchAuctionScheduleView);
  const endHeight = getEndHeightFromActionDutchAuctionScheduleView(dutchAuctionScheduleView);
  const stepCount = getStepCountFromActionDutchAuctionScheduleView(dutchAuctionScheduleView);
  const nonce = getNonceFromActionDutchAuctionScheduleView(dutchAuctionScheduleView);
  // remaining ActionDutchAuctionScheduleView level fields
  const auctionId = getActionDutchAuctionScheduleViewAuctionId.optional()(dutchAuctionScheduleView);
  const inputMetadata = getActionDutchAuctionScheduleViewInputMetadata.optional()(dutchAuctionScheduleView);
  const outputMetadata = getActionDutchAuctionScheduleViewOutputMetadata.optional()(dutchAuctionScheduleView);
  return (
    <FlexCol className="w-full border">
      <p className="text-center bg-slate-400">Action Dutch Auction Schedule View</p>
      <FlexCol className="w-full border-b">
        <p className="text-center bg-slate-300">Dutch Action Description</p>
        <Value value={input}/>
        <AssetId assetId={outputId} label="Target Asset ID"/>
        <Amount amount={maxOutput} label="Maximum Output"/>
        <Amount amount={minOutput} label="Minimum Output"/>
        <TxRow label="Start Height" value={startHeight}/>
        <TxRow label="End Height" value={endHeight}/>
        <TxRow label="Step Count" value={stepCount}/>
        <Nonce label="Nonce" value={nonce}/>
      </FlexCol>
      {auctionId ? <AuctionId value={auctionId.inner} label="Auction ID"/> : null}
      {inputMetadata ? <Metadata metaData={inputMetadata} label="Input Metadata"/> : null}
      {outputMetadata ? <Metadata metaData={outputMetadata} label="Output Metadata"/> : null}
    </FlexCol>
  );
};

const ActionDutchAuctionEnd: FC<{ actionDutchAuctionEnd: ActionDutchAuctionEndT }> = ({ actionDutchAuctionEnd }) => {
  const auctionId = getAuctionIdFromActionDutchAuctionEnd.optional()(actionDutchAuctionEnd);
  return (
    <FlexCol className="w-full border">
      <p className="text-center bg-slate-4000">Action Dutch Auction End</p>
      {auctionId ? <AuctionId value={auctionId.inner} label="Auction ID"/> : null}
    </FlexCol>
  );
};

const ActionDutchAuctionWithdrawView: FC<{ actionDutchAuctionWithdrawView: ActionDutchAuctionWithdrawViewT }> = ({ actionDutchAuctionWithdrawView }) => {
  const auctionId = getAuctionIdFromActionDutchAuctionWithdrawView.optional()(actionDutchAuctionWithdrawView);
  const seq = getSeqFromActionDutchAuctionWithdrawView(actionDutchAuctionWithdrawView);
  const reservesCommitment = getReservesCommitmentFromActionDutchAuctionWithdrawView.optional()(actionDutchAuctionWithdrawView);
  const reserves = getReservesFromActionDutchAuctionWithdrawView(actionDutchAuctionWithdrawView);
  return (
    <FlexCol className="w-full border">
      <p className="text-center bg-slate-400">Action Dutch Auction Withdraw View</p>
      {auctionId ? <AuctionId value={auctionId.inner} label="Auction ID"/> : null}
      <TxRow label="Sequence" value={seq}/>
      {reservesCommitment ? <BalanceCommitment value={reservesCommitment.inner} label="Reserves Commitment"/> : null}
      {reserves.length !== 0 ? (
        <FlexCol className="w-full border-b">
          <p className="text-center bg-slate-300">Reserves</p>
          {reserves.map((valueView, i) => <ValueView valueView={valueView} key={i}/>)}
        </FlexCol>
      ) : null}
    </FlexCol>
  );
};

export const getActionView = ({ actionView } : ActionViewT) => {
  switch (actionView.case) {
    case "spend": {
      return <SpendView spendView={actionView.value}/>;
    }
    case "output": {
      return <OutputView outputView={actionView.value}/>;
    }
    case "swap": {
      return <SwapView swapView={actionView.value}/>;
    }
    case "swapClaim": {
      return <SwapClaimView swapClaimView={actionView.value}/>;
    }
    case "delegatorVote": {
      return <DelegatorVoteView delegatorVoteView={actionView.value}/>;
    }
    case "validatorDefinition": {
      return <ValidatorDefinition validatorDefinition={actionView.value}/>;
    }
    case "ibcRelayAction": {
      return <IBCRelayAction ibcRelayAction={actionView.value}/>;
    }
    case "proposalSubmit": {
      return <ProposalSubmit proposalSubmit={actionView.value}/>;
    }
    case "proposalWithdraw": {
      return <ProposalWithdraw proposalWithdraw={actionView.value}/>;
    }
    case "validatorVote": {
      return <ValidatorVote validatorVote={actionView.value}/>;
    }
    case "proposalDepositClaim": {
      return <ProposalDepositClaim proposalDepositClaim={actionView.value}/>;
    }
    case "positionOpen": {
      return <PositionOpen positionOpen={actionView.value}/>;
    }
    case "positionClose": {
      return <PositionClose positionClose={actionView.value}/>;
    }
    case "positionWithdraw": {
      return <PositionWithdraw positionWithdraw={actionView.value}/>;
    }
    // Deprecated Action
    case "positionRewardClaim": {
      return <PositionRewardClaim positionRewardClaim={actionView.value}/>;
    }
    case "delegate": {
      return <Delegate delegate={actionView.value}/>;
    }
    case "undelegate": {
      return <Undelegate undelegate={actionView.value}/>;
    }
    case "communityPoolSpend": {
      return <CommunityPoolSpend communityPoolSpend={actionView.value}/>;
    }
    case "communityPoolOutput": {
      return <CommunityPoolOutput communityPoolOutput={actionView.value}/>;
    }
    case "communityPoolDeposit": {
      return <CommunityPoolDeposit communityPoolDeposit={actionView.value}/>;
    }
    case "actionDutchAuctionSchedule": {
      return <ActionDutchActionScheduleView dutchAuctionScheduleView={actionView.value}/>;
    }
    case "actionDutchAuctionEnd": {
      return <ActionDutchAuctionEnd actionDutchAuctionEnd={actionView.value}/>;
    }
    case "actionDutchAuctionWithdraw": {
      return <ActionDutchAuctionWithdrawView actionDutchAuctionWithdrawView={actionView.value}/>;
    }
    case "undelegateClaim": {
      return <UndelegateClaim undelegateClaim={actionView.value}/>;
    }
    case "ics20Withdrawal": {
      return <Ics20Withdrawal ics20Withdrawal={actionView.value}/>;
    }
    default:
      return undefined;
  }
};

interface ActionViewProps {
  action: ActionViewT,
}


export const ActionView : FC<ActionViewProps> = ({ action }) => {
  return (getActionView(action));
};
