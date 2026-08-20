import React, { useState } from 'react';
import { 
  Activity, 
  Clock, 
  DollarSign, 
  Zap, 
  CheckCircle2, 
  Search, 
  ChevronRight, 
  FileText, 
  Cpu, 
  Database, 
  ShieldCheck, 
  Sparkles,
  X
} from 'lucide-react';
import { AuditLog } from '../types';

interface AuditLogsViewProps {
  logs: AuditLog[];
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ logs }) => {
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const totalCost = logs.reduce((acc, l) => acc + l.cost_usd, 0);
  const totalHours = logs.reduce((acc, l) => acc + l.time_saved_hours, 0);
  const cacheHitCount = logs.filter((l) => l.cache_hit).length;
  const avgLatency =
    logs.length > 0
      ? Math.round(logs.reduce((acc, l) => acc + l.latency_ms, 0) / logs.length)
      : 0;

  return (
    <div className="space-y-6">
      {/* Header & Telemetry Summary */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
            <Activity className="w-3.5 h-3.5" />
            <span>Audit Logging & Telemetry Engine</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
            Execution Telemetry & ROI Metrics
          </h1>
          <p className="text-xs text-slate-600 dark:text-zinc-400 mt-1.5 max-w-2xl leading-relaxed">
            Every client synthesis run is audited for token usage, API cost in USD, end-to-end latency, and estimated PM engineering time saved.
          </p>
        </div>

        {/* Telemetry Numbers Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-2">
          <div className="bg-slate-50/80 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl p-4.5">
            <span className="text-[11px] text-slate-500 dark:text-zinc-400 block font-medium">Total Ingested Runs</span>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-zinc-100 mt-1 block tracking-tight">
              {logs.length}
            </span>
          </div>

          <div className="bg-slate-50/80 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl p-4.5">
            <span className="text-[11px] text-slate-500 dark:text-zinc-400 block font-medium">Cumulative PM Hours</span>
            <span className="text-2xl font-extrabold text-teal-600 dark:text-teal-400 mt-1 block tracking-tight">
              {totalHours.toFixed(1)} hrs
            </span>
          </div>

          <div className="bg-slate-50/80 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl p-4.5">
            <span className="text-[11px] text-slate-500 dark:text-zinc-400 block font-medium">Avg Pipeline Latency</span>
            <span className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1 block tracking-tight">
              {avgLatency} ms
            </span>
          </div>

          <div className="bg-slate-50/80 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl p-4.5">
            <span className="text-[11px] text-slate-500 dark:text-zinc-400 block font-medium">LLM API Spend</span>
            <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 block tracking-tight">
              ${totalCost.toFixed(4)}
            </span>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-zinc-800 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wider">
            Run Logs History ({logs.length})
          </h3>
          <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Click any run for stage breakdown</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-zinc-300">
            <thead className="bg-slate-50 dark:bg-zinc-950 text-slate-500 dark:text-zinc-400 font-semibold border-b border-slate-200/80 dark:border-zinc-800 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Run ID</th>
                <th className="px-4 py-3.5">Timestamp</th>
                <th className="px-4 py-3.5">Input Snippet</th>
                <th className="px-4 py-3.5">Cache Status</th>
                <th className="px-4 py-3.5">Latency</th>
                <th className="px-4 py-3.5">Tokens</th>
                <th className="px-4 py-3.5">API Cost</th>
                <th className="px-4 py-3.5">PM Time Saved</th>
                <th className="px-4 py-3.5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/80">
              {logs.map((log) => (
                <tr
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3.5 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                    {log.id}
                  </td>
                  <td className="px-4 py-3.5 text-slate-500 dark:text-zinc-400 font-mono text-[11px]">
                    {new Date(log.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </td>
                  <td className="px-4 py-3.5 max-w-xs truncate text-slate-900 dark:text-zinc-200 font-medium">
                    "{log.query_snippet}"
                  </td>
                  <td className="px-4 py-3.5">
                    {log.cache_hit ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-500/40 text-amber-800 dark:text-amber-300 font-semibold text-[10px]">
                        <Zap className="w-2.5 h-2.5 text-amber-500" />
                        <span>Cache Hit ($0)</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 text-[10px] font-medium">
                        <span>Fresh LLM Run</span>
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-slate-700 dark:text-zinc-300 font-medium">
                    {log.latency_ms} ms
                  </td>
                  <td className="px-4 py-3.5 font-mono text-slate-500 dark:text-zinc-400">
                    {log.tokens_used}
                  </td>
                  <td className="px-4 py-3.5 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                    ${log.cost_usd.toFixed(4)}
                  </td>
                  <td className="px-4 py-3.5 text-teal-700 dark:text-teal-300 font-semibold font-mono">
                    +{log.time_saved_hours}h
                  </td>
                  <td className="px-4 py-3.5 text-slate-400 dark:text-zinc-400">
                    <ChevronRight className="w-4 h-4" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Run Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-200/80 dark:border-zinc-800">
              <div className="flex items-center space-x-2">
                <span className="text-base font-bold text-slate-900 dark:text-zinc-100 font-mono">
                  {selectedLog.id}
                </span>
                {selectedLog.cache_hit && (
                  <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30">
                    Cache Hit
                  </span>
                )}
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-zinc-100 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-slate-500 dark:text-zinc-400 font-medium block mb-1">
                  Query Snippet:
                </span>
                <p className="p-3.5 bg-slate-50 dark:bg-zinc-950 rounded-xl border border-slate-200/80 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 leading-relaxed font-medium">
                  "{selectedLog.query_snippet}"
                </p>
              </div>

              {/* Stage Latencies */}
              <div>
                <span className="text-slate-500 dark:text-zinc-400 font-medium block mb-2">
                  Stage Latency Breakdown (Total: {selectedLog.latency_ms}ms):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <div className="bg-slate-50 dark:bg-zinc-950 p-3 rounded-xl border border-slate-200/80 dark:border-zinc-800">
                    <span className="text-slate-400 dark:text-zinc-500 block text-[10px] font-medium">1. Ingestion</span>
                    <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                      {selectedLog.stage_breakdown.ingestion_ms} ms
                    </span>
                  </div>
                  <div className="bg-slate-50 dark:bg-zinc-950 p-3 rounded-xl border border-slate-200/80 dark:border-zinc-800">
                    <span className="text-slate-400 dark:text-zinc-500 block text-[10px] font-medium">2. Vectorization</span>
                    <span className="font-mono font-bold text-teal-700 dark:text-teal-400 text-sm">
                      {selectedLog.stage_breakdown.embedding_ms} ms
                    </span>
                  </div>
                  <div className="bg-slate-50 dark:bg-zinc-950 p-3 rounded-xl border border-slate-200/80 dark:border-zinc-800">
                    <span className="text-slate-400 dark:text-zinc-500 block text-[10px] font-medium">3. Cache Gate</span>
                    <span className="font-mono font-bold text-amber-700 dark:text-amber-400 text-sm">
                      {selectedLog.stage_breakdown.cache_check_ms} ms
                    </span>
                  </div>
                  <div className="bg-slate-50 dark:bg-zinc-950 p-3 rounded-xl border border-slate-200/80 dark:border-zinc-800">
                    <span className="text-slate-400 dark:text-zinc-500 block text-[10px] font-medium">4. RAG Retrieval</span>
                    <span className="font-mono font-bold text-indigo-700 dark:text-indigo-400 text-sm">
                      {selectedLog.stage_breakdown.rag_retrieval_ms} ms
                    </span>
                  </div>
                  <div className="bg-slate-50 dark:bg-zinc-950 p-3 rounded-xl border border-slate-200/80 dark:border-zinc-800">
                    <span className="text-slate-400 dark:text-zinc-500 block text-[10px] font-medium">5. LLM Synthesis</span>
                    <span className="font-mono font-bold text-purple-700 dark:text-purple-400 text-sm">
                      {selectedLog.stage_breakdown.llm_synthesis_ms} ms
                    </span>
                  </div>
                  <div className="bg-slate-50 dark:bg-zinc-950 p-3 rounded-xl border border-slate-200/80 dark:border-zinc-800">
                    <span className="text-slate-400 dark:text-zinc-500 block text-[10px] font-medium">6. Validation & Commit</span>
                    <span className="font-mono font-bold text-slate-700 dark:text-zinc-300 text-sm">
                      {selectedLog.stage_breakdown.validation_ms} ms
                    </span>
                  </div>
                </div>
              </div>

              {/* Matched Reference Projects */}
              {selectedLog.matched_projects && selectedLog.matched_projects.length > 0 && (
                <div>
                  <span className="text-slate-500 dark:text-zinc-400 font-medium block mb-1.5">
                    Grounded Historical Benchmark Projects:
                  </span>
                  <div className="space-y-1.5">
                    {selectedLog.matched_projects.map((proj, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-50 dark:bg-zinc-950 p-3 rounded-xl border border-slate-200/80 dark:border-zinc-800 flex items-center justify-between"
                      >
                        <span className="font-semibold text-slate-800 dark:text-zinc-200">{proj.name}</span>
                        <div className="flex items-center space-x-2 font-mono text-[11px]">
                          <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                            ${proj.budget.toLocaleString()}
                          </span>
                          <span className="text-slate-400 dark:text-zinc-600">|</span>
                          <span className="text-teal-700 dark:text-teal-300 font-semibold">{proj.timeline} Wks</span>
                          <span className="text-slate-400 dark:text-zinc-600">|</span>
                          <span className="text-indigo-700 dark:text-indigo-400 font-bold">
                            {(proj.similarity * 100).toFixed(1)}% Sim
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3.5 border-t border-slate-200/80 dark:border-zinc-800 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 text-xs font-semibold cursor-pointer transition-colors shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
