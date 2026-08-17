import * as React from "react";
import { cn } from "../lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "accent" | "ghost";
}

export function Button({ className, variant = "primary", children, ...props }: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";
  
  const variants = {
    primary: "bg-[#EAEAEA] text-slate-950 hover:bg-white",
    accent: "bg-[#5C4DFF] text-white hover:bg-[#6B5CFF] shadow-[0_0_15px_rgba(92,77,255,0.3)]",
    ghost: "bg-transparent text-slate-400 hover:bg-white/5 hover:text-white",
  };

  return (
    <button 
      className={cn(baseStyles, variants[variant], className)} 
      {...props}
    >
      {children}
    </button>
  );
}