export function StatusBadge({ state }) {
  const config = {
    inactive: { color: 'bg-gray-500', text: '⏸️ Inactivo' },
    running: { color: 'bg-blue-500 animate-pulse', text: '⚙️ Ejecutando...' },
    success: { color: 'bg-green-500', text: '✅ Priorizado' },
    error: { color: 'bg-red-500', text: '❌ Error' },
  };

  const current = config[state] || config.inactive;

  return (
    <span className={`${current.color} text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300`}>
      {current.text}
    </span>
  );
}