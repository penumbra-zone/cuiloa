import { getBaseURL } from "@/lib/utils";

export async function getIbcChannel({ endpoint, channelId } : { endpoint: string, channelId: string}) {
  const baseUrl = getBaseURL();
  console.log(`Fetching: GET ${baseUrl}/${endpoint}?q=${channelId}`);
  const res = await fetch(`${baseUrl}/${endpoint}?q=${channelId}`, { method: "GET" });
  return await res.json();
}
