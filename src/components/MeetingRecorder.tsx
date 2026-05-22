import { useState, useRef, useEffect } from 'react'
import { Mic, MicOff, Square, Loader2 } from 'lucide-react'

interface TranscriptionSegment {
  text: string
  timestamp: number
  speaker?: string
}

export default function MeetingRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [transcription, setTranscription] = useState<TranscriptionSegment[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [extractedTasks, setExtractedTasks] = useState<any[]>([])
  
  const recognitionRef = useRef<any>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      // Setup Web Speech API for transcription
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = 'es-ES'

        recognition.onresult = (event: any) => {
          const segments: TranscriptionSegment[] = []
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i]
            if (result.isFinal) {
              segments.push({
                text: result[0].transcript,
                timestamp: Date.now(),
                speaker: `Voz ${transcription.length + 1}`
              })
            }
          }
          if (segments.length > 0) {
            setTranscription(prev => [...prev, ...segments])
          }
        }

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error)
        }

        recognitionRef.current = recognition
        recognition.start()
      }

      mediaRecorderRef.current = new MediaRecorder(stream)
      mediaRecorderRef.current.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('No se pudo acceder al micrófono. Por favor verifique los permisos.')
    }
  }

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
    }
    
    setIsRecording(false)
    setIsProcessing(true)
    
    // Process transcription to extract tasks
    setTimeout(() => {
      const tasks = extractTasksFromTranscription(transcription)
      setExtractedTasks(tasks)
      setShowSummary(true)
      setIsProcessing(false)
    }, 1000)
  }

  const extractTasksFromTranscription = (segments: TranscriptionSegment[]) => {
    const fullText = segments.map(s => s.text).join(' ')
    
    // Simple rule-based extraction for MVP
    const taskPatterns = [
      /(?:necesito|tengo que|debo|hay que|vamos a)\s+(.+)/gi,
      /(?:tarea|actividad|pendiente|acción)\s*[:]\s*(.+)/gi,
      /(?:para|el|la)\s+(.+?)\s+(?:necesita|requiere|debe)/gi
    ]

    const tasks: any[] = []
    
    taskPatterns.forEach(pattern => {
      let match
      while ((match = pattern.exec(fullText)) !== null) {
        tasks.push({
          id: Date.now() + Math.random(),
          description: match[1].trim(),
          responsible: null,
          deadline: null,
          project: null,
          status: 'pending'
        })
      }
    })

    // If no tasks found, create a general observation
    if (tasks.length === 0 && fullText.length > 0) {
      tasks.push({
        id: Date.now(),
        description: fullText.substring(0, 200) + (fullText.length > 200 ? '...' : ''),
        responsible: null,
        deadline: null,
        project: 'Observación general',
        status: 'observation'
      })
    }

    return tasks
  }

  const confirmTasks = () => {
    // Save to localStorage for MVP (will upgrade to SQLite later)
    const existingTasks = JSON.parse(localStorage.getItem('meetingTasks') || '[]')
    const tasksWithDates = extractedTasks.map(task => ({
      ...task,
      createdAt: new Date().toISOString()
    }))
    localStorage.setItem('meetingTasks', JSON.stringify([...existingTasks, ...tasksWithDates]))
    
    setShowSummary(false)
    setTranscription([])
    setExtractedTasks([])
    alert('Tareas guardadas exitosamente')
  }

  const cancelMeeting = () => {
    setShowSummary(false)
    setTranscription([])
    setExtractedTasks([])
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-2xl font-bold text-white mb-4">Grabación de Reunión</h2>
        
        <div className="flex space-x-4 mb-6">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
            >
              <Mic className="w-5 h-5 mr-2" />
              Iniciar Reunión
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
            >
              <Square className="w-5 h-5 mr-2" />
              Finalizar Reunión
            </button>
          )}
          
          {isRecording && (
            <div className="flex items-center px-4 py-3 bg-red-100 rounded-lg">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
              <span className="text-red-700 font-medium">Grabando...</span>
            </div>
          )}
        </div>

        {isProcessing && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mr-2" />
            <span className="text-slate-300">Procesando transcripción...</span>
          </div>
        )}
      </div>

      {transcription.length > 0 && !showSummary && (
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-semibold text-white mb-4">Transcripción en Tiempo Real</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {transcription.map((segment, index) => (
              <div key={index} className="bg-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-blue-400 font-medium">{segment.speaker}</span>
                  <span className="text-xs text-slate-400">
                    {new Date(segment.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-slate-200">{segment.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {showSummary && (
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-semibold text-white mb-4">Resumen de Tareas Detectadas</h3>
          <p className="text-slate-400 mb-4">Revise y edite las tareas antes de confirmar:</p>
          
          <div className="space-y-4 mb-6">
            {extractedTasks.map((task, index) => (
              <div key={task.id} className="bg-slate-700 rounded-lg p-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Descripción</label>
                    <input
                      type="text"
                      value={task.description}
                      onChange={(e) => {
                        const newTasks = [...extractedTasks]
                        newTasks[index].description = e.target.value
                        setExtractedTasks(newTasks)
                      }}
                      className="w-full bg-slate-600 text-white rounded-lg px-3 py-2 border border-slate-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Responsable</label>
                      <input
                        type="text"
                        value={task.responsible || ''}
                        onChange={(e) => {
                          const newTasks = [...extractedTasks]
                          newTasks[index].responsible = e.target.value
                          setExtractedTasks(newTasks)
                        }}
                        placeholder="Nombre del responsable"
                        className="w-full bg-slate-600 text-white rounded-lg px-3 py-2 border border-slate-500 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Fecha límite</label>
                      <input
                        type="date"
                        value={task.deadline || ''}
                        onChange={(e) => {
                          const newTasks = [...extractedTasks]
                          newTasks[index].deadline = e.target.value
                          setExtractedTasks(newTasks)
                        }}
                        className="w-full bg-slate-600 text-white rounded-lg px-3 py-2 border border-slate-500 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Proyecto/Contexto</label>
                    <input
                      type="text"
                      value={task.project || ''}
                      onChange={(e) => {
                        const newTasks = [...extractedTasks]
                        newTasks[index].project = e.target.value
                        setExtractedTasks(newTasks)
                      }}
                      placeholder="Nombre del proyecto"
                      className="w-full bg-slate-600 text-white rounded-lg px-3 py-2 border border-slate-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  
                  <button
                    onClick={() => {
                      const newTasks = extractedTasks.filter((_, i) => i !== index)
                      setExtractedTasks(newTasks)
                    }}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Eliminar tarea
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex space-x-4">
            <button
              onClick={confirmTasks}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              Confirmar y Guardar
            </button>
            <button
              onClick={cancelMeeting}
              className="px-6 py-3 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors font-medium"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
