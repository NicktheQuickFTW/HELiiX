"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView, useSpring, useTransform } from "framer-motion"

interface AnimatedCounterProps {
  value: number
  duration?: number
  decimals?: number
  prefix?: string
  suffix?: string
  className?: string
}

export function AnimatedCounter({
  value,
  duration = 2,
  decimals = 0,
  prefix = "",
  suffix = "",
  className = ""
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [hasAnimated, setHasAnimated] = useState(false)
  
  const springValue = useSpring(0, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })
  
  const displayValue = useTransform(springValue, (latest) =>
    latest.toFixed(decimals)
  )

  useEffect(() => {
    if (isInView && !hasAnimated) {
      springValue.set(value)
      setHasAnimated(true)
    }
  }, [isInView, hasAnimated, value, springValue])

  return (
    <span ref={ref} className={className}>
      {prefix}
      <motion.span className="tabular-nums">
        {displayValue}
      </motion.span>
      {suffix}
    </span>
  )
}