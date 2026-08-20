import React, { useState, useRef, useEffect } from 'react';
import { 
  User as UserIcon, 
  LogOut, 
  Settings, 
  Building, 
  Shield, 
  Sparkles, 
  ChevronDown, 
  Check,
  FolderKanban,
  Clock,
  X
} from 'lucide-react';
import { User } from '../types';

interface UserProfileMenuProps {
  user: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onUpdateProfile: (updated: Partial<User>) => Promise<void>;
  userProjectsCount: number;
}

export const UserProfileMenu: React.FC<UserProfileMenuProps> = ({
  user,
  onOpenAuth,
  onLogout,
  onUpdateProfile,
  userProjectsCount,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Edit profile form state
  const [editName, setEditName] = useState('');
  const [editCompany, setEditCompany] = useState('');
  const [editRole, setEditRole] = useState<User['role']>('Lead PM');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setEditName(user.full_name);
      setEditCompany(user.company_name || '');
      setEditRole(user.role);
    }
  }, [user]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onUpdateProfile({
        full_name: editName,
        company_name: editCompany,
        role: editRole,
      });
      setShowEditModal(false);
      setIsOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <button
        id="header-auth-btn"
        onClick={onOpenAuth}
        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs active:scale-[0.99]"
      >
        <UserIcon className="w-3.5 h-3.5 text-white" />
        <span>Sign In / Profile</span>
      </button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        id="user-menu-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-700 border border-slate-200/90 dark:border-zinc-700 rounded-xl p-1.5 pr-3 transition-all cursor-pointer shadow-xs"
      >
        {user.avatar_url ? (
          <img
            src={user.avatar_url}
            alt={user.full_name}
            className="w-6 h-6 rounded-lg object-cover border border-slate-200 dark:border-zinc-700"
          />
        ) : (
          <div className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 font-bold text-xs flex items-center justify-center">
            {user.full_name.charAt(0)}
          </div>
        )}

        <div className="text-left hidden sm:block">
          <div className="text-xs font-semibold text-slate-800 dark:text-zinc-200 leading-none">
            {user.full_name}
          </div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold leading-tight mt-0.5">
            {user.role}
          </div>
        </div>

        <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="p-4 bg-slate-50/80 dark:bg-zinc-950/80 border-b border-slate-200/80 dark:border-zinc-800">
            <div className="flex items-center space-x-3">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.full_name}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-zinc-700"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 font-bold text-sm flex items-center justify-center">
                  {user.full_name.charAt(0)}
                </div>
              )}
              <div className="overflow-hidden">
                <h4 className="text-xs font-bold text-slate-900 dark:text-zinc-100 truncate">
                  {user.full_name}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">{user.email}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400">
                    {user.role}
                  </span>
                </div>
              </div>
            </div>

            {user.company_name && (
              <div className="mt-2.5 pt-2 border-t border-slate-200/80 dark:border-zinc-800 flex items-center space-x-1.5 text-[11px] text-slate-600 dark:text-zinc-400">
                <Building className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
                <span className="truncate">{user.company_name}</span>
              </div>
            )}
          </div>

          <div className="p-2 space-y-1 text-xs">
            <div className="p-2.5 bg-slate-50 dark:bg-zinc-950 rounded-xl border border-slate-200/70 dark:border-zinc-800 flex items-center justify-between text-[11px] text-slate-600 dark:text-zinc-400 my-1">
              <span className="flex items-center space-x-1.5">
                <FolderKanban className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="font-medium">My Projects:</span>
              </span>
              <span className="font-bold text-slate-900 dark:text-zinc-100 font-mono">{userProjectsCount}</span>
            </div>

            <button
              onClick={() => {
                setShowEditModal(true);
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-50 dark:hover:bg-zinc-800 flex items-center space-x-2 transition-colors cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
              <span>Edit Profile Details</span>
            </button>

            <button
              onClick={() => {
                onLogout();
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/50 flex items-center space-x-2 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-500" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-zinc-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                <Settings className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Edit Profile & Workspace Info
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1.5">Full Name:</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-zinc-900 transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1.5">Company / Studio:</label>
                <input
                  type="text"
                  value={editCompany}
                  onChange={(e) => setEditCompany(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-zinc-900 transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1.5">Role Title:</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-zinc-900 transition-all cursor-pointer"
                >
                  <option value="Lead PM">Lead PM</option>
                  <option value="Founder">Founder</option>
                  <option value="Engineering Manager">Engineering Manager</option>
                  <option value="Freelance Dev">Freelance Dev</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-200/80 dark:border-zinc-800 flex justify-end space-x-2.5">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 text-xs font-semibold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center space-x-1.5 cursor-pointer shadow-sm active:scale-[0.99] transition-all"
                >
                  {isSaving ? <span>Saving...</span> : <span>Save Changes</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
