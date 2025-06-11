"use client"

import { useRef } from "react"
import { motion, useMotionValue, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

interface PerspectiveCardProps {
  children: React.ReactNode
  className?: string
  containerClassName?: string
}

export function PerspectiveCard({ 
  children, 
  className,
  containerClassName 
}: PerspectiveCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [7.5, -7.5])
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-7.5, 7.5])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const xPct = x / width - 0.5
    const yPct = y / height - 0.5

    mouseX.set(xPct)
    mouseY.set(yPct)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <div className={cn("perspective-[1000px]", containerClassName)}>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className={cn(
          "relative rounded-2xl divine-glass p-6",
          "transform-gpu will-change-transform",
          className
        )}
      >
        {/* Inner shadow for depth */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        
        {/* Content */}
        <div className="relative z-10" style={{ transform: "translateZ(50px)" }}>
          {children}
        </div>
        
        {/* Floating elements for 3D effect */}
        <motion.div
          className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-gradient-to-br from-[#FFB800]/30 to-[#FF6B00]/30 blur-2xl"
          style={{
            transform: "translateZ(75px)",
            rotateX: useTransform(rotateX, (val) => val * -2),
            rotateY: useTransform(rotateY, (val) => val * -2),
          }}
        />
        <motion.div
          className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full bg-gradient-to-tr from-[#FF6B00]/30 to-[#FFB800]/30 blur-2xl"
          style={{
            transform: "translateZ(100px)",
            rotateX: useTransform(rotateX, (val) => val * -1.5),
            rotateY: useTransform(rotateY, (val) => val * -1.5),
          }}
        />
      </motion.div>
    </div>
  )
}