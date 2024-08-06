import { cn } from "@/lib/utils";
import type { FC, ReactNode } from "react";

export const FlexCol: FC<{ children?: ReactNode, className?: string }> = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col", className ?? "")}>
      {children}
    </div>
  );
};

export const FlexRow: FC<{ children?: ReactNode, className?: string }> = ({ children, className }) => {
  return (
    <div className={cn("flex", className ?? "")}>
      {children}
    </div>
  );
};
