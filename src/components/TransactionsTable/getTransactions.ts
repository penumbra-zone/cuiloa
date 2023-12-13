"use server";

import { TableEvents } from "@/lib/validators/table";

export default async function getTransactions({ endpoint, pageIndex } : { endpoint: string, pageIndex: number}) {
  const res = await fetch(`http://localhost:3000${endpoint}?page=${pageIndex}`, { method: "POST" });
  const json = await res.json();
  console.log(json);
  const result = TableEvents.safeParse(json);
  if (result.success) {
    return result.data;
  } else {
    throw new Error(result.error.message);
  }
}