import { getBaseURL } from "@/lib/utils";

export async function getIbcChannels({ endpoint, pageIndex } : { endpoint: string, pageIndex: number}) {
  const baseUrl = getBaseURL();
  console.log(`Fetching: GET ${baseUrl}/${endpoint}?page=${pageIndex}`);
  const res = await fetch(`${baseUrl}/${endpoint}?page=${pageIndex}`, { method: "GET" });
  return await res.json();
  // const result = ChannelsTableData.safeParse(json);
  // if (result.success) {
  //   return result.data;
  // } else {
  //   throw new Error(result.error.message);
  // }
}
