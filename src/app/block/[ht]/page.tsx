"use client";

import { type FC } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BlockData } from "@/lib/validators/search";
import Block from "@/components/Block";

interface PageProps {
  params: {
    ht: string
  }
}

const Page : FC<PageProps> = ({ params }) => {
  const { ht } = params;

  const { data: blockData , isFetched, isError } = useQuery({
    queryFn: async () => {
      console.log(`Fetching: GET /api/block?q=${ht}`);
      const { data } = await axios.get(`/api/block?q=${ht}`);
      console.log("Fetching result:", data);
      const result = BlockData.safeParse(data);
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error.message);
      }
    },
    queryKey: ["htQuery", ht],
    retry: false,
    meta: {
      errorMessage: "Failed to find block event with provided height. Please check height or try a different query.",
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
  return (
    <div>
      {isFetched ? (
        <div>
          {blockData ? (
          <div className="flex flex-col gap-5 pt-5 items-center">
            <h1 className="sm:text-2xl font-bold">Block Summary</h1>
            <div className="sm:w-11/12 w-full">
              <Block blockData={blockData}/>
            </div>
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