import { Clock, AlertTriangle, Check, Terminal, Trash2 } from 'lucide-react';

export function TaskList({ tasks, onToggle, onDelete }) {
  if (tasks.length === 0) return (
    <div className="text-center py-12 text-slate-500 font-mono">
      <Terminal className="w-8 h-8 mx-auto mb-2 opacity-50" />
      NO_DATA_FOUND
    </div>
  );

  return (
    <div className="space-y-3 mt-6 font-mono">
      {tasks.map((task, index) => {
        const isOverdue = new Date(task.deadline) < new Date() && !task.completed;
        return (
          <div 
            key={task.id} 
            className={`group relative p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 hover:translate-x-1 ${
              isOverdue 
                ? 'border-red-500/30 bg-red-950/20 hover:border-red-500/60' 
                : 'border-slate-700/50 bg-slate-900/40 hover:border-cyan-500/40'
            } ${task.completed ? 'opacity-60' : ''}`}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-3">
                <span className={`text-xs font-bold mt-1 ${isOverdue ? 'text-red-400' : 'text-cyan-400'}`}>
                  [{String(index + 1).padStart(2, '0')}]
                </span>
                <div>
                  <h3 className={`font-semibold ${isOverdue ? 'text-red-200' : 'text-slate-200'} ${task.completed ? 'line-through' : ''}`}>
                    {task.title}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500">
                    <Clock className="w-3 h-3" />
                    <span>DEADLINE: {new Date(task.deadline).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isOverdue && (
                  <div className="flex items-center gap-1 text-red-400 text-xs font-bold bg-red-950/50 px-2 py-1 rounded">
                    <AlertTriangle className="w-3 h-3" />
                    OVERDUE
                  </div>
                )}
                <button type="button" onClick={() => onToggle(task.id)} aria-label={task.completed ? 'Marcar como pendiente' : 'Completar tarea'} className="p-2 rounded-lg text-emerald-400 hover:bg-emerald-500/10">
                  <Check className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => onDelete(task.id)} aria-label="Eliminar tarea" className="p-2 rounded-lg text-red-400 hover:bg-red-500/10">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            {/* Línea de escaneo decorativa */}
            <div className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-cyan-500 to-transparent group-hover:w-full transition-all duration-500" />
          </div>
        );
      })}
    </div>
  );
}
