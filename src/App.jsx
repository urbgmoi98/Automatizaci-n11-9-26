import { useSmartPrioritizer } from './Hooks/useSmartPrioritizer';
import { StatusBadge } from './Components/StatusBadge';
import { TaskList } from './Components/TaskList';
import { PanicModal } from './Components/PanicModal';
import { RefreshCw, Clock, Database, Sparkles } from 'lucide-react';

function App() {
  const { tasks, state, panicSuggestions, triggerManual, resolvePanic, config } = useSmartPrioritizer();

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-indigo-500/30">
      {/* Fondo decorativo */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[60%] h-[60%] rounded-full bg-purple-600/10 blur-[120px]" />
      </div>

      <div className="relative max-w-2xl mx-auto px-4 py-12">
        {/* Header Glassmorphism */}
        <header className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 mb-8 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-indigo-400 mb-2">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-bold tracking-widest uppercase">Automatización React v2.0</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Priorizador Inteligente</h1>
            </div>
            <StatusBadge state={state} />
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <Clock className="w-5 h-5 text-indigo-400 mb-2" />
              <div className="text-2xl font-bold text-white">{config.intervalMs / 1000}s</div>
              <div className="text-xs text-slate-400">Intervalo Auto</div>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <Database className="w-5 h-5 text-emerald-400 mb-2" />
              <div className="text-2xl font-bold text-white">{tasks.length}</div>
              <div className="text-xs text-slate-400">Tareas Activas</div>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <RefreshCw className={`w-5 h-5 text-amber-400 mb-2 ${state === 'running' ? 'animate-spin' : ''}`} />
              <div className="text-2xl font-bold text-white capitalize">{state === 'inactive' ? 'Listo' : state}</div>
              <div className="text-xs text-slate-400">Estado Motor</div>
            </div>
          </div>
        </header>

        {/* Controles y Lista */}
        <div className="space-y-4">
          <button
            onClick={triggerManual}
            disabled={state === 'running' || state === 'panic'}
            className="w-full group relative overflow-hidden bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-semibold transition-all active:scale-[0.99]"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <RefreshCw className={`w-5 h-5 ${state === 'running' ? 'animate-spin' : ''}`} />
              {state === 'running' ? 'Procesando Priorización...' : 'Ejecutar Automatización Manual'}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          </button>

          <TaskList tasks={tasks} currentState={state} />
        </div>
      </div>

      {/* Modal Sorpresa */}
      <PanicModal 
        suggestions={panicSuggestions} 
        onResolve={resolvePanic} 
        isVisible={state === 'panic'} 
      />
    </div>
  );
}

export default App;