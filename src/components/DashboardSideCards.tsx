import React, { useState, useEffect } from 'react';
import { 
  Video, 
  Plus, 
  Play, 
  Pause, 
  Square, 
  Layers, 
  ShieldCheck, 
  Code2, 
  Sparkles, 
  Flame, 
  Bug,
  CheckCircle2
} from 'lucide-react';

interface DashboardSideCardsProps {
  onStartMeeting?: () => void;
  onNewTask?: () => void;
  confidenceScore?: number;
}

export const DashboardSideCards: React.FC<DashboardSideCardsProps> = ({
  onStartMeeting,
  onNewTask,
  confidenceScore = 84,
}) => {
  // Time Tracker state
  const [seconds, setSeconds] = useState(5048); // 01:24:08
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600).toString().padStart(2, '0');
    const mins = Math.floor((totalSec % 3600) / 60).toString().padStart(2, '0');
    const secs = (totalSec % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  const projectItems = [
    {
      title: 'Develop API Endpoints',
      due: 'Due date: Nov 26, 2024',
      iconColor: 'bg-blue-500 text-white',
      badge: '//',
    },
    {
      title: 'Onboarding Flow',
      due: 'Due date: Nov 28, 2024',
      iconColor: 'bg-teal-500 text-white',
      badge: '✦',
    },
    {
      title: 'Build Dashboard',
      due: 'Due date: Nov 30, 2024',
      iconColor: 'bg-emerald-500 text-white',
      badge: '❖',
    },
    {
      title: 'Optimize Page Load',
      due: 'Due date: Dec 5, 2024',
      iconColor: 'bg-amber-500 text-white',
      badge: '⚡',
    },
    {
      title: 'Cross-Browser Testing',
      due: 'Due date: Dec 6, 2024',
      iconColor: 'bg-purple-500 text-white',
      badge: '●',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Reminders Card */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4">
        <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider block">
          Reminders
        </span>
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
            Meeting with Arc Company
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 font-medium">
            Time : 02.00 pm - 04.00 pm
          </p>
        </div>
        <button
          onClick={onStartMeeting}
          className="w-full py-3 px-4 rounded-2xl bg-[#155e42] hover:bg-[#114b35] text-white text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-xs active:scale-[0.98]"
        >
          <Video className="w-4 h-4" />
          <span>Start Meeting</span>
        </button>
      </div>

      {/* 2. Project Checklist Card */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
            Project
          </h3>
          <button
            onClick={onNewTask}
            className="px-3 py-1 rounded-full border border-slate-200 dark:border-zinc-700 text-[11px] font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 flex items-center space-x-1 transition-all cursor-pointer shadow-xs"
          >
            <Plus className="w-3 h-3" />
            <span>New</span>
          </button>
        </div>

        <div className="space-y-3">
          {projectItems.map((item, idx) => (
            <div key={idx} className="flex items-center space-x-3 group cursor-pointer">
              <div className={`w-8 h-8 rounded-xl ${item.iconColor} flex items-center justify-center font-bold text-xs shrink-0 shadow-xs`}>
                {item.badge}
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                  {item.title}
                </h4>
                <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium">
                  {item.due}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Project Progress Card (Semi-circle Arc Gauge) */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
          Project Progress
        </h3>

        {/* Semi-circular gauge container */}
        <div className="relative flex flex-col items-center justify-center pt-2">
          <div className="relative w-44 h-24 overflow-hidden flex items-end justify-center">
            {/* Background Arch */}
            <div className="absolute top-0 w-44 h-44 rounded-full border-[18px] border-slate-100 dark:border-zinc-800 border-b-transparent border-l-transparent -rotate-45" />
            {/* Filled Forest Green Arch */}
            <div className="absolute top-0 w-44 h-44 rounded-full border-[18px] border-transparent border-t-[#155e42] border-r-[#155e42] -rotate-45" />
            {/* Center Label */}
            <div className="text-center mb-1 z-10">
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-sans">
                41%
              </div>
              <div className="text-[10px] font-semibold text-slate-400 dark:text-zinc-500">
                Project Ended
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-[11px] pt-3 border-t border-slate-100 dark:border-zinc-800/80 text-slate-500 dark:text-zinc-400">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#155e42]" />
            <span>Completed</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0c3b2e]" />
            <span>In Progress</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-zinc-700" />
            <span>Pending</span>
          </div>
        </div>
      </div>

      {/* 4. Time Tracker Card (Dark Forest Green Textured Card) */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0a3124] to-[#041a13] dark:from-zinc-900 dark:to-zinc-950 p-6 text-white shadow-md relative overflow-hidden border border-emerald-900/40 space-y-4">
        {/* Subtle glowing lines in background */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

        <span className="text-xs font-semibold text-emerald-200/80 uppercase tracking-wider block">
          Time Tracker
        </span>

        <div className="text-center py-2">
          <div className="text-4xl font-extrabold tracking-tight font-mono text-white">
            {formatTime(seconds)}
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-center space-x-3 pt-1">
          <button
            onClick={() => setIsActive(!isActive)}
            className="w-10 h-10 rounded-full bg-white text-[#155e42] flex items-center justify-center hover:bg-emerald-50 transition-all cursor-pointer shadow-sm active:scale-95"
            title={isActive ? 'Pause Timer' : 'Resume Timer'}
          >
            {isActive ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>
          <button
            onClick={() => {
              setIsActive(false);
              setSeconds(0);
            }}
            className="w-10 h-10 rounded-full bg-rose-500/90 text-white flex items-center justify-center hover:bg-rose-600 transition-all cursor-pointer shadow-sm active:scale-95"
            title="Reset Timer"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
};
