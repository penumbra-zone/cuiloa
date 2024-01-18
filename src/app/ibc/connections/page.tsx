"use client";

import ConnectionsTable from "@/components/ibc/connections/ConnectionsTable";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const Page = () => {
  const { data , isFetched, isError } = useQuery({
    queryFn: async () => {
      console.log("Fetching: GET /api/ibc/connections");
      const { data } = await axios.get("/api/ibc/connections");
      console.log("Fetched result:", data);
      // TODO: enforce validation
      return data;
    },
    queryKey: ["IbcConnections"],
    retry: false,
    meta: {
      errorMessage: "Failed to query for IBC Connections. Please try again.",
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
          <h1 className="text-3xl mx-auto py-5 font-semibold">IBC Connections</h1>
        {// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        data  ? (
          <div className="flex flex-col justify-center w-full">
            <ConnectionsTable data={data} />
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
