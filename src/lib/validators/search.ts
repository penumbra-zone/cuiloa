import { z } from "zod";

// This validator is to check whether a sha256 hash conforms to what is expected by the `tx_hash` column
// of the `tx_result` table defined in cometbft's psql indexer schema.
export const HashResultValidator = z.union([
  z.string().toUpperCase().startsWith("0X").length(66).regex(/^(0X)([A-F0-9]{64})$/, { message: "Hash must be 64 hexadecimal characters with optional 0x prefix." }),
  z.string().toUpperCase().length(64).regex(/^([A-F0-9]{64})$/, { message: "Hash must be 64 hexadecimal characters with optional 0x prefix." }),
]).transform((val) => {
  // Trim 0X if our hash is prefixed, otherwise return as is.
  if ( val.length === 66 ) {
    return val.slice(2);
  }
  return val;
});

// A preprocessor validator that helps avoid coercion runtime errors with BigInt validation by piping the results of converting a string to an integer.
const toNonNegInt = z.number().or(z.string()).pipe(z.coerce.number().int().nonnegative());

// This validator is to check whether a block height conforms to what is expected by the `height` column of the 
// `blocks` table defined in cometbft's psql indexer schema. The final .pipe() doesn't require a nonnegative check because of toNonNegInt.
export const BlockHeightValidator = z.bigint().nonnegative({ message: "Block height must be a non-negative integer."}).or(toNonNegInt).pipe(z.coerce.bigint());

export type HashResultQuery = z.infer<typeof HashResultValidator>;
export type BlockHeightQuery = z.infer<typeof BlockHeightValidator>;

// zod schema equivalent to the /parsed/ JSON data returned by prisma in GET /api/tx?q=<hash>
export const TransactionResult = z.object({
  tx_hash: z.string(),
  // JSON.stringify transforms a Node Buffer into an object of { type: string, data: number[] }.
  tx_result: z.object({
    type: z.string(),
    data: z.array(z.number()),
  }),
  created_at: z.string().datetime(),
  events: z.array(z.object({
    type: z.string(),
    attributes: z.array(z.object({
      value: z.string().nullable(),
      key: z.string(),
    })),
  })),
  blocks: z.object({
    height: z.coerce.bigint(),
    chain_id: z.string(),
  }),
});

// zod schema equivalent to the /parsed/ JSON data returned by prisma in GET /api/ht?q=<height>
export const BlockResult = z.object({
  chain_id: z.string(),
  created_at: z.string().datetime(),
  height: z.coerce.bigint(),
  events: z.array(z.object({
    type: z.string(),
    attributes: z.array(z.object({
      value: z.string().nullable(),
      key: z.string(),
    })),
  })),
  tx_results: z.array(z.object({
    tx_hash: z.string(),
    tx_result: z.object({
      type: z.string(),
      data: z.array(z.number()),
    }),
  })),
});

export type TransactionResultPayload = z.infer<typeof TransactionResult>;
export type BlockResultPayload = z.infer<typeof BlockResult>;