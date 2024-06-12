import { getPgClient } from "@/lib/db";
import { sql } from "@pgtyped/runtime";
import { IGetConnectionsQuery } from "./route.types";

export async function GET() {
  console.log("SUCCESS: GET /api/ibc/connections");
  try {
    console.log("Acquiring db and querying for IBC Connections.");

    const client = await getPgClient();
    const getConnections = sql<IGetConnectionsQuery>`
      SELECT ea.value as "connection_id!"
      FROM event_attributes ea
      WHERE ea.composite_key='connection_open_init.connection_id'
      ORDER BY ea.block_id DESC;
    `;

    const connections = await getConnections.run(undefined, client);
    client.release();

    console.log("Successfully queried:", connections);

    return new Response(JSON.stringify(connections));

  } catch (error) {
    console.error("GET request failed.", error);
    return new Response("Could not query IBC Connections.", { status: 500 });
  }
}
