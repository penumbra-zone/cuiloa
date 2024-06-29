"use client";

import ChannelsTable from "@/components/ibc/channels/ChannelsTable";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const Page = () => {
  const { data , isError } = useQuery({
    queryFn: async () => {
      console.log("Fetching: GET /api/ibc/channels");
      const { data } = await axios.get("/api/ibc/channels");
      console.log("Fetched result:", data);
      // TODO: enforce validation
      return data;
    },
    queryKey: ["IbcChannels"],
    retry: false,
    meta: {
      errorMessage: "Failed to query for IBC Channels. Please try again.",
    },
  });

  if (isError) {
    return (
      <div className="py-5 flex justify-center">
        <h1 className="text-4xl font-semibold">No results found.</h1>
      </div>
    );
  }

  // TODO: clean this up.
  return (
    <div className="bg-primary flex flex-col gap-5 pt-5 items-center">
      <h1 className="sm:text-2xl font-bold">IBC Channels</h1>
      {// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        data ? <ChannelsTable className="sm:w-11/12 w-full" data={data} /> : <p>No results</p>
      }
    </div>
  );
};

export default Page;
