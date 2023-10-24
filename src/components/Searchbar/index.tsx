"use client";

import { type FC, useRef, useState, useEffect } from "react";
import { Command, CommandInput, CommandItem, CommandList, CommandGroup} from "../ui/command";
import { Blocks, Hash } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useOnClickOutside } from "usehooks-ts";

const SearchBar : FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [input, setInput] = useState<string>("");
  const [showCommands, setShowCommands] = useState<boolean>(false);
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
    if ( input.length !== 0 ) {
      router.push(`/${endpoint}/${input}`);
      router.refresh();
    }
  };

  return (
    <Command
      ref={cmdRef}
      className="relative rounded-lg border max-w-lg z-50 overflow-visible"
      // TODO: add filtering or command logic that removes invalid options for a given input value, ie
      //       any value starting with 0x or containing a-fA-F should disable the height search command.
      shouldFilter={false}
      onFocus={() => { setShowCommands(true) }}
      // TODO: current focus management is very dumb, does not allow you to click commands with mouse.
      onBlur={() => { setShowCommands(false) }}
      >
      <CommandInput
        ref={inputRef}
        placeholder="Search by height or tx hash..."
        value={input}
        onValueChange={(text) => {
          setInput(text);
        }}
      />
      {showCommands && (
        <CommandList className="absolute bg-white top-full inset-x-0 shadow rounded-b-md">
          <CommandGroup heading="Commands">
            <CommandItem
              onClick={() => { searchCmd("tx") }}
              onSelect={() => { searchCmd("tx") }}>
              <Hash className="mr-2 h-4 w-4" />
              <span>transaction hash</span>
            </CommandItem>
            <CommandItem
              onClick={() => { searchCmd("block") }}
              onSelect={() => { searchCmd("block") }}>
              <Blocks className="mr-2 h-4 w-4" />
              <span>block height</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>)}
    </Command>
  );
};

export default SearchBar;