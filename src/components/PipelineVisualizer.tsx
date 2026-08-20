import React from 'react';
import { 
  FileText, 
  Binary, 
  ShieldCheck, 
  Database, 
  Cpu, 
  CheckCircle2, 
  Clock, 
  Zap, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { AuditLog } from '../types';

interface PipelineVisualizerProps {
  isLoading: boolean;
  activeStage?: number; // 1 to 5
  stageBreakdown?: AuditLog['stage_breakdown'];
  isCacheHit?: boolean;
  similarityScore?: number;
  confidenceScore?: number;
  matchedProjectsCount?: number;
}

export const PipelineVisualizer: React.FC<PipelineVisualizerProps> = ({
  isLoading,
  activeStage = 0,
  stageBreakdown,
  isCacheHit,
  similarityScore,
  confidenceScore,
  matchedProjectsCount = 2,
}) => {
  const stages = [
    {
      id: 1,
      name: 'Ingestion',
      desc: 'Sanitize unstructured raw input & strip noise',
      icon: FileText,
      ms: stageBreakdown?.ingestion_ms,
      color: 'emerald',
    },
    {
      id: 2,
      name: 'Vectorization',
      desc: '128-dim dense embedding mapping',
      icon: Binary,
      ms: stageBreakdown?.embedding_ms,
      color: 'teal',
    },
    {
      id: 3,
      name: 'Cache Gate',
      desc: isCacheHit ? `Hit! Sim: ${((similarityScore || 0.95) * 100).toFixed(1)}%` : 'Cache check ($0 engine)',
      icon: ShieldCheck,
      ms: stageBreakdown?.cache_check_ms,
      color: isCacheHit ? 'amber' : 'slate',
      badge: isCacheHit ? '$0 Cost Hit' : null,
    },
    {
      id: 4,
      name: 'RAG Retrieval',
      desc: isCacheHit ? 'Bypassed (0 tokens)' : `Top-${matchedProjectsCount} benchmark projects matched`,
      icon: Database,
      ms: stageBreakdown?.rag_retrieval_ms,
      color: 'indigo',
    },
    {
      id: 5,
      name: 'Gemini Synthesis',
      desc: isCacheHit 
        ? 'Instant Cache Replay' 
        : confidenceScore 
          ? `Grounded JSON & Confidence: ${confidenceScore}%` 
          : 'Strict JSON schema & JIRA tickets',
      icon: Cpu,
      ms: stageBreakdown?.llm_synthesis_ms,
      color: 'purple',
      badge: (!isCacheHit && confidenceScore) ? `${confidenceScore}% Confidence` : null,
    },
  ];

  const totalMs = stageBreakdown
    ? (Object.values(stageBreakdown) as number[]).reduce((a: number, b: number) => a + (Number(b) || 0), 0)
    : 0;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/80 dark:border-zinc-800">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 tracking-tight flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            GhostPM 5-Stage Synthesis Pipeline
          </h3>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          {isCacheHit ? (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 font-semibold">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Semantic Cache Hit ($0 LLM Cost)</span>
            </span>
          ) : totalMs > 0 ? (
            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
              <span>Total Latency: {totalMs}ms</span>
            </span>
          ) : null}
        </div>
      </div>

      {/* Steps Visual Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 relative">
        {stages.map((stage) => {
          const Icon = stage.icon;
          const isDone = Boolean(stageBreakdown && stage.ms !== undefined);
          const isCurrent = isLoading && activeStage === stage.id;
          const isBypassed = isCacheHit && (stage.id === 4 || stage.id === 5);

          let borderClass = 'border-slate-200/80 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-950/70 text-slate-600 dark:text-zinc-400';
          let iconClass = 'text-slate-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800';

          if (isCurrent) {
            borderClass = 'border-emerald-500 dark:border-emerald-500 bg-emerald-50/90 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 shadow-sm animate-pulse';
            iconClass = 'text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/80 border-emerald-300 dark:border-emerald-700';
          } else if (isBypassed) {
            borderClass = 'border-amber-200 dark:border-amber-900/50 bg-amber-50/70 dark:bg-amber-950/30 text-amber-900 dark:text-amber-300';
            iconClass = 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/80 border-amber-300 dark:border-amber-800';
          } else if (isDone) {
            borderClass = 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200 shadow-xs';
            iconClass = 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800';
          }

          return (
            <div
              key={stage.id}
              className={`relative flex flex-col p-4 rounded-2xl border transition-all ${borderClass}`}
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center border shadow-xs ${iconClass}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex items-center space-x-1 text-[11px] font-mono">
                  {stage.ms !== undefined ? (
                    <span className="text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200/60 dark:border-emerald-800">
                      {stage.ms}ms
                    </span>
                  ) : (
                    <span className="text-slate-400 dark:text-zinc-500 font-medium">Stage {stage.id}</span>
                  )}
                </div>
              </div>

              <div className="text-xs font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-1">
                {stage.name}
                {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 inline" />}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed font-normal">
                {stage.desc}
              </p>

              {stage.badge && (
                <div className="mt-2.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300/80 dark:border-amber-800">
                    {stage.badge}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
