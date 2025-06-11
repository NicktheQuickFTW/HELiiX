"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface DivineCardProps extends React.ComponentProps<"div"> {
  glowColor?: "golden" | "amber" | "success" | "error"
  intensity?: "low" | "medium" | "high"
  hover3D?: boolean
}

const glowVariants = {
  golden: "hover:shadow-[0_0_20px_rgba(255,184,0,0.5),0_0_40px_rgba(255,184,0,0.3)]",
  amber: "hover:shadow-[0_0_20px_rgba(255,107,0,0.5),0_0_40px_rgba(255,107,0,0.3)]",
  success: "hover:shadow-[0_0_20px_rgba(0,255,136,0.5)]",
  error: "hover:shadow-[0_0_20px_rgba(255,51,102,0.5)]"
}

const DivineCard = React.forwardRef<HTMLDivElement, DivineCardProps>(
  ({ className, glowColor = "golden", intensity = "medium", hover3D = true, children, ...props }, ref) => {
    const cardRef = React.useRef<HTMLDivElement>(null)
    const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 })
    const [isHovered, setIsHovered] = React.useState(false)

    React.useImperativeHandle(ref, () => cardRef.current!)

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!hover3D || !cardRef.current) return

      const rect = cardRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height

      setMousePosition({ x, y })
    }

    const handleMouseEnter = () => setIsHovered(true)
    const handleMouseLeave = () => {
      setIsHovered(false)
      setMousePosition({ x: 0.5, y: 0.5 })
    }

    const transform = hover3D && isHovered
      ? `perspective(1000px) rotateX(${(mousePosition.y - 0.5) * -10}deg) rotateY(${(mousePosition.x - 0.5) * 10}deg) translateZ(10px)`
      : ""

    return (
      <div
        ref={cardRef}
        className={cn(
          "divine-glass relative overflow-hidden rounded-xl p-6",
          "transition-all duration-300 ease-out transform-gpu",
          "hover:scale-[1.02]",
          glowVariants[glowColor],
          className
        )}
        style={{ transform }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,184,0,0.1)] via-transparent to-transparent" />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.1)] to-transparent transform -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-700" />
        </div>

        {/* Particle effect container */}
        {intensity === "high" && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="divine-particle-1 absolute w-1 h-1 bg-[#FFB800] rounded-full animate-[divine-particle-float_3s_ease-in-out_infinite]" style={{ left: "10%", animationDelay: "0s" }} />
            <div className="divine-particle-2 absolute w-1 h-1 bg-[#FFC832] rounded-full animate-[divine-particle-float_3s_ease-in-out_infinite]" style={{ left: "30%", animationDelay: "1s" }} />
            <div className="divine-particle-3 absolute w-1 h-1 bg-[#FFD864] rounded-full animate-[divine-particle-float_3s_ease-in-out_infinite]" style={{ left: "50%", animationDelay: "2s" }} />
            <div className="divine-particle-4 absolute w-1 h-1 bg-[#FF6B00] rounded-full animate-[divine-particle-float_3s_ease-in-out_infinite]" style={{ left: "70%", animationDelay: "0.5s" }} />
            <div className="divine-particle-5 absolute w-1 h-1 bg-[#FF8C32] rounded-full animate-[divine-particle-float_3s_ease-in-out_infinite]" style={{ left: "90%", animationDelay: "1.5s" }} />
          </div>
        )}

        {/* Content with relative z-index */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    )
  }
)

DivineCard.displayName = "DivineCard"

const DivineCardHeader = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "mb-4 space-y-1",
        className
      )}
      {...props}
    />
  )
)

DivineCardHeader.displayName = "DivineCardHeader"

const DivineCardTitle = React.forwardRef<HTMLHeadingElement, React.ComponentProps<"h3">>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        "text-2xl font-semibold leading-none tracking-tight",
        "bg-gradient-to-r from-[#FFB800] to-[#FF6B00] bg-clip-text text-transparent",
        className
      )}
      {...props}
    />
  )
)

DivineCardTitle.displayName = "DivineCardTitle"

const DivineCardDescription = React.forwardRef<HTMLParagraphElement, React.ComponentProps<"p">>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
)

DivineCardDescription.displayName = "DivineCardDescription"

const DivineCardContent = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("", className)} {...props} />
  )
)

DivineCardContent.displayName = "DivineCardContent"

const DivineCardFooter = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("mt-4 flex items-center", className)}
      {...props}
    />
  )
)

DivineCardFooter.displayName = "DivineCardFooter"

export {
  DivineCard,
  DivineCardHeader,
  DivineCardFooter,
  DivineCardTitle,
  DivineCardDescription,
  DivineCardContent,
}