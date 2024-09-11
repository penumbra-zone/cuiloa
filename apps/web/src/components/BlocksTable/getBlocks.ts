import { getBaseURL } from "@/lib/utils";
import { BlocksTableQuery } from "@/lib/validators/table";

export async function getBlocks ({ endpoint, pageIndex, cached = true } : ({ endpoint: string, pageIndex: number, cached?: boolean })) {
  const baseUrl = getBaseURL();
  console.log(`Fetching: GET ${baseUrl}/${endpoint}/?page=${pageIndex}`);

  const res = await fetch(`${baseUrl}/${endpoint}?page=${pageIndex}`, { method: "GET", cache: ( cached ? "default" : "no-store") });
  const json = await res.json();

  console.log("Fetched result:", json);
  const result = BlocksTableQuery.safeParse(json);
  if (result.success) {
    return result.data;
  } else {
    throw new Error(result.error.message);
  }
}
