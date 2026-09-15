import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Zap, CalendarClock } from 'lucide-react';

export function PanicModal({ suggestions, onResolve, isVisible }) {
  return (
    <AnimatePresence>
      {isVisible && suggestions && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-red-100">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6 text-white">
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="w-8 h-8 animate-bounce" />
                <h2 className="text-2xl font-bold">¡MODO PÁNICO ACTIVADO!</h2>
              </div>
              <p className="opacity-90">Se detectaron {suggestions.overdueCount} tareas críticamente vencidas.</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-900">Acción Sugerida</h3>
                    <p className="text-sm text-red-700 mt-1">{suggestions.suggestedAction}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={onResolve}
                className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white py-3.5 rounded-xl font-medium transition-all active:scale-[0.98]"
              >
                <CalendarClock className="w-5 h-5" />
                Aplicar Reprogramación Inteligente
              </button>
              
              <p className="text-xs text-center text-gray-400">
                La automatización se pausará hasta resolver esta situación crítica
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}