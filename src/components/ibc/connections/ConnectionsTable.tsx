import { columns } from "./columns";
import { DataTable } from "../../ui/data-table";
import { type FC } from "react";

interface Props {
  data: Array<{
    key: string,
    value: string | null,
  }>,
}

const ConnectionsTable : FC<Props> = ({ data }) => {
  return (
    <div>
      <DataTable columns={columns} data={data}/>
    </div>
  );
};

export default ConnectionsTable;