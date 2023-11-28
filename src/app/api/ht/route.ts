import db from "@/lib/db";
import { transactionFromBytes } from "@/lib/protobuf";
import { BlockHeightValidator } from "@/lib/validators/search";
import { z } from "zod";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  console.log("Sucess: GET /api/ht");
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
        chain_id: true,
        created_at: true,
        height: true,
        events: {
          select: {
            type: true,
            attributes: {
              select: {
                key: true,
                value: true,
              },
            },
          },
          where: {
            AND: [
              {
                type: {
                  not: "block",
                },
              },
              {
                NOT: {
                  AND: [
                    {
                      type: "tx",
                    },
                    {
                      attributes: {
                        some: {
                          OR: [
                            {
                              key: {
                                equals: "height",
                              },
                            },
                            {
                              key: {
                                equals: "hash",
                              },
                            },
                          ],
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        tx_results: {
          select: {
            tx_hash: true,
            tx_result: true,
          },
        },
      },
    });

    console.log("Successfully queried block:", query);

    const tx = query.tx_results.at(0);
    const {tx_results : _, ...block} = query;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    let tx_hash = "";
    if (tx !== undefined) {
      const penumbraTx = transactionFromBytes(tx.tx_result);
      console.log("Successfully decoded Transaction from blockEvent.tx_results:", penumbraTx);

      // eslint-disable-next-line @typescript-eslint/naming-convention
      tx_hash = tx.tx_hash;
      return new Response(JSON.stringify([{tx_hash, ...block}, penumbraTx.toJsonString()]));
    }

    console.log("No Transaction associated with block.");
    return new Response(JSON.stringify([{tx_hash, ...block}, null]));
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return new Response("Invalid block height query.", { status: 422 });
    }
    return new Response("Could not find block by height.", { status: 404 });
  }
}