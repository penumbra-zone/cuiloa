import { type TransactionResultPayload } from "@/lib/validators/search";
import ReactJson from "@microlink/react-json-view";
import Link from "next/link";
import { type FC } from "react";
import ABCIEventsTable from "../ABCIEventsTable";

interface TransactionProps {
  txData: TransactionResultPayload
}

const Transaction : FC<TransactionProps> = ({ txData }) => {
  const [txResult, penumbraTx] = txData;
  const abciEvents = txResult.events;
  return (
    <div className="bg-white rounded-sm">
      <div className="flex flex-wrap justify-between p-5 gap-y-10 w-full">
        <div className="flex justify-start w-full">
          <p className="w-1/6">Hash</p>
          <pre>{txResult.tx_hash}</pre>
        </div>
        <div className="flex justify-start w-full">
          <p className="w-1/6">Block Height</p>
          <Link href={`/block/${txResult.blocks.height}`}><pre className="underline">{txResult.blocks.height.toString()}</pre></Link>
        </div>
        <div className="flex justify-start w-full">
          <p className="w-1/6">Timestamp</p>
          <pre>{txResult.created_at}</pre>
        </div>
        <div className="flex justify-start w-full">
          <p className="w-1/6 shrink-0">Transaction Data</p>
          <pre className="w-5/6 break-all whitespace-pre-wrap text-xs p-1 bg-slate-100">
            <ReactJson src={penumbraTx.toJson() as object} name={"transaction"} displayDataTypes={false} collapseStringsAfterLength={20} collapsed={5} enableClipboard={true} displayObjectSize={false}/>
          </pre>
        </div>
        <div className="flex flex-col items-center gap-5 w-full">
          <p className="font-semibold">Event Attributes</p>
          <ABCIEventsTable className="w-full" data={abciEvents}/>
        </div>
      </div>
    </div>
  );
};

export default Transaction;