"use client";

import { type FC, useRef, useState, useEffect } from "react";
import { Command, CommandInput } from "../ui/command";
import { usePathname, useRouter } from "next/navigation";
import { useOnClickOutside } from "usehooks-ts";
import { BlockHeightValidator, HashResultValidator } from "@/lib/validators/search";

const SearchBar : FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [input, setInput] = useState<string>("");
  const cmdRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useOnClickOutside(cmdRef, () => {
    setInput("");
  });

  useEffect(() => {
    setInput("");
    inputRef.current?.blur();
    cmdRef.current?.blur();
  }, [pathname]);

  const searchCmd = ( endpoint: string ) => {
    router.push(`/${endpoint}/${input}`);
    router.refresh();
  };
  return (
    <Command
      ref={cmdRef}
      className="relative rounded-lg border max-w-lg z-50 overflow-visible"
      shouldFilter={false}>
      <CommandInput
        ref={inputRef}
        placeholder="Search by height or tx hash..."
        value={input}
        onValueChange={(text) => {
          setInput(text);
        }}
        onKeyDown={(e) => {
          // TODO: Would be good to say "hey buddy, that's not a valid input"
          //       If that doesn't occur within the search then, ideally, would propagate that fact to the error page rather than just "Couldn't find a block with 'fizzbuzz'"
          // Aside: Now that this is just a single command input, maybe just convert this to a generic input box?
          if ( e.key === "Enter" && input.length !== 0 ) {
            const hashResult = HashResultValidator.safeParse(input);
            const blockResult = BlockHeightValidator.safeParse(input);
            if ( hashResult.success ) {
              searchCmd("tx");
            } else if ( blockResult.success ) {
              searchCmd("block");
            }
          }
        }}
      />
    </Command>
  );
};

export default SearchBar;