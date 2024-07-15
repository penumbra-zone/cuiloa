import { getPgClient } from "@/lib/db";
import { sql } from "@pgtyped/runtime";
import { IGetConnectionsCountQuery, IGetConnectionsQuery } from "./route.types";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  console.log("SUCCESS: GET /api/ibc/connections");
  try {
    const pageParam = req.nextUrl.searchParams.get("page")?.trim() ?? "";
    const pageOffset = (parseInt(pageParam, 10)) * 10;
    const pageLimit = 10;

    console.log("Acquiring db and querying for IBC Connections.");

    const client = await getPgClient();

    const getConnections = sql<IGetConnectionsQuery>`
      SELECT ea.value as "connection_id!"
      FROM event_attributes ea
      WHERE ea.composite_key='connection_open_init.connection_id'
      ORDER BY ea.block_id DESC LIMIT $pageLimit OFFSET $pageOffset!
    ;`;
    const getConnectionsCount = sql<IGetConnectionsCountQuery>`
      SELECT COUNT(*)::int as "count!"
      FROM event_attributes ea
      WHERE ea.composite_key='connection_open_init.connection_id'
    ;`;

    const connections = await getConnections.run({ pageOffset, pageLimit }, client);
    const [{ count },, ] = await getConnectionsCount.run(undefined, client);
    client.release();

    console.log("Successfully queried:", [connections, count]);

    const pages = Math.floor((count / 10) + 1);

    return new Response(JSON.stringify({ results: connections, pages }));

  } catch (error) {
    console.error("GET request failed.", error);
    return new Response("Could not query IBC Connections.", { status: 500 });
  }
}
