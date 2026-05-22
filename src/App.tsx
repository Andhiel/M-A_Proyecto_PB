import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import MeetingRecorder from './components/MeetingRecorder'
import Dashboard from './components/Dashboard'
import LoadingScreen from './components/LoadingScreen'
import Login from './components/Login'
import LandingPage from './components/LandingPage'
import ThemeToggle from './components/ThemeToggle'
import { Mic, LayoutDashboard, LogOut, User } from 'lucide-react'

type ViewState = 'loading' | 'landing' | 'login' | 'meeting' | 'dashboard'

function App() {
  const [viewState, setViewState] = useState<ViewState>('loading')
  const [currentUser, setCurrentUser] = useState<string | null>(null)
  const [currentView, setCurrentView] = useState<'meeting' | 'dashboard'>('meeting')

  const handleLoadingComplete = () => {
    setViewState('landing')
  }

  const handleGetStarted = () => {
    setViewState('login')
  }

  const handleLogin = (username: string) => {
    setCurrentUser(username)
    setViewState('meeting')
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setViewState('landing')
  }

  if (viewState === 'loading') {
    return <LoadingScreen onComplete={handleLoadingComplete} />
  }

  if (viewState === 'landing') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <LandingPage onGetStarted={handleGetStarted} />
      </motion.div>
    )
  }

  if (viewState === 'login') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Login onLogin={handleLogin} />
      </motion.div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <nav className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
                <Mic className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">MeetingVoice</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 bg-slate-700/50 px-3 py-2 rounded-lg">
                <User className="w-4 h-4 text-slate-400" />
                <span className="text-slate-300 text-sm">{currentUser}</span>
              </div>
              
              <div className="flex space-x-2">
                <ThemeToggle />
                <button
                  onClick={() => setCurrentView('meeting')}
                  className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                    currentView === 'meeting'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Mic className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Reunión</span>
                </button>
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                    currentView === 'dashboard'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Dashboard</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 rounded-lg transition-colors text-slate-300 hover:bg-red-600 hover:text-white"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline ml-2">Salir</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentView === 'meeting' ? <MeetingRecorder /> : <Dashboard />}
          </motion.div>
        </AnimatePresence>
      </main>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default App
