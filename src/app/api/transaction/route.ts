import db from "@/lib/db";
import { transactionFromBytes } from "@/lib/protobuf";
import { HashResultValidator } from "@/lib/validators/search";
import { z } from "zod";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  console.log("Success: GET /api/transaction");
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

    const penumbraTx = transactionFromBytes(query.tx_result);
    console.log("Successfully decoded Transaction from tx_result:", penumbraTx);

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { tx_result, events: _events, ...tx} = query;

    // NOTE: I Cannot Wait To Remove PrismaJS.
    // This flattens our ABCI data such that:
    // { type: string, 
    //   attributes: Array<{
    //     key: string,
    //     value: string | null }>}
    // } becomes:
    // { type: string,
    //   key: string,
    //   value: string | null }
    // Whether or not it would be better to nest this day for rendering in the table is TBD.
    const events = _events.map(({ type, attributes }) => {
      return attributes.map(({ key, value }) => ({ type, key, value }));
    }).flat();

    return new Response(JSON.stringify([{...tx, events}, penumbraTx.toJsonString()]));
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return new Response("Invalid transaction query: Hash must be 64 hexadecimal characters with optional 0x prefix", { status: 422 });
    }
    return new Response("Could not find transaction result with provided hash.", { status: 404 });
  }
}