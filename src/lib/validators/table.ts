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

export const TableEvents = z.object({
  pages: z.number(),
  results: z.array(
    z.object({
      height: z.coerce.bigint(),
      created_at: z.string().datetime(),
      tx_results: z.array(z.object({
        tx_hash: z.string(),
      })),
    }),
  ),
});

export type BlocksTablePayload = z.infer<typeof BlocksTableQuery>;
export type TableEventsPayload = z.infer<typeof TableEvents>;
