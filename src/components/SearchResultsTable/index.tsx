import { columns } from "./columns";
import { DataTable } from "../ui/data-table";
// import { type QueryKind } from "@/lib/validators/search";
import { type FC } from "react";

interface Props {
  data: Array<{
    kind: string,
    created_at?: string,
    value?: string | bigint
  }>,
}

const SearchResultsTable : FC<Props> = ({ data }) => {
  return (
    <div>
      <DataTable columns={columns} data={data}/>
    </div>
  );
};

export default SearchResultsTable;