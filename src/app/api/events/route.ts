import db from "@/lib/db";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const pageParam = url.searchParams.get("page")?.trim() ?? "";

    // TODO
    // - [ ] config limit variable
    const pageOffset = (parseInt(pageParam, 10)) * 10;

    const where = {
      tx_results: {
        some: {},
      },
    };

    const events = db.blocks.findMany({
      where,
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

    // In moments like this, I truly miss rolling plain SQL.
    // PrismaJS's docs on pagination are... "untruthful" because it is actually impossible to get the count for a pagination's count within the query.
    // Instead, we need to make two separate queries to first count all rows that match the criteria of our filter. After we acquire that number, we then run the query that gives us the actual rows using that same filter.
    // This is done in Promise.all() becuase Prisma's transaction method runs sequentially.
    // We cannot do both of these in a single query.
    // See:
    // - https://github.com/prisma/prisma/discussions/16148
    // - https://github.com/prisma/prisma/issues/6570
    // - https://github.com/prisma/prisma/issues/7550
    const [count, blockEvents] = await Promise.all([
      db.blocks.count({
        where,
      }),
      events,
    ]);

    // Ensure that our pagination doesn't cut off early.
    const pages = Math.floor((count / 10) + 1);

    return new Response(JSON.stringify([pages, blockEvents]));
  } catch (error) {
    return new Response("Could not load events.", { status: 404 });
  }
}