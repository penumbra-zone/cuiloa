import { type TransactionResultPayload } from "@/lib/validators/search";
import { JsonView, allExpanded, defaultStyles } from "react-json-view-lite";
import "react-json-view-lite/dist/index.css";
import Link from "next/link";
import { type FC } from "react";
import ABCIEventsTable from "../ABCIEventsTable";
import { TransactionView } from "../TransactionView";
import { ibcRegistry } from "@/lib/protobuf";

interface TransactionProps {
  txData: TransactionResultPayload
}

const Transaction : FC<TransactionProps> = ({ txData }) => {
  const [txResult, penumbraTx] = txData;
  const abciEvents = txResult.events;

  return (
    <div className="bg-white rounded-sm shadow-md">
      <div className="flex flex-wrap justify-between sm:p-5 p-2 sm:gap-y-10 gap-y-5 w-full">
        <div className="flex flex-wrap justify-start w-full">
          <p className="sm:w-1/6 w-full sm:text-lg font-semibold">Hash</p>
          {/* TODO: this width on smaller screens is pretty arbitrary and there's a few instances of this now through the codebase. revisit and implement as consistent tailwind variables. */}
          {/* TODO: also at the point where JS should be used for copying to clipboard which mitigates most text overflow issues and opens up stylings for improvement. */}
          <pre className="sm:w-5/6 w-[300px] sm:text-lg break-all whitespace-pre-wrap">{txResult.tx_hash}</pre>
        </div>
        <div className="flex flex-wrap justify-start w-full">
          <p className="sm:w-1/6 w-full sm:text-lg font-semibold">Block Height</p>
          <Link href={`/block/${txResult.height}`}><pre className="underline sm:w-0 sm:text-lg w-full">{txResult.height.toString()}</pre></Link>
        </div>
        <div className="flex flex-wrap justify-start w-full">
          <p className="sm:w-1/6 w-full sm:text-lg font-semibold">Timestamp</p>
          <pre className="sm:w-0 w-full sm:text-lg">{txResult.created_at}</pre>
        </div>
        <div className="flex flex-wrap justify-start w-full">
          <p className="sm:w-1/6 sm:shrink-0 w-full sm:text-lg font-semibold">Transaction Data</p>
          <pre className="sm:w-5/6 w-full break-all whitespace-pre-wrap text-xs p-1 bg-slate-100">
            <JsonView data={penumbraTx.toJson({ typeRegistry: ibcRegistry }) as object} shouldExpandNode={allExpanded} clickToExpandNode={true} style={defaultStyles}/>
          </pre>
        </div>
        <div className="flex justify-start flex-wrap w-full gap-y-5">
          <p className="sm:text-lg font-semibold">Block Event Attributes</p>
          {abciEvents.length !== 0 ? abciEvents.map(({ type, attributes }, i) => (
            <div key={i} className="flex flex-col sm:items-start items-center w-full gap-y-1">
              <ABCIEventsTable className="sm:w-2/3 w-full" type={type} attributes={attributes}/>
            </div>
          )) : <p>None</p>}
        </div>
        <TransactionView tx={penumbraTx}/>
      </div>
    </div>
  );
};

export default Transaction;
