import { useSmartPrioritizer } from './Hooks/useSmartPrioritizer';
import { StatusBadge } from './Components/StatusBadge';
import { TaskList } from './Components/TaskList';
import { PanicModal } from './Components/PanicModal';
import { MatrixBackground } from './Components/MatrixBackground';
import { Cpu, Database, Plus, Timer, TerminalSquare, Trash2 } from 'lucide-react';

function App() {
  const { tasks, state, panicSuggestions, triggerManual, resolvePanic, config, addTask, toggleTask, removeTask, clearCompleted } = useSmartPrioritizer();
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');
  const [formError, setFormError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!addTask(title, deadline)) {
      setFormError('Ingresa un título y una fecha límite válidos.');
      return;
    }
    setTitle('');
    setDeadline('');
    setFormError('');
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans relative overflow-x-hidden">
      <MatrixBackground />
      
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">
        {/* Header Terminal */}
        <header className="backdrop-blur-xl bg-slate-900/60 border border-slate-700/50 rounded-3xl p-8 mb-8 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 mb-2 font-mono text-xs">
                <TerminalSquare className="w-4 h-4" />
                <span>ROOT@PRIORITIZER:~$ ./start_automation.sh</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                PRIORIZADOR <span className="text-cyan-400">INTELIGENTE</span>
              </h1>
            </div>
            <StatusBadge state={state} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Timer, label: 'CYCLE_INTERVAL', value: `${config.intervalMs / 1000}s`, color: 'text-cyan-400' },
              { icon: Database, label: 'ACTIVE_NODES', value: tasks.length, color: 'text-emerald-400' },
              { icon: Cpu, label: 'ENGINE_STATUS', value: state.toUpperCase(), color: state === 'panic' ? 'text-amber-400' : 'text-slate-300' },
            ].map((stat, i) => (
              <div key={i} className="bg-slate-950/50 rounded-2xl p-4 border border-slate-800">
                <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
                <div className="text-2xl font-bold text-white font-mono">{stat.value}</div>
                <div className="text-[10px] text-slate-500 font-mono tracking-wider mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </header>

        <div className="space-y-4">
          <button
            onClick={triggerManual}
            disabled={state === 'running' || state === 'panic'}
            className="w-full group relative overflow-hidden bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-700 text-white py-4 rounded-2xl font-bold font-mono tracking-wider transition-all active:scale-[0.99]"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <Cpu className={`w-5 h-5 ${state === 'running' ? 'animate-spin' : ''}`} />
              {state === 'running' ? 'PROCESSING_QUEUE...' : 'EXECUTE_MANUAL_OVERRIDE'}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          </button>

          <form onSubmit={handleSubmit} className="grid gap-3 rounded-2xl border border-slate-700 bg-slate-900/60 p-4">
            <label className="text-left text-xs font-mono text-cyan-400" htmlFor="task-title">NEW_TASK</label>
            <input id="task-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Describe la tarea" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
            <label className="text-left text-xs font-mono text-cyan-400" htmlFor="task-deadline">DEADLINE</label>
            <input id="task-deadline" type="datetime-local" value={deadline} onChange={(event) => setDeadline(event.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
            {formError && <p className="text-left text-sm text-red-400">{formError}</p>}
            <button type="submit" className="flex items-center justify-center gap-2 rounded-xl bg-cyan-600 py-3 font-bold text-white hover:bg-cyan-500">
              <Plus className="w-4 h-4" /> ADD_TASK
            </button>
          </form>

          {tasks.some((task) => task.completed) && (
            <button type="button" onClick={clearCompleted} className="flex items-center gap-2 text-sm font-mono text-slate-400 hover:text-red-400">
              <Trash2 className="w-4 h-4" /> CLEAR_COMPLETED
            </button>
          )}

          <TaskList tasks={tasks} onToggle={toggleTask} onDelete={removeTask} />
        </div>
        
        <footer className="mt-12 text-center text-slate-600 text-xs font-mono">
          SYSTEM_OPERATIONAL • BINARY_STREAM_ACTIVE • v2.1.0
        </footer>
      </div>

      <PanicModal 
        suggestions={panicSuggestions} 
        onResolve={resolvePanic} 
        isVisible={state === 'panic'} 
      />
    </div>
  );
}

export default App;
import { useState } from 'react';
