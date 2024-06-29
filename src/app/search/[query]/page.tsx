"use client";
import SearchResultsTable from "@/components/SearchResultsTable";
// import { SearchResultValidator } from "@/lib/validators/search";
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

  const { data: searchResultData , isError } = useQuery({
    queryFn: async () => {
      console.log(`Fetching: GET /api/search?q=${query}`);
      const { data } = await axios.post(`/api/search?q=${query}`);
      console.log("Fetched result:", data);
      return data;
      // const result = SearchResultValidator.safeParse(data);
      // if (result.success) {
      //   console.log(result.data);
      //   return result.data;
      // } else {
      //   throw new Error(result.error.message);
      // }
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
    <div className="flex flex-col gap-5 pt-5 items-center bg-primary">
        <h1 className="sm:text-2xl font-bold">Search results</h1>
        {// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
          searchResultData ? <SearchResultsTable className="sm:w-1/2 w-full" data={[searchResultData]}/>
          : <p>No results</p>
        }
    </div>
  );
};

export default Page;
