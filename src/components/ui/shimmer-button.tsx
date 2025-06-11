"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface ShimmerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  variant?: "primary" | "secondary" | "destructive";
}

export const ShimmerButton = React.forwardRef<
  HTMLButtonElement,
  ShimmerButtonProps
>(
  (
    {
      shimmerColor = "#FFB800",
      shimmerSize = "0.1em",
      borderRadius = "0.625rem",
      shimmerDuration = "3s",
      background = "rgba(255, 184, 0, 0.1)",
      variant = "primary",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      primary: "border-divine-golden/30 hover:border-divine-golden/50",
      secondary: "border-divine-amber/30 hover:border-divine-amber/50",
      destructive: "border-divine-error/30 hover:border-divine-error/50",
    };

    const variantShimmerColors = {
      primary: "#FFB800",
      secondary: "#FF6B00",
      destructive: "#FF3366",
    };

    return (
      <button
        ref={ref}
        style={
          {
            "--spread": "90deg",
            "--shimmer-color": variantShimmerColors[variant] || shimmerColor,
            "--radius": borderRadius,
            "--speed": shimmerDuration,
            "--cut": shimmerSize,
            "--bg": background,
          } as React.CSSProperties
        }
        className={cn(
          "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap border px-6 py-3 font-medium transition-all duration-300",
          variantStyles[variant],
          "[background:var(--bg)] hover:scale-105",
          "transform-gpu transition-transform",
          className
        )}
        {...props}
      >
        {/* spark container */}
        <div
          className={cn(
            "-z-30 blur-[2px]",
            "absolute inset-0 overflow-visible [container-type:size]"
          )}
        >
          {/* spark */}
          <div className="absolute inset-0 h-[100cqh] animate-shimmer-slide [aspect-ratio:1] [border-radius:0] [mask:none] [background-attachment:fixed] [background-image:conic-gradient(from_calc(270deg-(var(--spread)*0.5))_at_right_center,transparent_0deg,var(--shimmer-color)_var(--spread),transparent_var(--spread))] [background-position:calc(50%-(100cqw))_0%] [background-size:calc(100cqw)_auto]" />
        </div>
        
        {/* Gradient background */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-[var(--shimmer-color)] to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />

        {/* Content */}
        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>

        {/* highlight */}
        <div
          className={cn(
            "insert-0 absolute h-full w-full",
            "rounded-[var(--radius)] px-1 py-0.5",
            "[mask-clip:padding-box,border-box] [mask-composite:intersect] [mask:linear-gradient(transparent,transparent),linear-gradient(white,white)]",
            "after:absolute after:aspect-square after:w-[calc(100%-var(--cut)*2)] after:animate-shimmer-slide after:[animation-delay:0s] after:[animation-duration:var(--speed)] after:[background-attachment:fixed] after:[background-image:conic-gradient(from_calc(270deg-(var(--spread)*0.5))_at_calc(100%-100cqw)_50cqh,_var(--shimmer-color)_0deg,_transparent_var(--spread),_transparent_var(--spread))] after:[background-position:center_center] after:[background-size:auto_auto]",
            "after:[inset:0] after:[translate:none]"
          )}
        />
      </button>
    );
  }
);

ShimmerButton.displayName = "ShimmerButton";