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
    <div className="bg-white rounded-sm shadow-md">
      <div className="flex flex-wrap justify-between sm:p-5 p-2 sm:gap-y-10 gap-y-5 w-full">
        <div className="flex flex-wrap justify-start w-full">
          <p className="sm:w-1/6 w-full font-semibold">Block Height</p>
          <pre className="sm:w-0 w-full">{blockData.height.toString()}</pre>
        </div>
        <div className="flex flex-wrap justify-start w-full">
          <p className="w-1/6 font-semibold">Timestamp</p>
          <pre className="sm:w-0 w-full">{blockData.created_at}</pre>
        </div>
        <div className="flex justify-start flex-wrap w-full">
          <p className="sm:w-1/6 w-full font-bold">Transactions</p>
          {/* eslint-disable-next-line @typescript-eslint/naming-convention */}
          {blockData.tx_results.length !== 0 ? blockData.tx_results.map(({ tx_hash }, i) => (
              <Link href={`/transaction/${tx_hash}`} key={i}><pre className="underline sm:max-w-full max-w-[200px] overflow-hidden overflow-ellipsis sm:text-base">{tx_hash}</pre></Link>
          )) : <p className="sm:w-0 w-full overflow-hidden text-ellipsis">None</p>}
        </div>
        <div className="flex justify-start flex-wrap w-full">
          <p className="font-bold text-base">Block Event Attributes</p>
          {abciEvents.length !== 0 ? abciEvents.map(({ type, attributes }, i) => (
            <div key={i} className="flex flex-col sm:items-start items-center w-full gap-y-1">
              <p className="font-mono whitespace-pre-wrap break-all sm:text-base text-sm pt-5">{type}</p>
              <ABCIEventsTable className="sm:w-2/3 w-full" data={attributes}/>
            </div>
          )) : <p>None</p>}
        </div>
      </div>
    </div>
  );
};

export default Block;