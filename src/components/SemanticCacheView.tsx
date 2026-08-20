import React, { useState } from 'react';
import { 
  Sparkles, 
  Trash2, 
  Zap, 
  DollarSign, 
  Clock, 
  ArrowRight, 
  Search, 
  ShieldCheck, 
  Activity,
  Layers,
  HelpCircle,
  RefreshCw
} from 'lucide-react';
import { SemanticCacheEntry } from '../types';

interface SemanticCacheViewProps {
  cacheEntries: SemanticCacheEntry[];
  onInvalidateEntry: (id: string) => Promise<void>;
  onClearAllCache: () => Promise<void>;
  onSelectCachedItem: (entry: SemanticCacheEntry) => void;
}

export const SemanticCacheView: React.FC<SemanticCacheViewProps> = ({
  cacheEntries,
  onInvalidateEntry,
  onClearAllCache,
  onSelectCachedItem,
}) => {
  const [testQuery, setTestQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'table' | 'simulator'>('table');

  const totalHits = cacheEntries.reduce((acc, c) => acc + c.hits_count, 0);
  const totalSaved = cacheEntries.reduce(
    (acc, c) => acc + (c.cost_saved_usd || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header & Stats Card */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>The $0 Cost Semantic Engine</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
              Semantic Cache Gate ({cacheEntries.length} Stored Vectors)
            </h1>
            <p className="text-xs text-slate-600 dark:text-zinc-400 mt-1.5 max-w-2xl leading-relaxed">
              When a client requirement has ≥92% cosine similarity with a previous query, GhostPM bypasses the Gemini LLM entirely, serving verified blueprints in under 15ms at $0 API cost.
            </p>
          </div>

          <div className="flex items-center space-x-2 self-start md:self-auto">
            {cacheEntries.length > 0 && (
              <button
                id="clear-cache-btn"
                onClick={onClearAllCache}
                className="px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-800 hover:bg-rose-50 dark:hover:bg-rose-950/60 text-slate-700 dark:text-zinc-300 hover:text-rose-700 dark:hover:text-rose-400 border border-slate-200 dark:border-zinc-700 hover:border-rose-200 dark:hover:border-rose-800 text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs active:scale-[0.99]"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Flush Entire Cache</span>
              </button>
            )}
          </div>
        </div>

        {/* Real-time Cache ROI stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-5 border-t border-slate-100 dark:border-zinc-800">
          <div className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 rounded-2xl p-4.5 flex items-center space-x-3.5 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-700 dark:text-amber-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 block">Total Cache Hits</span>
              <span className="text-lg font-bold text-amber-900 dark:text-amber-300">{totalHits}</span>
            </div>
          </div>

          <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40 rounded-2xl p-4.5 flex items-center space-x-3.5 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 block">API Cost Saved</span>
              <span className="text-lg font-bold text-emerald-800 dark:text-emerald-300">
                ${totalSaved.toFixed(3)} USD
              </span>
            </div>
          </div>

          <div className="bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-900/40 rounded-2xl p-4.5 flex items-center space-x-3.5 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-700 dark:text-indigo-400">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 block">Avg Response Speed</span>
              <span className="text-lg font-bold text-indigo-900 dark:text-indigo-300">&lt; 15 ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cache Entries List */}
      {cacheEntries.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-3xl p-12 text-center space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-zinc-800 mx-auto flex items-center justify-center text-slate-400 dark:text-zinc-500">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">Semantic Cache is Empty</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
            Run a synthesis in the PM Synthesizer tab. Generated outputs will automatically be indexed into this cache table with their 128-dimensional embedding vectors.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400 px-1 font-semibold">
            <span>Cached Queries ({cacheEntries.length})</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-bold">Auto-Indexed with 128d Embeddings</span>
          </div>

          <div className="space-y-3.5">
            {cacheEntries.map((entry) => (
              <div
                key={entry.id}
                className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-5 shadow-xs space-y-3.5 hover:border-slate-300 dark:hover:border-zinc-700 hover:shadow-sm transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-[11px] font-mono font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                      {entry.client_query_hash}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-zinc-100 truncate max-w-md">
                      "{entry.query_preview}"
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 self-start sm:self-auto">
                    <div className="bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 px-2.5 py-1 rounded-lg text-[11px] text-slate-700 dark:text-zinc-300 font-semibold flex items-center space-x-1">
                      <Zap className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                      <span>{entry.hits_count} Hits</span>
                    </div>

                    <button
                      onClick={() => onSelectCachedItem(entry)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold transition-all cursor-pointer shadow-xs"
                    >
                      View SOW
                    </button>

                    <button
                      onClick={() => onInvalidateEntry(entry.id)}
                      className="p-1.5 text-slate-400 dark:text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400 transition-all cursor-pointer rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      title="Invalidate cache entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="text-slate-700 dark:text-zinc-300">
                    <strong className="text-slate-900 dark:text-zinc-100 font-bold">Title: </strong>
                    {entry.cached_json_response.sow.project_title}
                  </div>

                  <div className="flex items-center space-x-3 text-[11px] text-slate-500 dark:text-zinc-400 font-mono font-medium">
                    <span>
                      Est:{' '}
                      <strong className="text-emerald-700 dark:text-emerald-400 font-bold">
                        ${entry.cached_json_response.sow.estimated_budget_usd.recommended.toLocaleString()}
                      </strong>
                    </span>
                    <span>•</span>
                    <span>
                      {entry.cached_json_response.sow.estimated_timeline_weeks.recommended} Wks
                    </span>
                    <span>•</span>
                    <span>
                      {entry.cached_json_response.dev_tickets.length} Dev Tickets
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
