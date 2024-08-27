"use client";

import { type FC, useRef, useState, useEffect, useCallback } from "react";
import { CommandInput, CommandDialog } from "../ui/command";
import { useToast } from "@/components/ui/use-toast";
import { usePathname, useRouter } from "next/navigation";
import { useOnClickOutside } from "usehooks-ts";
import { SearchValidator } from "@/lib/validators/search";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Search } from "lucide-react";
import { Input } from "../ui/input";

interface SearchProps {
  className?: string;
}

const SearchBar : FC<SearchProps> = ({ className }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [input, setInput] = useState<string>("");
  const cmdRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  useOnClickOutside(cmdRef, () => {
    setInput("");
  });

  useEffect(() => {
    setInput("");
    inputRef.current?.blur();
    cmdRef.current?.blur();
  }, [pathname]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const search = useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <div>
      <div className="hidden sm:inline-flex relative items-center rounded-full bg-popover border max-w-lg z-50 overflow-visible pl-3 gap-2">
        <Search className="w-5 h-5"/>
        <Input
          ref={inputRef}
          className={"border-none px-0 mt-[2px] rounded-full focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:ring-transparent"}
          placeholder="Search..."
          value={input}
          onChange={(text) => {
            console.log("text: ", text.currentTarget.value);
            setInput(text.currentTarget.value);
          }}
          onKeyDown={(e) => {
            // Aside: Now that this is just a single command input, maybe just convert this to a generic input box?
            if (e.key === "Enter" && input.length !== 0) {
              const searchQuery = SearchValidator.safeParse(input);
              if (searchQuery.success) {
                search(() => router.push(`/search/${searchQuery.data.value as string}`));
              }
              else {
                toast({
                  variant: "destructive",
                  title: "Invalid search query.",
                  description: "Try again with a block height, hash hash, or IBC identifier.",
                });
              }
            }
          }}
        />
        <kbd className="pointer-events-none hidden h-5 w-5 mr-3 select-none items-center bg-popover font-mono font-medium opacity-100 sm:flex text-xs text-muted-foreground/75">
          ⌘K
        </kbd>
      </div>
      <Button
        variant="outline"
        className={cn(
          "sm:hidden relative rounded-full border h-8 justify-start bg-popover text-sm font-normal shadow-none",
        )}
        onClick={() => setOpen(true)}
      >
        <Search className="w-4 h-4 self-center mr-1"/>
        <span className="inline-flex sm:hidden text-muted-foreground mt-[1px]">Search...</span>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        // className="h-9 sm:h-11 text-sm"
        ref={inputRef}
        placeholder="Search for transactions, blocks, IBC data..."
        value={input}
        onValueChange={(text) => {
          setInput(text);
        }}
        onKeyDown={(e) => {
          // Aside: Now that this is just a single command input, maybe just convert this to a generic input box?
          if (e.key === "Enter" && input.length !== 0) {
            const searchQuery = SearchValidator.safeParse(input);
            if (searchQuery.success) {
              search(() => router.push(`/search/${searchQuery.data.value as string}`));
            }
            else {
              toast({
                variant: "destructive",
                title: "Invalid search query.",
                description: "Try again with a block height, hash hash, or IBC identifier.",
              });
            }
          }
        }}
      />
      </CommandDialog>
    </div>
  );
};

export default SearchBar;
