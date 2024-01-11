"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { type FC } from "react";

interface PageProps {
  params: {
    id: string
  }
}

const Page : FC<PageProps> = ({ params }) => {
  const { id } = params;
  const { data , isFetched, isError } = useQuery({
    queryFn: async () => {
      console.log("Fetching: GET /api/ibc/client");
      const { data } = await axios.get(`/api/ibc/client?q=${id}`);
      console.log("Fetched result:", data);
      return data;
      // TODO: enforce validation
      // const result = IbcClientValidator.safeParse(data);
      // if (result.success) {
      // ...
    },
    queryKey: ["IbcClient", id],
    retry: false,
    meta: {
      errorMessage: "Failed to query IBC Client by id. Please try again.",
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
          <h1 className="text-3xl mx-auto py-5 font-semibold">IBC Client</h1>
        {// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        data  ? (
          <div className="flex flex-col justify-center w-full">
            <pre>{JSON.stringify(data)}</pre>
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