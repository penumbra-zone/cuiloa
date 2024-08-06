import { z } from "zod";

export const BlocksTableQuery = z.object({
  pages: z.number(),
  results: z.array(
    z.object({
      height: z.coerce.bigint(),
      created_at: z.string().datetime(),
    }),
  ),
});


export const TransactionsTableData = z.object({
  pages: z.number(),
  results: z.array(
    z.object({
      height: z.coerce.bigint(),
      created_at: z.string().datetime(),
      tx_hash: z.string(),
    }),
  ),
});

export type BlocksTablePayload = z.infer<typeof BlocksTableQuery>;
export type TransactionsTablePayload = z.infer<typeof TransactionsTableData>;
