"use client";

import React, { forwardRef, useRef } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface AnimatedBeamProps extends React.HTMLAttributes<HTMLDivElement> {
  duration?: number;
  delay?: number;
  pathColor?: string;
  pathWidth?: number;
  pathOpacity?: number;
  gradientStartColor?: string;
  gradientStopColor?: string;
  startXOffset?: number;
  startYOffset?: number;
  endXOffset?: number;
  endYOffset?: number;
  curvature?: number;
  reverse?: boolean;
}

export const AnimatedBeam = forwardRef<HTMLDivElement, AnimatedBeamProps>(
  (
    {
      duration = 3,
      delay = 0,
      pathColor = "rgba(255, 184, 0, 0.2)",
      pathWidth = 2,
      pathOpacity = 0.2,
      gradientStartColor = "#FFB800",
      gradientStopColor = "#FF6B00",
      startXOffset = 0,
      startYOffset = 0,
      endXOffset = 0,
      endYOffset = 0,
      curvature = 0,
      reverse = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const id = useRef(`beam-${Math.random().toString(36).substring(7)}`);

    const path = `
      M ${startXOffset} ${startYOffset}
      Q ${startXOffset + (endXOffset - startXOffset) / 2} ${startYOffset + (endYOffset - startYOffset) / 2 + curvature}
        ${endXOffset} ${endYOffset}
    `;

    return (
      <div
        ref={ref}
        className={cn("absolute inset-0 overflow-hidden", className)}
        {...props}
      >
        <svg
          className="absolute inset-0 h-full w-full"
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id={id.current}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor={gradientStartColor} stopOpacity="0" />
              <stop offset="50%" stopColor={gradientStartColor} stopOpacity="1" />
              <stop offset="100%" stopColor={gradientStopColor} stopOpacity="0" />
            </linearGradient>
          </defs>

          <path
            d={path}
            stroke={pathColor}
            strokeWidth={pathWidth}
            fill="none"
            strokeOpacity={pathOpacity}
            strokeLinecap="round"
          />

          <motion.path
            d={path}
            stroke={`url(#${id.current})`}
            strokeWidth={pathWidth}
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: reverse ? [1, 0] : [0, 1],
              opacity: 1,
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </svg>
        {children}
      </div>
    );
  }
);

AnimatedBeam.displayName = "AnimatedBeam";