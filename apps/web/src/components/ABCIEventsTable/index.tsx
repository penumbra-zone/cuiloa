import { makeColumns } from "./columns";
import { type FC } from "react";
import { AttributeTable } from "../ui/attribute-table";

interface Props {
  className?: string,
  type: string,
  attributes: Array<{
    key: string,
    value: string | null,
  }>,
}

const ABCIEventsTable : FC<Props> = ({ className, type, attributes }) => {
  const columns = makeColumns(type);
  return (
    <AttributeTable className={className ?? ""} header={type} columns={columns} data={attributes}/>
  );
};

export default ABCIEventsTable;