import { getPgClient } from "@/lib/db";
import { sql } from "@pgtyped/runtime";
import { IGetIbcChannelsQuery } from "./route.types";

export async function GET() {
  console.log("SUCCESS: GET /api/ibc/channels");
  try {
    console.log("Acquiring PgClient and querying for IBC channels");

    const client = await getPgClient();

    // TODO: A lot to improve on here. Create stable views instead of CTE's per client request. Laterals not a bad idea, either.
    // NOTE: The only suq-query that I'm not 100% on how to improve later is for getting the most up-to-date consensusHeight for a counterparty
    //       in type_consensus_by_client.
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
    LEFT JOIN type_consensus_by_client tcc ON tcc.client_id=ccc.client_id;
    `;

    const channels = await getIbcChannels.run(undefined, client);
    client.release();

    console.log("Successfully queried channels:", channels);

    return new Response(JSON.stringify(channels));

  } catch (error) {
    console.error("GET request failed.", error);
    return new Response("Could not query IBC Channels.", { status: 500 });
  }
}
