import React from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Database, 
  Sparkles, 
  Activity, 
  Settings, 
  ShieldCheck, 
  Sliders, 
  Code2, 
  HelpCircle, 
  LogOut, 
  Sun, 
  Moon, 
  Layers,
  ArrowUpRight,
  Download,
  Bot
} from 'lucide-react';
import { SupabaseStatus, User } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  devTicketsCount?: number;
  pastProjectsCount?: number;
  onOpenHybridConfig: () => void;
  onOpenSecurity: () => void;
  onOpenSupabase: () => void;
  onOpenArchitecture: () => void;
  supabaseStatus: SupabaseStatus | null;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  user: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onSeedDatabase: () => void;
  isSyncing: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  devTicketsCount = 12,
  pastProjectsCount = 9,
  onOpenHybridConfig,
  onOpenSecurity,
  onOpenSupabase,
  onOpenArchitecture,
  supabaseStatus,
  theme,
  onToggleTheme,
  user,
  onOpenAuth,
  onLogout,
  onSeedDatabase,
  isSyncing,
}) => {
  const menuItems = [
    {
      id: 'synthesizer',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'artifacts',
      label: 'Tasks',
      icon: CheckSquare,
      badge: `${devTicketsCount > 0 ? devTicketsCount : 12}+`,
    },
    {
      id: 'projects',
      label: 'Projects (RAG)',
      icon: Database,
      badge: `${pastProjectsCount}`,
    },
    {
      id: 'cache',
      label: 'Analytics ($0)',
      icon: Sparkles,
      badge: null,
    },
    {
      id: 'audit',
      label: 'Telemetry',
      icon: Activity,
      badge: null,
    },
  ];

  return (
    <aside className="w-64 shrink-0 bg-[#f8fafc] dark:bg-zinc-950 p-5 flex flex-col justify-between border-r border-slate-200/80 dark:border-zinc-800/80 min-h-screen transition-colors">
      <div className="space-y-7">
        {/* Logo / Brand Header */}
        <div className="flex items-center space-x-3 px-2">
          <div className="w-10 h-10 rounded-2xl bg-[#155e42] dark:bg-emerald-600 flex items-center justify-center text-white shadow-xs">
            {/* Geometric Loop icon resembling Donezo */}
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 14a4 4 0 1 1 4-4 4 4 0 0 1-4 4z" />
            </svg>
          </div>
          <div>
            <span className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight font-sans">
              Ghost<span className="text-[#155e42] dark:text-emerald-400">PM</span>
            </span>
          </div>
        </div>

        {/* MENU Section */}
        <div className="space-y-1.5">
          <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-2">
            MENU
          </div>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`sidebar-tab-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#155e42] dark:bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-200/60 dark:hover:bg-zinc-800/60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-zinc-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold font-mono ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-[#155e42]/10 dark:bg-emerald-950/60 text-[#155e42] dark:text-emerald-400 border border-[#155e42]/20'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* GENERAL Section */}
        <div className="space-y-1.5">
          <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-2">
            GENERAL
          </div>
          <div className="space-y-0.5">
            {/* Settings / Hybrid RAG */}
            <button
              id="sidebar-hybrid-rag-btn"
              onClick={onOpenHybridConfig}
              className="w-full flex items-center space-x-3 px-3.5 py-2 rounded-2xl text-xs font-medium text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-200/60 dark:hover:bg-zinc-800/60 transition-all cursor-pointer"
            >
              <Sliders className="w-4 h-4 text-slate-400 dark:text-zinc-500" />
              <span>Settings</span>
            </button>

            {/* 20/20 Security Center */}
            <button
              id="sidebar-security-center-btn"
              onClick={onOpenSecurity}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-2xl text-xs font-medium text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-200/60 dark:hover:bg-zinc-800/60 transition-all cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Security (20/20)</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </button>

            {/* Supabase pgvector */}
            <button
              id="sidebar-supabase-btn"
              onClick={onOpenSupabase}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-2xl text-xs font-medium text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-200/60 dark:hover:bg-zinc-800/60 transition-all cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <Database className="w-4 h-4 text-slate-400 dark:text-zinc-500" />
                <span>Supabase Sync</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                {supabaseStatus?.latency_ms || 24}ms
              </span>
            </button>

            {/* SQL Blueprint */}
            <button
              id="sidebar-sql-btn"
              onClick={onOpenArchitecture}
              className="w-full flex items-center space-x-3 px-3.5 py-2 rounded-2xl text-xs font-medium text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-200/60 dark:hover:bg-zinc-800/60 transition-all cursor-pointer"
            >
              <Code2 className="w-4 h-4 text-slate-400 dark:text-zinc-500" />
              <span>SQL Blueprint</span>
            </button>

            {/* Theme Toggle */}
            <button
              id="sidebar-theme-toggle-btn"
              onClick={onToggleTheme}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-2xl text-xs font-medium text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-200/60 dark:hover:bg-zinc-800/60 transition-all cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-500" />
                )}
                <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono capitalize">{theme}</span>
            </button>

            {/* Auth / Logout */}
            {user ? (
              <button
                id="sidebar-logout-btn"
                onClick={onLogout}
                className="w-full flex items-center space-x-3 px-3.5 py-2 rounded-2xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
                <span>Logout</span>
              </button>
            ) : (
              <button
                id="sidebar-signin-btn"
                onClick={onOpenAuth}
                className="w-full flex items-center space-x-3 px-3.5 py-2 rounded-2xl text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-all cursor-pointer"
              >
                <Bot className="w-4 h-4 text-emerald-600" />
                <span>Sign In / Profile</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Promo Card (Donezo Dark Green Graphic Card) */}
      <div className="mt-6 rounded-3xl bg-gradient-to-br from-[#0c3b2e] to-[#06241c] dark:from-zinc-900 dark:to-zinc-950 p-5 text-white shadow-md relative overflow-hidden border border-emerald-900/40">
        {/* Subtle geometric wave background effect */}
        <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-emerald-500/10 blur-xl pointer-events-none" />
        <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center mb-3">
          <Database className="w-4 h-4 text-emerald-300" />
        </div>
        <h4 className="text-xs font-bold text-white tracking-tight">
          Supabase pgvector
        </h4>
        <p className="text-[11px] text-emerald-100/70 mt-1 leading-relaxed">
          128-dim RAG database & $0 semantic caching active
        </p>
        <button
          onClick={onSeedDatabase}
          disabled={isSyncing}
          className="mt-3.5 w-full py-2 px-3 bg-[#155e42] hover:bg-[#1a7352] text-white text-[11px] font-bold rounded-xl transition-all cursor-pointer shadow-xs flex items-center justify-center space-x-1.5 active:scale-[0.98]"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{isSyncing ? 'Seeding...' : 'Seed Benchmarks'}</span>
        </button>
      </div>
    </aside>
  );
};
