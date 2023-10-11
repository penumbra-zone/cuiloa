import db from "@/lib/db";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const hash = url.searchParams.get("q") ?? "";
    // console.log(hash);
  
    if ( !hash ) {
      return new Response("Invalid query, no transaction hash.", { status: 400 });
    }

    const tx = await db.tx_results.findFirst({
      select: {
        tx_hash: true,
        tx_result: true,
        created_at: true,
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
            NOT: {
              type: "tx",
            },
          },
        },
        blocks: {
          select: {
            height: true,
            chain_id: true,
          },
        },
      },
      where: {
        tx_hash: hash,
      },
    });

    console.log(tx);
    // NOTE: Prisma's handling of 'bigint' typed columns gives the node equivalent which is one of the very
    //       few data types that JSON.stringify() cannot serialize. Prisma + NextJS completely smother this error, as well.
    //       The recommended solution is to monkey patch JSON globally[1] but I do it inline here for now.
    //       [1]: https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields#serializing-bigint
    // TODO: Consider either updating the schema so that this isn't an issue or explicitly patching this behavior somewhere more obvious/explicit.
    const json = JSON.stringify(tx, function (_, value) { return typeof value === "bigint" ? value.toString() : value });

    return new Response(json);
  } catch (error) {
    return new Response("Could not find transaction by hash.", { status: 404 });
  }
}