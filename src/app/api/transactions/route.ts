export const dynamic = "force-dynamic";
import { getPgClient } from "@/lib/db";
import { sql } from "@pgtyped/runtime";
import { IGetTransactionsCountQuery, IGetTransactionsQuery } from "./route.types";

export async function POST(req: Request) {
  console.log("Success: POST /api/transactions");
  try {
    const url = new URL(req.url);
    const pageParam = url.searchParams.get("page")?.trim() ?? "";
    // TODO: config limit variable
    const pageOffset = (parseInt(pageParam, 10)) * 10;
    const pageLimit = 10;

    const getTransactions = sql<IGetTransactionsQuery>`
      SELECT b.height as "height!", tx.created_at, tx.tx_hash
      FROM tx_results tx
      LEFT JOIN blocks b ON b.rowid=tx.block_id
      ORDER BY tx.block_id DESC LIMIT $pageLimit! OFFSET $pageOffset!;
    `;
    const getTransactionsCount = sql<IGetTransactionsCountQuery>`SELECT COUNT(*)::int as "count!" FROM tx_results;`;

    console.log("Acquring DbClient and querying for recent Transactions.");

    const client = await getPgClient();
    const transactions = await getTransactions.run({ pageLimit, pageOffset }, client);
    const [{ count },,] = await getTransactionsCount.run(undefined, client);
    client.release();

    console.log("Successfully queried Transactions:");
    console.log([transactions, count]);

    // Ensure that our pagination doesn't cut off early.
    const pages = Math.floor((count / 10) + 1);

    return new Response(JSON.stringify({ pages, results: transactions }));
  } catch (error) {
    console.log(error);
    return new Response("Could not load events.", { status: 404 });
  }
}
