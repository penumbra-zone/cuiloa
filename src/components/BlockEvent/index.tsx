import { type BlockResultPayload } from "@/lib/validators/search";
import { type FC } from "react";

interface BlockEventProps {
  blockEvent: BlockResultPayload
}

// TODO: Similar to TransactionEvent, it looks increasingly likely that tanstack/table will actually work here so pulling out different DataTable representations will need to happen.
// TODO: This isn't meaningfully different from TransactionEvent. In fact, I almost re-wrapped that component here rather than
//       re-write the rendering for BlockEvent. What I'm assuming is that there's meaningful info (and lack-of) to tease out from Blocks
//       and providing for that will eventually happen here; otherwise, just re-using the same component will make sense instead of mostly
//       duplicate ui code that shows the exact same information.
const BlockEvent : FC<BlockEventProps> = ({ blockEvent }) => {

  const tx = blockEvent.tx_results.at(0);

  return (
    <div className="bg-white rounded-sm">
      <div className="flex flex-wrap justify-between p-5 gap-y-10 w-full">
        <div className="flex justify-start w-full">
          <p className="w-1/6">Block Height</p>
          <pre>{blockEvent.height.toString()}</pre>
        </div>
        <div className="flex justify-start w-full">
          <p className="w-1/6">Timestamp</p>
          <pre>{blockEvent.created_at}</pre>
        </div>
        <div className="flex flex-col justify-start w-full">
          <p className="w-full">Transaction Event</p>
          {tx !== undefined ? (
            <div className="flex w-full flex-wrap gap-y-5 pl-5 pt-5">
              <div className="flex justify-start w-full">
                <p className="w-1/6">Hash</p>
                <pre>{tx.tx_hash}</pre>
              </div>
              <div className="flex w-full">
                <p className="w-1/6 shrink-0">Transaction Result</p>
                <details>
                  <summary className="list-none underline font-semibold">
                    click to expand
                  </summary>
                  <pre className="break-all whitespace-pre-wrap text-xs p-1 bg-slate-100">{tx.tx_result.data}</pre>
                </details>
              </div>
              <p>Event Attributes</p>
              {blockEvent.events.map(({ attributes }, i) => (
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
            </div>
          ) : (
            <p className="font-semibold">None</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlockEvent;