import { BlockData } from "@/lib/validators/search";

export async function getBlock({ endpoint, ht } : { endpoint: string, ht: string}) {
  console.log(`Fetching: GET ${endpoint}?q=${ht}`);
  const res = await fetch(`http://localhost:3000${endpoint}?q=${ht}`, { method: "GET" });
  const json = await res.json();
  console.log("Fetched Result:", json);
  const result = BlockData.safeParse(json);
  if (result.success) {
    return result.data;
  } else {
    throw new Error(result.error.message);
  }
}
