import db from "@/lib/db";
import { type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  console.log("SUCCESS: GET /api/ibc/connection");
  try {
    console.log("Querying indexer for IBC connection");
    const url = new URL(req.url);
    const connectionId = url.searchParams.get("q")?.trim() ?? "";
    if (connectionId === "") {
      throw new Error("No channel id provided.");
    }

    console.log("Querying for client_id and channel_id of connection...");

    const connectionInfo = await db.events.findMany({
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
                  equals: "channel_id",
                },
              },
            ],
          },
        },
      },
      where: {
        AND: [
          {
            attributes: {
              some: {
                value: {
                  equals: connectionId,
                },
              },
            },
          },
          {
            OR: [
              {
                type: {
                  equals: "connection_open_init",
                },
              },
              {
                type: {
                  equals: "channel_open_init",
                },
              },
            ],
          },
        ],
      },
      orderBy: {
        rowid: "desc",
      },
    });

    console.log("Successfully queried data for IBC connection.", connectionInfo);

    const channelIds: string[] = [];
    let clientId = "";
    connectionInfo.map(({ attributes }) => attributes).flat().forEach(({ key, value }) => {
      if (key==="client_id" && value !== null) {
        clientId = value;
      } else if (key==="channel_id" && value !== null) {
        channelIds.push(value);
      }
    });

    return new Response(JSON.stringify({clientId, channelIds}));

  } catch (error) {
    console.error("GET request failed.", error);
    return new Response("Could not query IBC Connection.", { status: 500 });
  }
}