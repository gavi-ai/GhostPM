import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  Database, 
  Server, 
  FileCode2, 
  CheckCircle2, 
  X, 
  ExternalLink,
  Search,
  Filter
} from 'lucide-react';
import { ENTERPRISE_SECURITY_PILLARS } from '../data/securityStandards';
import { SecurityPillar } from '../types';

interface SecurityCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityCenterModal: React.FC<SecurityCenterModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const categories = ['All', 'Key & Secrets', 'Database & RLS', 'Auth & Session', 'API & Transport', 'Data Protection'];

  const filteredPillars = ENTERPRISE_SECURITY_PILLARS.filter((pillar) => {
    const matchesCategory = selectedCategory === 'All' || pillar.category === selectedCategory;
    const matchesSearch =
      pillar.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pillar.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pillar.technical_implementation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        id="security-center-modal"
        className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between bg-slate-50/80 dark:bg-zinc-950/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
                  Enterprise Security & Compliance Architecture
                </h2>
                <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-full">
                  20/20 Standards Active
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium mt-0.5">
                Strict enterprise-grade hardening across authentication, transport, RLS database storage & secret isolation.
              </p>
            </div>
          </div>

          <button
            id="close-security-modal-btn"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 p-2 rounded-xl hover:bg-slate-200/50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls & Search */}
        <div className="p-4 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/50 flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Category Tabs */}
          <div className="flex items-center space-x-1 overflow-x-auto w-full sm:w-auto scrollbar-none bg-slate-100/80 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 p-1 rounded-xl">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-white dark:bg-zinc-900 text-emerald-700 dark:text-emerald-400 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
            <input
              type="text"
              placeholder="Search security standard..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 shadow-xs"
            />
          </div>
        </div>

        {/* Standards Grid */}
        <div className="p-6 overflow-y-auto space-y-3 max-h-[calc(90vh-210px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredPillars.map((pillar) => (
              <div
                key={pillar.id}
                className="bg-slate-50/80 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 rounded-2xl p-4 transition-all flex flex-col justify-between group shadow-xs"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-200/70 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-300/50 dark:border-zinc-700">
                        #{pillar.id.toString().padStart(2, '0')}
                      </span>
                      <h3 className="text-xs font-bold text-slate-900 dark:text-zinc-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                        {pillar.name}
                      </h3>
                    </div>
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-full shrink-0">
                      <CheckCircle2 className="w-3 h-3" />
                      <span className="capitalize">{pillar.status}</span>
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed mb-3 font-normal">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-2 pt-2.5 border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 -mx-4 -mb-4 p-3 rounded-b-2xl shadow-xs">
                  <div className="text-[11px] font-mono text-slate-500 dark:text-zinc-400 flex items-center space-x-1.5">
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold">Implementation:</span>
                    <span className="truncate text-slate-700 dark:text-zinc-300">{pillar.technical_implementation}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredPillars.length === 0 && (
            <div className="text-center py-12 text-slate-400 dark:text-zinc-500 text-xs">
              No security standards matched your filter.
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-medium">Zero-Trust API Gateway with Automatic Secret Scrubbing</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200/80 dark:bg-zinc-800 hover:bg-slate-300 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
