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
        // NOTE: This actually gets us the same result as the data queried in clientAttributes.
        //       I don't want to keep using Prisma so it probably doesn't matter but the clientAttributes query,
        //       as it exists, may be entirely unnecessary.
        // attributes: {
        //   select: {
        //     key: true,
        //     value: true,
        //   },
        // },
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

    console.log("Successfully queried last update for IBC Client.", lastClientUpdate);
    console.log("Querying for associated channel and connection data...");

    const ibcConnection = await db.events.findFirstOrThrow({
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
              equals: "connection_open_init",
            },
          },
          {
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
                      equals: clientIdParam,
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    });

    const ibcChannel = await db.events.findFirstOrThrow({
      select: {
        attributes: {
          select: {
            key: true,
            value: true,
          },
          where: {
            key: {
              equals: "channel_id",
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
                AND: [
                  {
                    key: {
                      equals: "connection_id",
                    },
                  },
                  {
                    value: {
                      equals: ibcConnection.attributes[0].value,
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    });

    console.log("Successfully queried IBC Channel and Connection data.", ibcChannel, ibcConnection);

    // Return all event attributes for the latest client_update for a specific client.
    // TODO: Verify that it is NOT possible for there to be more than one client `client_update` for the same event.
    const lastUpdate = await db.attributes.findMany({
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

    console.log("Successfully queried for latest client state.", lastUpdate);

    let client = { channelId: ibcChannel.attributes[0].value, connectionId: ibcConnection.attributes[0].value };
    lastUpdate.forEach(({ key, value }) => {
      if (key==="client_id") {
        client = Object.assign({ "clientId": value }, client);
      } else if (key==="client_type") {
        client = Object.assign({ "clientType": value }, client);
      } else if (key==="consensus_height") {
        client = Object.assign({ "consensusHeight": value }, client);
      } else if (key==="header") {
        client = Object.assign({ "header": value }, client);
      }
    });

    return new Response(JSON.stringify(client));

  } catch (error) {
    console.error("GET request failed.", error);
    return new Response("Could not query IBC Client.", { status: 500 });
  }
};