import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

function GalaxyParticles() {
  const ref = useRef<THREE.Points>(null)
  
  const particlesCount = 2000
  const positions = new Float32Array(particlesCount * 3)
  const colors = new Float32Array(particlesCount * 3)
  
  for (let i = 0; i < particlesCount; i++) {
    const i3 = i * 3
    const radius = Math.random() * 3 + 1
    const spinAngle = radius * 2
    const branchAngle = (i % 3) * ((2 * Math.PI) / 3)
    
    const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.5
    const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.5
    const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.5
    
    positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX
    positions[i3 + 1] = randomY * 2
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ
    
    const mixedColor = new THREE.Color()
    mixedColor.setHSL(Math.random() * 0.2 + 0.5, 0.8, 0.5)
    
    colors[i3] = mixedColor.r
    colors[i3 + 1] = mixedColor.g
    colors[i3 + 2] = mixedColor.b
  }
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.1
      ref.current.rotation.x = state.clock.elapsedTime * 0.05
    }
  })
  
  return (
    <Points ref={ref}>
      <PointMaterial
        transparent
        vertexColors
        size={0.02}
        sizeAttenuation
        depthWrite={false}
      />
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particlesCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
    </Points>
  )
}

function CometTrail() {
  const ref = useRef<THREE.Points>(null)
  
  const particlesCount = 500
  const positions = new Float32Array(particlesCount * 3)
  const colors = new Float32Array(particlesCount * 3)
  
  for (let i = 0; i < particlesCount; i++) {
    const i3 = i * 3
    const t = i / particlesCount
    const x = (t - 0.5) * 4
    const y = Math.sin(t * Math.PI * 2) * 0.5
    const z = Math.cos(t * Math.PI * 2) * 0.5
    
    positions[i3] = x
    positions[i3 + 1] = y + (Math.random() - 0.5) * 0.2
    positions[i3 + 2] = z + (Math.random() - 0.5) * 0.2
    
    const color = new THREE.Color()
    color.setHSL(0.6 + t * 0.2, 1, 0.5 + t * 0.3)
    colors[i3] = color.r
    colors[i3 + 1] = color.g
    colors[i3 + 2] = color.b
  }
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.elapsedTime * 0.5
      ref.current.position.x = Math.sin(state.clock.elapsedTime * 0.5) * 2
      ref.current.position.y = Math.cos(state.clock.elapsedTime * 0.3) * 1
    }
  })
  
  return (
    <Points ref={ref}>
      <PointMaterial
        transparent
        vertexColors
        size={0.03}
        sizeAttenuation
        depthWrite={false}
        opacity={0.8}
      />
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particlesCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
    </Points>
  )
}

function Microphone3D() {
  const ref = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.5
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1
    }
  })
  
  return (
    <group ref={ref}>
      {/* Microphone body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 1.5, 32]} />
        <meshStandardMaterial color="#4a5568" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Microphone head */}
      <mesh position={[0, 0.9, 0]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color="#2d3748" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Microphone grille pattern */}
      <mesh position={[0, 0.9, 0]}>
        <sphereGeometry args={[0.38, 16, 16]} />
        <meshStandardMaterial color="#1a202c" wireframe />
      </mesh>
      
      {/* Stand */}
      <mesh position={[0, -1, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 0.5, 32]} />
        <meshStandardMaterial color="#2d3748" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Base */}
      <mesh position={[0, -1.4, 0]}>
        <cylinderGeometry args={[0.4, 0.5, 0.2, 32]} />
        <meshStandardMaterial color="#1a202c" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Glow effect */}
      <pointLight position={[0, 0.9, 0]} intensity={2} color="#60a5fa" distance={3} />
    </group>
  )
}

export default function MicrophoneLoader() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <GalaxyParticles />
        <CometTrail />
        <Microphone3D />
      </Canvas>
    </div>
  )
}
