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

    console.log("Searching for connections associated with IBC Channels...");
    const connections = await db.events.findMany({
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

    console.log("Successfully queried for associated IBC Connections.", connections[0].attributes);

    // NOTE: this is why i should remove Prisma. I don't care if there is a way to massage the database into making this unecessary or that I could skip over it using RAWQUERY; the fact that this is what you are forced to do either of these for something so simple is ridiculous.
    //       included in this is that I would have an entire third query if I wasn't relying on the way `client_id`s are built off of `client_type`s
    console.log("Merging query data...");
    const channels = channelsQuery.map((channel) => {
      // Precondition: An attribute with key "connection_id" should never have a value of null.
      const connectionId = channel.attributes.find(({ key }) => key==="connection_id")?.value as string;
      // Precondition: An attribute with key "client_id" should never have a value of null.
      const clientID = connections.find(({ attributes }) => !!attributes.find(({ key, value }) => key==="connection_id" && connectionId===value))?.attributes.find(({ key }) => key==="client_id") as {key: string, value: string};
      channel.attributes.push(clientID);
      // NOTE: Abusing the fact that `ibc_types::core::client::ClientId` is built from `ibc_types::core::client::ClientType` by hyphenating an id_counter.
      //       I don't want to rely this on the longrun.
      // TODO: Verify whether we want counterparty_client_id or not.
      const idx = clientID.value.lastIndexOf("-");
      const  counterpartyID = clientID.value.substring(0, idx);
      channel.attributes.push({ key: "client_type", value: counterpartyID });
      // Enforce ordering on attributes for the consuming table on the client.
      channel.attributes.sort((a, b) => a.key.toUpperCase() < b.key.toUpperCase() ? -1 : (a.key.toUpperCase() > b.key.toUpperCase() ? 1 : 0));
      return channel.attributes;
    });
    console.log("Successfully merged channels and clients.", channels);

    return new Response(JSON.stringify(channels));

  } catch (error) {
    console.error("GET request failed.", error);
    return new Response("Could not query IBC Channels.", { status: 500 });
  }
}