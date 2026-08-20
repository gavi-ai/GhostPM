import React from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Sparkles,
  Zap
} from 'lucide-react';
import { RiskAnalysis } from '../types';

interface RiskRadarProps {
  risks: RiskAnalysis[];
}

export const RiskRadar: React.FC<RiskRadarProps> = ({ risks }) => {
  const getRiskColor = (level: RiskAnalysis['risk_level']) => {
    switch (level) {
      case 'Critical':
        return {
          border: 'border-rose-200/90 dark:border-rose-900/50',
          bg: 'bg-rose-50/50 dark:bg-rose-950/30',
          badge: 'bg-rose-100 dark:bg-rose-900/60 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300',
          dot: 'bg-rose-600 dark:bg-rose-500',
        };
      case 'High':
        return {
          border: 'border-amber-200/90 dark:border-amber-900/50',
          bg: 'bg-amber-50/50 dark:bg-amber-950/30',
          badge: 'bg-amber-100 dark:bg-amber-900/60 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300',
          dot: 'bg-amber-600 dark:bg-amber-500',
        };
      case 'Medium':
        return {
          border: 'border-blue-200/90 dark:border-blue-900/50',
          bg: 'bg-blue-50/50 dark:bg-blue-950/30',
          badge: 'bg-blue-100 dark:bg-blue-900/60 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300',
          dot: 'bg-blue-600 dark:bg-blue-500',
        };
      default:
        return {
          border: 'border-slate-200 dark:border-zinc-800',
          bg: 'bg-slate-50 dark:bg-zinc-950',
          badge: 'bg-slate-100 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300',
          dot: 'bg-slate-500 dark:text-zinc-400',
        };
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-slate-100 dark:border-zinc-800">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Scope Creep & Technical Feasibility Radar</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
            Client Risk & Ambiguity Analysis
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 font-medium">
            Pre-flight warnings detected from raw transcripts to prevent budget overruns.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 font-semibold shadow-xs">
            {risks.length} Red Flags Flagged
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {risks.map((risk, idx) => {
          const colors = getRiskColor(risk.risk_level);

          return (
            <div
              key={idx}
              className={`rounded-2xl border p-5 space-y-3.5 transition-all shadow-xs ${colors.border} ${colors.bg}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${colors.dot}`} />
                  <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-zinc-400 tracking-wider">
                    {risk.category}
                  </span>
                </div>

                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-lg border ${colors.badge}`}
                >
                  {risk.risk_level} Risk
                </span>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-zinc-100 leading-snug">
                  {risk.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-zinc-400 mt-1 leading-relaxed">
                  {risk.description}
                </p>
              </div>

              {/* Mitigation Strategy */}
              <div className="bg-white/90 dark:bg-zinc-900/90 p-4 rounded-xl border border-slate-200/80 dark:border-zinc-800 space-y-1.5 shadow-xs">
                <div className="flex items-center space-x-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>PM Mitigation Strategy:</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed">
                  {risk.mitigation_strategy}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
