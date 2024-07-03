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

  const { data: blockData , isError, isPending, isSuccess } = useQuery({
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

  if (isPending) {
    return (
      <div className="bg-primary rounded-sm shadow-md">
        <h1 className="text-lg font-semibold">Loading...</h1>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-primary py-5 flex justify-center">
        <h1 className="text-4xl font-semibold">No results found.</h1>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="bg-primary rounded-sm shadow-md">
        <div className="flex flex-col gap-5 pt-5 items-center">
          <h1 className="sm:text-2xl text-lg font-bold">Block Summary</h1>
          <div className="sm:w-11/12 w-full">
            <Block height={ht} {...blockData}/>
          </div>
        </div>
      </div>
    );
  }
};

export default Page;
