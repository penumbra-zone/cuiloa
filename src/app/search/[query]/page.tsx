import SearchResultsTable from "@/components/SearchResultsTable";
import { getBaseURL, getQueryClient } from "@/lib/utils";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { type FC } from "react";

interface PageProps {
  params: {
    query: string
  }
}

const Page : FC<PageProps> = ({ params }) => {
  const { query } = params;
  const queryClient = getQueryClient();

  queryClient.prefetchQuery({
    queryFn: async () => {
      const baseUrl = getBaseURL();
      console.log(`FETCHING: GET ${baseUrl}/api/search?q=${query}`);
      const data = await fetch(`${baseUrl}/api/search?q=${query}`, { method: "GET" });
      return await data.json();
    },
    queryKey: ["searchResult", query],
    meta: {
      errorMessage: "Failed to find any results for the search term. Please try looking for something else.",
    },
  });

  return (
    <div className="flex flex-col gap-5 pt-5 items-center bg-primary">
        <h1 className="sm:text-2xl font-bold">Search results</h1>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <SearchResultsTable className="sm:w-1/2 w-full" query={query}/>
        </HydrationBoundary>
    </div>
  );
};

export default Page;
