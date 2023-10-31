"use client";

import { useEffect, type FC } from "react";
import { useQuery } from "@tanstack/react-query";
import { TransactionResult } from "@/lib/validators/search";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import TransactionEvent from "@/components/TransactionEvent";

interface PageProps {
  params: {
    hash: string
  }
}

// TODO: this entire page could probably be rendered statically on the server via layout.ts & some minor optimization via tanstack query context.
const Page : FC<PageProps> = ({ params }) => {
  const { hash } = params;
  const { toast } = useToast();

  const { data: txData , isFetched, isError } = useQuery({
    queryFn: async () => {
      const { data } = await axios.get(`/api/tx?q=${hash}`);
      const result = TransactionResult.safeParse(data);
      if ( result.success ) {
        return result.data;
      } else {
        throw new Error(result.error.message);
      }
    },
    queryKey: ["txQuery", hash],
    retry: false,
  });

  // TODO: This is a hack of a compromise right now for the following reasons:
  //       1. Ideally, want to descriminate the error message where relevant to the end user (input error vs server error, etc).
  //       2. Doing this in queryFn is messy and doing it for every client useQuery is even messier
  //       3. However, not doing error refinement in useQuery results in a re-render error as the page state is resolved.
  //       Until error refinement is nailed down, useEffect delays the error toast to avoid re-render runtime errors.
  useEffect(() => {
    if (isError) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to find transaction event with provided hash. Please check hash or try a different query.",
      });
    }
  }, [isError]);

  if ( isError ) {
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
        { txData ? (
          <div className="flex flex-col justify-center w-full">
            <h1 className="text-3xl mx-auto py-5 font-semibold">Transaction Event Summary</h1>
            <TransactionEvent txEvent={txData} />
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
