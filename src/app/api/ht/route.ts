import db from "@/lib/db";
import { BlockHeightValidator } from "@/lib/validators/search";
import { z } from "zod";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const queryParam = url.searchParams.get("q")?.trim() ?? "";

    const ht = BlockHeightValidator.parse(queryParam);

    // NOTE: This endpoint doesn't return the plain data of a single block. It finds the block by height and, if they exist, attaches any associated events and transaction results.
    //       Duplicate height event attributes are also filtered out.
    // BUG: Why is this query (*AND* the one in /api/tx) not pulling in the relevant `action_undelegate.validator` event attributes for a given block query?
    const block = await db.blocks.findFirstOrThrow({
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

    const json = JSON.stringify(block, function (_, value) { return typeof value === "bigint" ? value.toString() : value });

    return new Response(json);
  } catch (error) {
    if ( error instanceof z.ZodError ) {
      return new Response("Invalid block height query.", { status: 422 });
    }
    return new Response("Could not find block by height.", { status: 404 });
  }
}