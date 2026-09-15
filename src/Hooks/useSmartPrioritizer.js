import { useState, useEffect, useCallback, useRef } from 'react';
import { loadDB, saveDB } from '../db';

export function useSmartPrioritizer() {
  const [tasks, setTasks] = useState(() => loadDB().tasks);
  const [config] = useState(() => loadDB().config);
  const [state, setState] = useState('inactive');
  const [panicSuggestions, setPanicSuggestions] = useState(null);
  const intervalRef = useRef(null);

  const runAutomation = useCallback(async () => {
    if (state === 'running') return;
    setState('running');

    try {
      await new Promise(r => setTimeout(r, 1200)); // Simular procesamiento CPU
      
      const now = new Date();
      const sorted = [...tasks].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
      const overdueCount = sorted.filter(t => !t.completed && new Date(t.deadline) < now).length;
      
      const db = loadDB();
      db.tasks = sorted;
      saveDB(db);
      setTasks(sorted);

      if (overdueCount >= config.panicThreshold) {
        setState('panic');
        setPanicSuggestions({
          overdueCount,
          suggestedAction: 'Ejecutar protocolo de contingencia: Reprogramar +24h',
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

  useEffect(() => {
    if (tasks.length > 0 && state !== 'panic') {
      intervalRef.current = setInterval(runAutomation, config.intervalMs);
    }
    return () => clearInterval(intervalRef.current);
  }, [runAutomation, config.intervalMs, tasks.length, state]);

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

    const db = loadDB();
    db.tasks = updatedTasks;
    saveDB(db);
    
    setTasks(updatedTasks);
    setPanicSuggestions(null);
    setState('success');
    setTimeout(() => setState('inactive'), 2000);
  }, [tasks]);

  return { tasks, state, panicSuggestions, triggerManual: runAutomation, resolvePanic, config };
}
