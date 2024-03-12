import { Transaction } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/transaction/v1/transaction_pb";
import { z } from "zod";
// This validator is to check whether a sha256 hash conforms to what is expected by the `tx_hash` column
// of the `tx_result` table defined in cometbft's psql indexer schema.
export const HashResultValidator = z.union([
  z.string().toUpperCase().startsWith("0X").length(66).regex(/^(0X)([A-F0-9]{64})$/, { message: "Hash must be 64 hexadecimal characters with optional 0x prefix." }),
  z.string().toUpperCase().length(64).regex(/^([A-F0-9]{64})$/, { message: "Hash must be 64 hexadecimal characters with optional 0x prefix." }),
]).transform((val) => {
  // Trim 0X if our hash is prefixed, otherwise return as is.
  if (val.length === 66) {
    return val.slice(2);
  }
  return val;
});

// A preprocessor validator that helps avoid coercion runtime errors with BigInt validation by piping the results of converting a string to an integer.
const toNonNegInt = z.number().or(z.string()).pipe(z.coerce.number().int().nonnegative());

// This validator is to check whether a block height conforms to what is expected by the `height` column of the 
// `blocks` table defined in cometbft's psql indexer schema. The final .pipe() doesn't require a nonnegative check because of toNonNegInt.
export const BlockHeightValidator = z.bigint().nonnegative({ message: "Block height must be a non-negative integer."}).or(toNonNegInt).pipe(z.coerce.bigint());

// Validator for IBC Complient *Client* Identifiers as *emitted by Penumbra*.
// I went through the trouble of specifying it to this detail because it ensures that validator checks are NOT sensitive to the order of regex evaluation :).
// Broken down by capture group:
// 1. Ensure that the identifier does not start with `connection` or `channel`, which is how Penumbra names identifiers for IBC Connections and IBC Channels.
// 2. Ensure that the identifier only consists of characters as specified for valid IBC identifiers *and* is a valid length.
// 3. Finally, ensure that the identifier is some number of valid characters followed by a `-<number>`, which is how Penumbra generates Client IDs.
export const IbcClientValidator = z.string().regex(/^(?!connection|channel)(?=[A-Za-z0-9.[\]<>_+\-#]{9,64})([A-Za-z0-9.[\]<>_+\-#]+-[0-9]+)$/);

// Validator for IBC Complient *Channel* Identifiers emitted by Penumbra.
export const IbcChannelValidator = z.string().regex(/^(channel-[0-9]){1,56}$/);

// Validator for IBC Complient *Connection* Identifiers emmitted by Penumbra.
export const IbcConnectionValidator = z.string().regex(/^(connection-[0-9]){1,53}$/);

export type HashResultQuery = z.infer<typeof HashResultValidator>;
export type BlockHeightQuery = z.infer<typeof BlockHeightValidator>;
export type IbcClientValidatorT = z.infer<typeof IbcClientValidator>;
export type IbcChannelValidatorT = z.infer<typeof IbcChannelValidator>;
export type IbcConnectionValidatorT = z.infer<typeof IbcConnectionValidator>;

// TODO: There might be a more "correct" way to rely on Zod's typings to enforce the types that will eventually
//       represent all query types but this is an OK approximation for now.
//       i.e. Define an enum of QueryKinds and then an union of tuples with the tagged QueryKind and the associated validator for that kind, QueryValidator.
//            This will ensure that only records with a kind of "TX_HASH" will have a value of HashResultQuery (ie a correctly formated hash string), and
//            records with "BLOCK_HEIGHT" will only have a value of BlockHeightQuery (bigint), etc.

export enum QueryKind {
  BlockHeight = "BLOCK_HEIGHT",
  IbcClient = "IBC_CLIENT",
  IbcChannel = "IBC_CHANNEL",
  IBCConnection = "IBC_CONNECTION",
  TxHash = "TX_HASH",
}

// NOTE: would it be worth converting these branded values into using the ts enum value intead of the string literals?
//       more a question with how zod plays with those values and how it differentiates them. might also be why my code ended up this way
//       without realizing it.
const HashResultSearchValidator = HashResultValidator
  .transform((val) => ({ kind: "TX_HASH", value: val }));

export const BlockHeightSearchValidator = BlockHeightValidator
  .transform((val) => ({ kind: "BLOCK_HEIGHT", value: val }));

export const IbcClientSearchValidator = IbcClientValidator
  .transform((val) => ({ kind: "IBC_CLIENT", value: val }));

export const IbcChannelSearchValidator = IbcChannelValidator
  .transform((val) => ({ kind: "IBC_CHANNEL", value: val }));

export const IbcConnectionSearchValidator = IbcConnectionValidator
  .transform((val) => ({ kind: "IBC_CONNECTION", value: val }));

// Validator used for checking whether a user's search query input is recognized and supported.
export const SearchValidator = z.union([
  HashResultSearchValidator,
  BlockHeightSearchValidator,
  IbcClientSearchValidator,
  IbcChannelSearchValidator,
  IbcConnectionSearchValidator,
]);

export type SearchValidatorT = z.infer<typeof SearchValidator>;

// Validators used for checking the result of searched queries represented as a discriminate union where the QueryKind serves as the discriminate.
// Query Kinds supported ought to be defined in both `SearchValidator` and `QueryKind`.
// NOTE: Completely forgot why I felt the need to chain optionals from within the discriminated record. Another thing in need of documentation
//       if not refactored in the next pass of cleaning up the codebase.
export const SearchResultValidator = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("TX_HASH"),
    value: HashResultValidator.optional(),
    created_at: z.string().datetime().optional(),
  }),
  z.object({
    kind: z.literal("BLOCK_HEIGHT"),
    value: BlockHeightValidator.optional(),
    created_at: z.string().datetime().optional(),
  }),
  z.object({
    kind: z.literal("IBC_CLIENT"),
    value: IbcClientValidator.optional(),
    created_at: z.string().datetime().optional(),
  }),
  z.object({
    kind: z.literal("IBC_CHANNEL"),
    value: IbcChannelValidator.optional(),
    created_at: z.string().datetime().optional(),
  }),
  z.object({
    kind: z.literal("IBC_CONNECTION"),
    value: IbcConnectionValidator.optional(),
    created_at: z.string().datetime().optional(),
  }),
]);

// zod schema equivalent to the /parsed/ JSON data returned by prisma in GET /api/transaction?q=<hash>
export const TransactionResult = z.tuple([
  z.object({
    tx_hash: z.string(),
    created_at: z.string().datetime(),
    events: z.array(z.object({
      type: z.string(),
      value: z.string().nullable(),
      key: z.string(),
    })),
    blocks: z.object({
      height: z.coerce.bigint(),
      chain_id: z.string(),
    }),
  }),
  // NOTE: Not sure how good this perf wise relative to JsonValue equivalent, but I would need to type out the entire object structure.
  z.string().transform((jsonString) => {
    const parsed = Transaction.fromJsonString(jsonString);
    return parsed;
  }),
]);

// zod schema equivalent to the /parsed/ JSON data returned by prisma in GET /api/block?q=<height>
export const BlockData = z.object({
  created_at: z.string().datetime(),
  height: z.coerce.bigint(),
  events: z.array(
    z.object({
      type: z.string(),
      attributes: z.array(
        z.object({
          value: z.string().nullable(),
          key: z.string(),
        }),
      ),
    }),
  ),
  tx_results: z.array(z.object({ tx_hash: z.string() })),
});

export type TransactionResultPayload = z.infer<typeof TransactionResult>;
export type BlockDataPayload = z.infer<typeof BlockData>;