import { useState, useEffect, useCallback, useRef } from 'react';
import { loadDB, saveDB } from '../db';

const PROCESSING_DELAY = 1200;

export function useSmartPrioritizer() {
  const [tasks, setTasks] = useState(() => loadDB().tasks);
  const [config] = useState(() => loadDB().config);
  const [state, setState] = useState('inactive');
  const [panicSuggestions, setPanicSuggestions] = useState(null);
  const tasksRef = useRef(tasks);
  const isRunningRef = useRef(false);
  const intervalRef = useRef(null);
  const resetTimerRef = useRef(null);
  const mountedRef = useRef(true);

  const setTemporaryState = useCallback((nextState, delay) => {
    clearTimeout(resetTimerRef.current);
    setState(nextState);
    resetTimerRef.current = setTimeout(() => {
      if (mountedRef.current) setState('inactive');
    }, delay);
  }, []);

  const persistTasks = useCallback((nextTasks) => {
    const db = loadDB();
    db.tasks = nextTasks;
    saveDB(db);
    tasksRef.current = nextTasks;
    setTasks(nextTasks);
  }, []);

  const runAutomation = useCallback(async () => {
    if (isRunningRef.current || tasksRef.current.length === 0) return;

    isRunningRef.current = true;
    clearTimeout(resetTimerRef.current);
    setState('running');

    try {
      await new Promise((resolve) => setTimeout(resolve, PROCESSING_DELAY));
      if (!mountedRef.current) return;

      const now = new Date();
      const sorted = [...tasksRef.current].sort(
        (a, b) => new Date(a.deadline) - new Date(b.deadline),
      );
      const overdueTasks = sorted.filter(
        (task) => !task.completed && new Date(task.deadline) < now,
      );

      persistTasks(sorted);

      if (overdueTasks.length >= config.panicThreshold) {
        setPanicSuggestions({
          overdueCount: overdueTasks.length,
          suggestedAction: 'Ejecutar protocolo de contingencia: Reprogramar +24h',
          affectedTasks: overdueTasks,
        });
        setState('panic');
      } else {
        setTemporaryState('success', 2500);
      }
    } catch (error) {
      console.error('No se pudo priorizar la cola de tareas:', error);
      setTemporaryState('error', 2500);
    } finally {
      isRunningRef.current = false;
    }
  }, [config.panicThreshold, persistTasks, setTemporaryState]);

  useEffect(() => {
    mountedRef.current = true;
    if (state !== 'panic') {
      intervalRef.current = setInterval(runAutomation, config.intervalMs);
    }

    return () => {
      mountedRef.current = false;
      clearInterval(intervalRef.current);
      clearTimeout(resetTimerRef.current);
    };
  }, [config.intervalMs, runAutomation, state]);

  const addTask = useCallback((title, deadline) => {
    const cleanTitle = title.trim();
    if (!cleanTitle || Number.isNaN(new Date(deadline).getTime())) return false;

    const id = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
    persistTasks([
      ...tasksRef.current,
      { id, title: cleanTitle, deadline: new Date(deadline).toISOString(), completed: false },
    ]);
    return true;
  }, [persistTasks]);

  const toggleTask = useCallback((id) => {
    persistTasks(tasksRef.current.map((task) => (
      task.id === id ? { ...task, completed: !task.completed } : task
    )));
  }, [persistTasks]);

  const removeTask = useCallback((id) => {
    persistTasks(tasksRef.current.filter((task) => task.id !== id));
  }, [persistTasks]);

  const clearCompleted = useCallback(() => {
    persistTasks(tasksRef.current.filter((task) => !task.completed));
  }, [persistTasks]);

  const resolvePanic = useCallback(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    persistTasks(tasksRef.current.map((task) => (
      !task.completed && new Date(task.deadline) < new Date()
        ? { ...task, deadline: tomorrow.toISOString() }
        : task
    )));
    setPanicSuggestions(null);
    setTemporaryState('success', 2000);
  }, [persistTasks, setTemporaryState]);

  return {
    tasks,
    state,
    panicSuggestions,
    config,
    triggerManual: runAutomation,
    resolvePanic,
    addTask,
    toggleTask,
    removeTask,
    clearCompleted,
  };
}
