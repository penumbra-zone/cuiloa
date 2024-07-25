import { getBaseURL } from "@/lib/utils";
import { BlockData } from "@/lib/validators/search";

export async function getBlock({ endpoint, ht } : { endpoint: string, ht: string}) {
  const baseUrl = getBaseURL();
  console.log(`Fetching: GET ${baseUrl}/${endpoint}?q=${ht}`);
  const res = await fetch(`${baseUrl}/${endpoint}?q=${ht}`, { method: "GET" });
  const json = await res.json();
  console.log("Fetched Result:", json);
  const result = BlockData.safeParse(json);
  if (result.success) {
    return result.data;
  } else {
    throw new Error(result.error.message);
  }
}
