import { z } from "zod";

export const TableEvents = z.array(z.object({
  height: z.coerce.bigint(),
  created_at: z.string().datetime(),
  chain_id: z.string(),
  tx_results: z.array(z.object({
    tx_hash: z.string(),
    })),
}));

export type TableEventsPayload = z.infer<typeof TableEvents>;