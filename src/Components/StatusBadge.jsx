import { Activity, AlertCircle, CheckCircle2, PauseCircle, Zap } from 'lucide-react';

export function StatusBadge({ state }) {
  const config = {
    inactive: { icon: PauseCircle, color: 'text-slate-400 border-slate-700 bg-slate-900/50', text: 'STANDBY' },
    running: { icon: Activity, color: 'text-cyan-400 border-cyan-500/50 bg-cyan-950/30 animate-pulse', text: 'PROCESSING' },
    success: { icon: CheckCircle2, color: 'text-emerald-400 border-emerald-500/50 bg-emerald-950/30', text: 'OPTIMIZED' },
    error: { icon: AlertCircle, color: 'text-red-400 border-red-500/50 bg-red-950/30', text: 'SYSTEM FAULT' },
    panic: { icon: Zap, color: 'text-amber-400 border-amber-500/50 bg-amber-950/30 animate-bounce', text: 'CRITICAL ALERT' },
  };

  const current = config[state] || config.inactive;
  const Icon = current.icon;

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-md font-mono text-xs tracking-widest ${current.color}`}>
      <Icon className="w-4 h-4" />
      {current.text}
    </div>
  );
}