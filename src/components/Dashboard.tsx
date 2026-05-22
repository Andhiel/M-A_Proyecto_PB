import { useState, useEffect } from 'react'
import { CheckCircle2, Circle, Calendar, Trash2 } from 'lucide-react'
import { Skeleton } from './ui/skeleton'

interface Task {
  id: number
  description: string
  responsible: string | null
  deadline: string | null
  project: string | null
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'completed' | 'observation'
  createdAt: string
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'observations' | 'high' | 'medium' | 'low'>('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = () => {
    setIsLoading(true)
    setTimeout(() => {
      const stored = localStorage.getItem('meetingTasks')
      if (stored) {
        const parsed = JSON.parse(stored)
        const validatedTasks: Task[] = parsed.map((task: any) => ({
          ...task,
          status: ['pending', 'completed', 'observation'].includes(task.status) 
            ? task.status as 'pending' | 'completed' | 'observation'
            : 'pending',
          priority: ['high', 'medium', 'low'].includes(task.priority)
            ? task.priority as 'high' | 'medium' | 'low'
            : 'medium'
        }))
        setTasks(validatedTasks)
      }
      setIsLoading(false)
    }, 500)
  }

  const toggleTaskStatus = (taskId: number) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId
        ? { ...task, status: task.status === 'pending' ? 'completed' : 'pending' }
        : task
    )
    setTasks(updatedTasks)
    localStorage.setItem('meetingTasks', JSON.stringify(updatedTasks))
  }

  const deleteTask = (taskId: number) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId)
    setTasks(updatedTasks)
    localStorage.setItem('meetingTasks', JSON.stringify(updatedTasks))
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return task.status !== 'observation'
    if (filter === 'pending') return task.status === 'pending'
    if (filter === 'completed') return task.status === 'completed'
    if (filter === 'observations') return task.status === 'observation'
    if (filter === 'high') return task.priority === 'high' && task.status !== 'observation'
    if (filter === 'medium') return task.priority === 'medium' && task.status !== 'observation'
    if (filter === 'low') return task.priority === 'low' && task.status !== 'observation'
    return true
  })

  const observations = tasks.filter(task => task.status === 'observation')

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (!a.deadline) return 1
    if (!b.deadline) return -1
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
  })

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-2xl font-bold text-white mb-4">Dashboard de Pendientes</h2>
        
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'pending' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Pendientes
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'completed' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Completadas
          </button>
          <button
            onClick={() => setFilter('high')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'high' ? 'bg-red-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            🔥 Alta
          </button>
          <button
            onClick={() => setFilter('medium')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'medium' ? 'bg-yellow-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            ⚡ Media
          </button>
          <button
            onClick={() => setFilter('low')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'low' ? 'bg-green-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            📌 Baja
          </button>
          <button
            onClick={() => setFilter('observations')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'observations' ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Observaciones
          </button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-700 rounded-lg p-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2 mb-2" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            ))}
          </div>
        ) : filter === 'observations' ? (
          <div className="space-y-3">
            {observations.length === 0 ? (
              <p className="text-slate-400 text-center py-8">No hay observaciones registradas</p>
            ) : (
              observations.map(task => (
                <div key={task.id} className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-slate-200 mb-2">{task.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-slate-400">
                        {task.project && (
                          <span className="bg-slate-600 px-2 py-1 rounded">{task.project}</span>
                        )}
                        <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-red-400 hover:text-red-300 ml-4"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {sortedTasks.length === 0 ? (
              <p className="text-slate-400 text-center py-8">
                No hay tareas registradas. Inicie una reunión para comenzar.
              </p>
            ) : (
              sortedTasks.map(task => (
                <div
                  key={task.id}
                  className={`bg-slate-700 rounded-lg p-4 ${
                    task.status === 'completed' ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <button
                        onClick={() => toggleTaskStatus(task.id)}
                        className="mt-1"
                      >
                        {task.status === 'completed' ? (
                          <CheckCircle2 className="w-6 h-6 text-green-500" />
                        ) : (
                          <Circle className="w-6 h-6 text-slate-400 hover:text-blue-500" />
                        )}
                      </button>
                      <div className="flex-1">
                        <p
                          className={`text-slate-200 mb-2 ${
                            task.status === 'completed' ? 'line-through' : ''
                          }`}
                        >
                          {task.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-sm">
                          {task.priority === 'high' && (
                            <span className="bg-red-600/30 text-red-300 px-2 py-1 rounded">
                              🔥 Alta
                            </span>
                          )}
                          {task.priority === 'medium' && (
                            <span className="bg-yellow-600/30 text-yellow-300 px-2 py-1 rounded">
                              ⚡ Media
                            </span>
                          )}
                          {task.priority === 'low' && (
                            <span className="bg-green-600/30 text-green-300 px-2 py-1 rounded">
                              📌 Baja
                            </span>
                          )}
                          {task.responsible && (
                            <span className="bg-blue-600/30 text-blue-300 px-2 py-1 rounded">
                              👤 {task.responsible}
                            </span>
                          )}
                          {task.deadline && (
                            <span className="bg-orange-600/30 text-orange-300 px-2 py-1 rounded flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(task.deadline).toLocaleDateString()}
                            </span>
                          )}
                          {task.project && (
                            <span className="bg-purple-600/30 text-purple-300 px-2 py-1 rounded">
                              📁 {task.project}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-red-400 hover:text-red-300 ml-4"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {observations.length > 0 && filter !== 'observations' && (
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-semibold text-white mb-4">Observaciones de Proyectos</h3>
          <div className="space-y-3">
            {observations.map(task => (
              <div key={task.id} className="bg-slate-700 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-slate-200 mb-2">{task.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-slate-400">
                      {task.project && (
                        <span className="bg-slate-600 px-2 py-1 rounded">{task.project}</span>
                      )}
                      <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-red-400 hover:text-red-300 ml-4"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
