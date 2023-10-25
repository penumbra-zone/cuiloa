import EventTable from "@/components/EventTable";
import { TableEvents } from "@/lib/validators/table";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import axios from "axios";

export default async function Home() {  
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["eventTableQuery"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/events?page=${1}`);
      const result = TableEvents.safeParse(data);
      if ( result.success ) {
        return result.data;
      } else {
        throw result.error;
      }
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EventTable />
    </HydrationBoundary>
  );
}
