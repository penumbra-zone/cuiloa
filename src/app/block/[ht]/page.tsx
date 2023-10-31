"use client";

import { useEffect, type FC } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BlockResult } from "@/lib/validators/search";
import { toast } from "@/components/ui/use-toast";
import BlockEvent from "@/components/BlockEvent";

interface PageProps {
  params: {
    ht: string
  }
}

const Page : FC<PageProps> = ({ params }) => {
  const { ht } = params;

  const { data: blockData , isFetched, isError } = useQuery({
    queryFn: async () => {
      const { data } = await axios.get(`/api/ht?q=${ht}`);
      const result = BlockResult.safeParse(data);
      if ( result.success ) {
        return result.data;
      } else {
        throw new Error(result.error.message);
      }
    },
    queryKey: ["htQuery", ht],
    retry: false,
  });

  useEffect(() => {
    if (isError) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to find block event with provided height. Please check height or try a different query.",
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
      { isFetched ? (
        <div>
          {blockData ? (
          <div className="flex flex-col justify-center w-full">
            <h1 className="text-3xl mx-auto py-5 font-semibold">Block Summary</h1>
            <BlockEvent blockEvent={blockData}/>
          </div>
          ) : (
            <div>
              <p className="font-semibold">No block event</p>
              <p>To be frank... You shouldn&apos;t be able to see this.</p>
            </div>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Page;