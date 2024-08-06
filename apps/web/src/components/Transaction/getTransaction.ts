import { getBaseURL } from "@/lib/utils";
import { TransactionData } from "@/lib/validators/search";

export async function getTransaction({ endpoint, hash } : { endpoint: string, hash: string}) {
  const baseUrl = getBaseURL();
  console.log(`Fetching: GET ${baseUrl}/${endpoint}?q=${hash}`);
  const res = await fetch(`${baseUrl}/${endpoint}?q=${hash}`, { method: "GET" });
  const json = await res.json();
  console.log("Fetched Result:", json);
  const result = TransactionData.safeParse(json);
  if (result.success) {
    return result.data;
  } else {
    throw new Error(result.error.message);
  }
}
