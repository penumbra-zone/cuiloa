import { type NextRequest } from "next/server";
import db from "@/lib/db";

export async function GET(req: NextRequest) {
  console.log("SUCCESS: GET /api/ibc/channel");
  try {
    const url = new URL(req.url);
    const channelIdParam = url.searchParams.get("q")?.trim() ?? "";
    if (channelIdParam === "") {
      throw new Error("No channel id provided.");
    }
    console.log(`Querying indexer for IBC Channel with id ${channelIdParam}.`);
    const connectionId = await db.events.findFirstOrThrow({
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
        AND: [
          {
            type: {
              equals: "channel_open_init",
            },
          },
          {
            attributes: {
              some: {
                value: {
                  equals: channelIdParam,
                },
              },
            },
          },
        ],
      },
    });

    console.log("Successfully queried connection_id for channel.", connectionId);

    const clientId = await db.events.findFirstOrThrow({
      select: {
        attributes: {
          select: {
            key: true,
            value: true,
          },
          where: {
            key: {
              equals: "client_id",
            },
          },
        },
      },
      where: {
        AND: [
          {
            type: {
              equals: "connection_open_init",
            },
          },
          {
            attributes: {
              some: {
                value: {
                  equals: connectionId.attributes[0].value,
                },
              },
            },
          },
        ],
      },
    });

    console.log("Successfully queried client_id for channel.", clientId);


    // This will return the block id for the latest client_update event type for a given client_id.
    const transactions = await db.events.findMany({
      select: {
        tx_results: {
          select: {
            tx_hash: true,
          },
        },
      },
      where: {
        attributes: {
          some: {
            value: {
              equals: channelIdParam,
            },
          },
        },
      },
      orderBy: {
        block_id: "desc",
      },
      take: 10,
    });

    const recentTransactions = transactions.map(({ tx_results: txResults }) => ({ "hash": txResults?.tx_hash }));

    console.log("Successfully queried recent transactions for channel.", recentTransactions);

    return new Response(JSON.stringify({ "connectionId": connectionId.attributes[0].value, "clientId": clientId.attributes[0].value, recentTransactions}));

  } catch (error) {
    console.error("GET request failed.", error);
    return new Response("Could not query IBC Channel.", { status: 500 });
  }
};