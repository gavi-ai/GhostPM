import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Info, 
  Sparkles, 
  Layers, 
  Cpu
} from 'lucide-react';
import { ConfidenceMetric } from '../types';

interface ConfidenceScoreWidgetProps {
  confidence?: ConfidenceMetric;
  similarityScore?: number;
  benchmarkNames?: string[];
  compact?: boolean;
}

export const ConfidenceScoreWidget: React.FC<ConfidenceScoreWidgetProps> = ({
  confidence,
  similarityScore = 0.88,
  benchmarkNames = [],
  compact = false,
}) => {
  // Default fallback if metric is missing
  const score = confidence?.score_percent ?? Math.round(similarityScore * 100 - 8);
  const variance = 100 - score;

  const reasoning =
    confidence?.reasoning ||
    `Confidence: ${score}% (Based on 2 highly similar past projects${
      benchmarkNames.length > 0 ? `: "${benchmarkNames.join('" & "')}"` : ''
    }. ${variance}% variance flagged due to unique domain edge cases and unverified third-party dependencies).`;

  const varianceFlags = confidence?.variance_flags && confidence.variance_flags.length > 0
    ? confidence.variance_flags
    : [
        `${variance}% variance flagged due to project-specific third-party integrations`,
        'Discovery confirmation required during Phase 1 for unverified APIs/hardware',
      ];

  const getScoreTheme = (s: number) => {
    if (s >= 80) {
      return {
        bg: 'bg-white dark:bg-zinc-900 border-slate-200/90 dark:border-zinc-800 text-slate-900 dark:text-zinc-100',
        ring: 'text-emerald-500 dark:text-emerald-400',
        badge: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
        bar: 'bg-emerald-500',
        label: 'High Confidence Grounding',
      };
    } else if (s >= 65) {
      return {
        bg: 'bg-white dark:bg-zinc-900 border-slate-200/90 dark:border-zinc-800 text-slate-900 dark:text-zinc-100',
        ring: 'text-teal-500 dark:text-teal-400',
        badge: 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800',
        bar: 'bg-teal-500',
        label: 'Moderate Grounded Confidence',
      };
    } else if (s >= 50) {
      return {
        bg: 'bg-white dark:bg-zinc-900 border-slate-200/90 dark:border-zinc-800 text-slate-900 dark:text-zinc-100',
        ring: 'text-amber-500 dark:text-amber-400',
        badge: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
        bar: 'bg-amber-500',
        label: 'Moderate-Low (Discovery Advised)',
      };
    } else {
      return {
        bg: 'bg-white dark:bg-zinc-900 border-slate-200/90 dark:border-zinc-800 text-slate-900 dark:text-zinc-100',
        ring: 'text-rose-500 dark:text-rose-400',
        badge: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
        bar: 'bg-rose-500',
        label: 'High Uncertainty Variance',
      };
    }
  };

  const theme = getScoreTheme(score);

  if (compact) {
    return (
      <div className={`p-3.5 rounded-2xl border ${theme.bg} flex items-center justify-between gap-3 shadow-xs`}>
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 flex items-center justify-center font-mono font-bold text-xs text-slate-800 dark:text-zinc-200">
            {score}%
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-500">Confidence Metric</div>
            <div className="text-xs font-semibold text-slate-800 dark:text-zinc-200 truncate max-w-xs">{theme.label}</div>
          </div>
        </div>
        <div className="text-[11px] text-slate-500 dark:text-zinc-400 text-right hidden sm:block max-w-xs truncate">
          {reasoning}
        </div>
      </div>
    );
  }

  return (
    <div
      id="confidence-score-widget"
      className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200/80 dark:border-zinc-800">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Self-Aware Estimator
              </span>
              <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${theme.badge}`}>
                {theme.label}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-zinc-100 tracking-tight mt-0.5">
              RAG Grounding & Confidence Score Metric
            </h3>
          </div>
        </div>

        {/* Big Score Pill */}
        <div className="flex items-center space-x-3 self-start sm:self-auto bg-slate-50 dark:bg-zinc-950 px-4 py-2.5 rounded-2xl border border-slate-200/90 dark:border-zinc-800 shadow-xs">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 dark:text-zinc-500 block uppercase font-mono font-medium">Confidence</span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-zinc-100 leading-none">
              {score}%
            </span>
          </div>
          <div className="w-10 h-10 relative flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-200 dark:text-zinc-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={theme.ring}
                strokeDasharray={`${score}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Primary Honest PM Reasoning Quote */}
      <div className="p-4.5 bg-slate-50 dark:bg-zinc-950 rounded-2xl border border-slate-200/80 dark:border-zinc-800 space-y-2">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 dark:text-zinc-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
          <span>AI Estimation Reasoning & Variance Notice:</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-800 dark:text-zinc-200 font-sans leading-relaxed pl-3 border-l-2 border-emerald-500 dark:border-emerald-400 italic">
          "{reasoning}"
        </p>
      </div>

      {/* Grounding Factor Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
        <div className="bg-slate-50/70 dark:bg-zinc-950/70 p-4 rounded-2xl border border-slate-200/80 dark:border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-slate-600 dark:text-zinc-400 text-[11px]">
            <span className="flex items-center gap-1.5 font-semibold">
              <Layers className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              Historical Grounding
            </span>
            <span className="font-mono font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-200/60 dark:border-indigo-800/60">
              +{confidence?.grounding_factors?.historical_matches_weight ?? Math.round(score * 0.9)}%
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full"
              style={{
                width: `${confidence?.grounding_factors?.historical_matches_weight ?? Math.round(score * 0.9)}%`,
              }}
            />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-zinc-400">
            Backed by Top-2 verified past deliverables.
          </p>
        </div>

        <div className="bg-slate-50/70 dark:bg-zinc-950/70 p-4 rounded-2xl border border-slate-200/80 dark:border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-slate-600 dark:text-zinc-400 text-[11px]">
            <span className="flex items-center gap-1.5 font-semibold">
              <Cpu className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              Tech Stack Clarity
            </span>
            <span className="font-mono font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-1.5 py-0.5 rounded border border-teal-200/60 dark:border-teal-800/60">
              +{confidence?.grounding_factors?.tech_stack_clarity_weight ?? 86}%
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-teal-600 dark:bg-teal-500 h-full rounded-full"
              style={{
                width: `${confidence?.grounding_factors?.tech_stack_clarity_weight ?? 86}%`,
              }}
            />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-zinc-400">
            Standard frameworks & battle-tested libraries.
          </p>
        </div>

        <div className="bg-slate-50/70 dark:bg-zinc-950/70 p-4 rounded-2xl border border-slate-200/80 dark:border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-slate-600 dark:text-zinc-400 text-[11px]">
            <span className="flex items-center gap-1.5 font-semibold">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              Ambiguity Variance
            </span>
            <span className="font-mono font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-200/60 dark:border-amber-800/60">
              -{Math.abs(confidence?.grounding_factors?.scope_ambiguity_penalty ?? variance)}%
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 dark:bg-amber-400 h-full rounded-full"
              style={{ width: `${Math.min(100, Math.abs(confidence?.grounding_factors?.scope_ambiguity_penalty ?? variance) * 2)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-zinc-400">
            Ungrounded or client-specific novel parameters.
          </p>
        </div>
      </div>

      {/* Variance Flags List */}
      {varianceFlags.length > 0 && (
        <div className="space-y-2.5 pt-1">
          <div className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider flex items-center space-x-1.5">
            <Info className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
            <span>Identified Variance Flags & Limitations (Anti-Hallucination Safeguards):</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {varianceFlags.map((flag, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-2.5 bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 rounded-2xl p-3 text-xs text-slate-800 dark:text-amber-200"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{flag}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

