import db from "@/lib/db";
// import { transactionFromBytes } from "@/lib/protobuf";
import { BlockHeightValidator } from "@/lib/validators/search";
import { z } from "zod";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  console.log("Sucess: GET /api/block");
  try {
    const url = new URL(req.url);
    const queryParam = url.searchParams.get("q")?.trim() ?? "";

    const ht = BlockHeightValidator.parse(queryParam);
    // NOTE: This endpoint doesn't return the plain data of a single block. It finds the block by height and, if they exist, attaches any associated events and transaction results.
    //       Duplicate height event attributes are also filtered out.
    console.log(`querying database for block with height ${ht}.`);

    const query = await db.blocks.findFirstOrThrow({
      where: {
        height: ht,
      },
      select: {
        created_at: true,
        height: true,
        events: {
          select: {
            block_id: true,
            type: true,
            attributes: {
              select: {
                key: true,
                value: true,
              },
            },
          },
          where: {
            tx_id: {
              equals: null,
            },
          },
        },
        tx_results: {
          select: {
            tx_hash: true,
          },
        },
      },
    });

    console.log("Successfully queried block data: ", query, query.events);

    return new Response(JSON.stringify(query));
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return new Response("Invalid block height query.", { status: 422 });
    }
    return new Response("Could not find block by height.", { status: 404 });
  }
}