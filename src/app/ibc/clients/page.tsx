"use client";
import ClientsTable from "@/components/ibc/clients/ClientsTable";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const Page = () => {
  const { data , isFetched, isError } = useQuery({
    queryFn: async () => {
      console.log("Fetching: GET /api/ibc/clients");
      const { data } = await axios.get("/api/ibc/clients");
      console.log("Fetched result:", data);
      // TODO: enforce validation
      return data;
    },
    queryKey: ["IbcClients"],
    retry: false,
    meta: {
      errorMessage: "Failed to query for IBC Clients. Please try again.",
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
        <div className="flex flex-col gap-5 pt-5 items-center">
          <h1 className="sm:text-2xl font-bold">IBC Clients</h1>
        {// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        data  ? (
          <ClientsTable className="sm:w-11/12 w-full" data={data}/>
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