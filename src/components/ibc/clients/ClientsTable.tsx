import { columns } from "./columns";
import { DataTable } from "../../ui/data-table";
import { type FC } from "react";

interface Props {
  className?: string,
  data: Array<{
    tx_results: {
      tx_hash: string | null,
    },
    blocks: {
      created_at: string,
      height: bigint,
    },
    attributes: Array<{
      key: string,
      value: string | null,
    }>,
  }>,
}

const ClientsTable : FC<Props> = ({ className, data }) => {
  return (
    <DataTable className={className} columns={columns} data={data}/>
  );
};

export default ClientsTable;