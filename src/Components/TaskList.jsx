export function TaskList({ tasks }) {
  if (tasks.length === 0) return <p className="text-gray-400">No hay tareas.</p>;

  return (
    <ul className="space-y-2 mt-4">
      {tasks.map((task, index) => {
        const isOverdue = new Date(task.deadline) < new Date();
        return (
          <li key={task.id} className={`p-3 rounded border-l-4 shadow-sm flex justify-between items-center ${isOverdue ? 'border-red-500 bg-red-50' : 'border-blue-500 bg-white'}`}>
            <div>
              <span className="font-semibold text-gray-800">#{index + 1} {task.title}</span>
              <p className="text-xs text-gray-500">Vence: {new Date(task.deadline).toLocaleDateString()}</p>
            </div>
            {isOverdue && <span className="text-xs font-bold text-red-600">URGENTE</span>}
          </li>
        );
      })}
    </ul>
  );
}