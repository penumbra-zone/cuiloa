"use client";

import { useStream } from "@/lib/hooks/useStream";
import { QueryService } from "@buf/penumbra-zone_penumbra.connectrpc_es/penumbra/core/component/governance/v1/governance_connect";

const Page = () => {
  // TODO: Figure out loading, passing error, etc

  const { data , isError, error } = useStream({...QueryService.methods.proposalList, service: {typeName: QueryService.typeName}});
  if (isError) {
    console.log("Error:", error);
    return (
      <div className="py-5 flex justify-center">
        <h1 className="text-4xl font-semibold">No results found.</h1>
      </div>
    );
  }

  if (!(data?.done ?? false)) {
    return (
      <div className="py-5 flex justify-center">
        <h1 className="text-4xl font-semibold">Please Be Patient With Me, I Am Loading.</h1>
      </div>
    );
  } else {
    console.log("Done loading!");
    return (
      <div className="flex flex-col gap-5 pt-5">
        <h1 className="sm:text-2xl font-bold self-center">Proposal List</h1>
        <pre>{JSON.stringify(data, undefined, 2)}</pre>
      </div>
    );
  }
};

export default Page;
