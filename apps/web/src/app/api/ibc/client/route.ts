export const dynamic = "force-dynamic";
import { type NextRequest } from "next/server";
import { getPgClient } from "@/lib/db";
import { sql } from "@pgtyped/runtime";
import { IGetClientQuery } from "./route.types";

export async function GET(req: NextRequest) {
  console.log("SUCCESS: GET /api/ibc/client");
  try {
    const url = new URL(req.url);
    const clientIdParam = url.searchParams.get("q")?.trim() ?? "";
    if (clientIdParam === "") {
      throw new Error("No client id provided.");
    }
    console.log(`Querying indexer for IBC client with id ${clientIdParam}.`);
    const pgClient = await getPgClient();
    // TODO?: as commented elsewhere, still need to clarify the mapping of connections with clients,
    //        ie can there ever be more than one, can a client (or an connection) change its connection (and vice versa)
    const getClient = sql<IGetClientQuery>`
      SELECT
        client.client_id as "client_id!",
        client_connection.connection_id as "connection_id!",
        array_agg(DISTINCT channels.channel_id) as "channels!",
        json_agg(json_build_object('key', events.key, 'value', events.value))::text as "events!"
      FROM (
        SELECT MAX(ea.block_id) as "block_id", ea.value as "client_id"
        FROM event_attributes ea
        WHERE
          ea.value=$clientIdParam!
          AND
          (ea.composite_key='update_client.client_id'
          OR
          ea.composite_key='create_client.client_id')
        GROUP BY ea.value
      ) client LEFT JOIN LATERAL (
        -- this will have consensus_height and client_type
        SELECT DISTINCT ON (ea.key) ea.key, ea.value
        FROM event_attributes ea
        WHERE
          ea.block_id=client.block_id
      ) events ON true LEFT JOIN LATERAL (
        SELECT ea.block_id
        FROM event_attributes ea
        WHERE
          ea.composite_key='connection_open_init.client_id'
          AND
          ea.value=client.client_id
      ) client_connection_init ON true LEFT JOIN LATERAL (
        SELECT ea.value as "connection_id"
        FROM event_attributes ea
        WHERE
          ea.block_id=client_connection_init.block_id
          AND
          ea.composite_key='connection_open_init.connection_id'
      ) client_connection ON true LEFT JOIN LATERAL (
        SELECT ea.block_id
        FROM event_attributes ea
        WHERE
          ea.composite_key='channel_open_init.connection_id'
          AND
          ea.value=client_connection.connection_id
        ORDER BY ea.block_id DESC
      ) channel_inits ON true LEFT JOIN LATERAL (
        SELECT ea.value as "channel_id"
        FROM event_attributes ea
        WHERE
          ea.block_id=channel_inits.block_id
          AND
          ea.composite_key='channel_open_init.channel_id'
      ) channels ON true
      GROUP BY client.client_id, client_connection.connection_id
    ;`;
    const _client = await getClient.run({ clientIdParam }, pgClient);
    pgClient.release();

    console.log("Successfully queried Client");
    // console.dir(["pgClient result:", _client], { depth: 4});

    return new Response(JSON.stringify(_client));

  } catch (error) {
    console.error("GET request failed.", error);
    return new Response("Could not query IBC Client.", { status: 500 });
  }
};
