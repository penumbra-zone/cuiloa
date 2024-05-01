import type { FC } from "react";
import type { SwapView as SwapViewT, SwapClaimView as SwapClaimViewT, Swap as SwapT, TradingPair as TradingPairT, SwapPayload as SwapPayloadT, BatchSwapOutputData as BatchSwapOutputDataT, SwapPlaintext as SwapPlaintextT, SwapClaim as SwapClaimT} from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/component/dex/v1/dex_pb";
import type { Output as OutputT, NoteView as NoteViewT, Spend as SpendT, NotePayload as NotePayloadT } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/component/shielded_pool/v1/shielded_pool_pb";
import type { ActionView as ActionViewT } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/transaction/v1/transaction_pb";
import type { ChangedAppParameters as ChangeAppParametersT, DelegatorVoteView as DelegatorVoteViewT, ProposalSubmit as ProposalSubmitT, Proposal_CommunityPoolSpend, Proposal_Emergency, Proposal_FreezeIbcClient, Proposal_ParameterChange, Proposal_Signaling, Proposal_UnfreezeIbcClient, Proposal_UpgradePlan, Vote as VoteT, } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/component/governance/v1/governance_pb";
import { getAddress, getAddressIndex } from "@penumbra-zone/getters/src/address-view";
import { getAsset1, getAsset2 } from "@penumbra-zone/getters/src/trading-pair";
import { getBatchSwapOutputDelta1Amount, getBatchSwapOutputDelta2Amount, getBatchSwapOutputTradingPair, getBatchSwapOutputLambda1Amount, getBatchSwapOutputLambda2Amount, getBatchSwapOutputUnfilled1Amount, getBatchSwapOutputUnfilled2Amount , getBatchSwapOutputData, getOutput, getOutputKey, getOutputNote, getSpend, getSpendNote, getSwap, getSwapBodyAmounts, getSwapBodyFeeCommitment, getSwapBodyPayload, getSwapMetadata1, getSwapMetadata2, getWalletId, getOutputValue1FromSwapView, getOutputValue2FromSwapView, getSwapTransactionId, getSwapPlaintext, getSwapNoteViewOutput1, getSwapNoteViewOutput2, getSwapPlaintextTradingPair, getSwapPlaintextDelta1, getSwapPlaintextDelta2, getSwapPlaintextFee, getSwapPlaintextAddress, getFeeAmount, getFeeAssetId, getSwapClaimViewZKProof, getSwapClaimViewBody, getSwapClaimViewEpochDuration, getSwapClaimBodyNullifier, getSwapClaimBodyFee, getSwapClaimBodyOutput1Commitment, getSwapClaimBodyOutput2Commitment, getSwapClaimBodyBatchOutputData, getSwapClaimNoteOutput1, getSwapClaimNoteOutput2, getSwapClaimTransactionId, getDelegatorVoteViewBody, getDelegatorVoteViewAuthSig, getDelegatorVoteViewProof, getDelegatorVoteViewNote, getDelegatorVoteBodyProposal, getDelegatorVoteBodyStartPosition, getDelegatorVoteBodyVote, getDelegatorVoteBodyValue, getDelegatorVoteBodyUnbondedAmount, getDelegatorVoteBodyNullifier, getDelegatorVoteBodyRK, getValidatorIdentityKey, getValidatorConsensusKey, getValidatorName, getValidator, getValidatorWebsite, getValidatorDescription, getValidatorEnabled, getValidatorFundingStream, getValidatorSequenceNumber, getValidatorGovernanceKey, getValidatorAuthSig, getFundingStreamToAddress, getFundingStreamRateBps, getProposalSubmitDepositAmount, getProposalId, getProposalTitle, getProposalDescription, getProposalPayload } from "@/lib/protobuf";
import { joinLoHiAmount } from "@penumbra-zone/types/src/amount";
import { getAssetId } from "@penumbra-zone/getters/src/metadata";
import { getAmount, getMetadata, getEquivalentValues, getExtendedMetadata, getAssetIdFromValueView } from "@penumbra-zone/getters/src/value-view";
import type { Address as AddressT, AddressIndex as AddressIndexT, WalletId as WalletIdT, PayloadKey as PayloadKeyT } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/keys/v1/keys_pb";
import type { AssetId as AssetIdT, EquivalentValue as EquivalentValueT, Metadata as MetadataT, Value as ValueT, ValueView as ValueViewT } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/asset/v1/asset_pb";
import { FlexCol, FlexRow } from "../ui/flex";
import type { Amount as AmountT } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/num/v1/num_pb";
import type { Fee as FeeT } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/component/fee/v1/fee_pb";
import type { ValidatorDefinition as ValidatorDefinitionT, FundingStream as FundingStreamT} from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/component/stake/v1/stake_pb";
import type { IbcRelay } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/component/ibc/v1/ibc_pb";

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

const PayloadKey: FC<{ payloadKey: PayloadKeyT }> = ({ payloadKey }) => {
  return (
    <div className="flex">
      <p>Payload Key</p>
      <pre>{payloadKey.inner}</pre>
    </div>
  );
};

const GenericKV: FC<{ name: string, _key: Uint8Array }> = ({ name, _key }) => {
  return (
    <FlexRow>
      <p>{name}</p>
      <pre>{_key}</pre>
    </FlexRow>
  );
};

// TODO: Currently abusing GenericKV. These keys diverge drastically on encoding and should reflect this to the degree possible.
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
const ZKDelegatorVoteProof = GenericKV;
const AuthSignature = GenericKV;
const IdentityKey = GenericKV;
const GovernanceKey = GenericKV;
const ConsensusKey = GenericKV;

const EquivalentValueView: FC<{ equivalentValue: EquivalentValueT }> = ({ equivalentValue }) => {
  return (
    <FlexCol>
      <p>Equivalent Value</p>
      {equivalentValue.equivalentAmount ? <Amount amount={equivalentValue.equivalentAmount}/> : null}
      {equivalentValue.numeraire ? <Metadata metaData={equivalentValue.numeraire}/> : null}
      <FlexRow>
        <p>Height</p>
        <pre>{equivalentValue.asOfHeight.toString()}</pre>
      </FlexRow>
    </FlexCol>
  );
};

// NOTE: the way ValueView's opaque vs visible cases are handled is by the fact that metadata, equivalentValues, and extendedMetadata
//       should never be defined in the case of an UnknownAssetId and we only render assetId when valueView.case is unknownAssetId.
const ValueView: FC<{ valueView: ValueViewT, label?: "Asset 1" | "Asset 2" }> = ({ valueView, label }) => {
  const amount = getAmount(valueView);
  const metadata = getMetadata.optional()(valueView);
  const equivalentValues = getEquivalentValues.optional()(valueView);
  const extendedMetadata = getExtendedMetadata.optional()(valueView);
  const assetId = getAssetIdFromValueView(valueView);
  return (
    <FlexCol>
      {label ? <p>{label} ValueView</p> : <p>ValueView</p>}
      <Amount amount={amount} label={label ? `${label} Amount` : "Amount"}/>
      {metadata ? <Metadata metaData={metadata} label={label}/> : null}
      {equivalentValues ? (
        <FlexRow>
          {equivalentValues.map((equivalentValue, i) => <EquivalentValueView equivalentValue={equivalentValue} key={i}/>)}
        </FlexRow>
      ) : null}
      {extendedMetadata ? (
        <FlexRow>
          <p>Extended Metadata</p>
          <pre>{extendedMetadata.toJsonString()}</pre>
        </FlexRow>
      ) : null}
      {valueView.valueView.case === "unknownAssetId" ? (
        <AssetId assetId={assetId}/>
      ) : null}
    </FlexCol>
  );
};

const Value: FC<{ value: ValueT, label?: string }> = ({ value, label }) => {
  return (
    <FlexCol>
      {(label ?? "") ? <p>{label}</p> : <p>Value</p>}
      {value.amount ? <Amount amount={value.amount}/> : null}
      {value.assetId ? <AssetId assetId={value.assetId}/> : null}
    </FlexCol>
  );
};

const NotePayload: FC<{ notePayload: NotePayloadT }> = ({ notePayload }) => {
  return (
    <div className="flex flex-wrap w-full">
      <p className="w-full">NotePayload</p>
      <div className="flex flex-wrap w-full">
        {notePayload.noteCommitment ? (
          <div className="flex">
            <p className="w-full">Note Commitment</p>
            <pre className="w-full">{notePayload.noteCommitment.inner}</pre>
          </div>
        ) : null}
        <EphemeralKey _key={notePayload.ephemeralKey} name="Ephemeral Key"/>
        {notePayload.encryptedNote ? (
          <div className="flex flex-wrap w-full">
            <p className="w-full">Encrypted Note</p>
            <pre className="w-full">{notePayload.encryptedNote.inner}</pre>
          </div>
        ) : null}
      </div>
    </div>
  );
};


const Output: FC<{ output: OutputT }> = ({ output }) => {
  const body = output.body;
  return (
    <div className="flex flex-col flex-wrap w-full">
      {body ? (
        <div className="flex flex-wrap w-full">
          <p className="w-full">OutputBody</p>
          {body.notePayload ? (
            <NotePayload notePayload={body.notePayload}/>
          ) : null}
          {body.balanceCommitment ? (
            <BalanceCommitment _key={body.balanceCommitment.inner} name="Balance Commitment"/>
          ) : null}
          <WrappedMemoKey _key={body.wrappedMemoKey} name="Wrapped Memo Key"/>
          <OvkWrappedKey _key={body.ovkWrappedKey} name="Ovk Wrapped Key"/>
        </div>
      ) : null}
      {output.proof ? (
        <div className="flex flex-wrap w-full">
          <p className="w-full">Proof</p>
          <pre className="w-full">{output.proof.inner}</pre>
        </div>
      ) : null}
    </div>
  );
};

const Spend : FC<{spend: SpendT}>= ({spend}) => {
  const spendBody = spend.body;
  return (
    <div className="flex flex-col flex-wrap w-full">
      <div className="flex flex-col flex-wrap w-full">
        {spend.proof ? (
          <div className="flex flex-wrap w-full">
            <p className="w-full">Proof</p>
            <pre className="w-full">{spend.proof.inner}</pre>
          </div>
        ) : null}
        {spend.authSig ? (
        <div className="flex flex-wrap w-full">
          <p className="w-full">AuthSig</p>
          <pre className="w-full">{spend.authSig.inner}</pre>
        </div>
        ) : null}
        {spendBody ? (
          <div className="flex flex-wrap w-full">
            <p className="w-full">Body</p>
            <div className="flex flex-wrap w-full">
              {spendBody.nullifier ? (
                <div className="flex flex-wrap w-full">
                  <p className="w-full">Nullifier</p>
                  <pre className="w-full">{spendBody.nullifier.inner}</pre>
                </div>
              ) : spendBody.rk ? (
                <div className="flex flex-wrap w-full">
                  <p className="w-full">Randomized Validating Key</p>
                  <pre className="w-full">{spendBody.rk.inner}</pre>
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
    <div className="flex flex-col flex-wrap w-full">
      <p className="w-full">TxNote</p>
      {address ? (
        <div className="flex flex-col flex-wrap w-full">
          <p className="w-full">Address</p>
          <Address address={address}/>
          {walletId ? <WalletId walletId={walletId}/> : null}
          {addressIndex ? <AddressIndex index={addressIndex}/> : null}
        </div>
      ) : null}
      <div className="flex flex-col flex-wrap">
        <p className="w-full">rseed</p>
        <pre>{note.rseed}</pre>
      </div>
    </div>
  );
};

const SpendView : FC<{ spend: SpendT, noteView?: NoteViewT}> = ({spend, noteView}) => {
  return (
    <div className="flex flex-col flex-wrap w-full">
      <p className="w-full">Spend View</p>
      <Spend spend={spend} />
      {noteView ? (
        <NoteView note={noteView}/>
      ) : null}
    </div>
  );
};

const OutputView: FC<{ output: OutputT, noteView?: NoteViewT, payloadKey?: PayloadKeyT }> = ({ output, noteView, payloadKey }) => {
  return (
    <div className="flex flex-col flex-wrap w-full">
      <p className="w-full">Output View</p>
      <Output output={output} />
      {noteView ? (
        <NoteView note={noteView}/>
      ) : null}
      {payloadKey ? (
        <PayloadKey payloadKey={payloadKey}/>
      ) : null}
    </div>
  );
};

const AssetId: FC<{ assetId: AssetIdT, label?: string }> = ({ assetId, label }) => {
  return (
    <FlexRow>
      {(label ?? "") ? <p>{label}</p> : <p>Asset ID</p>}
      <FlexRow>
        <p>inner</p>
        <p>{assetId.inner}</p>
      </FlexRow>
      <FlexRow>
        <p>Alt Bech32</p>
        <p>{assetId.altBech32m}</p>
      </FlexRow>
      <FlexRow>
        <p>Alt Base Denomination</p>
        <p>{assetId.altBaseDenom}</p>
      </FlexRow>
    </FlexRow>
  );
};

const TradingPair: FC<{ tradingPair?: TradingPairT }> = ({ tradingPair }) => {
  const asset1 = getAsset1(tradingPair);
  const asset2 = getAsset2(tradingPair);
  return (
    <FlexCol>
      <p>Trading Pair</p>
      <AssetId assetId={asset1} label="Asset 1"/>
      <AssetId assetId={asset2} label="Asset 2"/>
    </FlexCol>
  );
};

const Amount: FC<{ amount: AmountT, label?: string }> = ({ amount, label }) => {
  return (
    <FlexRow>
      {(label ?? "") ? <p>{label}</p> : <p>Amount</p>}
      <p>{joinLoHiAmount(amount).toString()}</p>
    </FlexRow>
  );
};

const SwapPayload: FC<{ swapPayload: SwapPayloadT }> = ({ swapPayload }) => {
  return (
    <FlexCol>
      {swapPayload.commitment ? <StateCommitment _key={swapPayload.commitment?.inner} name="Commitment"/> : null}
      <EncryptedSwap _key={swapPayload.encryptedSwap} name="Encrypted Swap"/>
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
  const startingEpoch = batchSwapOutput.epochStartingHeight;
  return (
    <FlexCol>
      <p>BatchSwapOutputData</p>
      <Amount amount={delta1I} label="delta_1_i"/>
      <Amount amount={delta2I} label="delta_2_i"/>
      <Amount amount={lambda1} label="lambda_1"/>
      <Amount amount={lambda2} label="lambda_2"/>
      <Amount amount={unfilled1} label="unfilled_1"/>
      <Amount amount={unfilled2} label="unfilled_2"/>
      <FlexRow>
        <p>Height</p>
        <pre>{height.toString()}</pre>
      </FlexRow>
      <TradingPair tradingPair={tradingPair}/>
      <FlexRow>
        <p>Epoch Starting Height</p>
        <pre>{startingEpoch.toString()}</pre>
      </FlexRow>
    </FlexCol>
  );
};

const Metadata: FC<{ metaData: MetadataT, label?: "Asset 1" | "Asset 2" }> = ({ metaData, label }) => {
  const assetId = getAssetId(metaData);
  return (
    <FlexCol>
      {label ? <p>{`${label} Metadata`}</p> : <p>Asset Metadata</p>}
      <FlexRow>
        <p>Name</p>
        <p>{metaData.name}</p>
      </FlexRow>
      <FlexRow>
        <p>Description</p>
        <p>{metaData.description}</p>
      </FlexRow>
      <FlexRow>
        <p>Symbol</p>
        <p>{metaData.symbol}</p>
      </FlexRow>
      <AssetId assetId={assetId} label="Penumbra Asset ID"/>
      <FlexRow>
        <p>Display Denomination</p>
        <pre>{metaData.display}</pre>
      </FlexRow>
      <FlexRow>
        <p>Base Denomination</p>
        <pre>{metaData.base}</pre>
      </FlexRow>
      {/* TODO: This needs to be fleshed out. Skipping aliases and information for exponents. Could easily blow up the UI without collapsable elements as it is. */}
      <FlexRow>
        {metaData.denomUnits.map((denomUnit, i) => <p key={i}>{denomUnit.denom}</p>)}
      </FlexRow>
      {/* TODO: Skipping AssetImage images field entirely */}
      <FlexRow>
        <p>Asset Images</p>
        <p>Unimplemented</p>
      </FlexRow>
    </FlexCol>
  );
};

const Vote: FC<{ vote: VoteT }> = ({ vote }) => {
  return (
    <FlexRow>
      <p>Vote</p>
      <pre>{vote.vote.toString()}</pre>
    </FlexRow>
  );
};

const Fee: FC<{ fee: FeeT}> = ({ fee }) => {
  const amount = getFeeAmount(fee);
  const assetId = getFeeAssetId.optional()(fee);
  return (
    <FlexCol>
      <p>Fee</p>
      <Amount amount={amount}/>
      {assetId ? <AssetId assetId={assetId} label="Token ID"/> : null}
    </FlexCol>
  );
};

const FundingStream: FC<{ fundingStream: FundingStreamT }> = ({ fundingStream }) => {
  const fundingStreamToAddress = getFundingStreamToAddress.optional()(fundingStream);
  const fundingStreamBps = getFundingStreamRateBps.optional()(fundingStream);
  return (
    <FlexCol className="flex-overflow w-full">
      {fundingStreamToAddress !== undefined ?
        <FlexRow className="flex-overflow w-full">
          <p>Destination Address</p>
          <pre>{fundingStreamToAddress}</pre>
        </FlexRow> : null}
      {fundingStreamBps !== undefined ?
        <FlexRow>
          <p>Reward BPS</p>
          <pre>{fundingStreamToAddress}</pre>
        </FlexRow> : null}
    </FlexCol>
  );
};

const SwapPlaintext: FC<{ swapPlaintext: SwapPlaintextT }> = ({ swapPlaintext }) => {
  const tradingPair = getSwapPlaintextTradingPair(swapPlaintext);
  const delta1I = getSwapPlaintextDelta1(swapPlaintext);
  const delta2I = getSwapPlaintextDelta2(swapPlaintext);
  const claimFee = getSwapPlaintextFee(swapPlaintext);
  const claimAddress = getSwapPlaintextAddress(swapPlaintext);
  return (
    <FlexCol>
      <TradingPair tradingPair={tradingPair}/>
      <Amount amount={delta1I} label="Delta 1"/>
      <Amount amount={delta2I} label="Delta 2"/>
      <Fee fee={claimFee}/>
      <Address address={claimAddress}/>
      <RSeed _key={swapPlaintext.rseed} name="rseed"/>
    </FlexCol>
  );
};

const ChangeParameters: FC<{
  parameters: ChangeAppParametersT,
  label: "Old App Parameters" | "New App Parameters"
}> = ({ parameters, label }) => {
  return (
    <FlexCol>
    </FlexCol>
  );
};

const ProposalPayload: FC<{ payload: ProposalSubmitKind }> = ({ payload }) => {
  switch (payload.case) {
    case "signaling":
      return (
        <FlexRow>
          <p>Commit</p>
          <pre>{payload.value.commit}</pre>
        </FlexRow>
      );
    case "emergency":
      return (
        <FlexRow>
          <p>Emergency Halt Chain</p>
          <pre>{payload.value.haltChain}</pre>
        </FlexRow>
      );
    case "parameterChange":
      return (
        <FlexCol>
          <p>Change App Parameters</p>
          {payload.value.oldParameters ?
            <ChangeParameters
              parameters={payload.value.oldParameters}
              label="Old App Parameters"/> : null}
          {payload.value.newParameters ?
            <ChangeParameters
              parameters={payload.value.newParameters}
              label="New App Parameters"/> : null}
          <FlexCol>
            <p>New Parameters</p>
          </FlexCol>
        </FlexCol>
      );
    case "communityPoolSpend": {
      const ibcValue = payload.value.transactionPlan?.value;
      const ibcTypeURL = payload.value.transactionPlan?.typeUrl;
      return (
        <FlexCol className="flex-overflow w-full">
          <p className="w-full">Community Pool Spend</p>
          {ibcValue ? (
            <FlexCol className="flex-overflow w-full">
              <p className="w-full">Value</p>
              <pre className="w-full">{ibcValue}</pre>
            </FlexCol>
          ) : null}
          {ibcTypeURL?.length !== undefined ? (
            <FlexCol className="flex-overflow w-full">
              <p>Proto URL Resource</p>
              <pre className="w-full">{ibcTypeURL}</pre>
            </FlexCol>
          ) : null}
      </FlexCol>
      );
    }
    case "upgradePlan":
      return (
      <FlexRow>
        <p>Upgrade Height</p>
        <pre>{payload.value.height.toString()}</pre>
      </FlexRow>
      );
    case "freezeIbcClient":
      return (
        <FlexRow>
          <p>Freeze IBC Client ID</p>
          <pre>{payload.value.clientId}</pre>
        </FlexRow>
      );
    case "unfreezeIbcClient":
      return (
        <FlexRow>
          <p>Unfreeze IBC Client ID</p>
          <pre>{payload.value.clientId}</pre>
        </FlexRow>
      );
    default:
      break;
  }
};

const Swap: FC<{ swap: SwapT}> = ({ swap }) => {
  const swapBody = swap.body;
  const { delta1I, delta2I } = getSwapBodyAmounts(swapBody);
  const feeCommitment = getSwapBodyFeeCommitment(swapBody);
  const payload = getSwapBodyPayload(swapBody);
  return (
    <FlexCol>
      {swap.proof ? <ZKSwapProof name="ZK Proof" _key={swap.proof.inner}/> : null}
      {swapBody ? (
        <FlexCol>
          <p>Swap Body</p>
          <TradingPair tradingPair={swapBody.tradingPair}/>
          <Amount amount={delta1I} label="delta_1_i"/>
          <Amount amount={delta2I} label="delta_2_i"/>
          <BalanceCommitment _key={feeCommitment.inner} name="Fee Commitment"/>
          <SwapPayload swapPayload={payload}/>
        </FlexCol>
      ) : null}
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
    <FlexCol>
      {batchSwapOutput ? <BatchSwapOutputData batchSwapOutput={batchSwapOutput}/> : null}
      {outputValue1 ? <ValueView valueView={outputValue1} label="Asset 1"/> : null}
      {outputValue2 ? <ValueView valueView={outputValue2} label="Asset 2"/> : null}
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
    <FlexCol>
      <SwapPlaintext swapPlaintext={swapPlaintext}/>
      {transactionId ? <TransactionId _key={transactionId.inner} name="Transaction ID"/> : null}
      {batchSwapOutput ? <BatchSwapOutputData batchSwapOutput={batchSwapOutput}/> : null}
      {noteOuput1 ? <NoteView note={noteOuput1}/> : null}
      {noteOuput2 ? <NoteView note={noteOuput2}/> : null}
      {metadata1 ? <Metadata metaData={metadata1} label="Asset 1"/> : null}
      {metadata2 ? <Metadata metaData={metadata2} label="Asset 2"/> : null}
    </FlexCol>
  );
};

const SwapView: FC<{ swapView: SwapViewT }> = ({ swapView }) => {
  // NOTE: everything but Swap itself and SwapPlaintext (for SwapView_Visible) are optional.
  //       While less than hygenic, it would theoretically be fine to just have all getters defined here
  //       and render purely on ternary checks. SwapPlaintext would be made optional but would only render
  //       if a SwapView_Visible, etc.
  const swap = getSwap(swapView);
  return (
    <FlexCol>
      <p>Swap View</p>
      <Swap swap={swap}/>
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
    <FlexCol>
      <p>Swap Claim View</p>
      <FlexCol>
        {swapClaimProof ? <ZKSwapProof _key={swapClaimProof.inner} name="SwapClaim Proof"/> : null}
        {swapClaimBody ? (
          <FlexCol>
            <p>SwapClaimBody</p>
            {bodyNullifier ? <Nullifier _key={bodyNullifier.inner} name="Nullifier"/> : null}
            {bodyFee ? <Fee fee={bodyFee}/> : null}
            {bodyOutput1Commitment ? <StateCommitment _key={bodyOutput1Commitment.inner} name="Output 1 Commitment"/> : null}
            {bodyOutput2Commitment ? <StateCommitment _key={bodyOutput2Commitment.inner} name="Output 2 Commitment"/> : null}
            {bodyOutputData ? <BatchSwapOutputData batchSwapOutput={bodyOutputData}/> : null}
          </FlexCol>
        ) : null}
        <FlexRow>
          <p>Epoch Duration</p>
          <pre>{swapEpochDuration.toString()}</pre>
        </FlexRow>
        {isVisible && swapClaimNoteOutput1 ? <NoteView note={swapClaimNoteOutput1}/> : null}
        {isVisible && swapClaimNoteOutput2 ? <NoteView note={swapClaimNoteOutput2}/> : null}
        {isVisible && swapClaimTxId ? <TransactionId _key={swapClaimTxId.inner} name="Swap Transaction ID"/> : null}
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
    <FlexCol>
      <p>Delegator Vote View</p>
      <FlexCol>
        {delegatorVoteBody ? (
          <FlexCol>
            <p>DelegatorVoteBody</p>
            {bodyProposal !== undefined ? (
              <FlexRow>
                <p>Proposal</p>
                <pre>{bodyProposal.toString()}</pre>
              </FlexRow>
            ) : null}
            {bodyStartPosition !== undefined ? (
              <FlexRow>
                <p>Proposal</p>
                <pre>{bodyStartPosition.toString()}</pre>
            </FlexRow>
            ) : null}
            {bodyVote ? <Vote vote={bodyVote}/> : null}
            {bodyValue ? <Value value={bodyValue} label="Delegation Note Value"/> : null}
            {bodyUnboundedAmount ? <Amount amount={bodyUnboundedAmount} label="Delegation Note Amount"/> : null}
            {bodyNullifier ? <Nullifier _key={bodyNullifier.inner} name="Input Note Nullifier"/> : null}
            {bodyRK ? <SpendVerificationKey _key={bodyRK.inner} name="Validating Key"/> : null}
          </FlexCol>
        ) : null}
        {delegatorVoteAuthSig ? <SpendAuthSignature _key={delegatorVoteAuthSig.inner} name="Auth Signature"/> : null}
        {delegatorVoteProof ? <ZKDelegatorVoteProof _key={delegatorVoteProof.inner} name="Delegator Vote Proof"/> : null}
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
    <FlexCol className="flex-overflow w-full">
      <p className="w-full">Validator Definition</p>
      {validatorIdKey ? <IdentityKey _key={validatorIdKey.ik} name="Identity Verification Key"/> : null}
      {validatorConsensusKey ? <ConsensusKey _key={validatorConsensusKey} name="Consensus PubKey"/> : null}
      <FlexRow className="flex-overflow w-full">
        <p className="w-full">Name</p>
        <p className="w-full">{validatorName}</p>
      </FlexRow>
      <FlexRow className="flex-overflow w-full">
        <p className="w-full">Website</p>
        <p className="w-full">{validatorWebsite}</p>
      </FlexRow>
      <FlexRow className="flex-overflow w-full">
        <p className="w-full">Description</p>
        <p className="w-full">{validatorDescription}</p>
      </FlexRow>
      <FlexRow className="flex-overflow w-full">
        <p className="w-full">Enabled?</p>
        <p className="w-full">{validatorEnabled}</p>
      </FlexRow>
      {validatorFundingStreams?.length !== undefined ? (
        <FlexCol className="flex-overflow w-full">
          <p>Funding Streams</p>
          {validatorFundingStreams.map((fundingStream, i) => <FundingStream fundingStream={fundingStream} key={i}/>)}
        </FlexCol>
      ) : null}
      {validatorSequenceNumber !== undefined  ? (
        <FlexRow className="flex-overflow w-full">
          <p className="w-full">Enabled?</p>
          <p className="w-full">{validatorSequenceNumber}</p>
        </FlexRow>
      ) : null}
      {validatorGovernanceKey ? <GovernanceKey _key={validatorGovernanceKey.gk} name="Governance Key"/> : null}
      {validatorAuthSig ? <AuthSignature _key={validatorAuthSig} name="Auth Signature"/> : null}
    </FlexCol>
  );
};

const IBCRelayAction: FC<{ ibcRelayAction: IbcRelay }> = ({ ibcRelayAction }) =>{
  const ibcValue = ibcRelayAction.rawAction?.value;
  const ibcTypeURL = ibcRelayAction.rawAction?.typeUrl;
  return (
    <FlexCol className="flex-overflow w-full">
      <p className="w-full">IBC Relay Raw Action</p>
      {ibcValue ? (
        <FlexCol className="flex-overflow w-full">
          <p className="w-full">Value</p>
          <pre className="w-full">{ibcValue}</pre>
        </FlexCol>
      ) : null}
      {ibcTypeURL?.length !== undefined ? (
        <FlexCol className="flex-overflow w-full">
          <p>Proto URL Resource</p>
          <pre className="w-full">{ibcTypeURL}</pre>
        </FlexCol>
      ) : null}
    </FlexCol>
  );
};

const ProposalSubmit: FC<{ proposalSubmit: ProposalSubmitT }> = ({ proposalSubmit }) => {
  const proposalSubmitAmount = getProposalSubmitDepositAmount(proposalSubmit);
  const proposalId = getProposalId(proposalSubmit);
  const proposalTitle = getProposalTitle(proposalSubmit);
  const proposalDescription = getProposalDescription(proposalSubmit);
  const proposalPayload = getProposalPayload(proposalSubmit);
  return (
    <FlexCol className="flex-wrap w-full">
      <p className="w-full">Proposal Submit</p>
      <FlexRow>
        <p>ID</p>
        <pre>{proposalId.toString()}</pre>
      </FlexRow>
      <FlexRow>
        <p>Title</p>
        <p>{proposalTitle}</p>
      </FlexRow>
      <FlexRow>
        <p>Description</p>
        <p>{proposalDescription}</p>
      </FlexRow>
      {proposalPayload ? <ProposalPayload payload={proposalPayload}/> : null}
      {proposalSubmitAmount ? <Amount amount={proposalSubmitAmount} label="Proposal Deposit Amount"/> : null}
    </FlexCol>
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
    <div className="flex flex-col flex-wrap w-full">
      {getActionView(action)}
    </div>
  );
};
