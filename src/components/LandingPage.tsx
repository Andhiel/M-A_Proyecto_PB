import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { Mic, ArrowRight, Sparkles, Zap, Shield } from 'lucide-react'

function FloatingMicrophone() {
  const ref = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.3
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.2
    }
  })
  
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <group ref={ref}>
        {/* Microphone body */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 2, 32]} />
          <meshStandardMaterial color="#3b82f6" metalness={0.9} roughness={0.1} />
        </mesh>
        
        {/* Microphone head */}
        <mesh position={[0, 1.2, 0]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color="#1e40af" metalness={0.95} roughness={0.05} />
        </mesh>
        
        {/* Microphone grille */}
        <mesh position={[0, 1.2, 0]}>
          <sphereGeometry args={[0.48, 20, 20]} />
          <meshStandardMaterial color="#1e3a8a" wireframe />
        </mesh>
        
        {/* Stand */}
        <mesh position={[0, -1.3, 0]}>
          <cylinderGeometry args={[0.2, 0.25, 0.6, 32]} />
          <meshStandardMaterial color="#1e40af" metalness={0.8} roughness={0.2} />
        </mesh>
        
        {/* Base */}
        <mesh position={[0, -1.8, 0]}>
          <cylinderGeometry args={[0.5, 0.6, 0.25, 32]} />
          <meshStandardMaterial color="#1e3a8a" metalness={0.9} roughness={0.1} />
        </mesh>
        
        {/* Glow effect */}
        <pointLight position={[0, 1.2, 0]} intensity={3} color="#60a5fa" distance={5} />
        <pointLight position={[0, -1, 0]} intensity={1} color="#a78bfa" distance={3} />
      </group>
    </Float>
  )
}

function ParticleField() {
  const ref = useRef<THREE.Points>(null)
  
  const particlesCount = 1000
  const positions = new Float32Array(particlesCount * 3)
  
  for (let i = 0; i < particlesCount; i++) {
    const i3 = i * 3
    positions[i3] = (Math.random() - 0.5) * 10
    positions[i3 + 1] = (Math.random() - 0.5) * 10
    positions[i3 + 2] = (Math.random() - 0.5) * 10
  }
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.05
      ref.current.rotation.x = state.clock.elapsedTime * 0.02
    }
  })
  
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#60a5fa" transparent opacity={0.6} />
    </points>
  )
}

interface LandingPageProps {
  onGetStarted: () => void
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
          <Environment preset="night" />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={2} />
          <pointLight position={[-10, -10, -10]} intensity={1} color="#a78bfa" />
          <ParticleField />
          <FloatingMicrophone />
          <ContactShadows opacity={0.3} scale={10} blur={2} far={10} />
        </Canvas>
      </div>
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Navigation */}
        <nav className="p-6 md:p-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
                <Mic className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">MeetingVoice</span>
            </div>
            <button
              onClick={onGetStarted}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-lg transition-all border border-white/20"
            >
              Iniciar
            </button>
          </div>
        </nav>
        
        {/* Hero Section */}
        <main className="flex-1 flex items-center px-6 md:px-8">
          <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center bg-blue-500/20 border border-blue-500/30 rounded-full px-4 py-2">
                <Sparkles className="w-4 h-4 text-blue-400 mr-2" />
                <span className="text-blue-300 text-sm font-medium">IA Potenciada</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                Transcripción
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {' '}Inteligente
                </span>
                <br />
                de Reuniones
              </h1>
              
              <p className="text-lg text-slate-300 leading-relaxed">
                Transforma tus reuniones en acciones concretas. Graba, transcribe y extrae 
                tareas automáticamente con nuestra tecnología de IA.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onGetStarted}
                  className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-8 py-4 rounded-xl transition-all transform hover:scale-105 shadow-2xl flex items-center justify-center"
                >
                  Comenzar Gratis
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-medium px-8 py-4 rounded-xl transition-all border border-white/20">
                  Ver Demo
                </button>
              </div>
              
              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-8">
                <div className="text-center">
                  <div className="bg-blue-500/20 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Zap className="w-6 h-6 text-blue-400" />
                  </div>
                  <p className="text-white font-semibold">Tiempo Real</p>
                  <p className="text-slate-400 text-sm">Transcripción instantánea</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-500/20 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Sparkles className="w-6 h-6 text-purple-400" />
                  </div>
                  <p className="text-white font-semibold">IA Avanzada</p>
                  <p className="text-slate-400 text-sm">Extracción inteligente</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-500/20 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Shield className="w-6 h-6 text-green-400" />
                  </div>
                  <p className="text-white font-semibold">Seguro</p>
                  <p className="text-slate-400 text-sm">Datos protegidos</p>
                </div>
              </div>
            </div>
            
            {/* Empty div for 3D model space */}
            <div className="hidden md:block" />
          </div>
        </main>
        
        {/* Footer */}
        <footer className="p-6 md:p-8 text-center text-slate-400 text-sm">
          <p>© 2024 MeetingVoice. Todos los derechos reservados.</p>
        </footer>
      </div>
    </div>
  )
}
