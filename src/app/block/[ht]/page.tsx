"use client";

import { type FC } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BlockResult } from "@/lib/validators/search";

interface PageProps {
  params: {
    ht: string
  }
}

const Page : FC<PageProps> = ({ params }) => {
  const { ht } = params;

  const { data: blockData , isFetched, isError, error} = useQuery({
    queryFn: async () => {
      const { data } = await axios.get(`/api/ht?q=${ht}`);
      const result = BlockResult.safeParse(data);
      if ( result.success ) {
        return result.data;
      } else {
        throw result.error;
      }
    },
    queryKey: ["htQuery"],
    retry: false,
  });

  if ( isError ) {
    return (
      <div>
        <p>Failed to fetch requested transaction.</p>
        <p>Error: {JSON.stringify(error)}</p>
      </div>
    );
  }

  // TODO: Replace with data table component views once those are fleshed out.
  return (
    <div>
      { isFetched ? (
        <div>
          {blockData ? (
            <div className="bg-white rounded-sm">
              <div className="flex p-3">
                <div className="shrink-0 flex flex-col gap-y-10 w-1/5 text-slate-600 text-sm">
                  <div>
                    <p>Block Height</p>
                  </div>
                  <div>
                    <p>Timestamp</p>
                  </div>
                  <div>
                    <p>Transaction Event</p>
                  </div>
                </div>
                <div className="flex flex-col flex-wrap break-words gap-y-9 w-full">
                  <div>
                    <p>{blockData.height.toString()}</p>
                  </div>
                  <div>
                    <p>{blockData.created_at}</p>
                  </div>
                  <div className="w-full">
                    { blockData.tx_results.length !== 0 ? (
                      <div className="flex">
                        <div className="shrink-0 flex flex-col gap-y-10 w-1/6 text-slate-700 text-xs">
                          <div>
                            <p>Hash</p>
                          </div>
                          <div>
                            <p>Result</p>
                          </div>
                          <div>
                            <p>Other Event Attributes</p>
                          </div>
                        </div>
                        <div className="flex flex-col flex-wrap break-words gap-y-9 w-full text-sm">
                          <div>
                            <pre className="whitespace-pre-wrap text-xs">{blockData.tx_results[0].tx_hash}</pre>
                          </div>
                          <div className="break-words w-3/4">
                            <details>
                              <summary className="list-none underline">
                                click to expand
                              </summary>
                              <pre className="whitespace-pre-wrap text-xs">{blockData.tx_results[0].tx_result.data}</pre>
                            </details>
                          </div>
                          <div className="flex flex-col w-full">
                            {blockData.events.map(({ attributes }, i) => (
                              <div key={i} className="w-full">
                                {attributes.map(({ value, key }, j) => (
                                  <div key={j} className="flex justify-between flex-wrap w-full">
                                    <p className="font-semibold">
                                      {key}
                                    </p>
                                    <pre className="break-all whitespace-pre-wrap">{value}</pre>
                                  </div>
                                ))}
                              </div>
                            ))}                        
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p>None</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p>none</p>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Page;