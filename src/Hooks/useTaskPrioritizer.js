import { useState, useEffect, useRef } from 'react';

// Simulación de proceso asíncrono (ej. llamada a API o cálculo pesado)
const simulatePrioritizationAPI = async (tasks) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const now = new Date();
      const sorted = [...tasks].sort((a, b) => {
        const dateA = new Date(a.deadline);
        const dateB = new Date(b.deadline);
        // Lógica: Si ya pasó la fecha, prioridad máxima (0). 
        // Si no, ordenar por cercanía.
        if (dateA < now && dateB >= now) return -1;
        if (dateB < now && dateA >= now) return 1;
        return dateA - dateB;
      });
      resolve(sorted);
    }, 1500); // Simula 1.5s de procesamiento
  });
};

export function useTaskPrioritizer(initialTasks, autoIntervalMs = 10000) {
  const [tasks, setTasks] = useState(initialTasks);
  const [automationState, setAutomationState] = useState('inactive'); // inactive | running | success | error
  const intervalRef = useRef(null);

  // Función principal de automatización
  const runPrioritization = async () => {
    setAutomationState('running');
    try {
      const prioritizedTasks = await simulatePrioritizationAPI(tasks);
      setTasks(prioritizedTasks);
      setAutomationState('success');
      
      // Resetear estado a inactivo después de 2 segundos para feedback visual
      setTimeout(() => setAutomationState('inactive'), 2000);
    } catch (err) {
      console.error("Error en automatización:", err);
      setAutomationState('error');
    }
  };

  // useEffect para el disparador basado en tiempo (Trigger: Temporizador)
  useEffect(() => {
    // Iniciar intervalo solo si hay tareas
    if (tasks.length > 0) {
      intervalRef.current = setInterval(runPrioritization, autoIntervalMs);
    }

    // LIMPIEZA CORRECTA: Evitar fugas de memoria al desmontar
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [tasks.length, autoIntervalMs]); 

  // Disparador manual adicional
  const triggerManual = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    runPrioritization();
    // Reiniciar intervalo tras ejecución manual
    intervalRef.current = setInterval(runPrioritization, autoIntervalMs);
  };

  return { tasks, automationState, triggerManual, setTasks };
}