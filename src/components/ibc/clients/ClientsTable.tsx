import { columns } from "./columns";
import { DataTable } from "../../ui/data-table";
import { type FC } from "react";

interface Props {
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

const ClientsTable : FC<Props> = ({ data }) => {
  return (
    <div>
      <DataTable columns={columns} data={data}/>
    </div>
  );
};

export default ClientsTable;