import { type TransactionResultPayload } from "@/lib/validators/search";
import ReactJson from "@microlink/react-json-view";
import { type FC } from "react";

interface TransactionProps {
  txPayload: TransactionResultPayload
}

const Transaction : FC<TransactionProps> = ({ txPayload }) => {
  const [txEvent, penumbraTx] = txPayload;
  return (
    <div className="bg-white rounded-sm">
      <div className="flex flex-wrap justify-between p-5 gap-y-10 w-full">
        <div className="flex justify-start w-full">
          <p className="w-1/6">Hash</p>
          <pre>{txEvent.tx_hash}</pre>
        </div>
        <div className="flex justify-start w-full">
          <p className="w-1/6">Block Height</p>
          <pre>{txEvent.blocks.height.toString()}</pre>
        </div>
        <div className="flex justify-start w-full">
          <p className="w-1/6">Timestamp</p>
          <pre>{txEvent.created_at}</pre>
        </div>
        <div className="flex justify-start w-full">
          <p className="w-1/6 shrink-0">Transaction Data</p>
          <pre className="w-5/6 break-all whitespace-pre-wrap text-xs p-1 bg-slate-100">
            <ReactJson src={penumbraTx.toJson() as object} name={"transaction"} displayDataTypes={false} collapseStringsAfterLength={20} collapsed={5} enableClipboard={true} displayObjectSize={false}/>
          </pre>
        </div>
        <div className="flex flex-wrap justify-start w-full gap-y-5">
          <p className="w-1/6 shrink-0">Event Attributes</p>
          {txEvent.events.map(({ type, attributes }, i) => (
            <div key={i} className="w-full">
              <p className="pl-4">{type}</p>
              {attributes.map(({ value, key }, j) => (
                <div key={j} className="flex justify-start w-full">
                  <p className="font-semibold w-1/5 pl-10">
                    {key}
                  </p>
                  <pre className="whitespace-pre-wrap break-all w-full">{value}</pre>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Transaction;