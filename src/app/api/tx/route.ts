import db from "@/lib/db";
import { transactionFromBytes } from "@/lib/protobuf";
import { HashResultValidator } from "@/lib/validators/search";
import { z } from "zod";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  console.log("Success: GET /api/tx");
  try {
    const url = new URL(req.url);
    const queryParam = url.searchParams.get("q")?.trim() ?? "";

    const hash = HashResultValidator.parse(queryParam);
    console.log(`Querying db for transaction event with hash ${hash}`);
    const query = await db.tx_results.findFirstOrThrow({
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

    console.log("Successfully queried transaction event:", query);

    const penumbraTx = transactionFromBytes(query.tx_result);
    console.log("Successfully decoded Transaction from tx_result:", penumbraTx);

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { tx_result, ...tx} = query;
    return new Response(JSON.stringify([tx, penumbraTx.toJsonString()]));
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return new Response("Invalid transaction query: Hash must be 64 hexadecimal characters with optional 0x prefix", { status: 422 });
    }
    return new Response("Could not find transaction result with provided hash.", { status: 404 });
  }
}