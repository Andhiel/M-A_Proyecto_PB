import { useState } from 'react'
import { toast } from 'sonner'
import { Mic, LogIn, User, Lock, Sparkles } from 'lucide-react'

interface LoginProps {
  onLogin: (user: string) => void
}

const USERS = [
  { id: '1', username: 'admin', password: 'admin123', name: 'Administrador' },
  { id: '2', username: 'user', password: 'user123', name: 'Usuario' }
]

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    setTimeout(() => {
      const user = USERS.find(u => u.username === username && u.password === password)
      
      if (user) {
        toast.success(`¡Bienvenido, ${user.name}!`)
        onLogin(user.name)
      } else {
        setError('Credenciales inválidas')
        toast.error('Credenciales inválidas')
        setIsLoading(false)
      }
    }, 1000)
  }
  
  const handleQuickLogin = (userId: string) => {
    const user = USERS.find(u => u.id === userId)
    if (user) {
      setUsername(user.username)
      setPassword(user.password)
    }
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-2xl">
            <Mic className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">MeetingVoice</h1>
          <p className="text-slate-300">Transcripción inteligente de reuniones</p>
        </div>
        
        {/* Login Card */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <LogIn className="w-6 h-6 mr-2" />
            Iniciar Sesión
          </h2>
          
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Usuario
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="Ingrese su usuario"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="Ingrese su contraseña"
                  required
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                  Cargando...
                </span>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>
          
          {/* Quick Login Buttons */}
          <div className="mt-6 pt-6 border-t border-slate-700">
            <p className="text-sm text-slate-400 mb-3 text-center">Acceso rápido:</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleQuickLogin('1')}
                className="bg-slate-700/50 hover:bg-slate-700 text-slate-300 py-2 px-4 rounded-lg transition-all text-sm border border-slate-600 hover:border-blue-500"
              >
                Admin
              </button>
              <button
                onClick={() => handleQuickLogin('2')}
                className="bg-slate-700/50 hover:bg-slate-700 text-slate-300 py-2 px-4 rounded-lg transition-all text-sm border border-slate-600 hover:border-purple-500"
              >
                Usuario
              </button>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <p className="text-center text-slate-400 text-sm mt-6">
          © 2024 MeetingVoice. Todos los derechos reservados.
        </p>
      </div>
    </div>
  )
}
