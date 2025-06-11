"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface Orb {
  x: number
  y: number
  size: number
  color: string
  velocity: { x: number; y: number }
  phase: number
}

export function FloatingOrbs() {
  const containerRef = useRef<HTMLDivElement>(null)
  const orbsRef = useRef<Orb[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const animationRef = useRef<number>()

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const colors = ["#FFB800", "#FF6B00", "#FFD700", "#FFA500"]
    const orbCount = 6

    // Initialize orbs
    const initOrbs = () => {
      const orbs: Orb[] = []
      
      for (let i = 0; i < orbCount; i++) {
        orbs.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: 100 + Math.random() * 200,
          color: colors[i % colors.length],
          velocity: {
            x: (Math.random() - 0.5) * 0.5,
            y: (Math.random() - 0.5) * 0.5,
          },
          phase: Math.random() * Math.PI * 2,
        })
      }
      
      orbsRef.current = orbs
    }
    initOrbs()

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener("mousemove", handleMouseMove)

    // Animation loop
    const animate = () => {
      const orbs = orbsRef.current
      
      orbs.forEach((orb, index) => {
        // Update position
        orb.x += orb.velocity.x
        orb.y += orb.velocity.y
        
        // Wrap around edges
        if (orb.x < -orb.size) orb.x = window.innerWidth + orb.size
        if (orb.x > window.innerWidth + orb.size) orb.x = -orb.size
        if (orb.y < -orb.size) orb.y = window.innerHeight + orb.size
        if (orb.y > window.innerHeight + orb.size) orb.y = -orb.size
        
        // Mouse repulsion
        const dx = mouseRef.current.x - orb.x
        const dy = mouseRef.current.y - orb.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 200) {
          const force = (200 - distance) / 200
          orb.velocity.x -= (dx / distance) * force * 0.1
          orb.velocity.y -= (dy / distance) * force * 0.1
        }
        
        // Damping
        orb.velocity.x *= 0.99
        orb.velocity.y *= 0.99
        
        // Update phase for pulsing
        orb.phase += 0.01
        
        // Update DOM element
        const element = container.children[index] as HTMLElement
        if (element) {
          element.style.transform = `translate(${orb.x - orb.size / 2}px, ${orb.y - orb.size / 2}px)`
          element.style.opacity = `${0.3 + Math.sin(orb.phase) * 0.1}`
        }
      })
      
      animationRef.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 2, delay: i * 0.2 }}
          style={{
            width: `${100 + Math.random() * 200}px`,
            height: `${100 + Math.random() * 200}px`,
            background: `radial-gradient(circle, ${
              ["#FFB800", "#FF6B00", "#FFD700", "#FFA500"][i % 4]
            }40 0%, transparent 70%)`,
            filter: "blur(40px)",
          }}
        />
      ))}
    </div>
  )
}