// Simulación persistente usando localStorage como "db.json"
const STORAGE_KEY = 'cyber_tasks_db';

export const initialDB = {
  tasks: [
    { id: "1", title: "Inyectar payload en mainframe", deadline: "2026-09-14T18:00:00", completed: false },
    { id: "2", title: "Descifrar hash SHA-256", deadline: "2026-09-15T12:00:00", completed: false },
    { id: "3", title: "Evadir firewall corporativo", deadline: "2026-09-16T09:00:00", completed: false },
    { id: "4", title: "Extraer logs de acceso", deadline: "2026-09-18T17:00:00", completed: false },
    { id: "5", title: "Compilar kernel personalizado", deadline: "2026-09-20T10:00:00", completed: false }
  ],
  config: { intervalMs: 8000, panicThreshold: 3 }
};

export const loadDB = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : initialDB;
};

export const saveDB = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};