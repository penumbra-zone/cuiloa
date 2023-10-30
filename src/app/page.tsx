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
        // NOTE: another reason to move this hydration further down the component tree, ie create a completely generic data-table component and
        //       make independent BlockEventTable/TransactionEventTable server generated components that performs the hydration, is that
        //       it will allow for toaster errors without losing access to static server rendering.
        //       It's that or going back to react-hot-toast which provides a headless UI solution for this precise issue.
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
