import { useState, useEffect, useCallback, useRef } from 'react';

const API_URL = 'http://localhost:3001';

export function useSmartPrioritizer() {
  const [tasks, setTasks] = useState([]);
  const [config, setConfig] = useState({ intervalMs: 10000, panicThreshold: 3 });
  const [state, setState] = useState('inactive'); // inactive | running | success | error | panic
  const [panicSuggestions, setPanicSuggestions] = useState(null);
  const intervalRef = useRef(null);

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      try {
        const [tasksRes, configRes] = await Promise.all([
          fetch(`${API_URL}/tasks`),
          fetch(`${API_URL}/automationConfig`)
        ]);
        setTasks(await tasksRes.json());
        setConfig(await configRes.json());
      } catch (e) {
        console.error("Error cargando datos:", e);
        setState('error');
      }
    };
    loadData();
  }, []);

  // Lógica core de priorización + Modo Pánico
  const runAutomation = useCallback(async () => {
    if (state === 'running') return;
    setState('running');

    try {
      // Simular latencia de red realista
      await new Promise(r => setTimeout(r, 800));
      
      const now = new Date();
      const sorted = [...tasks].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
      
      const overdueCount = sorted.filter(t => !t.completed && new Date(t.deadline) < now).length;
      
      // Persistir orden actualizado
      await fetch(`${API_URL}/tasks`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sorted)
      });

      setTasks(sorted);

      // 🚨 FUNCIÓN SORPRESA: MODO PÁNICO INTELIGENTE
      if (overdueCount >= config.panicThreshold) {
        setState('panic');
        setPanicSuggestions({
          overdueCount,
          suggestedAction: 'Reprogramar todas las tareas vencidas para mañana +1 día',
          affectedTasks: sorted.filter(t => !t.completed && new Date(t.deadline) < now)
        });
      } else {
        setState('success');
        setTimeout(() => setState('inactive'), 2500);
      }
    } catch (err) {
      console.error(err);
      setState('error');
    }
  }, [tasks, config, state]);

  // Trigger temporal con limpieza
  useEffect(() => {
    if (tasks.length > 0 && state !== 'panic') {
      intervalRef.current = setInterval(runAutomation, config.intervalMs);
    }
    return () => clearInterval(intervalRef.current);
  }, [runAutomation, config.intervalMs, tasks.length, state]);

  // Acción para resolver el pánico
  const resolvePanic = useCallback(async () => {
    setState('running');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const updatedTasks = tasks.map(t => {
      if (!t.completed && new Date(t.deadline) < new Date()) {
        return { ...t, deadline: tomorrow.toISOString() };
      }
      return t;
    });

    await fetch(`${API_URL}/tasks`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTasks)
    });

    setTasks(updatedTasks);
    setPanicSuggestions(null);
    setState('success');
    setTimeout(() => setState('inactive'), 2000);
  }, [tasks]);

  return { 
    tasks, state, panicSuggestions, 
    triggerManual: runAutomation, 
    resolvePanic,
    config 
  };
}