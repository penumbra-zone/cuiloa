import { getBaseURL } from "@/lib/utils";

export async function getIbcConnection ({ endpoint, connectionId } : { endpoint: string, connectionId: string }) {
  const baseUrl = getBaseURL();
  console.log(`Fetching: GET ${baseUrl}/${endpoint}?q=${connectionId}`);
  const res = await fetch(`${baseUrl}/${endpoint}?q=${connectionId}`, { method: "GET" });
  return await res.json();
}
