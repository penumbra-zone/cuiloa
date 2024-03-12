import { type BlockDataPayload } from "@/lib/validators/search";
import Link from "next/link";
// import ReactJson from "@microlink/react-json-view";
import { type FC } from "react";

interface BlockEventProps {
  blockData: BlockDataPayload,
}

// TODO: Similar to TransactionEvent, it looks increasingly likely that tanstack/table will actually work here so pulling out different DataTable representations will need to happen.
const Block : FC<BlockEventProps> = ({ blockData }) => {

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
        <div className="flex flex-col justify-start w-full">
        <p>Block Event Attributes</p>
              {blockData.events.map(({ attributes }, i) => (
                <div key={i} className="w-full">
                  {attributes.map(({ value, key }, j) => (
                    <div key={j} className="flex justify-start flex-wrap w-full">
                      <p className="w-1/6">
                        {key}
                      </p>
                      <pre className="break-all whitespace-pre-wrap w-5/6">{value}</pre>
                    </div>
                  ))}
                </div>
              ))}
        <p>Transactions</p>
              {/* eslint-disable-next-line @typescript-eslint/naming-convention */}
              {blockData.tx_results.map(({ tx_hash }, i) => (
                <div key={i} className="w-full">
                  <div className="flex justify-start flex-wrap w-full">
                    <p className="w-1/6">
                      hash
                    </p>
                    <Link href={`/transaction/${tx_hash}`}><pre className="underline break-all whitespace-pre-wrap w-5/6">{tx_hash}</pre></Link>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default Block;