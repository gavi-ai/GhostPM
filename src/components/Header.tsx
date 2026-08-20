import React from 'react';
import { 
  Bot, 
  Database, 
  Zap, 
  FileText, 
  Activity, 
  Code2, 
  Clock, 
  DollarSign, 
  Sparkles, 
  Sliders, 
  ShieldCheck, 
  CheckCircle2,
  Sun,
  Moon
} from 'lucide-react';
import { StatsSummary, User, SupabaseStatus } from '../types';
import { UserProfileMenu } from './UserProfileMenu';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  stats: StatsSummary | null;
  onOpenArchitecture: () => void;
  user: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onUpdateProfile: (updated: Partial<User>) => Promise<void>;
  userProjectsCount: number;
  onOpenHybridConfig: () => void;
  onOpenSecurity: () => void;
  onOpenSupabase: () => void;
  supabaseStatus: SupabaseStatus | null;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  stats,
  onOpenArchitecture,
  user,
  onOpenAuth,
  onLogout,
  onUpdateProfile,
  userProjectsCount,
  onOpenHybridConfig,
  onOpenSecurity,
  onOpenSupabase,
  supabaseStatus,
  theme,
  onToggleTheme,
}) => {
  const tabs = [
    { id: 'synthesizer', label: 'PM Synthesizer', icon: Zap },
    { id: 'artifacts', label: 'SOW & Dev Tickets', icon: FileText },
    { id: 'projects', label: 'Past Projects (RAG)', icon: Database },
    { id: 'cache', label: 'Semantic Cache ($0)', icon: Sparkles },
    { id: 'audit', label: 'Audit & Telemetry', icon: Activity },
  ];

  return (
    <header className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-zinc-800 sticky top-0 z-40 transition-colors">
      {/* Top Banner with Stats, Branding & User Auth */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Identity */}
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-sm text-white font-bold">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
                  Ghost<span className="text-emerald-600 dark:text-emerald-400">PM</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/70 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 rounded-full">
                  Neo-SaaS 2024
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-normal hidden sm:block">
                AI Technical PM & Benchmark Pricing Engine
              </p>
            </div>
          </div>

          {/* Right Action, Live Telemetry & User Profile Section */}
          <div className="flex items-center space-x-2 text-xs">
            {/* Dark / Light Mode Switch Button */}
            <button
              id="theme-toggle-btn"
              onClick={onToggleTheme}
              className="bg-slate-50 hover:bg-slate-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 border border-slate-200/90 dark:border-zinc-700 rounded-xl px-2.5 py-1.5 flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs active:scale-[0.97]"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Dark / Light Mode"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400 animate-in spin-in-180 duration-200" />
                  <span className="hidden sm:inline font-semibold text-[11px]">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-500 animate-in spin-in-180 duration-200" />
                  <span className="hidden sm:inline font-semibold text-[11px]">Dark</span>
                </>
              )}
            </button>

            {/* Live Supabase Connection Pill */}
            <button
              id="header-supabase-status-btn"
              onClick={onOpenSupabase}
              className="bg-slate-50 hover:bg-slate-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 border border-slate-200/90 dark:border-zinc-700 rounded-xl px-3 py-1.5 flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs active:scale-[0.99]"
              title="Supabase PostgreSQL + pgvector Engine Status"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-[11px] text-slate-800 dark:text-zinc-200">Supabase pgvector</span>
              <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-mono hidden md:inline">({supabaseStatus?.latency_ms || 24}ms)</span>
            </button>

            {/* 20/20 Security Standards Pill */}
            <button
              id="header-security-center-btn"
              onClick={onOpenSecurity}
              className="bg-slate-50 hover:bg-slate-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 border border-slate-200/90 dark:border-zinc-700 rounded-xl px-3 py-1.5 flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs active:scale-[0.99]"
              title="View 20 Enterprise Security Standards"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline font-semibold text-[11px]">20/20 Security</span>
            </button>

            {/* Hybrid RAG Weights Button */}
            <button
              id="header-hybrid-rag-btn"
              onClick={onOpenHybridConfig}
              className="bg-slate-50 hover:bg-slate-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 border border-slate-200/90 dark:border-zinc-700 rounded-xl px-3 py-1.5 flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs active:scale-[0.99]"
              title="Configure Dense + BM25 + Re-ranking weights"
            >
              <Sliders className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
              <span className="hidden lg:inline text-[11px] font-medium">Hybrid RAG</span>
            </button>

            {/* Blueprint Button */}
            <button
              id="view-blueprint-btn"
              onClick={onOpenArchitecture}
              className="bg-slate-50 hover:bg-slate-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 border border-slate-200/90 dark:border-zinc-700 rounded-xl px-3 py-1.5 flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs active:scale-[0.99]"
            >
              <Code2 className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
              <span className="hidden md:inline text-[11px] font-medium">SQL DDL</span>
            </button>

            {/* User Profile / Login Button */}
            <UserProfileMenu
              user={user}
              onOpenAuth={onOpenAuth}
              onLogout={onLogout}
              onUpdateProfile={onUpdateProfile}
              userProjectsCount={userProjectsCount}
            />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-slate-50/70 dark:bg-zinc-950/70 border-t border-slate-200/70 dark:border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1.5 overflow-x-auto py-2 scrollbar-none">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-zinc-800 text-emerald-700 dark:text-emerald-400 shadow-sm border border-slate-200/90 dark:border-zinc-700'
                      : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-white/60 dark:hover:bg-zinc-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-zinc-500'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};

