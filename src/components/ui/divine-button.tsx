"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface DivineButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "destructive"
  size?: "sm" | "md" | "lg"
  glow?: boolean
  loading?: boolean
}

const DivineButton = React.forwardRef<HTMLButtonElement, DivineButtonProps>(
  ({ className, variant = "primary", size = "md", glow = true, loading = false, children, disabled, ...props }, ref) => {
    const baseStyles = "relative font-semibold tracking-wide uppercase overflow-hidden transition-all duration-300 transform-gpu"
    
    const sizeStyles = {
      sm: "px-4 py-2 text-xs",
      md: "px-6 py-3 text-sm",
      lg: "px-8 py-4 text-base"
    }

    const variantStyles = {
      primary: cn(
        "bg-gradient-to-r from-[#FFB800] to-[#FF6B00] text-black",
        glow && "hover:shadow-[0_0_20px_rgba(255,184,0,0.5),0_0_40px_rgba(255,184,0,0.3)]"
      ),
      secondary: cn(
        "bg-transparent border border-[#FFB800] text-[#FFB800]",
        "hover:bg-[#FFB800] hover:text-black",
        glow && "hover:shadow-[0_0_20px_rgba(255,184,0,0.5)]"
      ),
      ghost: cn(
        "bg-transparent text-white hover:bg-white/10",
        glow && "hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]"
      ),
      destructive: cn(
        "bg-[#FF3366] text-white",
        glow && "hover:shadow-[0_0_20px_rgba(255,51,102,0.5)]"
      )
    }

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          sizeStyles[size],
          variantStyles[variant],
          "rounded-lg",
          "hover:scale-105 active:scale-95",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {/* Shine effect */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>

        {/* Loading spinner */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}

        {/* Content */}
        <span className={cn("relative z-10", loading && "opacity-0")}>
          {children}
        </span>

        {/* Ripple effect container */}
        <span className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
          <span className="divine-ripple" />
        </span>
      </button>
    )
  }
)

DivineButton.displayName = "DivineButton"

export { DivineButton }