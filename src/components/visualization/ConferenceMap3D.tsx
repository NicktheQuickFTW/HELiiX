"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text, Sphere, Line } from "@react-three/drei"
import * as THREE from "three"

const schools = [
  { name: "Arizona", position: [-3, 0, 2], color: "#8B2346" },
  { name: "Arizona State", position: [-3, 0, 1], color: "#8C1D40" },
  { name: "Baylor", position: [-2, 0, -1], color: "#003015" },
  { name: "BYU", position: [0, 0, -3], color: "#002E5D" },
  { name: "UCF", position: [3, 0, 1], color: "#FFC904" },
  { name: "Cincinnati", position: [2, 0, 2], color: "#E00122" },
  { name: "Colorado", position: [-2, 0, 3], color: "#CFB87C" },
  { name: "Houston", position: [1, 0, 2], color: "#C8102E" },
  { name: "Iowa State", position: [0, 0, 1], color: "#C8102E" },
  { name: "Kansas", position: [0, 0, 0], color: "#0051BA" },
  { name: "K-State", position: [1, 0, 0], color: "#512888" },
  { name: "Oklahoma State", position: [1, 0, -2], color: "#FF7300" },
  { name: "TCU", position: [-1, 0, -2], color: "#4D1979" },
  { name: "Texas Tech", position: [-1, 0, 1], color: "#CC0000" },
  { name: "Utah", position: [-2, 0, -3], color: "#CC0000" },
  { name: "West Virginia", position: [2, 0, -1], color: "#002855" },
]

function SchoolNode({ school, index }: { school: typeof schools[0], index: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const textRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current && textRef.current) {
      const time = state.clock.getElapsedTime()
      meshRef.current.position.y = Math.sin(time * 2 + index) * 0.1
      textRef.current.position.y = meshRef.current.position.y + 0.5
      
      // Pulsing glow effect
      const scale = 1 + Math.sin(time * 3 + index * 0.5) * 0.1
      meshRef.current.scale.setScalar(scale)
    }
  })

  return (
    <group position={school.position}>
      <Sphere ref={meshRef} args={[0.2, 32, 16]}>
        <meshStandardMaterial
          color={school.color}
          emissive={school.color}
          emissiveIntensity={0.5}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
      
      {/* Glow effect */}
      <Sphere args={[0.25, 32, 16]}>
        <meshBasicMaterial
          color={school.color}
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </Sphere>
      
      <Text
        ref={textRef}
        position={[0, 0.5, 0]}
        fontSize={0.15}
        color="#FFB800"
        anchorX="center"
        anchorY="middle"
      >
        {school.name}
      </Text>
    </group>
  )
}

function ConnectionLines() {
  const connections = useMemo(() => {
    const lines = []
    // Create connections between nearby schools
    for (let i = 0; i < schools.length; i++) {
      for (let j = i + 1; j < schools.length; j++) {
        const dist = Math.sqrt(
          Math.pow(schools[i].position[0] - schools[j].position[0], 2) +
          Math.pow(schools[i].position[2] - schools[j].position[2], 2)
        )
        if (dist < 2.5) {
          lines.push({
            start: schools[i].position,
            end: schools[j].position,
            color: "#FFB800",
          })
        }
      }
    }
    return lines
  }, [])

  return (
    <>
      {connections.map((connection, i) => (
        <Line
          key={i}
          points={[connection.start, connection.end]}
          color={connection.color}
          lineWidth={1}
          transparent
          opacity={0.3}
        />
      ))}
    </>
  )
}

function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null)
  
  const particles = useMemo(() => {
    const count = 200
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10
      positions[i * 3 + 1] = Math.random() * 5 - 2.5
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
      
      const color = new THREE.Color(Math.random() > 0.5 ? "#FFB800" : "#FF6B00")
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }
    
    return { positions, colors }
  }, [])
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.05
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
      
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(state.clock.getElapsedTime() + i) * 0.001
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particles.colors.length / 3}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

export function ConferenceMap3D() {
  return (
    <div className="relative h-[600px] w-full rounded-2xl overflow-hidden divine-glass">
      <Canvas
        camera={{ position: [0, 5, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#FFB800" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#FF6B00" />
        
        {/* Environment */}
        <fog attach="fog" args={["#0A0A0B", 5, 20]} />
        
        {/* School nodes */}
        {schools.map((school, i) => (
          <SchoolNode key={i} school={school} index={i} />
        ))}
        
        {/* Connection lines */}
        <ConnectionLines />
        
        {/* Floating particles */}
        <FloatingParticles />
        
        {/* Central Big 12 logo */}
        <group position={[0, 0.5, 0]}>
          <Text
            fontSize={0.5}
            color="#FFB800"
            anchorX="center"
            anchorY="middle"
            font="/fonts/orbitron-bold.woff"
          >
            BIG 12
          </Text>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.5, 2, 32]} />
            <meshStandardMaterial
              color="#FFB800"
              emissive="#FFB800"
              emissiveIntensity={0.2}
              side={THREE.DoubleSide}
              transparent
              opacity={0.3}
            />
          </mesh>
        </group>
        
        {/* Controls */}
        <OrbitControls
          enablePan={false}
          maxPolarAngle={Math.PI / 2.5}
          minDistance={5}
          maxDistance={15}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
      
      {/* Title */}
      <div className="absolute top-6 left-6 space-y-2">
        <h3 className="text-2xl font-bold divine-holographic">Big 12 Conference Network</h3>
        <p className="text-sm text-muted-foreground">Interactive 3D visualization of member schools</p>
      </div>
    </div>
  )
}