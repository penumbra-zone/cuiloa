import { TransactionData } from "@/lib/validators/search";

export default async function getTransaction({ endpoint, hash } : { endpoint: string, hash: string}) {
  console.log(`Fetching: POST ${endpoint}?q=${hash}`);
  const res = await fetch(`http://localhost:3000${endpoint}?q=${hash}`, { method: "GET" });
  const json = await res.json();
  console.log("Fetched Result:", json);
  const result = TransactionData.safeParse(json);
  if (result.success) {
    return result.data;
  } else {
    throw new Error(result.error.message);
  }
}
