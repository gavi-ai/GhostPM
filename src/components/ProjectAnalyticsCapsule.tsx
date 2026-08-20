import React from 'react';
import { Sparkles, BarChart2 } from 'lucide-react';

interface ProjectAnalyticsCapsuleProps {
  onExplore?: () => void;
}

export const ProjectAnalyticsCapsule: React.FC<ProjectAnalyticsCapsuleProps> = ({
  onExplore,
}) => {
  const days = [
    { day: 'S', height: 'h-24', type: 'striped', val: '40%' },
    { day: 'M', height: 'h-32', type: 'solid-dark', val: '65%' },
    { day: 'T', height: 'h-28', type: 'solid-mint', val: '74%', highlighted: true },
    { day: 'W', height: 'h-36', type: 'solid-deep', val: '92%' },
    { day: 'T', height: 'h-20', type: 'striped', val: '35%' },
    { day: 'F', height: 'h-28', type: 'striped', val: '50%' },
    { day: 'S', height: 'h-32', type: 'striped', val: '60%' },
  ];

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
          Project Analytics
        </h3>
        <span className="text-[11px] font-semibold text-slate-400 dark:text-zinc-500">
          This Week
        </span>
      </div>

      {/* Capsule Bars Container */}
      <div className="relative pt-6 pb-2">
        <div className="flex items-end justify-between gap-2 h-44 px-2">
          {days.map((item, index) => {
            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-3">
                {/* Floating pill badge for Tuesday */}
                {item.highlighted && (
                  <div className="absolute -top-1 px-2 py-0.5 rounded-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 shadow-xs text-[10px] font-bold text-slate-800 dark:text-zinc-200">
                    74%
                  </div>
                )}

                {/* Vertical Capsule Bar */}
                <div
                  className={`w-full max-w-[36px] ${item.height} rounded-full transition-all duration-300 hover:scale-105 ${
                    item.type === 'solid-deep'
                      ? 'bg-[#0f4a35] dark:bg-emerald-700'
                      : item.type === 'solid-dark'
                      ? 'bg-[#155e42] dark:bg-emerald-600'
                      : item.type === 'solid-mint'
                      ? 'bg-[#48bb78] dark:bg-emerald-500'
                      : 'bg-slate-100 dark:bg-zinc-800 border border-dashed border-slate-300 dark:border-zinc-700 bg-[linear-gradient(45deg,#f1f5f9_25%,transparent_25%,transparent_50%,#f1f5f9_50%,#f1f5f9_75%,transparent_75%,transparent)] dark:bg-[linear-gradient(45deg,#27272a_25%,transparent_25%,transparent_50%,#27272a_50%,#27272a_75%,transparent_75%,transparent)] bg-[size:8px_8px]'
                  }`}
                  title={`${item.day}: ${item.val}`}
                />

                {/* Day Label */}
                <span className="text-xs font-semibold text-slate-400 dark:text-zinc-500">
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
