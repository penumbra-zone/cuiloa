import { TxResult } from "@buf/cometbft_cometbft.bufbuild_es/cometbft/abci/v1/types_pb";
import { OutputView, OutputView_Opaque, SpendView, SpendView_Opaque } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/component/shielded_pool/v1/shielded_pool_pb";
import { type AddressView } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/keys/v1/keys_pb";
import { type Action, ActionView, Transaction } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/transaction/v1/transaction_pb";
import { createGetter } from "./getter/create-getter";
import { SwapView, SwapView_Opaque, SwapClaimView, SwapClaimView_Opaque, type BatchSwapOutputData, type SwapPlaintext, type Position, PositionState_PositionStateEnum, type TradingFunction, type PositionOpen, type PositionClose, type PositionWithdraw, type PositionRewardClaim } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/component/dex/v1/dex_pb";
import { type ChangedAppParameters, DelegatorVoteView, DelegatorVoteView_Opaque, type ProposalSubmit, type ValidatorVote, type ProposalDepositClaim, type CommunityPoolSpend, type CommunityPoolOutput, type CommunityPoolDeposit } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/component/governance/v1/governance_pb";
import type { Fee } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/component/fee/v1/fee_pb";
import { getAsset1, getAsset2 } from "@penumbra-zone/getters/trading-pair";
import type { Delegate, FundingStream, Undelegate, UndelegateClaim, ValidatorDefinition } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/component/stake/v1/stake_pb";
import { Ics20Withdrawal } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/component/ibc/v1/ibc_pb";
import type { ActionDutchAuctionEnd, ActionDutchAuctionSchedule, ActionDutchAuctionScheduleView, ActionDutchAuctionWithdrawView, DutchAuctionDescription } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/component/auction/v1/auction_pb";
import { Any, createRegistry } from "@bufbuild/protobuf";
import { MsgUpdateClient, MsgCreateClient } from "@buf/cosmos_ibc.bufbuild_es/ibc/core/client/v1/tx_pb";
import { Header, ClientState, ConsensusState } from "@buf/cosmos_ibc.bufbuild_es/ibc/lightclients/tendermint/v1/tendermint_pb";
import { MsgAcknowledgement, MsgChannelOpenAck, MsgChannelOpenInit, MsgRecvPacket } from "@buf/cosmos_ibc.bufbuild_es/ibc/core/channel/v1/tx_pb";
import { MsgConnectionOpenInit, MsgConnectionOpenAck } from "@buf/cosmos_ibc.bufbuild_es/ibc/core/connection/v1/tx_pb";

// Provides registry types for decoding the known google.protobuf.Any typeURLs in IbcRelay.raw_action
// TODO: figure out how to add this at the top level (just re-export the relevant schemas, maybe?) so that this doesn't need to be passed around.
export const ibcRegistry = createRegistry(
  MsgUpdateClient,
  MsgCreateClient,
  MsgRecvPacket,
  MsgAcknowledgement,
  MsgChannelOpenInit,
  MsgChannelOpenAck,
  MsgConnectionOpenInit,
  MsgConnectionOpenAck,
  // Types for tendermint light clients.
  // TODO: Do we want to add anymore before catching with Any?
  Header,
  ClientState,
  ConsensusState,
  // This should ultimately catch any other Any values without throwing an error.
  Any,
);

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
    // TODO: None of these actions have *View equivalents (and, transatively, Opaque/Decoded variants). Is exhausitively constructing an ActionView from them OK?
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

export const getSpendViewProof = createGetter((spendView?: SpendView) =>
  spendView?.spendView.value?.spend?.proof ? spendView.spendView.value.spend.proof : undefined,
);

export const getSpendViewAuthSig = createGetter((spendView?: SpendView) =>
  spendView?.spendView.value?.spend?.authSig ? spendView.spendView.value.spend.authSig :  undefined,
);

export const getSpendViewBodyNullifier = createGetter((spendView?: SpendView) =>
  spendView?.spendView.value?.spend?.body?.nullifier
  ? spendView.spendView.value.spend.body.nullifier
  : undefined,
);

export const getSpendViewBodySpendVerificationKey = createGetter((spendView?: SpendView) =>
  spendView?.spendView.value?.spend?.body?.rk
  ? spendView.spendView.value.spend.body.rk
  : undefined,
);

export const getSpendViewBodyBalanceCommitment = createGetter((spendView?: SpendView) =>
  spendView?.spendView.value?.spend?.body?.balanceCommitment
  ? spendView.spendView.value.spend.body.balanceCommitment
  : undefined,
);

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

export const getOutput = createGetter((outputView?: OutputView) =>
  outputView?.outputView.value?.output ? outputView.outputView.value.output : undefined,
);

export const getOutputViewNote = createGetter((outputView?: OutputView) =>
  outputView?.outputView.case === "visible" ? outputView.outputView.value.note : undefined,
);

export const getOutputViewKey = createGetter((outputView?: OutputView) =>
  outputView?.outputView.case === "visible" ? outputView.outputView.value.payloadKey : undefined,
);

export const getOutputViewProof = createGetter((outputView?: OutputView) =>
  outputView?.outputView.value?.output?.proof ? outputView.outputView.value.output.proof : undefined,
);

export const getOutputViewBodyNotePayload = createGetter((outputView?: OutputView) =>
  outputView?.outputView.value?.output?.body?.notePayload
  ? outputView.outputView.value.output.body.notePayload
  : undefined,
);

export const getOutputViewBodyBalanceCommitment= createGetter((outputView?: OutputView) =>
  outputView?.outputView.value?.output?.body?.balanceCommitment
  ? outputView.outputView.value.output.body.balanceCommitment
  : undefined,
);

export const getOutputViewBodyWrappedMemoKey = createGetter((outputView?: OutputView) =>
  outputView?.outputView.value?.output?.body
  ? outputView.outputView.value.output.body.wrappedMemoKey
  : undefined,
);

export const getOutputViewBodyOvkWrappedKey = createGetter((outputView?: OutputView) =>
  outputView?.outputView.value?.output?.body
  ? outputView.outputView.value.output.body.ovkWrappedKey
  : undefined,
);

export const getSwap = createGetter((swapView?: SwapView) =>
  swapView?.swapView.value?.swap ? swapView.swapView.value.swap : undefined,
);

export const getSwapViewProof = createGetter((swapView?: SwapView) =>
  swapView?.swapView.value?.swap?.proof ? swapView.swapView.value.swap.proof : undefined,
);

export const getSwapMetadata1 = createGetter((swapView?: SwapView) =>
  swapView?.swapView.case === "visible" || swapView?.swapView.case === "opaque"
  ? swapView.swapView.value.asset1Metadata
  : undefined,
);

export const getSwapMetadata2 = createGetter((swapView?: SwapView) =>
  swapView?.swapView.case === "visible" || swapView?.swapView.case === "opaque"
  ? swapView.swapView.value.asset2Metadata
  : undefined,
);

export const getSwapViewBodyAmounts = createGetter((swapView?: SwapView) =>
  swapView?.swapView.value?.swap?.body?.delta1I && swapView.swapView.value.swap.body.delta2I
  ? { delta1I: swapView.swapView.value.swap.body.delta1I, delta2I: swapView.swapView.value.swap.body.delta2I }
  : undefined,
);

export const getSwapViewBodyPayload = createGetter((swapView?: SwapView) =>
  swapView?.swapView.value?.swap?.body?.payload ? swapView.swapView.value.swap.body.payload : undefined,
);

export const getSwapViewBodyFeeCommitment = createGetter((swapView?: SwapView) =>
  swapView?.swapView.value?.swap?.body?.feeCommitment ? swapView.swapView.value.swap.body.feeCommitment : undefined,
);

export const getSwapViewBodyTradingPair = createGetter((swapView?: SwapView) =>
  swapView?.swapView.value?.swap?.body?.tradingPair ? swapView.swapView.value.swap.body.tradingPair : undefined,
);

export const getBatchSwapOutputData = createGetter((swapView?: SwapView) =>
  swapView?.swapView.case === "visible" || swapView?.swapView.case === "opaque"
  ? swapView.swapView.value.batchSwapOutputData
  : undefined,
);

export const getOutputValue1FromSwapView = createGetter((swapView?: SwapView) =>
  swapView?.swapView.case === "opaque" ? swapView.swapView.value.output1Value : undefined,
);

export const getOutputValue2FromSwapView = createGetter((swapView?: SwapView) =>
  swapView?.swapView.case === "opaque" ? swapView.swapView.value.output2Value : undefined,
);

// SwapView_Visible getters
export const getSwapPlaintext = createGetter((swapView?: SwapView) =>
  swapView?.swapView.case === "visible" ? swapView.swapView.value.swapPlaintext : undefined,
);

export const getSwapTransactionId = createGetter((swapView?: SwapView) =>
  swapView?.swapView.case === "visible" ? swapView.swapView.value.claimTx : undefined,
);

export const getSwapNoteViewOutput1 = createGetter((swapView?: SwapView) =>
  swapView?.swapView.case === "visible" ? swapView.swapView.value.output1 : undefined,
);

export const getSwapNoteViewOutput2 = createGetter((swapView?: SwapView) =>
  swapView?.swapView.case === "visible" ? swapView.swapView.value.output2 : undefined,
);

// all BatchSwapOutputData getters
export const getBatchSwapOutputTradingPair = createGetter((b?: BatchSwapOutputData) => b?.tradingPair);

export const getBatchSwapOutputAsset1 = getBatchSwapOutputTradingPair.pipe(getAsset1);

export const getBatchSwapOutputAsset2 = getBatchSwapOutputTradingPair.pipe(getAsset2);

export const getBatchSwapOutputDelta1Amount = createGetter((b?: BatchSwapOutputData) => b?.delta1);

export const getBatchSwapOutputDelta2Amount = createGetter((b?: BatchSwapOutputData) => b?.delta2);

export const getBatchSwapOutputLambda1Amount = createGetter((b?: BatchSwapOutputData) => b?.lambda1);

export const getBatchSwapOutputLambda2Amount = createGetter((b?: BatchSwapOutputData) => b?.lambda2);

export const getBatchSwapOutputUnfilled1Amount = createGetter((b?: BatchSwapOutputData) => b?.unfilled1);

export const getBatchSwapOutputUnfilled2Amount = createGetter((b?: BatchSwapOutputData) => b?.unfilled2);

export const getSwapPlaintextTradingPair = createGetter((swapPlaintext?: SwapPlaintext) =>
  swapPlaintext?.tradingPair ? swapPlaintext.tradingPair : undefined,
);

export const getSwapPlainTextAsset1 = getSwapPlaintextTradingPair.pipe(getAsset1);

export const getSwapPlainTextAsset2 = getSwapPlaintextTradingPair.pipe(getAsset2);

export const getSwapPlaintextDelta1 = createGetter((swapPlaintext?: SwapPlaintext) =>
  swapPlaintext?.delta1I ? swapPlaintext.delta1I : undefined,
);

export const getSwapPlaintextDelta2 = createGetter((swapPlaintext?: SwapPlaintext) =>
  swapPlaintext?.delta2I ? swapPlaintext.delta2I : undefined,
);

export const getSwapPlaintextFee = createGetter((swapPlaintext?: SwapPlaintext) =>
  swapPlaintext?.claimFee ? swapPlaintext.claimFee : undefined,
);

export const getSwapPlaintextAddress = createGetter((swapPlaintext?: SwapPlaintext) =>
  swapPlaintext?.claimAddress ? swapPlaintext.claimAddress : undefined,
);

export const getFeeAmount = createGetter((fee?: Fee) => fee?.amount ? fee.amount : undefined);

export const getFeeAssetId = createGetter((fee?: Fee) => fee?.assetId ? fee.assetId : undefined);


// SwapClaimView getters
export const getSwapClaimViewBody = createGetter((swapClaimView?: SwapClaimView) =>
  swapClaimView?.swapClaimView.value?.swapClaim?.body
  ? swapClaimView.swapClaimView.value.swapClaim?.body
  : undefined,
);

export const getSwapClaimViewZKProof = createGetter((swapClaimView?: SwapClaimView) =>
  swapClaimView?.swapClaimView.value?.swapClaim?.proof
  ? swapClaimView.swapClaimView.value.swapClaim.proof
  : undefined,
);

export const getSwapClaimViewEpochDuration = createGetter((swapClaimView?: SwapClaimView) =>
  swapClaimView?.swapClaimView.value?.swapClaim
  ? swapClaimView.swapClaimView.value.swapClaim.epochDuration
  : undefined,
);

export const getSwapClaimBodyNullifier = createGetter((swapClaimView?: SwapClaimView) =>
  swapClaimView?.swapClaimView.value?.swapClaim?.body?.nullifier
  ? swapClaimView?.swapClaimView.value?.swapClaim?.body?.nullifier
  : undefined,
);

export const getSwapClaimBodyFee = createGetter((swapClaimView?: SwapClaimView) =>
  swapClaimView?.swapClaimView.value?.swapClaim?.body?.fee
  ? swapClaimView?.swapClaimView.value?.swapClaim?.body?.fee
  : undefined,
);

export const getSwapClaimBodyOutput1Commitment = createGetter((swapClaimView?: SwapClaimView) =>
  swapClaimView?.swapClaimView.value?.swapClaim?.body?.output1Commitment
  ? swapClaimView?.swapClaimView.value?.swapClaim?.body?.output1Commitment
  : undefined,
);

export const getSwapClaimBodyOutput2Commitment = createGetter((swapClaimView?: SwapClaimView) =>
  swapClaimView?.swapClaimView.value?.swapClaim?.body?.output2Commitment
  ? swapClaimView?.swapClaimView.value?.swapClaim?.body?.output2Commitment
  : undefined,
);

export const getSwapClaimBodyBatchOutputData = createGetter((swapClaimView?: SwapClaimView) =>
  swapClaimView?.swapClaimView.value?.swapClaim?.body?.outputData
  ? swapClaimView?.swapClaimView.value?.swapClaim?.body?.outputData
  : undefined,
);

export const getSwapClaimNoteOutput1 = createGetter((swapClaimView?: SwapClaimView) =>
  swapClaimView?.swapClaimView.case === "visible"
  ? swapClaimView.swapClaimView.value.output1
  : undefined,
);

export const getSwapClaimNoteOutput2 = createGetter((swapClaimView?: SwapClaimView) =>
  swapClaimView?.swapClaimView.case === "visible"
  ? swapClaimView.swapClaimView.value.output2
  : undefined,
);

export const getSwapClaimTransactionId = createGetter((swapClaimView?: SwapClaimView) =>
  swapClaimView?.swapClaimView.case === "visible"
  ? swapClaimView.swapClaimView.value.swapTx
  : undefined,
);

// DelegatorVoteView getters
export const getDelegatorVoteViewBody = createGetter((delegatorVoteView?: DelegatorVoteView) =>
  delegatorVoteView?.delegatorVote.value?.delegatorVote?.body
  ? delegatorVoteView.delegatorVote.value.delegatorVote.body
  : undefined,
);

export const getDelegatorVoteViewAuthSig = createGetter((delegatorVoteView?: DelegatorVoteView) =>
  delegatorVoteView?.delegatorVote.value?.delegatorVote?.authSig
  ? delegatorVoteView.delegatorVote.value.delegatorVote.authSig
  : undefined,
);

export const getDelegatorVoteViewProof = createGetter((delegatorVoteView?: DelegatorVoteView) =>
  delegatorVoteView?.delegatorVote.value?.delegatorVote?.proof
  ? delegatorVoteView.delegatorVote.value.delegatorVote.proof
  : undefined,
);

export const getDelegatorVoteBodyProposal = createGetter((delegatorVoteView?: DelegatorVoteView) =>
  delegatorVoteView?.delegatorVote.value?.delegatorVote?.body
  ? delegatorVoteView.delegatorVote.value.delegatorVote.body.proposal
  : undefined,
);

export const getDelegatorVoteBodyStartPosition = createGetter((delegatorVoteView?: DelegatorVoteView) =>
  delegatorVoteView?.delegatorVote.value?.delegatorVote?.body
  ? delegatorVoteView.delegatorVote.value.delegatorVote.body.startPosition
  : undefined,
);

export const getDelegatorVoteBodyVote = createGetter((delegatorVoteView?: DelegatorVoteView) =>
  delegatorVoteView?.delegatorVote.value?.delegatorVote?.body?.vote
  ? delegatorVoteView.delegatorVote.value.delegatorVote.body.vote
  : undefined,
);

export const getDelegatorVoteBodyValue = createGetter((delegatorVoteView?: DelegatorVoteView) =>
  delegatorVoteView?.delegatorVote.value?.delegatorVote?.body?.value
  ? delegatorVoteView.delegatorVote.value.delegatorVote.body.value
  : undefined,
);

export const getDelegatorVoteBodyUnbondedAmount = createGetter((delegatorVoteView?: DelegatorVoteView) =>
  delegatorVoteView?.delegatorVote.value?.delegatorVote?.body?.unbondedAmount
  ? delegatorVoteView.delegatorVote.value.delegatorVote.body.unbondedAmount
  : undefined,
);

export const getDelegatorVoteBodyNullifier = createGetter((delegatorVoteView?: DelegatorVoteView) =>
  delegatorVoteView?.delegatorVote.value?.delegatorVote?.body?.nullifier
  ? delegatorVoteView.delegatorVote.value.delegatorVote.body.nullifier
  : undefined,
);

export const getDelegatorVoteBodyRK = createGetter((delegatorVoteView?: DelegatorVoteView) =>
  delegatorVoteView?.delegatorVote.value?.delegatorVote?.body?.rk
  ? delegatorVoteView.delegatorVote.value.delegatorVote.body.rk
  : undefined,
);

// DelegatorVoteView_Visible getter
export const getDelegatorVoteViewNote = createGetter((delegatorVoteView?: DelegatorVoteView) =>
  delegatorVoteView?.delegatorVote.case === "visible"
  ? delegatorVoteView.delegatorVote.value.note
  : undefined,
);

// ValidatorDefinition getters
export const getValidatorAuthSig = createGetter((validatorDefinition?: ValidatorDefinition) =>
  validatorDefinition?.authSig ? validatorDefinition.authSig: undefined,
);

export const getValidatorIdentityKey = createGetter((validatorDefinition?: ValidatorDefinition) =>
  validatorDefinition?.validator?.identityKey
  ? validatorDefinition.validator.identityKey
  : undefined,
);

export const getValidatorConsensusKey = createGetter((validatorDefinition?: ValidatorDefinition) =>
  validatorDefinition?.validator?.consensusKey
  ? validatorDefinition.validator.consensusKey
  : undefined,
);

export const getValidatorName = createGetter((validatorDefinition?: ValidatorDefinition) =>
  validatorDefinition?.validator
  ? validatorDefinition.validator.name
  : undefined,
);

export const getValidatorWebsite = createGetter((validatorDefinition?: ValidatorDefinition) =>
  validatorDefinition?.validator
  ? validatorDefinition.validator.website
  : undefined,
);

export const getValidatorDescription = createGetter((validatorDefinition?: ValidatorDefinition) =>
  validatorDefinition?.validator
  ? validatorDefinition.validator.description
  : undefined,
);

export const getValidatorEnabled = createGetter((validatorDefinition?: ValidatorDefinition) =>
  validatorDefinition?.validator
  ? validatorDefinition.validator.enabled
  : undefined,
);

// NOTE: protobuf defines FundingStream as non-optional but is still possibly undefined. Is that because it's repeated?
export const getValidatorFundingStream = createGetter((validatorDefinition?: ValidatorDefinition) =>
  validatorDefinition?.validator?.fundingStreams
  ? validatorDefinition.validator.fundingStreams
  : undefined,
);

export const getValidatorSequenceNumber = createGetter((validatorDefinition?: ValidatorDefinition) =>
  validatorDefinition?.validator
  ? validatorDefinition.validator.sequenceNumber
  : undefined,
);

export const getValidatorGovernanceKey = createGetter((validatorDefinition?: ValidatorDefinition) =>
  validatorDefinition?.validator?.governanceKey
  ? validatorDefinition.validator.governanceKey
  : undefined,
);

// FundingStream getters
export const getFundingStreamToAddress = createGetter((fundingStream?: FundingStream) =>
  fundingStream?.recipient.case === "toAddress" ? fundingStream.recipient.value.address : undefined,
);

export const getFundingStreamRateBps = createGetter((fundingStream?: FundingStream) =>
  fundingStream?.recipient.value ? fundingStream.recipient.value.rateBps : undefined,
);

// ProposalSubmit getters
export const getProposalSubmitDepositAmount = createGetter((proposalSubmit?: ProposalSubmit) =>
  proposalSubmit?.depositAmount ? proposalSubmit.depositAmount : undefined,
);

export const getProposalId = createGetter((proposalSubmit?: ProposalSubmit) =>
  proposalSubmit?.proposal ? proposalSubmit.proposal.id : undefined,
);

export const getProposalTitle = createGetter((proposalSubmit?: ProposalSubmit) =>
  proposalSubmit?.proposal ? proposalSubmit.proposal.title : undefined,
);

export const getProposalDescription = createGetter((proposalSubmit?: ProposalSubmit) =>
  proposalSubmit?.proposal ? proposalSubmit.proposal.description : undefined,
);

export const getProposalPayload = createGetter((proposalSubmit?: ProposalSubmit) =>
  proposalSubmit?.proposal?.payload ? proposalSubmit.proposal.payload : undefined,
);

// ChangeAppParameters getters
export const getChangeAppSctParameter = createGetter((changeAppParameter?: ChangedAppParameters) =>
  changeAppParameter?.sctParams ? changeAppParameter.sctParams : undefined,
);

export const getChangeAppCommunityPoolParameter = createGetter((changeAppParameter?: ChangedAppParameters) =>
  changeAppParameter?.communityPoolParams ? changeAppParameter.communityPoolParams : undefined,
);

export const getChangeAppGovernanceParameter = createGetter((changeAppParameter?: ChangedAppParameters) =>
  changeAppParameter?.governanceParams ? changeAppParameter.governanceParams : undefined,
);

export const getChangeAppIbcParameters = createGetter((changeAppParameter?: ChangedAppParameters) =>
  changeAppParameter?.ibcParams ? changeAppParameter.ibcParams : undefined,
);

export const getChangeAppStakeParameters = createGetter((changeAppParameter?: ChangedAppParameters) =>
  changeAppParameter?.stakeParams ? changeAppParameter.stakeParams : undefined,
);

export const getChangeAppFeeParameters = createGetter((changeAppParameter?: ChangedAppParameters) =>
  changeAppParameter?.feeParams ? changeAppParameter.feeParams : undefined,
);

export const getChangeAppDistributionParameters = createGetter((changeAppParameter?: ChangedAppParameters) =>
  changeAppParameter?.distributionsParams ? changeAppParameter.distributionsParams : undefined,
);

export const getChangeAppFundingParameters = createGetter((changeAppParameter?: ChangedAppParameters) =>
  changeAppParameter?.fundingParams ? changeAppParameter.fundingParams : undefined,
);

export const getChangeAppShieldedParameters = createGetter((changeAppParameter?: ChangedAppParameters) =>
  changeAppParameter?.shieldedPoolParams ? changeAppParameter.shieldedPoolParams : undefined,
);

export const getChangeAppDexParameters = createGetter((changeAppParameter?: ChangedAppParameters) =>
  changeAppParameter?.dexParams ? changeAppParameter.dexParams : undefined,
);

export const getChangeAppAuctionParameters = createGetter((changeAppParameter?: ChangedAppParameters) =>
  changeAppParameter?.auctionParams ? changeAppParameter.auctionParams : undefined,
);

export const getValidatorVoteBody = createGetter((validatorVote?: ValidatorVote) =>
  validatorVote?.body ? validatorVote.body : undefined,
);

export const getValidatorVoteAuthSig = createGetter((validatorVote?: ValidatorVote) =>
  validatorVote?.authSig ? validatorVote.authSig : undefined,
);

export const getValidatorVoteBodyProposal = createGetter((validatorVote?: ValidatorVote) =>
  validatorVote?.body ? validatorVote.body.proposal : undefined,
);

export const getValidatorVoteBodyVote = createGetter((validatorVote?: ValidatorVote) =>
  validatorVote?.body?.vote ? validatorVote.body.vote : undefined,
);

export const getValidatorVoteBodyIdentityKey = createGetter((validatorVote?: ValidatorVote) =>
  validatorVote?.body?.identityKey ? validatorVote.body.identityKey : undefined,
);

export const getValidatorVoteBodyGovernanceKey = createGetter((validatorVote?: ValidatorVote) =>
  validatorVote?.body?.governanceKey ? validatorVote.body.governanceKey : undefined,
);

export const getValidatorVoteBodyReason = createGetter((validatorVote?: ValidatorVote) =>
  validatorVote?.body?.reason ? validatorVote.body.reason : undefined,
);

export const getProposalDepositClaimAmount = createGetter((proposalDepositClaim?: ProposalDepositClaim) =>
  proposalDepositClaim?.depositAmount ? proposalDepositClaim.depositAmount : undefined,
);

export const getProposalDepositClaimOutcome = createGetter((proposalDepositClaim?: ProposalDepositClaim) =>
  proposalDepositClaim?.outcome?.outcome ? proposalDepositClaim.outcome.outcome : undefined,
);

export const getProposalDepositClaimOutcomeReason = createGetter((proposalDepositClaim?: ProposalDepositClaim) =>
  proposalDepositClaim?.outcome?.outcome.case === "failed" || proposalDepositClaim?.outcome?.outcome.case === "slashed"
  && proposalDepositClaim.outcome.outcome.value.withdrawn
  ? proposalDepositClaim.outcome.outcome.value.withdrawn?.reason
  : undefined,
);

export const getPositionTradingFunction = createGetter((position?: Position) =>
  position?.phi ? position.phi : undefined,
);

export const getTradingFunctionFee = createGetter((tradingFunction?: TradingFunction) =>
  tradingFunction?.component ? tradingFunction.component.fee : undefined,
);

export const getTradingFunctionPair = createGetter((tradingFunction?: TradingFunction) =>
  tradingFunction?.pair ? tradingFunction.pair : undefined,
);

export const getTradingFunctionAmountP = createGetter((tradingFunction?: TradingFunction) =>
  tradingFunction?.component?.p ? tradingFunction.component.p : undefined,
);

export const getTradingFunctionAmountQ = createGetter((tradingFunction?: TradingFunction) =>
  tradingFunction?.component?.q ? tradingFunction.component.q : undefined,
);

export const getPositionNonce = createGetter((position?: Position) => position?.nonce ? position.nonce : undefined);

export const getPositionState = createGetter((position?: Position) => position?.state ? position.state : undefined);

export const getPositionStateSequence = createGetter((position?: Position) =>
  position?.state && position.state.state === PositionState_PositionStateEnum.WITHDRAWN
  ? position.state.sequence
  : undefined,
);

export const getPositionReservesAmount1 = createGetter((position?: Position) =>
  position?.reserves?.r1 ? position.reserves.r1 : undefined,
);

export const getPositionReservesAmount2 = createGetter((position?: Position) =>
  position?.reserves?.r2 ? position.reserves.r2 : undefined,
);

export const getPositionCloseOnFill = createGetter((position?: Position) => position ? position.closeOnFill : undefined);

export const getPositionOpen = createGetter((positionOpen?: PositionOpen) =>
  positionOpen?.position ? positionOpen.position : undefined,
);

export const getPositionClosePositionId = createGetter((positionClose?: PositionClose) =>
  positionClose?.positionId ? positionClose.positionId : undefined,
);

export const getPositionWithdrawPositionId = createGetter((positionWithdraw?: PositionWithdraw) =>
  positionWithdraw?.positionId ? positionWithdraw.positionId : undefined,
);

export const getPositionWithdrawBalanceCommitment = createGetter((positionWithdraw?: PositionWithdraw) =>
  positionWithdraw?.reservesCommitment ? positionWithdraw.reservesCommitment : undefined,
);

export const getPositionWithdrawSequence = createGetter((positionWithdraw?: PositionWithdraw) =>
  positionWithdraw ? positionWithdraw.sequence : undefined,
);

// PositionRewardClaim
// NOTE: DEPRECATED
export const getPositionRewardClaimPositionId = createGetter((positionRewardClaim?: PositionRewardClaim) =>
  positionRewardClaim?.positionId ? positionRewardClaim.positionId : undefined,
);

export const getPositionRewardClaimBalanceCommitment = createGetter((positionRewardClaim?: PositionRewardClaim) =>
  positionRewardClaim?.rewardsCommitment ? positionRewardClaim.rewardsCommitment : undefined,
);

export const getCommunityPoolSpendValue = createGetter((communityPoolSpend?: CommunityPoolSpend) =>
  communityPoolSpend?.value ? communityPoolSpend.value : undefined,
);

export const getCommunityPoolOutputValue = createGetter((communityPoolOutput?: CommunityPoolOutput) =>
  communityPoolOutput?.value ? communityPoolOutput.value : undefined,
);

export const getCommunityPoolOutputAddress = createGetter((communityPoolOutput?: CommunityPoolOutput) =>
  communityPoolOutput?.address ? communityPoolOutput.address : undefined,
);

export const getCommunityPoolDepositValue = createGetter((communityPoolDeposit?: CommunityPoolDeposit) =>
  communityPoolDeposit?.value ? communityPoolDeposit.value : undefined,
);

export const getUndelegateClaimIdentityKey = createGetter((undelegateClaim?: UndelegateClaim) =>
  undelegateClaim?.body?.validatorIdentity ? undelegateClaim.body.validatorIdentity : undefined,
);

// NOTE: DEPRECATED
export const getUndelegateClaimStartEpochIndex = createGetter((undelegateClaim?: UndelegateClaim) =>
  undelegateClaim?.body ? undelegateClaim.body.startEpochIndex : undefined,
);

export const getUndelegateClaimPenalty = createGetter((undelegateClaim?: UndelegateClaim) =>
  undelegateClaim?.body?.penalty ? undelegateClaim.body.penalty : undefined,
);

export const getUndelegateClaimBalanceCommitment = createGetter((undelegateClaim?: UndelegateClaim) =>
  undelegateClaim?.body?.balanceCommitment ? undelegateClaim.body.balanceCommitment : undefined,
);

export const getUndelegateClaimUnbondingStartHeight = createGetter((undelegateClaim?: UndelegateClaim) =>
  undelegateClaim?.body ? undelegateClaim.body.unbondingStartHeight : undefined,
);

export const getUndelegateClaimProof = createGetter((undelegateClaim?: UndelegateClaim) =>
  undelegateClaim ? undelegateClaim.proof : undefined,
);

export const getIcs20WithdrawalAmount = createGetter((ics20Withdrawal?: Ics20Withdrawal) =>
  ics20Withdrawal?.amount ? ics20Withdrawal.amount : undefined,
);

export const getIcs20WithdrawalDenom = createGetter((ics20Withdrawal?: Ics20Withdrawal) =>
  ics20Withdrawal?.denom ? ics20Withdrawal.denom.denom : undefined,
);

export const getIcs20WithdrawalDestinationAddress = createGetter((ics20Withdrawal?: Ics20Withdrawal) =>
  ics20Withdrawal ? ics20Withdrawal.destinationChainAddress : undefined,
);

export const getIcs20WithdrawalReturnAddress = createGetter((ics20Withdrawal?: Ics20Withdrawal) =>
  ics20Withdrawal?.returnAddress ? ics20Withdrawal.returnAddress : undefined,
);

export const getIcs20WithdrawalTimeoutHeight = createGetter((ics20Withdrawal?: Ics20Withdrawal) =>
  ics20Withdrawal?.timeoutHeight ? ics20Withdrawal.timeoutHeight : undefined,
);

export const getIcs20WithdrawalTimeoutTime = createGetter((ics20Withdrawal?: Ics20Withdrawal) =>
  ics20Withdrawal ? ics20Withdrawal.timeoutTime : undefined,
);

export const getIcs20WithdrawalSourceChannel = createGetter((ics20Withdrawal?: Ics20Withdrawal) =>
  ics20Withdrawal ? ics20Withdrawal.sourceChannel : undefined,
);

export const getDelegateIdentityKey = createGetter((delegate?: Delegate) =>
  delegate?.validatorIdentity ? delegate.validatorIdentity : undefined,
);

export const getDelegateEpochIndex = createGetter((delegate?: Delegate) =>
  delegate ? delegate.epochIndex : undefined,
);

export const getDelegateUnbondedAmount = createGetter((delegate?: Delegate) =>
  delegate?.unbondedAmount ? delegate.unbondedAmount : undefined,
);

export const getDelegateDelegationAmount = createGetter((delegate?: Delegate) =>
  delegate?.delegationAmount ? delegate.delegationAmount : undefined,
);

export const getUndelegateIdentityKey = createGetter((undelegate?: Undelegate) =>
  undelegate?.validatorIdentity ? undelegate.validatorIdentity : undefined,
);

export const getUndelegateStartEpochIndex = createGetter((undelegate?: Undelegate) =>
  undelegate ? undelegate.startEpochIndex: undefined,
);

export const getUndelegateUnbondedAmount = createGetter((undelegate?: Undelegate) =>
  undelegate?.unbondedAmount ? undelegate.unbondedAmount : undefined,
);

export const getUndelegateDelegationAmount = createGetter((undelegate?: Undelegate) =>
  undelegate?.delegationAmount ? undelegate.delegationAmount : undefined,
);

export const getUndelegateFromEpoch = createGetter((undelegate?: Undelegate) =>
  undelegate?.fromEpoch ? undelegate.fromEpoch : undefined,
);

export const getActionDutchAuctionScheduleViewAction = createGetter((actionDutchAuctionScheduleView?: ActionDutchAuctionScheduleView) =>
  actionDutchAuctionScheduleView?.action ? actionDutchAuctionScheduleView.action : undefined,
);

export const getActionDutchAuctionScheduleViewAuctionId = createGetter((actionDutchAuctionScheduleView?: ActionDutchAuctionScheduleView) =>
  actionDutchAuctionScheduleView?.auctionId ? actionDutchAuctionScheduleView.auctionId : undefined,
);

export const getActionDutchAuctionScheduleViewInputMetadata = createGetter((actionDutchAuctionScheduleView?: ActionDutchAuctionScheduleView) =>
  actionDutchAuctionScheduleView?.inputMetadata ? actionDutchAuctionScheduleView.inputMetadata : undefined,
);

export const getActionDutchAuctionScheduleViewOutputMetadata = createGetter((actionDutchAuctionScheduleView?: ActionDutchAuctionScheduleView) =>
  actionDutchAuctionScheduleView?.outputMetadata ? actionDutchAuctionScheduleView.outputMetadata : undefined,
);

export const getActionDutchAuctionScheduleDescription = createGetter((actionDutchAuctionSchedule?: ActionDutchAuctionSchedule) =>
  actionDutchAuctionSchedule?.description ? actionDutchAuctionSchedule.description : undefined,
);

export const getDutchAuctionDescriptionInput = createGetter((dutchAuctionDescription?: DutchAuctionDescription) =>
  dutchAuctionDescription?.input ? dutchAuctionDescription.input : undefined,
);

export const getDutchAuctionDescriptionOutputId = createGetter((dutchAuctionDescription?: DutchAuctionDescription) =>
  dutchAuctionDescription?.outputId ? dutchAuctionDescription.outputId : undefined,
);

export const getDutchAuctionDescriptionMaxOutput = createGetter((dutchAuctionDescription?: DutchAuctionDescription) =>
  dutchAuctionDescription?.maxOutput ? dutchAuctionDescription.maxOutput : undefined,
);

export const getDutchAuctionDescriptionMinOutput = createGetter((dutchAuctionDescription?: DutchAuctionDescription) =>
  dutchAuctionDescription?.minOutput ? dutchAuctionDescription.minOutput : undefined,
);

export const getDutchAuctionDescriptionStartHeight = createGetter((dutchAuctionDescription?: DutchAuctionDescription) =>
  dutchAuctionDescription ? dutchAuctionDescription.startHeight : undefined,
);

export const getDutchAuctionDescriptionEndHeight = createGetter((dutchAuctionDescription?: DutchAuctionDescription) =>
  dutchAuctionDescription ? dutchAuctionDescription.endHeight : undefined,
);

export const getDutchAuctionDescriptionStepCount = createGetter((dutchAuctionDescription?: DutchAuctionDescription) =>
  dutchAuctionDescription ? dutchAuctionDescription.stepCount : undefined,
);

export const getDutchAuctionDescriptionNonce = createGetter((dutchAuctionDescription?: DutchAuctionDescription) =>
  dutchAuctionDescription ? dutchAuctionDescription.nonce : undefined,
);

export const getInputFromActionDutchAuctionScheduleView = getActionDutchAuctionScheduleViewAction
  .pipe(getActionDutchAuctionScheduleDescription
    .pipe(getDutchAuctionDescriptionInput));

export const getOutputIdFromActionDutchAuctionScheduleView = getActionDutchAuctionScheduleViewAction
  .pipe(getActionDutchAuctionScheduleDescription
    .pipe(getDutchAuctionDescriptionOutputId));

export const getMaxOutputFromActionDutchAuctionScheduleView = getActionDutchAuctionScheduleViewAction
  .pipe(getActionDutchAuctionScheduleDescription
    .pipe(getDutchAuctionDescriptionMaxOutput));

export const getMinOutputFromActionDutchAuctionScheduleView = getActionDutchAuctionScheduleViewAction
  .pipe(getActionDutchAuctionScheduleDescription
    .pipe(getDutchAuctionDescriptionMinOutput));

export const getStartHeightFromActionDutchAuctionScheduleView = getActionDutchAuctionScheduleViewAction
  .pipe(getActionDutchAuctionScheduleDescription
    .pipe(getDutchAuctionDescriptionStartHeight));

export const getEndHeightFromActionDutchAuctionScheduleView = getActionDutchAuctionScheduleViewAction
  .pipe(getActionDutchAuctionScheduleDescription
    .pipe(getDutchAuctionDescriptionEndHeight));

export const getStepCountFromActionDutchAuctionScheduleView = getActionDutchAuctionScheduleViewAction
  .pipe(getActionDutchAuctionScheduleDescription
    .pipe(getDutchAuctionDescriptionStepCount));

export const getNonceFromActionDutchAuctionScheduleView = getActionDutchAuctionScheduleViewAction
  .pipe(getActionDutchAuctionScheduleDescription
    .pipe(getDutchAuctionDescriptionNonce));

export const getAuctionIdFromActionDutchAuctionEnd = createGetter((actionDutchAuctionEnd?: ActionDutchAuctionEnd) =>
  actionDutchAuctionEnd?.auctionId ? actionDutchAuctionEnd.auctionId : undefined,
);

export const getReservesFromActionDutchAuctionWithdrawView = createGetter((actionDutchAuctionWithdrawView?: ActionDutchAuctionWithdrawView) =>
  actionDutchAuctionWithdrawView?.reserves ? actionDutchAuctionWithdrawView.reserves : undefined,
);

export const getAuctionIdFromActionDutchAuctionWithdrawView = createGetter((actionDutchAuctionWithdrawView?: ActionDutchAuctionWithdrawView) =>
  actionDutchAuctionWithdrawView?.action?.reservesCommitment ? actionDutchAuctionWithdrawView.action.reservesCommitment : undefined,
);

export const getSeqFromActionDutchAuctionWithdrawView = createGetter((actionDutchAuctionWithdrawView?: ActionDutchAuctionWithdrawView) =>
  actionDutchAuctionWithdrawView?.action ? actionDutchAuctionWithdrawView.action.seq : undefined,
);

export const getReservesCommitmentFromActionDutchAuctionWithdrawView = createGetter((actionDutchAuctionWithdrawView?: ActionDutchAuctionWithdrawView) =>
  actionDutchAuctionWithdrawView?.action?.reservesCommitment ? actionDutchAuctionWithdrawView.action.reservesCommitment : undefined,
);

export const transactionFromBytes = (txBytes : Buffer) => {
  const txResult = TxResult.fromBinary(txBytes);
  const tx = Transaction.fromBinary(txResult.tx);
  return tx;
};

// NOTE: As of now, cannot completely decode the Protobuf data for an IBC client related transaction
//       due to ibc.core.client.v1.MsgCreateClient not having a defined URL protobuf schema that can be resolved.
//       What data that can be returned by decoding from TxResult and Transaction is not all that useful.
export const ibcEventFromBytes = (txBytes : Buffer) : [Transaction, TxResult] => {
  const ibcEvent = TxResult.fromBinary(txBytes);
  const tx = Transaction.fromBinary(ibcEvent.tx);
  return [tx, ibcEvent];
};
