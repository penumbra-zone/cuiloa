import { getPgClient } from "@/lib/db";
import { sql } from "@pgtyped/runtime";
import { NextRequest } from "next/server";
import { IGetClientsQuery } from "./route.types";

export async function GET(req: NextRequest) {
  console.log("SUCCESS: GET /api/ibc/clients");
  try {
    const pageParam = req.nextUrl.searchParams.get("page")?.trim() ?? "";
    const pageOffset = (parseInt(pageParam, 10)) * 10;
    const pageLimit = 10;

    console.log("Querying indexer for IBC clients.");
    const getClients = sql<IGetClientsQuery>`
      SELECT
        clients.client_id as "client_id!",
        clients.block_id as "block_id!",
        hashes.created_at as "last_updated_at!",
        hashes.tx_hash as "hash!",
        update_attrs.max_value as "consensus_height"
        -- Useful for aggregating other event data if that is desired later.
        -- array_agg(array[update_attrs.key, update_attrs.value]) as "events!"
      FROM (
        SELECT DISTINCT ON (ea.value) ea.value as "client_id", ea.block_id, ea.tx_id
        FROM event_attributes ea
        WHERE
          ea.composite_key='update_client.client_id'
          OR
          ea.composite_key='create_client.client_id'
        ORDER BY client_id, ea.block_id DESC
      ) clients LEFT JOIN LATERAL (
        SELECT MAX(ea.value) as "max_value", ea.tx_id
        FROM event_attributes ea
        WHERE
          ea.block_id=clients.block_id
          AND
          ea.key='consensus_height'
        GROUP BY ea.tx_id
      ) update_attrs ON true LEFT JOIN LATERAL (
        -- NOTE: null check probably no longer needed since both create_client and update_client indices are now in clients
        SELECT tx.tx_hash, tx.created_at
        FROM tx_results tx
        WHERE
          tx.rowid=update_attrs.tx_id
          OR
          update_attrs.tx_id IS NULL
          AND
          tx.rowid=clients.tx_id
        LIMIT 1
      ) hashes ON true
      ORDER BY clients.block_id DESC
      LIMIT $pageLimit! OFFSET $pageOffset!
    ;`;
    // Filtering distinct and then counting is more efficient than both at the same time. Not that these queries are particularly performant to begin with.
    const getClientsCount = sql`
      SELECT COUNT(*)::int as "count!"
      FROM (
        SELECT DISTINCT ON (ea.value) ea.value, ea.block_id
        FROM event_attributes ea
        WHERE
          ea.composite_key='update_client.client_id'
          OR
          ea.composite_key='create_client.client_id'
        ORDER BY ea.value, ea.block_id DESC
      ) AS clients
    ;`;

    const pgClient = await getPgClient();
    const clients = await getClients.run({ pageLimit, pageOffset }, pgClient);
    const [{ count },,] = await getClientsCount.run(undefined, pgClient);
    pgClient.release();

    console.log("Successfully queried for IBC Clients.");

    const pages = Math.floor((count / 10) + 1);

    return new Response(JSON.stringify({ results: clients, pages }));

  } catch (error) {
    console.error("GET request failed.", error);
    return new Response("Could not query IBC Clients.", { status: 500 });
  }
}
