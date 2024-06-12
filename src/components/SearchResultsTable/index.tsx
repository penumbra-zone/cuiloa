import { columns } from "./columns";
import { DataTable } from "../ui/data-table";
import { type FC } from "react";


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
  data: SearchResult[]
}

const SearchResultsTable : FC<SearchResultsTableProps> = ({ className, data }) => {
  const relatedVisible = !!data[0].related;
  console.log("relatedVisible", relatedVisible);
  return (
    <DataTable className={className} columns={columns} data={data} columnVisibility={{ "related": relatedVisible }}/>
  );
};

export default SearchResultsTable;
