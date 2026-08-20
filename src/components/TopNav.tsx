import React, { useState } from 'react';
import { 
  Search, 
  Mail, 
  Bell, 
  Sun, 
  Moon, 
  Sparkles,
  Command
} from 'lucide-react';
import { User, SupabaseStatus } from '../types';
import { UserProfileMenu } from './UserProfileMenu';

interface TopNavProps {
  user: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onUpdateProfile: (updated: Partial<User>) => Promise<void>;
  userProjectsCount: number;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onSearch?: (query: string) => void;
  onOpenEmailArtifact?: () => void;
  onOpenSupabase?: () => void;
  supabaseStatus: SupabaseStatus | null;
}

export const TopNav: React.FC<TopNavProps> = ({
  user,
  onOpenAuth,
  onLogout,
  onUpdateProfile,
  userProjectsCount,
  theme,
  onToggleTheme,
  onSearch,
  onOpenEmailArtifact,
  onOpenSupabase,
  supabaseStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [hasNotifications, setHasNotifications] = useState(true);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
  };

  return (
    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 sm:px-0">
      {/* Search Bar matching Donezo pill style */}
      <form onSubmit={handleSearchSubmit} className="w-full sm:max-w-md relative">
        <div className="flex items-center bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-full px-4 py-2.5 shadow-xs focus-within:ring-2 focus-within:ring-[#155e42]/20 focus-within:border-[#155e42] transition-all">
          <Search className="w-4 h-4 text-slate-400 dark:text-zinc-500 mr-2.5 shrink-0" />
          <input
            type="text"
            placeholder="Search task, project, or SOW benchmark..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-slate-800 dark:text-zinc-200 placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none"
          />
          <div className="flex items-center space-x-1 pl-2 border-l border-slate-200 dark:border-zinc-800 text-[10px] font-mono text-slate-400 dark:text-zinc-500 shrink-0">
            <Command className="w-3 h-3" />
            <span>F</span>
          </div>
        </div>
      </form>

      {/* Right Controls: Mail, Notification, Theme, and Profile */}
      <div className="flex items-center space-x-2.5 self-end sm:self-auto">
        {/* Email / Messages Icon */}
        <button
          onClick={onOpenEmailArtifact}
          className="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 flex items-center justify-center text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all cursor-pointer shadow-xs"
          title="Founder Email Drafts"
          aria-label="Founder Email Drafts"
        >
          <Mail className="w-4 h-4" />
        </button>

        {/* Notifications Icon */}
        <button
          onClick={() => setHasNotifications(false)}
          className="relative w-10 h-10 rounded-full bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 flex items-center justify-center text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all cursor-pointer shadow-xs"
          title="Notifications & Telemetry Alerts"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          {hasNotifications && (
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900" />
          )}
        </button>

        {/* Theme Toggle Button */}
        <button
          id="top-theme-toggle-btn"
          onClick={onToggleTheme}
          className="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 flex items-center justify-center text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all cursor-pointer shadow-xs"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-500" />
          )}
        </button>

        {/* User Profile Menu Pill (Totok Michael style) */}
        <div className="flex items-center pl-1">
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
  );
};
