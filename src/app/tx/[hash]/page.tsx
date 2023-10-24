"use client";

import { type FC } from "react";
import { useQuery } from "@tanstack/react-query";
import { TransactionResult } from "@/lib/validators/search";
import axios from "axios";

interface PageProps {
  params: {
    hash: string
  }
}

// TODO: this entire page could probably be rendered statically on the server via layout.ts & some minor optimization via tanstack query context.
const Page : FC<PageProps> = ({ params }) => {
  const { hash } = params;

  const { data: txData , isFetched, isError, error} = useQuery({
    queryFn: async () => {
      const { data } = await axios.get(`/api/tx?q=${hash}`);
      const result = TransactionResult.safeParse(data);

      if ( result.success ) {
        return result.data;
      } else {
        throw result.error;
      }
    },
    queryKey: ["txQuery"],
    retry: false,
  });

  // TODO: integrate (enumerated?) toast errors rather than this mess.
  if ( isError ) {
    return (
      <div>
        <p>Failed to fetch requested transaction.</p>
        <p>Error: {JSON.stringify(error)}</p>
      </div>
    );
  }

  // TODO: Replace with data table component views once those are fleshed out.
  return (
    <div>
      {isFetched ? (
        <div>
        { txData ? (
          <div className="bg-white rounded-sm">
          <div className="flex p-3">
            <div className="shrink-0 flex flex-col gap-y-10 w-1/5 text-slate-600 text-sm">
              <div>
                <p>Hash</p>
              </div>
              <div>
                <p>Block Height</p>
              </div>
              <div>
                <p>Transaction Result</p>
              </div>
              <div>
                <p>Timestamp</p>
              </div>
              <div>
                <p>Note Commitments</p>
              </div>
              <div>
                <p>Other</p>
              </div>
              {/* <pre>{JSON.stringify(txData, null, 2)}</pre> */}
            </div>
            <div className="flex flex-col flex-wrap break-words gap-y-9 w-full">
              <div>
                <pre>{txData.tx_hash}</pre>
              </div>
              <div>
                <p>{txData.blocks.height.toString()}</p>
              </div>
              <div className="break-words w-3/4">
                <details>
                  <summary className="list-none underline">
                    click to expand
                  </summary>
                  <pre className="whitespace-pre-wrap text-xs">{txData.tx_result.data}</pre>
                </details>
              </div>
              <div>
                <p>{typeof txData.created_at}</p>
              </div>
              <div>
                {txData.events.filter((v) => v.type === "action_output").map((v, i) => (
                  <div key={i}>
                    <pre>{v.attributes[0].value}</pre>
                  </div>
                ))}
              </div>
              <div>
                {txData.events.filter((v) => v.type !== "action_output").map((v, i) => (
                    <div key={i} className="flex justify-between">
                      <p className="font-semibold">
                        {v.attributes[0].key}
                      </p>
                      <pre className="whitespace-pre-wrap">{v.attributes[0].value}</pre>
                    </div>
                  ))}
              </div>
            </div>
          </div>
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

// {isFetched ? (
//   <div className="bg-white rounded-sm">
//     <div className="flex p-3">
//       <div className="shrink-0 flex flex-col gap-y-10 w-1/5 text-slate-600 text-sm">
//         <div>
//           <p>Hash</p>
//         </div>
//         <div>
//           <p>Block Height</p>
//         </div>
//         <div>
//           <p>Transaction Result</p>
//         </div>
//         <div>
//           <p>Timestamp</p>
//         </div>
//         <div>
//           <p>Note Commitments</p>
//         </div>
//         <div>
//           <p>Other</p>
//         </div>
//         {/* <pre>{JSON.stringify(txData, null, 2)}</pre> */}
//       </div>
//       <div className="flex flex-col flex-wrap break-words gap-y-9 w-full">
//         <div>
//           <pre>{txData.tx_hash}</pre>
//         </div>
//         <div>
//           <p>{txData.blocks.height.toString()}</p>
//         </div>
//         <div className="break-words w-3/4">
//           <details>
//             <summary className="list-none underline">
//               click to expand
//             </summary>
//             <pre className="whitespace-pre-wrap text-xs">{txData.tx_result}</pre>
//           </details>
//         </div>
//         <div>
//           <p>{txData.created_at.toTimeString()}</p>
//         </div>
//         <div>
//           {txData.events.filter((v) => v.type === "action_output").map((v, i) => (
//             <div key={i}>
//               <pre>{v.attributes[0].value}</pre>
//             </div>
//           ))}
//         </div>
//         <div>
//           {txData.events.filter((v) => v.type !== "action_output").map((v, i) => (
//               <div key={i} className="flex justify-between">
//                 <p className="font-semibold">
//                   {v.attributes[0].key}
//                 </p>
//                 <pre className="whitespace-pre-wrap">{v.attributes[0].value}</pre>
//               </div>
//             ))}
//         </div>
//       </div>
//     </div>
//   </div>
// ) : (
//   <p>Loading...</p>
// )}