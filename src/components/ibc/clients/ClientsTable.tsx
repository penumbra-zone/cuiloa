import { columns } from "./columns";
import { DataTable } from "../../ui/data-table";
// import { type QueryKind } from "@/lib/validators/search";
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
      value: string,
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