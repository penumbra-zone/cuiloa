export const dynamic = "force-dynamic";
import { getPgClient } from "@/lib/db";
import { sql } from "@pgtyped/runtime";
import { type NextRequest } from "next/server";
import { IGetConnectionInfoQuery } from "./route.types";

export async function GET(req: NextRequest) {
  console.log("SUCCESS: GET /api/ibc/connection");
  try {
    console.log("Querying indexer for IBC connection");
    const url = new URL(req.url);
    const connectionId = url.searchParams.get("q")?.trim() ?? "";
    if (connectionId === "") {
      throw new Error("No channel id provided.");
    }

    console.log("Acquiring pgClient and querying for IBC Connection info.");
    const client = await getPgClient();

    // TODO: Establish that it's only channels that a connection can be 1:N with, not also clients (possibility of aliasing across chains????)
    const getConnectionInfo = sql<IGetConnectionInfoQuery>`
      SELECT
        channel_inits.connection_id as "connection_id!",
        clients.client_id as "client_id!",
        array_agg(channels.channel_id) as "channel_ids!"
      FROM (
        SELECT ea.block_id, ea.value as "connection_id"
        FROM event_attributes ea
        WHERE
          ea.composite_key='channel_open_init.connection_id'
          AND
          ea.value=$connectionId!
      ) channel_inits LEFT JOIN LATERAL (
        SELECT ea.value as "channel_id"
        FROM event_attributes ea
        WHERE
          ea.block_id=channel_inits.block_id
          AND
          ea.composite_key='channel_open_init.channel_id'
      ) channels ON true LEFT JOIN LATERAL (
        SELECT ea.block_id
        FROM event_attributes ea
        WHERE
          ea.composite_key='connection_open_init.connection_id'
          AND
          ea.value=channel_inits.connection_id
      ) connection_inits ON true LEFT JOIN LATERAL (
        SELECT ea.value as "client_id"
        FROM event_attributes ea
        WHERE
          ea.block_id=connection_inits.block_id
          AND
          ea.composite_key='connection_open_init.client_id'
      ) clients ON TRUE
      GROUP BY channel_inits.connection_id, clients.client_id
      LIMIT 1
    ;`;
    const connections = await getConnectionInfo.run({ connectionId }, client);
    client.release();

    console.log("pgClient finished!", connections);

    return new Response(JSON.stringify(connections));

  } catch (error) {
    console.error("GET request failed.", error);
    return new Response("Could not query IBC Connection.", { status: 500 });
  }
}
