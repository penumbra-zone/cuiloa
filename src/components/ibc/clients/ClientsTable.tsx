import { columns } from "./columns";
import { DataTable } from "../../ui/data-table";
import { type FC } from "react";

interface Props {
  className?: string,
  data: Array<{
    client_id: string,
    block_id: bigint,
    last_updated_at: string,
    hash: string,
    consensus_height: string | null
  }>,
}

const ClientsTable : FC<Props> = ({ className, data }) => {
  return (
    <DataTable className={className} columns={columns} data={data}/>
  );
};

export default ClientsTable;
