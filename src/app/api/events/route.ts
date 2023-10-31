import db from "@/lib/db";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const pageParam = url.searchParams.get("page")?.trim() ?? "";

    // TODO
    // - [ ] make this a validator, too.
    // - [ ] config limit variable
    const pageOffset = (parseInt(pageParam, 10) - 1) * 10;

    const blockEvents = await db.blocks.findMany({
      where: {
        tx_results: {
          some: {},
        },
      },
      select: {
        height: true,
        created_at: true,
        tx_results: {
          select: {
            tx_hash: true,
          },
        },
      },
      skip: pageOffset,
      take: 10,
      orderBy: {
        created_at: "desc",
      },
    });

    return new Response(JSON.stringify(blockEvents));
  } catch (error) {
    return new Response("Could not load events.", { status: 404 });
  }
}