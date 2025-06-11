"use client";

import { cn } from "@/lib/utils";

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  borderWidth?: number;
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
}

export const BorderBeam = ({
  className,
  size = 200,
  duration = 15,
  borderWidth = 1.5,
  colorFrom = "#FFB800",
  colorTo = "#FF6B00",
  delay = 0,
}: BorderBeamProps) => {
  return (
    <div
      style={
        {
          "--size": size,
          "--duration": duration,
          "--border-width": borderWidth,
          "--color-from": colorFrom,
          "--color-to": colorTo,
          "--delay": `-${delay}s`,
        } as React.CSSProperties
      }
      className={cn(
        "absolute inset-0 rounded-[inherit] overflow-hidden",
        "[background:conic-gradient(from_90deg_at_50%_50%,var(--color-from)_0%,var(--color-to)_50%,var(--color-from)_100%)]",
        "animate-border-beam",
        "[mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]",
        "[mask-composite:exclude]",
        "p-[var(--border-width)]",
        "!pb-[calc(var(--border-width)+1px)]",
        className
      )}
    />
  );
};