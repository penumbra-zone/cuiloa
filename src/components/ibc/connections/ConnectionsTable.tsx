import { columns } from "./columns";
import { DataTable } from "../../ui/data-table";
import { type FC } from "react";

interface Props {
  className?: string,
  data: Array<{
    key: string,
    value: string | null,
  }>,
}

const ConnectionsTable : FC<Props> = ({ className, data }) => {
  return (
    <DataTable className={className} columns={columns} data={data}/>
  );
};

export default ConnectionsTable;