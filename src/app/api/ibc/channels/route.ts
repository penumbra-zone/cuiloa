import db from "@/lib/db";
import { type NextRequest } from "next/server";

export async function GET(_req: NextRequest) {
  console.log("SUCCESS: GET /api/ibc/channels");
  try {
    console.log("Querying indexer for IBC channels");

    const channelsQuery = await db.events.findMany({
      select: {
        attributes: {
          select: {
            key: true,
            value: true,
          },
          where: {
            NOT: {
              OR: [
                {
                  key: "counterparty_port_id",
                },
                {
                  key: "port_id",
                },
                {
                  key: "version",
                },
              ],
            },
          },
        },
      },
      where: {
        type: {
          equals: "channel_open_init",
        },
      },
      orderBy: {
        rowid: "desc",
      },
    });

    console.log("Successfully queried for IBC channels.", channelsQuery);
    console.log(channelsQuery[0].attributes);

    console.log("Searching for clients associated with IBC Channels...");
    const clients = await db.events.findMany({
      select: {
        attributes: {
          select: {
            key: true,
            value: true,
          },
          where: {
            OR: [
              {
                key: {
                  equals: "client_id",
                },
              },
              {
                key: {
                  equals: "connection_id",
                },
              },
            ],
          },
        },
      },
      where: {
        type: "connection_open_init",
      },
      orderBy: {
        block_id: "desc",
      },
    });

    console.log("Successfully queried for associated IBC Clients.", clients);

    console.log("Merging channels and clients...");
    const channels = channelsQuery.map((channel, i) => {
      // Precondition: An attribute with key "connection_id" should never have a value of null.
      const connectionId = channel.attributes.find(({ key }) => key==="connection_id")?.value as string;
      // Precondition: An attribute with key "client_id" should never have a value of null.
      const clientAttribute = clients.find(({ attributes }) => !!attributes.find(({ key, value }) => key==="connection_id" && connectionId===value))?.attributes.find(({ key, value }) => key==="client_id") as { key: string, value: string};
      channel.attributes.push(clientAttribute);
      // Enforce ordering on attributes for the consuming table on the client.
      channel.attributes.sort((a, b) => a.key.toUpperCase() < b.key.toUpperCase() ? -1 : (a.key.toUpperCase() > b.key.toUpperCase() ? 1 : 0));

      return channel.attributes;
    });
    console.log("Successfully merged channels and clients.");

    return new Response(JSON.stringify(channels));

  } catch (error) {
    console.error("GET request failed.", error);
    return new Response("Could not query IBC Channels.", { status: 500 });
  }
}