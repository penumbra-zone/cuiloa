import db from "@/lib/db";
import { QueryKind, SearchValidator } from "@/lib/validators/search";

export async function POST(req: Request) {
  console.log("POST req on /api/search", req);
  try {
    const url = new URL(req.url);
    const queryParam = url.searchParams.get("q")?.trim() ?? "";
    console.log("Search paramater: ", queryParam);

    const res = SearchValidator.safeParse(queryParam);
    if (!res.success) {
      return new Response("Invalid query", { status: 404 });
    }

    const searchQuery = res.data;
    // TODO: pagination will be more relevant when there are different types of values to search across for a given query...
    //       i.e. for a given block height, find any associated ABCI stuff
    // const pageParam = url.searchParams.get("page")?.trim() ?? "";
    // const pageOffset = (parseInt(pageParam, 10)) * 10;

    if (searchQuery.kind === QueryKind.BlockHeight) {
      const blocksQuery = await db.blocks.findFirst({
        select: {
          height: true,
        },
        where: {
          // value will be bigint when kind is BlockHeight
          height: searchQuery.value as bigint,
        },
      });

      return new Response(JSON.stringify({
        kind: searchQuery.kind,
        identifier: blocksQuery?.height,
      }));

    } else if (searchQuery.kind === QueryKind.TxHash) {
      const txQuery = await db.tx_results.findFirst({
        select: {
          tx_hash: true,
        },
        where: {
          // value will be string when kind is TxHash
          tx_hash: searchQuery.value as string,
        },
      });
      return new Response(JSON.stringify({
        kind: searchQuery.kind,
        identifier: txQuery?.tx_hash,
      }));
    } else if (searchQuery.kind === QueryKind.IbcClient) {
      console.log("Searching for IBC Clients...");
      const clientQuery = await db.events.findMany({
        select: {
          type: true,
          tx_results: {
            select: {
              tx_hash: true,
            },
          },
        },
        where: {
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
                    equals: searchQuery.value as string,
                  },
                },
              ],
            },
          },
        },
        orderBy: {
          block_id: "desc",
        },
        take: 10,
      });
      console.log("Successfully queried for IBC Client Search Results.", clientQuery);
      const clientData = clientQuery.map(({ type, tx_results: txResults }) => ({type, identifier: txResults?.tx_hash }));
      return new Response(JSON.stringify({
        kind: searchQuery.kind,
        identifier: searchQuery.value,
        related: clientData,
      }));
    } else if (searchQuery.kind === QueryKind.IbcChannel) {
      console.log("Searching for IBC Channels...");
      const recentTransactions = await db.events.findMany({
        select: {
          block_id: true,
        },
        where: {
          attributes: {
            some: {
              value: {
                equals: searchQuery.value as string,
              },
            },
          },
        },
      });
      console.log("Recent transactions involving IBC Channel.", recentTransactions);
      const channelQuery = await db.events.findMany({
        select: {
          type: true,
          tx_results: {
            select: {
              tx_hash: true,
            },
          },
        },
        where: {
          block_id: {
            in: recentTransactions.map(({ block_id: blockId }) => blockId),
          },
        },
        orderBy: {
          block_id: "desc",
        },
        take: 10,
      });
      console.log("Successfully queried for IBC Channel Search Results.", channelQuery);
      const channelData = channelQuery.map(({ type, tx_results: txResults }) => ({type, identifier: txResults?.tx_hash }));
      return new Response(JSON.stringify({
        kind: searchQuery.kind,
        identifier: searchQuery.value,
        related: channelData,
      }));
    } else if (searchQuery.kind === QueryKind.IBCConnection) {
      console.log("Searching for IBC Connections...");
      const connectionQuery = await db.events.findFirst({
        select: {
          attributes: {
            select: {
              value: true,
            },
            where: {
              AND: [
                {
                  key: {
                    equals: "connection_id",
                  },
                },
                {
                  value: {
                    equals: searchQuery.value as string,
                  },
                },
              ],
            },
          },
        },
        orderBy: {
          block_id: "desc",
        },
      });
      console.log("Successfully queried for IBC Connection Search Results.", connectionQuery);
      return new Response(JSON.stringify({
        kind: searchQuery.kind,
        identifier: searchQuery.value,
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