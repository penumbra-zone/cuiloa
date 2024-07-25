import { getBaseURL } from "@/lib/utils";
import { TransactionsTableData } from "@/lib/validators/table";

export async function getTransactions({ endpoint, pageIndex } : { endpoint: string, pageIndex: number}) {
  const baseUrl = getBaseURL();
  console.log(`Fetching: POST ${baseUrl}/${endpoint}?page=${pageIndex}`);
  const res = await fetch(`${baseUrl}/${endpoint}?page=${pageIndex}`, { method: "GET" });
  const json = await res.json();
  console.log("Fetched Result:", json);
  const result = TransactionsTableData.safeParse(json);
  if (result.success) {
    return result.data;
  } else {
    throw new Error(result.error.message);
  }
}
