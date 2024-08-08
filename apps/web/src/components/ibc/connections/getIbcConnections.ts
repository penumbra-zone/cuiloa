import { getBaseURL } from "@/lib/utils";

export async function getIbcConnections({ endpoint, pageIndex } : { endpoint: string, pageIndex: number}) {
  const baseUrl = getBaseURL();
  console.log(`Fetching: GET ${baseUrl}/${endpoint}?page=${pageIndex}`);
  const res = await fetch(`${baseUrl}/${endpoint}?page=${pageIndex}`, { method: "GET" });
  return await res.json();
}
