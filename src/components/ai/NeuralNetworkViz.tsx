"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  connections: number[]
  pulsePhase: number
  type: 'input' | 'hidden' | 'output'
}

export function NeuralNetworkViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nodesRef = useRef<Node[]>([])
  const animationRef = useRef<number>()
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const updateCanvasSize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    updateCanvasSize()
    window.addEventListener("resize", updateCanvasSize)

    // Initialize nodes
    const initNodes = () => {
      const nodes: Node[] = []
      const layers = [4, 6, 5, 3] // Input, hidden layers, output
      const width = canvas.offsetWidth
      const height = canvas.offsetHeight
      
      layers.forEach((nodeCount, layerIndex) => {
        const x = (width / (layers.length + 1)) * (layerIndex + 1)
        
        for (let i = 0; i < nodeCount; i++) {
          const y = (height / (nodeCount + 1)) * (i + 1)
          const node: Node = {
            x,
            y,
            vx: (Math.random() - 0.5) * 0.2,
            vy: (Math.random() - 0.5) * 0.2,
            connections: [],
            pulsePhase: Math.random() * Math.PI * 2,
            type: layerIndex === 0 ? 'input' : layerIndex === layers.length - 1 ? 'output' : 'hidden'
          }
          
          // Connect to nodes in next layer
          if (layerIndex < layers.length - 1) {
            const nextLayerStart = nodes.length + nodeCount - i
            const nextLayerCount = layers[layerIndex + 1]
            
            for (let j = 0; j < nextLayerCount; j++) {
              if (Math.random() > 0.3) { // 70% connection probability
                node.connections.push(nextLayerStart + j)
              }
            }
          }
          
          nodes.push(node)
        }
      })
      
      nodesRef.current = nodes
    }
    initNodes()

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }
    }
    canvas.addEventListener("mousemove", handleMouseMove)

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)
      
      const nodes = nodesRef.current
      const time = Date.now() * 0.001
      
      // Update node positions
      nodes.forEach((node) => {
        // Gentle floating animation
        node.x += node.vx
        node.y += node.vy
        
        // Boundary check with soft bounce
        if (node.x < 20 || node.x > canvas.offsetWidth - 20) node.vx *= -0.9
        if (node.y < 20 || node.y > canvas.offsetHeight - 20) node.vy *= -0.9
        
        // Mouse interaction
        const dx = mouseRef.current.x - node.x
        const dy = mouseRef.current.y - node.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 100) {
          const force = (100 - distance) / 1000
          node.vx += dx * force
          node.vy += dy * force
        }
        
        // Damping
        node.vx *= 0.99
        node.vy *= 0.99
        
        // Update pulse phase
        node.pulsePhase += 0.02
      })
      
      // Draw connections
      nodes.forEach((node, i) => {
        node.connections.forEach((targetIndex) => {
          if (targetIndex < nodes.length) {
            const target = nodes[targetIndex]
            const gradient = ctx.createLinearGradient(node.x, node.y, target.x, target.y)
            
            // Pulsing connection
            const pulse = Math.sin(time * 2 + node.pulsePhase) * 0.5 + 0.5
            const opacity = 0.1 + pulse * 0.2
            
            gradient.addColorStop(0, `rgba(255, 184, 0, ${opacity})`)
            gradient.addColorStop(0.5, `rgba(255, 107, 0, ${opacity * 1.5})`)
            gradient.addColorStop(1, `rgba(255, 184, 0, ${opacity})`)
            
            ctx.strokeStyle = gradient
            ctx.lineWidth = 0.5 + pulse * 0.5
            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(target.x, target.y)
            ctx.stroke()
          }
        })
      })
      
      // Draw nodes
      nodes.forEach((node) => {
        const pulse = Math.sin(time * 3 + node.pulsePhase) * 0.5 + 0.5
        const size = node.type === 'hidden' ? 4 : 6
        const glowSize = size + pulse * 2
        
        // Outer glow
        const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowSize * 3)
        glow.addColorStop(0, `rgba(255, 184, 0, ${0.3 + pulse * 0.2})`)
        glow.addColorStop(1, "rgba(255, 184, 0, 0)")
        
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(node.x, node.y, glowSize * 3, 0, Math.PI * 2)
        ctx.fill()
        
        // Node core
        const nodeGradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowSize)
        nodeGradient.addColorStop(0, "#FFD700")
        nodeGradient.addColorStop(0.5, "#FFB800")
        nodeGradient.addColorStop(1, "#FF6B00")
        
        ctx.fillStyle = nodeGradient
        ctx.beginPath()
        ctx.arc(node.x, node.y, glowSize, 0, Math.PI * 2)
        ctx.fill()
        
        // Inner core
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)"
        ctx.beginPath()
        ctx.arc(node.x, node.y, size * 0.5, 0, Math.PI * 2)
        ctx.fill()
      })
      
      animationRef.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener("resize", updateCanvasSize)
      canvas.removeEventListener("mousemove", handleMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <motion.canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    />
  )
}