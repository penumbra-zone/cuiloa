"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const Page = () => {
  const { data, isFetched, isError } = useQuery({
    queryFn: async () => {
      const { data } = await axios.get(`/api/blocks?page=${0}`);
      return data;
    },
    queryKey: ["blocksQuery"],
    retry: false,
  });

  if (isError) {
    return (
      <div>
        <h1 className="text-lg font-bold">Error occurred while querying Blocks data...</h1>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-lg font-bold">Not yet implemented...</h1>
      { isFetched && (Boolean(data)) ? (
        <pre>{JSON.stringify(data)}</pre>
      ) : (
        <p>no data...</p>
      )}
    </div>
  );
};

export default Page;