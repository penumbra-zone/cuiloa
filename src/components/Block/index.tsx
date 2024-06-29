import { type BlockDataPayload } from "@/lib/validators/search";
import Link from "next/link";
import { type FC } from "react";
import ABCIEventsTable from "../ABCIEventsTable";


interface BlockProps extends BlockDataPayload {
  height: string
}

// TODO: Similar to TransactionEvent, it looks increasingly likely that tanstack/table will actually work here so pulling out different DataTable representations will need to happen.
const Block : FC<BlockProps> = ({ height, created_at, tx_hashes, events }) => {
  return (
    <div>
      <div className="flex flex-wrap justify-between sm:p-5 p-2 sm:gap-y-10 gap-y-5 w-full">
        <div className="flex flex-wrap justify-start w-full">
          <p className="sm:w-1/6 w-full font-semibold">Block Height</p>
          <pre className="sm:w-0 w-full">{height}</pre>
        </div>
        <div className="flex flex-wrap justify-start w-full">
          <p className="w-1/6 font-semibold">Timestamp</p>
          <pre className="sm:w-0 w-full">{created_at}</pre>
        </div>
        <div className="flex justify-start flex-wrap w-full">
          <p className="sm:w-1/6 w-full font-bold">Transactions</p>
          {/* eslint-disable-next-line @typescript-eslint/naming-convention */}
          {tx_hashes.length !== 0 ? tx_hashes.map((hash, i) => (
              <Link href={`/transaction/${hash}`} key={i}><pre className="underline sm:max-w-full max-w-[200px] overflow-hidden overflow-ellipsis sm:text-base">{hash}</pre></Link>
          )) : <p className="sm:w-0 w-full overflow-hidden text-ellipsis">None</p>}
        </div>
        <div className="flex justify-start flex-wrap w-full gap-y-5">
          <p className="font-bold text-base">Block Event Attributes</p>
          {events.length !== 0 ? events.map(({ type, attributes }, i) => (
            <div key={i} className="flex flex-col sm:items-start items-center w-full gap-y-1">
              <ABCIEventsTable className="sm:w-2/3 w-full" type={type} attributes={attributes}/>
            </div>
          )) : <p>None</p>}
        </div>
      </div>
    </div>
  );
};

export default Block;
