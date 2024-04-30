import type { FC } from "react";
import type { SwapView as SwapViewT, SwapClaimView as SwapClaimViewT, Swap as SwapT, TradingPair as TradingPairT, SwapPayload as SwapPayloadT, BatchSwapOutputData as BatchSwapOutputDataT, SwapPlaintext as SwapPlaintextT, SwapClaim as SwapClaimT} from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/component/dex/v1/dex_pb";
import type { Output as OutputT, NoteView as NoteViewT, Spend as SpendT, NotePayload as NotePayloadT } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/component/shielded_pool/v1/shielded_pool_pb";
import type { ActionView as ActionViewT } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/transaction/v1/transaction_pb";
import { type DelegatorVoteView, DelegatorVoteView_Opaque, type DelegatorVoteView_Visible } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/component/governance/v1/governance_pb";
import { getAddress, getAddressIndex } from "@penumbra-zone/getters/src/address-view";
import { getAsset1, getAsset2 } from "@penumbra-zone/getters/src/trading-pair";
import { getBatchSwapOutputDelta1Amount, getBatchSwapOutputDelta2Amount, getBatchSwapOutputTradingPair, getBatchSwapOutputLambda1Amount, getBatchSwapOutputLambda2Amount, getBatchSwapOutputUnfilled1Amount, getBatchSwapOutputUnfilled2Amount , getBatchSwapOutputData, getOutput, getOutputKey, getOutputNote, getSpend, getSpendNote, getSwap, getSwapBodyAmounts, getSwapBodyFeeCommitment, getSwapBodyPayload, getSwapMetadata1, getSwapMetadata2, getWalletId, getOutputValue1FromSwapView, getOutputValue2FromSwapView, getSwapTransactionId, getSwapPlaintext, getSwapNoteViewOutput1, getSwapNoteViewOutput2, getSwapPlaintextTradingPair, getSwapPlaintextDelta1, getSwapPlaintextDelta2, getSwapPlaintextFee, getSwapPlaintextAddress, getFeeAmount, getFeeAssetId, getSwapClaimViewZKProof, getSwapClaimViewBody, getSwapClaimViewEpochDuration, getSwapClaimBodyNullifier, getSwapClaimBodyFee, getSwapClaimBodyOutput1Commitment, getSwapClaimBodyOutput2Commitment, getSwapClaimBodyBatchOutputData, getSwapClaimNoteOutput1, getSwapClaimNoteOutput2, getSwapClaimTransactionId } from "@/lib/protobuf";
import { joinLoHiAmount } from "@penumbra-zone/types/src/amount";
import { getAssetId } from "@penumbra-zone/getters/src/metadata";
import { getAmount, getMetadata, getEquivalentValues, getExtendedMetadata, getAssetIdFromValueView } from "@penumbra-zone/getters/src/value-view";
import type { Address as AddressT, AddressIndex as AddressIndexT, WalletId as WalletIdT, PayloadKey as PayloadKeyT } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/keys/v1/keys_pb";
import type { AssetId as AssetIdT, EquivalentValue as EquivalentValueT, Metadata as MetadataT, ValueView as ValueViewT } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/asset/v1/asset_pb";
import { FlexCol, FlexRow } from "../ui/flex";
import type { Amount as AmountT } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/num/v1/num_pb";
import type { Fee as FeeT } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/component/fee/v1/fee_pb";

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

const GenericKV: FC<{ name: string, _key: Uint8Array }> = ({ name, _key }) => {
  return (
    <FlexRow>
      <p>{name}</p>
      <pre>{_key}</pre>
    </FlexRow>
  );
};

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
      {label ? <p>{label} Value</p> : <p>Value</p>}
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
            <BalanceCommitment _key={body.balanceCommitment.inner} name="Balance Commitment"/>
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
  const bodyOutput1Commitment = getSwapClaimBodyOutput1Commitment.optional()(swapClaimView)
  const bodyOutput2Commitment = getSwapClaimBodyOutput2Commitment.optional()(swapClaimView)
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
