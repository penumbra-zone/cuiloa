import { columns } from "./columns";
import { DataTable } from "../../ui/data-table";
import { type FC } from "react";

interface Props {
  className?: string,
  data: Array<{
    channel_id: string,
    client_id: string,
    connection_id: string,
    client_type: string,
    counterparty_client_id: string,
    consensus_height: bigint
  }>,
}

const ChannelsTable : FC<Props> = ({ className, data }) => {
  return (
    <DataTable className={className} columns={columns} data={data}/>
  );
};

export default ChannelsTable;
