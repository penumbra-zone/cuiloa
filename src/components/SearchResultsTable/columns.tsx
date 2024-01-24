"use client";

// import { QueryKind } from "@/lib/validators/search";
import { type ColumnDef } from "@tanstack/react-table";
// import Link from "next/link";
import { type RelatedQuery, type SearchResult } from ".";
import Link from "next/link";


type SearchResultsColumns = SearchResult;

export const columns : Array<ColumnDef<SearchResultsColumns>> = [
  {
    accessorKey: "kind",
    header: () => <div className="font-semibold text-gray-800">Kind</div>,
    cell: ({ row }) => {
      const kind : string = row.getValue("kind");
      return <p className="">{kind}</p>;
    },
  },
  {
    accessorKey: "identifier",
    header: () => <div className="font-semibold text-gray-800 text-center">ID</div>,
    cell: ({ row }) => {
      const identifier : string = row.getValue("identifier");
      const kind : string = row.getValue("kind");
      const prefix = kind === "TX_HASH" ? "/transaction" : (kind === "BLOCK_HEIGHT" ? "/block" : (kind === "IBC_CLIENT" ? "/ibc/client" : (kind === "IBC_CHANNEL" ? "/ibc/channel" : "/ibc/connection")));
      return <Link href={`${prefix}/${identifier}`}><p className="text-xs text-center underline">{identifier}</p></Link>;
    },
  },
  {
    id: "related",
    accessorKey: "related",
    header: () => <div className="font-semibold text-gray-800 text-center">Related Queries</div>,
    cell: ({ row }) => {
      console.log(row);
      // const kind : string = row.getValue("kind");
      const related : RelatedQuery[] | undefined = row.getValue("related");
      // TODO: Do some kind of convenient formatting that better signals what is being shown to the user
      // if (kind === QueryKind.BlockHeight) {
      //   const height: bigint = row.getValue("value");
      //   return <Link href={`/block/${height}`} className="underline">{height.toString()}</Link>;
      // } else if (kind === QueryKind.TxHash) {
      //   const txHash: string = row.getValue("value");
      //   return <Link href={`/transaction/${txHash}`} className="underline">{txHash}</Link>;
      // }
      if (related !== undefined) {
        return (
        <ul>
          {/* {related.map(({ type, indentifier }, i) => <li key={i}>{type} : {indentifier}</li>)} */}
          {related.map(({ type, identifier }, i) => {
            return <li key={i}>{type}: <Link href={`/transaction/${identifier}`}><p className="underline">{identifier}</p></Link></li>;
          })
          }
        </ul>
        );
      }
      return <div>None</div>;
    },
  },
];