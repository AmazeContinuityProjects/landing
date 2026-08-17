import * as React from "react";
import { cn } from "../lib/utils"; // Importing the utility

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm",
        "p-6 shadow-2xl shadow-black/50",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}