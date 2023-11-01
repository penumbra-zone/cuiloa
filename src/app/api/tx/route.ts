import db from "@/lib/db";
import { HashResultValidator } from "@/lib/validators/search";
import { z } from "zod";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const queryParam = url.searchParams.get("q")?.trim() ?? "";

    const hash = HashResultValidator.parse(queryParam);

    const tx = await db.tx_results.findFirstOrThrow({
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

    return new Response(JSON.stringify(tx));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid transaction query: Hash must be 64 hexadecimal characters with optional 0x prefix", { status: 422 });
    }
    return new Response("Could not find transaction result with provided hash.", { status: 404 });
  }
}