import { type NextRequest } from "next/server";
import db from "@/lib/db";

export async function GET(req: NextRequest) {
  console.log("SUCCESS: GET /api/ibc/client");
  try {
    const url = new URL(req.url);
    const clientIdParam = url.searchParams.get("q")?.trim() ?? "";
    if (clientIdParam === "") {
      throw new Error("No client id provided.");
    }
    console.log(`Querying indexer for IBC client with id ${clientIdParam}.`);
    // This will return the block id for the latest client_update event type for a given client_id.
    const lastClientUpdate = await db.events.findFirstOrThrow({
      select: {
        rowid: true,
      },
      where: {
        type: {
          equals: "update_client",
        },
        attributes: {
          some: {
            AND: {
              key: {
                equals: "client_id",
              },
              value: {
                equals: clientIdParam,
              },
            },
          },
        },
      },
      orderBy: {
        block_id: "desc",
      },
    });
    // Return all event attributes for the latest client_update for a specific client.
    // TODO: Verify that it is NOT possible for there to be more than one client `client_update` for the same event.
    const clientAttributes = await db.attributes.findMany({
      select: {
        key: true,
        value: true,
        composite_key: true,
      },
      where: {
        event_id: {
          equals: lastClientUpdate.rowid,
        },
      },
    });

    console.log("Successfully queried for latest client state.", clientAttributes);

    return new Response(JSON.stringify(clientAttributes));

  } catch (error) {
    console.error("GET request failed.", error);
    return new Response("Could not query IBC Client.", { status: 500 });
  }
};