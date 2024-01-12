import db from "@/lib/db";
import { type NextRequest } from "next/server";

export async function GET(_req: NextRequest) {
  console.log("SUCCESS: GET /api/ibc/channels");
  try {
    console.log("Querying indexer for IBC channels");
    const channels = await db.events.findMany({
      select: {
        blocks: {
          select: {
            created_at: true,
            height: true,
          },
        },
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
        AND: {
          type: {
            equals: "channel_open_ack",
          },
        },
      },
    });

    console.log("Successfully queried for IBC channels.", channels);

    return new Response(JSON.stringify(channels));

  } catch (error) {
    console.error("GET request failed.", error);
    return new Response("Could not query IBC Channels.", { status: 500 });
  }
}