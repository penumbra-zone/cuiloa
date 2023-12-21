import db from "@/lib/db";
import { type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  console.log("SUCCESS: GET /api/ibc/clients");
  try {
    console.log("Querying indexer for IBC clients.");
    const clients = await db.events.findMany({
      select: {
        tx_results: {
          select: {
            tx_hash: true,
          },
        },
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
        },
      },
      where: {
        type: {
          equals: "create_client",
        },
      },
    });

    console.log("Successfully queried for IBC Clients.", clients);

    // NOTE: As of now, cannot completely decode the Protobuf data for an IBC client related transaction
    //       due to ibc.core.client.v1.MsgCreateClient not having a defined URL protobuf schema that can be resolved.
    //       What data that can be returned by decoding from TxResult and Transaction is not all that useful.
    // const clientTx = clients.at(0)?.tx_results?.tx_result;
    // if (clientTx) {
    //   const [tx, ibcClient] = ibcEventFromBytes(clientTx);
    //   console.log("Successfully extracted IBC data from txResult data.", tx, ibcClient);
    // }

    return new Response(JSON.stringify(clients));

  } catch (error) {
    console.error("GET request failed.", error);
    return new Response("Could not query IBC Clients.", { status: 500 });
  }
}