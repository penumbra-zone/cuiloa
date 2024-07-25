export const dynamic = "force-dynamic";
import { type NextRequest } from "next/server";
import { getPgClient } from "@/lib/db";
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
      SELECT update_clients.block_id, channel_id.id as "channel_id!", connection_id.id as "connection_id!", client_id.id as "client_id!", counterparty_client.id as "counterparty_client_id", counterparty_updates.consensus_height, array_agg(recent_txs.tx_hash) as "recent_txs!"
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
        SELECT txs.tx_hash
        FROM (
          SELECT DISTINCT ON (tx.tx_hash) tx.tx_hash, tx.block_id
          FROM tx_results tx
          JOIN event_attributes ea ON ea.block_id=tx.block_id
          WHERE
            EXISTS (SELECT 1 FROM event_attributes _ea WHERE _ea.block_id=tx.block_id AND _ea.value=$channelIdParam!)
          ORDER BY tx.tx_hash, tx.block_id DESC
        ) txs
        ORDER BY txs.block_id DESC
        LIMIT 10
      ) recent_txs ON true
      GROUP BY update_clients.block_id, channel_id.id, connection_id.id, client_id.id, counterparty_client.id, counterparty_updates.consensus_height
      ORDER BY update_clients.block_id;
    `;

    const [ channelInfo ,,] = await getChannelInfo.run({ channelIdParam }, client);
    client.release();
    console.log("PGCLIENT:", channelInfo);

    const { channel_id: channelId, connection_id: connectionId, client_id: clientId, consensus_height: consensusHeight, recent_txs: recentTxs } = channelInfo;
    return new Response(JSON.stringify({
      channelId,
      connectionId,
      clientId,
      consensusHeight,
      recentTxs,
    }));

  } catch (error) {
    console.error("GET request failed.", error);
    return new Response("Could not query IBC Channel.", { status: 500 });
  }
};
