"use client";

import { type FC } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

interface PageProps {
  params: {
    id: string,
  }
}

const Page : FC<PageProps> = ({ params }) => {
  const { id: channelId } = params;
  const { data, isFetched, isError } = useQuery({
    queryFn: async () => {
      console.log(`Fetching: GET /api/ibc/channel/${channelId}`);
      const { data } = await axios.get(`/api/ibc/channel?q=${channelId}`);
      console.log("Fetched result:", data);
      return data;
      // TODO: enforce validation
      // const result = IbcChannelValidator.safeParse(data);
    },
    queryKey: ["IbcChannel", channelId],
    retry: false,
    meta: {
      errorMessage: "Failed to query IBC Channel by id. Please try again.",
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
          <h1 className="text-3xl mx-auto py-5 font-semibold">IBC Channel</h1>
        {// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        data  ? (
          <div className="flex flex-col justify-center w-full">
            <pre>{JSON.stringify(data, undefined, 2)}</pre>
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