export async function getIbcChannel({ endpoint, channelId } : { endpoint: string, channelId: string}) {
  console.log(`Fetching: GET ${endpoint}?q=${channelId}`);
  const res = await fetch(`http://localhost:3000${endpoint}?q=${channelId}`, { method: "GET" });
  return await res.json();
}
