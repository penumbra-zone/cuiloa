import { columns } from "./columns";
import { DataTable } from "../../ui/data-table";
import { type FC } from "react";

interface Props {
  data: Array<{
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

const ChannelsTable : FC<Props> = ({ data }) => {
  return (
    <div>
      <DataTable columns={columns} data={data}/>
    </div>
  );
};

export default ChannelsTable;