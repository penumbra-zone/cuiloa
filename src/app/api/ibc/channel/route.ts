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

    // WARNING: This query does not check/enforce the fact that this update used the channel.
    // TODO: Check for whether this event is associated with the correct channel.
    // update_client event types do not include this information, so I'd hope/assume that a related
    // transaction or block will have that associated data? If so, how do I find it?
    const clientHeight = await db.events.findFirstOrThrow({
      select: {
        attributes: {
          select: {
            key: true,
            value: true,
          },
          where: {
            key: {
              equals: "consensus_height",
            },
          },
        },
      },
      where: {
        AND: [
          {
            type: {
              equals: "update_client",
            },
            attributes: {
              some: {
                AND: [
                  {
                    key: {
                      equals: "client_id",
                    },
                  },
                  {
                    value: {
                      equals: clientId.attributes[0].value,
                    },
                  },
                ],

              },
            },
          },
        ],
      },
      orderBy: {
        block_id: "desc",
      },
    });

    console.log("Successfully queried for latest client height.", clientHeight);

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

    return new Response(JSON.stringify({
        "connectionId": connectionId.attributes[0].value,
        "clientId": clientId.attributes[0].value,
        "consensusHeight": clientHeight.attributes[0].value,
        recentTransactions,
      }));

  } catch (error) {
    console.error("GET request failed.", error);
    return new Response("Could not query IBC Channel.", { status: 500 });
  }
};