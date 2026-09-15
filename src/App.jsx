import { useState } from 'react';
import { useTaskPrioritizer } from './Hooks/useTaskPrioritizer';
import { StatusBadge } from './Components/StatusBadge';
import { TaskList } from './Components/TaskList';

const MOCK_TASKS = [
  { id: 1, title: 'Revisar contrato anual', deadline: '2026-09-20' },
  { id: 2, title: 'Pagar factura proveedor', deadline: '2026-09-14' }, // Vencida ayer
  { id: 3, title: 'Actualizar documentación', deadline: '2026-09-25' },
  { id: 4, title: 'Deploy a producción', deadline: '2026-09-16' },
];

function App() {
  const { tasks, automationState, triggerManual, setTasks } = useTaskPrioritizer(MOCK_TASKS, 8000);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const task = {
      id: Date.now(),
      title: newTaskTitle,
      deadline: new Date(Date.now() + Math.random() * 1000000000).toISOString().split('T')[0]
    };
    setTasks(prev => [...prev, task]);
    setNewTaskTitle('');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">🤖 Auto-Priorizador</h1>
          <StatusBadge state={automationState} />
        </div>

        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded text-sm text-yellow-800 mb-4">
          ℹ️ La automatización se ejecuta cada 8 segundos o manualmente. Las tareas vencidas saltan al inicio.
        </div>

        <button 
          onClick={triggerManual}
          disabled={automationState === 'running'}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-2 rounded mb-4 transition-colors"
        >
          {automationState === 'running' ? 'Procesando...' : '⚡ Ejecutar Priorización Ahora'}
        </button>

        <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
          <input 
            type="text" 
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Nueva tarea..."
            className="flex-1 border p-2 rounded"
          />
          <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded">+</button>
        </form>

        <TaskList tasks={tasks} />
      </div>
    </div>
  );
}

export default App;