"use server";

import { BlocksTableQuery } from "@/lib/validators/table";

export default async function getBlocks ({ endpoint, pageIndex } : ({ endpoint: string, pageIndex: number })) {
  console.log(`Fetching: POST ${endpoint}?page=${pageIndex}`);
  const res = await fetch(`http://localhost:3000${endpoint}?page=${pageIndex}`, { method: "POST" });
  console.log("Fetched result:", res);
  const json = await res.json();
  console.log(json);
  const result = BlocksTableQuery.safeParse(json);
  if (result.success) {
    return result.data;
  } else {
    throw new Error(result.error.message);
  }
}