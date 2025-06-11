"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface MorphingTextProps {
  texts: string[]
  className?: string
  interval?: number
}

export function MorphingText({ texts, className = "", interval = 3000 }: MorphingTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % texts.length)
    }, interval)

    return () => clearInterval(timer)
  }, [texts.length, interval])

  return (
    <div className={`relative ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
          transition={{
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1],
          }}
          className="relative"
        >
          {texts[currentIndex].split("").map((char, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.3,
                delay: i * 0.03,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="inline-block"
              style={{
                textShadow: `
                  0 0 20px rgba(255, 184, 0, 0.8),
                  0 0 40px rgba(255, 184, 0, 0.6),
                  0 0 60px rgba(255, 184, 0, 0.4)
                `,
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}