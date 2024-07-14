import { getPgClient } from "@/lib/db";
import { sql } from "@pgtyped/runtime";
import { IGetChannelsCountQuery, IGetIbcChannelsQuery } from "./route.types";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  console.log("SUCCESS: GET /api/ibc/channels");
  try {
    const pageParam = req.nextUrl.searchParams.get("page")?.trim() ?? "";
    const pageOffset = (parseInt(pageParam, 10)) * 10;
    const pageLimit = 10;

    console.log("Acquiring PgClient and querying for IBC channels");

    const client = await getPgClient();

    // TODO: Revisit with latteral joins like other IBC queries
    // WARNING
    // TODO: This code *MUST* be revisited once support for IBC chanClose* events is clarified. Only channels are ever possibly deleted but does Penumbra support this?.
    const getIbcChannels = sql<IGetIbcChannelsQuery>`
      WITH channel_connection (channel_id, connection_id) AS (
        SELECT ea.value as channel_id, _ea.value as connection_id
        FROM event_attributes ea
        INNER JOIN event_attributes _ea
          ON _ea.block_id=ea.block_id
          AND _ea.composite_key='channel_open_init.connection_id'
        WHERE
          ea.composite_key='channel_open_init.channel_id'
      ), connections_counterparty_by_client (client_id, connection_id, counterparty_client_id) AS (
        SELECT ea.value as client_id, c_ea.value as connection_id, p_ea.value as counterparty_client_id
        FROM event_attributes ea
        INNER JOIN event_attributes c_ea
          ON ea.block_id=c_ea.block_id
          AND c_ea.composite_key='connection_open_init.connection_id'
        INNER JOIN event_attributes p_ea
          ON p_ea.block_id=c_ea.block_id
          AND p_ea.composite_key='connection_open_init.counterparty_client_id'
        WHERE
          ea.composite_key='connection_open_init.client_id'
      ), type_consensus_by_client (client_id, client_type, consensus_height) AS (
        SELECT DISTINCT ON (updates.client_id, updates.client_type)
          updates.client_id, updates.client_type, updates.consensus_height
        FROM (
          SELECT ea.block_id, ea.value as client_id, t_ea.value as client_type, h_ea.value as consensus_height
          FROM event_attributes ea
          INNER JOIN event_attributes h_ea
            ON h_ea.block_id=ea.block_id
            AND h_ea.composite_key='update_client.consensus_height'
          INNER JOIN event_attributes t_ea
            ON t_ea.block_id=ea.block_id
            AND t_ea.composite_key='update_client.client_type'
          WHERE
            ea.composite_key='update_client.client_id'
          ORDER BY ea.block_id DESC
        ) updates
      )
      SELECT cc.channel_id, tcc.client_id, ccc.connection_id, tcc.client_type, ccc.counterparty_client_id, tcc.consensus_height
      FROM channel_connection cc
      LEFT JOIN connections_counterparty_by_client ccc ON cc.connection_id=ccc.connection_id
      LEFT JOIN type_consensus_by_client tcc ON tcc.client_id=ccc.client_id
      LIMIT $pageLimit OFFSET $pageOffset!
    ;`;
    const getChannelsCount = sql<IGetChannelsCountQuery>`
      SELECT COUNT(*)::int as "count!"
      FROM event_attributes ea
      WHERE ea.composite_key='channel_open_init.channel_id'
    ;`;

    const channels = await getIbcChannels.run({ pageLimit, pageOffset }, client);
    const [ { count },,] = await getChannelsCount.run(undefined, client);
    client.release();

    console.log("Successfully queried channels:", [channels, count]);

    const pages = Math.floor((count / 10) + 1);

    return new Response(JSON.stringify({ results: channels, pages }));

  } catch (error) {
    console.error("GET request failed.", error);
    return new Response("Could not query IBC Channels.", { status: 500 });
  }
}
