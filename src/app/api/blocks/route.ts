import db from "@/lib/db";

// Without forcing no-cache on the route, even downstream components will render stale data without a hard-refresh of the page. This holds true for /transactions as well.
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  console.log("POST req on /api/blocks/", req);
  try {
    const url = new URL(req.url);
    const pageParam = url.searchParams.get("page")?.trim() ?? "";

    const pageOffset = (parseInt(pageParam, 10)) * 10;

    console.log("pageOffset", pageOffset);

    const blocksQuery = db.blocks.findMany({
      select: {
        height: true,
        created_at: true,
      },
      skip: pageOffset,
      take: 10,
      orderBy: {
        created_at: "desc",
      },
    });


    console.log("Querying database for recent blocks.");
    const [count, blocks] = await Promise.all([
      db.blocks.count(),
      blocksQuery,
    ]);

    console.log("Successfully queried Blocks count and Blocks.");
    console.log([count, blocks]);

    const pages = Math.floor((count / 10) + 1);

    return new Response(JSON.stringify([pages, blocks]));
  } catch (error) {
    console.error("Error occurred while requesting Blocks", error);
    return new Response("Could not query blocks.", { status: 404});
  }
}