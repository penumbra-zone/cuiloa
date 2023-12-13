"use client";

import { type FC } from "react";
import { useQuery } from "@tanstack/react-query";
import { TransactionResult } from "@/lib/validators/search";
import axios from "axios";
import Transaction from "@/components/Transaction";

interface PageProps {
  params: {
    hash: string
  }
}

// TODO: this entire page could probably be rendered statically on the server via layout.ts & some minor optimization via tanstack query context.
const Page : FC<PageProps> = ({ params }) => {
  const { hash } = params;

  const { data: txData , isFetched, isError } = useQuery({
    queryFn: async () => {
      console.log(`Fetching: GET /api/tx?q=${hash}`);
      const { data } = await axios.get(`/api/tx?q=${hash}`);
      console.log("Fetched result:", data);
      const result = TransactionResult.safeParse(data);
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error.message);
      }
    },
    queryKey: ["txQuery", hash],
    retry: false,
    meta: {
      errorMessage: "Failed to find transaction event with provided hash. Please check hash or try a different query.",
    },
  });

  if (isError) {
    return (
      <div className="py-5 flex justify-center">
        <h1 className="text-4xl font-semibold">No results found.</h1>
      </div>
    );
  }

  // TODO: Replace with data table component views once those are fleshed out.
  // TODO: add Suspense
  return (
    <div>
      {isFetched ? (
        <div>
        {txData ? (
          <div className="flex flex-col justify-center w-full">
            <h1 className="text-3xl mx-auto py-5 font-semibold">Transaction Event Summary</h1>
            <Transaction txPayload={txData} />
          </div>
        ) : (
          <p>No results</p>
        )}
       </div>
      ) : (
        <p>loading...</p>
      )}
    </div>
  );
};

export default Page;
