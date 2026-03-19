import { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface ChipProps {
  children: ReactNode;
  className?: string;
}

export function Chip({ children, className }: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-accent/25 bg-accent-soft px-3 py-1 text-xs font-medium text-cyan-100",
        className
      )}
    >
      {children}
    </span>
  );
}
