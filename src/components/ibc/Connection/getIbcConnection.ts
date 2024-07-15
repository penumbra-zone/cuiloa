export async function getIbcConnection ({ endpoint, connectionId } : { endpoint: string, connectionId: string }) {
  console.log(`Fetching: GET ${endpoint}?q=${connectionId}`);
  const res = await fetch(`http://localhost:3000${endpoint}?q=${connectionId}`, { method: "GET" });
  return await res.json();
}
