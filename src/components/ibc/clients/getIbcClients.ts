export async function getIbcClients({ endpoint, pageIndex } : { endpoint: string, pageIndex: number }) {
  console.log(`Fetching: GET ${endpoint}?page=${pageIndex}`);
  const res = await fetch(`http://localhost:3000${endpoint}?page=${pageIndex}`, { method: "GET" });
  const json = await res.json();
  return json;
}
