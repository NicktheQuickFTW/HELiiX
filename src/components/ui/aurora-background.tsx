"use client";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <main>
      <div
        className={cn(
          "relative flex flex-col h-[100vh] items-center justify-center bg-zinc-950 text-slate-950 transition-bg",
          className
        )}
        {...props}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={cn(
              `
            [--golden-gradient:repeating-linear-gradient(100deg,#FFD700_0%,#FFA500_7%,#FFD700_14%,#FF8C00_21%,#FFD700_28%,#FFA500_35%,#FFD700_42%,#FF8C00_49%,#FFD700_56%,#FFA500_63%,#FFD700_70%,#FF8C00_77%,#FFD700_84%,#FFA500_91%)]
            [background-image:var(--golden-gradient)]
            absolute inset-0 opacity-50
            [mask-image:radial-gradient(ellipse_at_center,white,transparent)]
            `,
              `after:content-[""] after:absolute after:inset-0 after:[background-image:var(--golden-gradient)] 
            after:animate-aurora after:[background-attachment:fixed] after:mix-blend-color-dodge`,
              showRadialGradient &&
                `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]`
            )}
          ></div>
        </div>
        {children}
      </div>
    </main>
  );
};