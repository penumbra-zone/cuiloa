import { getBaseURL } from "@/lib/utils";

export async function getIbcClients({ endpoint, pageIndex } : { endpoint: string, pageIndex: number }) {
  const baseUrl = getBaseURL();
  console.log(`Fetching: GET ${baseUrl}/${endpoint}?page=${pageIndex}`);
  const res = await fetch(`${baseUrl}/${endpoint}?page=${pageIndex}`, { method: "GET" });
  const json = await res.json();
  return json;
}
