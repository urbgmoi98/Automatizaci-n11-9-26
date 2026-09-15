import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Zap, ShieldAlert } from 'lucide-react';

export function PanicModal({ suggestions, onResolve, isVisible }) {
  return (
    <AnimatePresence>
      {isVisible && suggestions && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-slate-900 border border-red-500/30 rounded-2xl shadow-[0_0_50px_rgba(239,68,68,0.15)] max-w-md w-full overflow-hidden"
          >
            <div className="bg-gradient-to-r from-red-900/50 to-orange-900/50 p-6 border-b border-red-500/20">
              <div className="flex items-center gap-3 mb-2">
                <ShieldAlert className="w-8 h-8 text-red-400 animate-pulse" />
                <h2 className="text-2xl font-bold text-white font-mono tracking-tighter">PROTOCOL_PANIC</h2>
              </div>
              <p className="text-red-200/80 text-sm font-mono">
                &gt; {suggestions.overdueCount} critical failures detected in task queue
              </p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-red-950/30 p-4 rounded-xl border border-red-500/20 font-mono text-sm">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-amber-300">SUGGESTED_ACTION:</h3>
                    <p className="text-slate-300 mt-1">{suggestions.suggestedAction}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={onResolve}
                className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white py-3.5 rounded-xl font-bold font-mono tracking-wider transition-all active:scale-[0.98] shadow-lg shadow-red-900/20"
              >
                EXECUTE_CONTINGENCY
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}