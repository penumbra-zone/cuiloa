export async function getIbcChannels({ endpoint, pageIndex } : { endpoint: string, pageIndex: number}) {
  console.log(`Fetching: GET ${endpoint}?page=${pageIndex}`);
  const res = await fetch(`http://localhost:3000${endpoint}?page=${pageIndex}`, { method: "GET" });
  return await res.json();
  // const result = ChannelsTableData.safeParse(json);
  // if (result.success) {
  //   return result.data;
  // } else {
  //   throw new Error(result.error.message);
  // }
}
