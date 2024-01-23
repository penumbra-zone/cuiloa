import { columns } from "./columns";
import { DataTable } from "../ui/data-table";
import { type FC } from "react";


export interface RelatedQuery {
  type: string,
  identifier: string,
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
  data: SearchResult[]
}

const SearchResultsTable : FC<SearchResultsTableProps> = ({ data }) => {
  const relatedVisible = !!data[0].related;
  console.log("relatedVisible", relatedVisible);
  return (
    <div>
      <DataTable columns={columns} data={data} columnVisibility={{ "related": relatedVisible }}/>
    </div>
  );
};

export default SearchResultsTable;