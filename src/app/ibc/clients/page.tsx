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
      return data;
      // const result = SearchResultValidator.safeParse(data);
      // if (result.success) {
      //   console.log(result.data);
      //   return result.data;
      // } else {
      //   throw new Error(result.error.message);
      // }
    },
    queryKey: ["IBCClients"],
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
        <div>
          <h1 className="text-3xl mx-auto py-5 font-semibold">IBC Clients</h1>
        {// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        data  ? (
          <div className="flex flex-col justify-center w-full">
            <ClientsTable data={data}/>
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