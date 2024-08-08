import { getBaseURL } from "@/lib/utils";

export async function getIbcClient ({ endpoint, clientId } : { endpoint: string, clientId: string }) {
  const baseUrl = getBaseURL();
  console.log(`Fetching: GET ${baseUrl}/${endpoint}?q=${clientId}`);
  const res = await fetch(`${baseUrl}/${endpoint}?q=${clientId}`, { method: "GET" });
  return await res.json();
}
