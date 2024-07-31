"use client";
import { columns } from "./columns";
import { DataTable } from "../ui/data-table";
import { type FC } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getBaseURL } from "@/lib/utils";


export interface RelatedQuery {
  type: string,
  hash: string,
}

export interface SearchResult {
  kind: string,
  identifier: string,
  related?: RelatedQuery[],
}
// TODO?
// interface TransactionSearchResult {}
// interface BlockSearchResult {}
interface SearchResultsTableProps {
  className?: string,
  query: string,
}

const SearchResultsTable : FC<SearchResultsTableProps> = ({ className, query }) => {
  const { data } = useSuspenseQuery({
    queryFn: async () => {
      const baseUrl = getBaseURL();
      console.log(`FETCHING: GET /api/search?q=${query}`);
      const data = await fetch(`${baseUrl}/api/search?q=${query}`, { method: "GET" });
      return await data.json();
    },
    queryKey: ["searchResult", query],
  });

  const relatedVisible = !!(data as SearchResult)?.related?.at(0);

  return (
    <DataTable className={className} columns={columns} data={[data]} columnVisibility={{ "related": relatedVisible }}/>
  );
};

export default SearchResultsTable;
