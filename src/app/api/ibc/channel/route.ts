import { type NextRequest } from "next/server";
import db, { getPgClient } from "@/lib/db";
import { sql } from "@pgtyped/runtime";
import { IGetChannelInfoQuery } from "./route.types";

export async function GET(req: NextRequest) {
  console.log("SUCCESS: GET /api/ibc/channel");
  try {
    const url = new URL(req.url);
    const channelIdParam = url.searchParams.get("q")?.trim() ?? "";
    if (channelIdParam === "") {
      throw new Error("No channel id provided.");
    }
    console.log(`Querying indexer for IBC Channel with id ${channelIdParam}.`);
    const client = await getPgClient();
    const getChannelInfo = sql<IGetChannelInfoQuery>`
      SELECT update_clients.block_id, connection_id.id as "connection_id!", client_id.id as "client_id!", counterparty_client.id as "counterparty_client_id", counterparty_updates.consensus_height, array_agg(recent_txs.tx_hash) as "tx_hashs"
      FROM (
        SELECT ea.value as "id", ea.block_id
        FROM event_attributes ea
        WHERE ea.composite_key='channel_open_init.channel_id' AND ea.value=$channelIdParam!
        LIMIT 1
      ) channel_id LEFT JOIN LATERAL (
        SELECT ea.value as "id"
        FROM event_attributes ea
        WHERE
          ea.composite_key='channel_open_init.connection_id'
          AND
          ea.block_id=channel_id.block_id
        LIMIT 1
      ) connection_id ON true LEFT JOIN LATERAL (
        SELECT ea.block_id, ea.value as "id"
        FROM event_attributes ea
        WHERE
          ea.composite_key='connection_open_init.client_id'
          AND
          EXISTS (
            SELECT 1
            FROM event_attributes _ea
            WHERE _ea.block_id=ea.block_id AND _ea.value=connection_id.id
          )
        LIMIT 1
      ) client_id ON true LEFT JOIN LATERAL (
        SELECT ea.block_id, ea.value as "id"
        FROM event_attributes ea
        WHERE
          ea.composite_key='connection_open_init.counterparty_client_id'
          AND
          ea.block_id=client_id.block_id
        LIMIT 1
      ) counterparty_client ON true LEFT JOIN LATERAL (
        SELECT ea.block_id, ea.value as "id"
        FROM event_attributes ea
        WHERE
          ea.composite_key='update_client.client_id'
          AND
          ea.value=client_id.id
        ORDER BY ea.block_id DESC
        LIMIT 1
      ) update_clients ON TRUE LEFT JOIN LATERAL (
        SELECT ea.value as "consensus_height"
        FROM event_attributes ea
        WHERE
          ea.block_id=update_clients.block_id
          AND
          ea.composite_key='update_client.consensus_height'
        ORDER BY ea.block_id DESC
        LIMIT 1
      ) counterparty_updates ON true JOIN LATERAL (
        SELECT DISTINCT ON (tx.tx_hash) tx.tx_hash, tx.block_id
        FROM tx_results tx
        JOIN event_attributes ea ON ea.block_id=tx.block_id
        WHERE
          EXISTS (SELECT 1 FROM event_attributes _ea WHERE _ea.block_id=tx.block_id AND _ea.value=$channelIdParam!)
        ORDER BY tx.tx_hash, tx.block_id DESC
      ) recent_txs ON true
      GROUP BY update_clients.block_id, connection_id.id, client_id.id, counterparty_client.id, counterparty_updates.consensus_height
      ORDER BY update_clients.block_id;
    `;

    const channelInfo = await getChannelInfo.run({ channelIdParam }, client);
    client.release();
    console.log("PGCLIENT:", channelInfo);
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

    // This will return the latest transactions that are associated with the channel.
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
