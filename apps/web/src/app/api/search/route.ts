export const dynamic = "force-dynamic";
import { getPgClient } from "@/lib/db";
import { sql } from "@pgtyped/runtime";
import { QueryKind, SearchValidator } from "@/lib/validators/search";
import { IGetBlockSearchQuery, IGetChannelSearchQuery, IGetClientSearchQuery, IGetConnectionSearchQuery, IGetTransactionSearchQuery } from "./route.types";

export async function GET(req: Request) {
  console.log("GET req on /api/search");
  try {
    const url = new URL(req.url);
    const queryParam = url.searchParams.get("q")?.trim() ?? "";
    console.log("Search paramater: ", queryParam);

    const res = SearchValidator.safeParse(queryParam);
    if (!res.success) {
      return new Response("Invalid query", { status: 404 });
    }

    const pgClient = await getPgClient();

    const searchQuery = res.data;

    if (searchQuery.kind === QueryKind.BlockHeight) {

      const blockParam = BigInt(searchQuery.value);
      console.log(`Searching for block ${blockParam}`);

      const getBlockSearch = sql<IGetBlockSearchQuery>`
        SELECT b.height as "height"
        FROM blocks b
        WHERE b.height=$blockParam!
      ;`;

      const block = await getBlockSearch.run({ blockParam }, pgClient);
      pgClient.release();

      return new Response(JSON.stringify({
        kind: searchQuery.kind,
        identifier: block.at(0)?.height,
      }));

    } else if (searchQuery.kind === QueryKind.TxHash) {

      const txParam = searchQuery.value as string;
      console.log(`Searching for transaction hash ${txParam}`);
      const getTransactionSearch = sql<IGetTransactionSearchQuery>`
        SELECT tx.tx_hash as "hash"
        FROM tx_results tx
        WHERE tx.tx_hash=$txParam!
      ;`;

      const txHash = await getTransactionSearch.run({ txParam }, pgClient);

      return new Response(JSON.stringify({
        kind: searchQuery.kind,
        identifier: txHash.at(0)?.hash,
      }));
    } else if (searchQuery.kind === QueryKind.IbcClient) {

      const clientId = searchQuery.value as string;
      console.log(`Searching for IBC client ${clientId}`);

      // TODO: Also search for packets involving the client's connection
      const getClientSearch = sql<IGetClientSearchQuery>`
        SELECT ea.type as "type!", tx.tx_hash as "hash"
        FROM event_attributes ea
        LEFT JOIN tx_results tx ON ea.tx_id=tx.rowid
        WHERE
          ea.value=$clientId!
          AND
          (ea.composite_key='update_client.client_id'
          OR
          ea.composite_key='create_client.client_id')
        ORDER BY ea.block_id DESC
        LIMIT 5
      ;`;

      const clientSearch = await getClientSearch.run({ clientId }, pgClient);
      pgClient.release();

      if (clientSearch.length === 0) return new Response("No results.", { status: 404 });

      console.log("Results found:", { kind: searchQuery.kind, identifier: searchQuery.value, related: clientSearch});

      return new Response(JSON.stringify({
        kind: searchQuery.kind,
        identifier: searchQuery.value,
        related: clientSearch,
      }));
    } else if (searchQuery.kind === QueryKind.IbcChannel) {

      const channelId = searchQuery.value as string;
      console.log(`Searching for IBC channel ${channelId}`);

      const getChannelSearch = sql<IGetChannelSearchQuery>`
        SELECT ea.type as "type!", tx.tx_hash as "hash"
        FROM event_attributes ea
        LEFT JOIN tx_results tx ON ea.tx_id=tx.rowid
        WHERE
          ea.value=$channelId!
          AND
          (ea.composite_key='send_packet.packet_src_channel'
          OR
          ea.composite_key='recv_packet.packet_dst_channel'
          OR
          ea.composite_key='channel_open_init.channel_id')
        ORDER BY ea.block_id DESC
        LIMIT 5
      ;`;

      const channelSearch = await getChannelSearch.run({ channelId }, pgClient);
      pgClient.release();

      if (channelSearch.length === 0) return new Response("No results.", { status: 404 });

      return new Response(JSON.stringify({
        kind: searchQuery.kind,
        identifier: searchQuery.value,
        related: channelSearch,
      }));
    } else if (searchQuery.kind === QueryKind.IBCConnection) {

      const connectionId = searchQuery.value as string;
      console.log(`Searching for IBC Connection ${connectionId}`);

      const getConnectionSearch = sql<IGetConnectionSearchQuery>`
        SELECT ea.type as "type!", tx.tx_hash as "hash"
        FROM event_attributes ea
        LEFT JOIN tx_results tx ON ea.tx_id=tx.rowid
        WHERE
          ea.value=$connectionId!
          AND
          (ea.composite_key='send_packet.packet_connection'
          OR
          ea.composite_key='recv_packet.packet_connection'
          OR
          ea.composite_key='connection_open_init.connection_id')
        ORDER BY ea.block_id DESC
        LIMIT 5
      ;`;

      const connectionSearch = await getConnectionSearch.run({ connectionId }, pgClient);
      pgClient.release();

      if (connectionSearch.length === 0) return new Response("No results.", { status: 404 });

      return new Response(JSON.stringify({
        kind: searchQuery.kind,
        identifier: searchQuery.value,
        related: connectionSearch,
      }));
    } else {
      // This should be impossible.
      return new Response("Error processing query.", { status: 500 });
    }
  } catch (error) {
    console.error("Error occurred while searching query.", error);
    return new Response("Could not search query.", { status: 404});
  }
}
