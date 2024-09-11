"use client";

import { columns as blocksColumns} from "@/components/BlocksTable/columns";
import { columns as transactionsColumns } from "@/components/TransactionsTable/columns";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DataTable } from "../ui/data-table";
import { getBlocks } from "@/components/BlocksTable/getBlocks";
import { getTransactions } from "../TransactionsTable/getTransactions";
import { cn } from "@/lib/utils";

export interface QueryOptions {
  pageIndex: number,
  pageSize: number,
}

interface PreviewTableProps {
  className?: string,
  queryName: "BlocksTable" | "TransactionsTable",
  pageIndex: number,
  endpoint: string,
  errorMessage: string,
}

// TODO: Unbelievably gross stuff that needs to be parameterized later.
// TODO: It would be nice to have a tagged union type that allows narrowing instead of all the gross stuff up to this point.
//       In addition to that, however, is the need to resolve the slices below. The current APIs do an integer check for offsets
//       that prevent values below 10. It really shouldn't be an issue but it would be nice to do something better than this.
export function PreviewTable ({
  className,
  queryName,
  pageIndex = 0,
  endpoint,
  errorMessage,
} : PreviewTableProps) {

  const getFn  = queryName === "BlocksTable" ? getBlocks : getTransactions;

  const { data } : {
    data : {
      pages: number;
      results: {
        height: bigint;
        created_at: string;
      }[];
    } | {
      pages: number;
      results: {
        height: bigint;
        created_at: string;
        tx_hash: string;
      }[];
    }
  } = useSuspenseQuery({
    queryKey: [queryName, pageIndex],
    queryFn: () => getFn({ endpoint, pageIndex, cached: false }),
    // staleTime: 0,
    // refresh preview data every 15 seconds
    refetchInterval: 10 * 1000,
    meta: {
      errorMessage,
    },
  });

  const { results } = data ?? { pages: 0, results: []};

  // Checks only necessary for safely enforcing type. See todo comment above.
  if (queryName === "BlocksTable") {
    const tableData = results as {
      height: bigint,
      created_at: string,
    }[];

    return (
      <div className={cn("", className)}>
        <DataTable data={tableData.slice(0,3)} columns={blocksColumns}/>
      </div>
    );
  } else {

    const tableData = results as {
      height: bigint,
      created_at: string,
      tx_hash: string
    }[];

    return (
      <div className={cn("overflow-auto", className)}>
        <DataTable data={tableData.slice(0,3)} columns={transactionsColumns}/>
      </div>
    );
  }
};
