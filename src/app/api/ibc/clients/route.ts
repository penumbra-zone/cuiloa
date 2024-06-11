import { getPgClient } from "@/lib/db";
import { sql } from "@pgtyped/runtime";

export async function GET() {
  console.log("SUCCESS: GET /api/ibc/clients");
  try {
    console.log("Querying indexer for IBC clients.");
    const getClients = sql`
      SELECT
        create_clients.client_id as "client_id!",
        COALESCE(update_clients.block_id, create_clients.block_id) as "block_id!",
        hashes.created_at as "last_updated_at!",
        hashes.tx_hash as "hash!",
        update_attrs.value as "consensus_height"
        -- Useful for aggregating other event data if that is desired later.
        -- array_agg(array[update_attrs.key, update_attrs.value]) as "events!"
      FROM (
        SELECT DISTINCT ON (ea.value) ea.value as "client_id", ea.block_id, ea.tx_id
        FROM event_attributes ea
        WHERE ea.composite_key='create_client.client_id'
        LIMIT 10
      ) create_clients LEFT JOIN LATERAL (
        SELECT MAX(ea.block_id) as block_id
        FROM event_attributes ea
        WHERE
          ea.composite_key='update_client.client_id'
          AND
          ea.value=create_clients.client_id
        LIMIT 1
      ) update_clients ON true LEFT JOIN LATERAL (
        SELECT DISTINCT ON (ea.key, ea.value) ea.key, ea.value, ea.tx_id
        FROM event_attributes ea
        WHERE
          ea.block_id=update_clients.block_id
          AND
          ea.key='consensus_height'
      ) update_attrs ON true LEFT JOIN LATERAL (
        SELECT tx.tx_hash, tx.created_at
        FROM tx_results tx
        WHERE
          tx.rowid=update_attrs.tx_id
          OR
          update_attrs.tx_id IS NULL
          AND
          tx.rowid=create_clients.tx_id
        LIMIT 1
      ) hashes ON true
      -- GROUP BY create_clients.client_id, update_clients.block_id, create_clients.block_id, hashes.tx_hash, hashes.created_at
      -- ordering by create_clients first ensures that clients without updates get sorted correctly along those with updates
      ORDER BY create_clients.block_id DESC, update_clients.block_id DESC
    ;`;
    const pgClient = await getPgClient();
    const clients = await getClients.run(undefined, pgClient);
    pgClient.release();

    console.log("Successfully queried for IBC Clients.");
    // console.dir(["pgClient query: ", clients], { depth: 4 });

    return new Response(JSON.stringify(clients));

  } catch (error) {
    console.error("GET request failed.", error);
    return new Response("Could not query IBC Clients.", { status: 500 });
  }
}
