"use client";

import ChannelsTable from "@/components/ibc/channels/ChannelsTable";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const Page = () => {
  const { data , isFetched, isError } = useQuery({
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

  return (
    <div>
      {isFetched ? (
        <div>
          <h1 className="text-3xl mx-auto py-5 font-semibold">IBC Channels</h1>
        {// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        data  ? (
          <div className="flex flex-col justify-center w-full">
            <ChannelsTable data={data} />
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
