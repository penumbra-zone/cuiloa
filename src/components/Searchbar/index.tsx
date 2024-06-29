"use client";

import { type FC, useRef, useState, useEffect } from "react";
import { Command, CommandInput } from "../ui/command";
import { useToast } from "@/components/ui/use-toast";
import { usePathname, useRouter } from "next/navigation";
import { useOnClickOutside } from "usehooks-ts";
import { SearchValidator } from "@/lib/validators/search";

const SearchBar : FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [input, setInput] = useState<string>("");
  const cmdRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();

  useOnClickOutside(cmdRef, () => {
    setInput("");
  });

  useEffect(() => {
    setInput("");
    inputRef.current?.blur();
    cmdRef.current?.blur();
  }, [pathname]);

  const searchCmd = () => {
    router.push(`/search/${input}`);
    router.refresh();
  };

  return (
    <Command
      ref={cmdRef}
      className="relative rounded-full bg-popover border max-w-lg z-50 overflow-visible"
      shouldFilter={false}>
      <CommandInput
        className="text-sm"
        ref={inputRef}
        placeholder="Search by height, hash, or IBC identifier..."
        value={input}
        onValueChange={(text) => {
          setInput(text);
        }}
        onKeyDown={(e) => {
          // Aside: Now that this is just a single command input, maybe just convert this to a generic input box?
          if (e.key === "Enter" && input.length !== 0) {
            const searchQuery = SearchValidator.safeParse(input);
            if (searchQuery.success) {
              searchCmd();
            }
            else {
              toast({
                variant: "destructive",
                title: "Invalid search query.",
                description: "Please try again with a block height or transaction hash.",
              });
            }
          }
        }}
      />
    </Command>
  );
};

export default SearchBar;
