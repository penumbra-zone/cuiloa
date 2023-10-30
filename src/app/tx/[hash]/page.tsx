"use client";

import { useEffect, type FC } from "react";
import { useQuery } from "@tanstack/react-query";
import { TransactionResult } from "@/lib/validators/search";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

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
  return (
    <div>
      {isFetched ? (
        <div>
        { txData ? (
          <div className="bg-white rounded-sm">
          <div className="flex p-3">
            <div className="shrink-0 flex flex-col gap-y-10 w-1/6 text-slate-600 text-sm">
              <div>
                <p>Hash</p>
              </div>
              <div>
                <p>Block Height</p>
              </div>
              <div>
                <p>Transaction Result</p>
              </div>
              <div>
                <p>Timestamp</p>
              </div>
              <div>
                <p>Note Commitments</p>
              </div>
              <div>
                <p>Other</p>
              </div>
              {/* <pre>{JSON.stringify(txData, null, 2)}</pre> */}
            </div>
            <div className="flex flex-col flex-wrap break-words gap-y-9 w-5/6">
              <div>
                <pre>{txData.tx_hash}</pre>
              </div>
              <div>
                <p>{txData.blocks.height.toString()}</p>
              </div>
              <div className="break-words w-3/4">
                <details>
                  <summary className="list-none underline">
                    click to expand
                  </summary>
                  <pre className="whitespace-pre-wrap text-xs">{txData.tx_result.data}</pre>
                </details>
              </div>
              <div>
                <p>{txData.created_at}</p>
              </div>
              <div>
                {txData.events.filter((v) => v.type === "action_output").map((v, i) => (
                  <div key={i}>
                    <pre>{v.attributes[0].value}</pre>
                  </div>
                ))}
              </div>
              <div className="flex flex-col w-full">
                {txData.events.filter((v) => v.type !== "action_output").map(({ type, attributes }, i) => (
                    <div key={i} className="w-full">
                        {attributes.map(({ value, key }, j) => (
                          <div key={j} className="flex justify-between flex-wrap w-full">
                            <p className="font-semibold">
                              {key}
                            </p>
                            <pre className="whitespace-pre-wrap break-all">{value}</pre>
                          </div>
                        ))}
                    </div>
                  ))}
              </div>
            </div>
          </div>
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
