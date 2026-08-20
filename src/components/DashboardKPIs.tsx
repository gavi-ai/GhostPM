import React from 'react';
import { ArrowUpRight, CheckCircle2, TrendingUp, Sparkles, Database } from 'lucide-react';
import { StatsSummary } from '../types';

interface DashboardKPIsProps {
  stats: StatsSummary | null;
  totalProjectsCount: number;
  totalTicketsCount: number;
  cacheHitCount: number;
  confidenceScore?: number;
  onSelectMetric?: (metricId: string) => void;
}

export const DashboardKPIs: React.FC<DashboardKPIsProps> = ({
  stats,
  totalProjectsCount,
  totalTicketsCount,
  cacheHitCount,
  confidenceScore = 84,
  onSelectMetric,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {/* CARD 1: Total Projects (Signature Deep Forest Green) */}
      <div 
        onClick={() => onSelectMetric && onSelectMetric('projects')}
        className="bg-[#155e42] dark:bg-[#0f4a35] rounded-3xl p-6 text-white shadow-sm flex flex-col justify-between h-[175px] relative overflow-hidden transition-all hover:shadow-md cursor-pointer group"
      >
        <div className="flex items-start justify-between">
          <span className="text-xs font-semibold text-emerald-100/90 tracking-wide">
            Total Projects
          </span>
          <div className="w-8 h-8 rounded-full bg-white text-[#155e42] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-4xl font-extrabold tracking-tight font-sans text-white">
            {totalProjectsCount > 0 ? totalProjectsCount : 24}
          </div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#1e7a57] text-white text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
            <span>5 Increased from last month</span>
          </div>
        </div>
      </div>

      {/* CARD 2: Ended Projects / SOW Deliverables */}
      <div 
        onClick={() => onSelectMetric && onSelectMetric('artifacts')}
        className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between h-[175px] transition-all hover:shadow-md cursor-pointer group"
      >
        <div className="flex items-start justify-between">
          <span className="text-xs font-semibold text-slate-600 dark:text-zinc-400 tracking-wide">
            Ended Projects
          </span>
          <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 flex items-center justify-center group-hover:scale-105 transition-transform">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-4xl font-extrabold tracking-tight font-sans text-slate-900 dark:text-white">
            {stats?.completed_sows_count || 10}
          </div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 text-[11px] font-medium border border-slate-200/60 dark:border-zinc-700">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">6 ↗</span>
            <span>Increased from last month</span>
          </div>
        </div>
      </div>

      {/* CARD 3: Running Projects / Semantic Cache Hits */}
      <div 
        onClick={() => onSelectMetric && onSelectMetric('cache')}
        className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between h-[175px] transition-all hover:shadow-md cursor-pointer group"
      >
        <div className="flex items-start justify-between">
          <span className="text-xs font-semibold text-slate-600 dark:text-zinc-400 tracking-wide">
            Running Projects
          </span>
          <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 flex items-center justify-center group-hover:scale-105 transition-transform">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-4xl font-extrabold tracking-tight font-sans text-slate-900 dark:text-white">
            {cacheHitCount > 0 ? cacheHitCount : 12}
          </div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 text-[11px] font-medium border border-slate-200/60 dark:border-zinc-700">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">2 ↗</span>
            <span>Increased from last month</span>
          </div>
        </div>
      </div>

      {/* CARD 4: Pending Projects / Confidence Accuracy */}
      <div 
        onClick={() => onSelectMetric && onSelectMetric('synthesizer')}
        className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between h-[175px] transition-all hover:shadow-md cursor-pointer group"
      >
        <div className="flex items-start justify-between">
          <span className="text-xs font-semibold text-slate-600 dark:text-zinc-400 tracking-wide">
            Pending Project
          </span>
          <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 flex items-center justify-center group-hover:scale-105 transition-transform">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-4xl font-extrabold tracking-tight font-sans text-slate-900 dark:text-white">
            2
          </div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 text-[11px] font-medium border border-slate-200/60 dark:border-zinc-700">
            <span>On Discuss</span>
          </div>
        </div>
      </div>
    </div>
  );
};
