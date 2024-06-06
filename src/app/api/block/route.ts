import { sql } from "@pgtyped/runtime";
import { getPgClient } from "@/lib/db";
import { IGetBlockQuery } from "./route.types";
import { BlockHeightValidator } from "@/lib/validators/search";
import { z } from "zod";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  console.log("Sucess: GET /api/block");
  try {
    const url = new URL(req.url);
    const queryParam = url.searchParams.get("q")?.trim() ?? "";
    const ht = BlockHeightValidator.parse(queryParam);

    console.log(`Acquiring DB client and querying database for attribute data of block with height ${ht}.`);

    // TODO: Update query to match Transaction, can use EventAttribute validator instead of the ad-hoc validation + transform.
    const getBlock = sql<IGetBlockQuery>`
      WITH txs (block_id, tx_hash) AS (
          SELECT tx.block_id, tx.tx_hash FROM tx_results tx
          WHERE tx.block_id=$ht!
      )
      SELECT
        DISTINCT ON (be.type, be.key, be.value)
        be.type as "type!",
        be.key as "key!",
        be.value,
        CASE be.type
            WHEN  'block' THEN array_agg(txs.tx_hash)
        END tx_hashes,
        CASE be.type
            WHEN 'block' THEN b.created_at
        END created_at
      FROM block_events be
      LEFT JOIN txs ON txs.block_id=be.block_id
      LEFT JOIN blocks b ON b.rowid=be.block_id
      WHERE be.height=$ht!
      GROUP BY be.type, be.key, be.value, b.created_at
      ORDER BY be.type, be.key, be.value;
    `;

    const client = await getPgClient();
    const blockAttributes = await getBlock.run({ ht }, client);
    client.release();

    console.log("Acquired blockAttributes data:", blockAttributes);

    return new Response(JSON.stringify(blockAttributes));
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return new Response("Invalid block height query.", { status: 422 });
    }
    return new Response("Could not find block by height.", { status: 404 });
  }
}
