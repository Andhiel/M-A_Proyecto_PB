import { useState, useEffect } from 'react'
import MicrophoneLoader from './MicrophoneLoader'

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState('Inicializando...')
  
  const loadingSteps = [
    'Inicializando...',
    'Cargando recursos...',
    'Preparando audio...',
    'Configurando transcripción...',
    '¡Listo!'
  ]
  
  useEffect(() => {
    let currentProgress = 0
    const interval = setInterval(() => {
      currentProgress += 2
      if (currentProgress <= 100) {
        setProgress(currentProgress)
        const stepIndex = Math.floor((currentProgress / 100) * (loadingSteps.length - 1))
        setLoadingText(loadingSteps[stepIndex])
      } else {
        clearInterval(interval)
        setTimeout(() => {
          onComplete()
        }, 500)
      }
    }, 50)
    
    return () => clearInterval(interval)
  }, [onComplete])
  
  return (
    <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col items-center justify-center">
      <div className="w-64 h-64 md:w-96 md:h-96 mb-8">
        <MicrophoneLoader />
      </div>
      
      <div className="text-center space-y-4">
        <h2 className="text-2xl md:text-3xl font-bold text-white">{loadingText}</h2>
        
        <div className="w-64 md:w-96 h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <p className="text-slate-400 text-sm md:text-base">{progress}%</p>
      </div>
    </div>
  )
}
