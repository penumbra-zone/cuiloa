"use client";
import SearchResultsTable from "@/components/SearchResultsTable";
import { SearchResultValidator } from "@/lib/validators/search";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { type FC } from "react";

interface PageProps {
  params: {
    query: string
  }
}

const Page : FC<PageProps> = ({ params }) => {
  const { query } = params;

  const { data: searchResultData , isFetched, isError } = useQuery({
    queryFn: async () => {
      console.log(`Fetching: GET /api/search?q=${query}`);
      const { data } = await axios.post(`/api/search?q=${query}`);
      console.log("Fetched result:", data);
      const result = SearchResultValidator.safeParse(data);
      if (result.success) {
        console.log(result.data);
        return result.data;
      } else {
        throw new Error(result.error.message);
      }
    },
    queryKey: ["searchResult", query],
    retry: false,
    meta: {
      errorMessage: "Failed to find any results from the provided query. Please try a different query.",
    },
  });

  if (isError) {
    return (
      <div className="py-5 flex justify-center">
        <h1 className="text-4xl font-semibold">No results found.</h1>
      </div>
    );
  }

  return (
    <div>
      {isFetched ? (
        <div>
          <h1 className="text-3xl mx-auto py-5 font-semibold">Search results</h1>
        {searchResultData ? (
          <div className="flex flex-col justify-center w-full">
            <SearchResultsTable data={[searchResultData]}/>
          </div>
        ) : (
          <p>No results</p>
        )}
       </div>
      ) : (
        <p>loading...</p>
      )}
    </div>
  );
};

export default Page;