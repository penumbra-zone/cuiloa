import db from "@/lib/db";
import { type NextRequest } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_req: NextRequest) {
  console.log("SUCCESS: GET /api/ibc/connections");
  try {
    console.log("Querying indexer for IBC connections");

    const connectionsQuery = await db.events.findMany({
      select: {
        attributes: {
          select: {
            key: true,
            value: true,
          },
          where: {
            key: {
              equals: "connection_id",
            },
          },
        },
      },
      where: {
        type: {
          equals: "connection_open_init",
        },
      },
      orderBy: {
        rowid: "desc",
      },
    });

    console.log("Successfully queried for IBC connections.", connectionsQuery);
    // console.log(connectionsQuery[0].attributes);

    const connections = connectionsQuery.map(({ attributes }) => attributes).flat();

    return new Response(JSON.stringify(connections));

  } catch (error) {
    console.error("GET request failed.", error);
    return new Response("Could not query IBC Connections.", { status: 500 });
  }
}
