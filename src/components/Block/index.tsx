import { type BlockDataPayload } from "@/lib/validators/search";
import Link from "next/link";
// import ReactJson from "@microlink/react-json-view";
import { type FC } from "react";
import ABCIEventsTable from "../ABCIEventsTable";

interface BlockEventProps {
  blockData: BlockDataPayload,
}

// TODO: Similar to TransactionEvent, it looks increasingly likely that tanstack/table will actually work here so pulling out different DataTable representations will need to happen.
const Block : FC<BlockEventProps> = ({ blockData }) => {
  const abciEvents = blockData.events;

  return (
    <div className="bg-white rounded-sm">
      <div className="flex flex-wrap justify-between p-5 gap-y-10 w-full">
        <div className="flex justify-start w-full">
          <p className="w-1/6">Block Height</p>
          <pre>{blockData.height.toString()}</pre>
        </div>
        <div className="flex justify-start w-full">
          <p className="w-1/6">Timestamp</p>
          <pre>{blockData.created_at}</pre>
        </div>
        <div className="flex justify-start w-full">
          <p className="w-1/6">Transactions</p>
          {/* eslint-disable-next-line @typescript-eslint/naming-convention */}
          {blockData.tx_results.map(({ tx_hash }, i) => (
            // <div key={i} className="w-full">
              <Link href={`/transaction/${tx_hash}`} key={i}><pre className="underline break-all whitespace-pre-wrap">{tx_hash}</pre></Link>
            // </div>
          ))}
        </div>
        <div className="flex flex-col items-center gap-5 w-full">
          <p className="font-semibold">Block Event Attributes</p>
          <ABCIEventsTable className="w-full" data={abciEvents}/>
        </div>
      </div>
    </div>
  );
};

export default Block;