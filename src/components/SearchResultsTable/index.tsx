import { columns } from "./columns";
import { DataTable } from "../ui/data-table";
import { type FC } from "react";

interface RelatedIbcTransaction {
  type: string,
  hash: string,
}

interface IbcSearchResult {
  kind: string,
  identifier: string,
  related?: RelatedIbcTransaction[],
}
// TODO?
// interface TransactionSearchResult {}
// interface BlockSearchResult {}
interface SearchResultsTableProps {
  data: Array<{
    kind: string,
    created_at?: string,
    value?: string | bigint
  }> | IbcSearchResult[],
}

const SearchResultsTable : FC<SearchResultsTableProps> = ({ data }) => {
  return (
    <div>
      <DataTable columns={columns} data={data}/>
    </div>
  );
};

export default SearchResultsTable;