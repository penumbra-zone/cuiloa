"use client";

import Script from "next/script";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { FC, useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";

export const TwitterEmbed: FC<{ className?: string }> = ({ className }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // This useEffect is basically a hack to allow somekind of UI indication that an element is being loaded.
    // Complete and totally inadequate hack to cope with the fact that twitter is a zombie social media company.
    // The timeline embed is completely broken and does not respect requests to limit the total number of posts loaded.
    // As a result, this embed adds an additional ***~20mb*** to the page load. This is why we delay it.
    function checkIframeLoaded() {
      // Get a handle to the iframe element
      const iframeDiv = document.getElementsByClassName("twitter-timeline-rendered");
      if (iframeDiv === undefined || iframeDiv.length === 0 ) {
        // Nothing loaded yet, wait.
        window.setTimeout(checkIframeLoaded, 1000);
      } else {
        // console.log(iframeDiv);
        // Check if the iframe element itself is loaded yet
        const iframeDoc = document.getElementById("twitter-widget-0");
        if (iframeDoc === undefined) {
          window.setTimeout(checkIframeLoaded, 1000);
        } else {
          // Completely arbitrary. Seems to work OK on simulated low band 4g connections.
          window.setTimeout(() => setLoaded(true), 5000);
          return;
        }
      }
    }
    checkIframeLoaded();
  }, []);

  return (
    <Card className={cn("bg-card/60", className)}>
      <CardHeader className="flex justify-center">
        <CardTitle className="text-lg font-medium">
          <span className="font-mono font-bold">@penumbrazone</span> on Twitter
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 h-[320px]">
        <div className="grid grid-cols-1 grid-rows-1">
          <div className="col-span-1 row-span-1 col-start-1 row-start-1">
            <Link
              id="twitter-tl"
              className={cn("twitter-timeline")}
              data-tweet-limit={5}
              data-limit="5"
              data-height="300"
              data-chrome="noheader"
              href="https://twitter.com/penumbrazone?ref_src=twsrc%5Etfw"
            />
          </div>
          <div className="col-span-1 row-span-1 col-start-1 row-start-1">
            { !loaded ? <Skeleton className={cn("w-full h-[300px] opacity-85")}/> : null}
          </div>
        <Script
          async
          src="https://platform.twitter.com/widgets.js"
          strategy="lazyOnload"
          data-tweet-limit="5"
          data-limit="5"
          data-height="300"
          data-chrome="noheader"
        />
        </div>
      </CardContent>
    </Card>
  );
};
