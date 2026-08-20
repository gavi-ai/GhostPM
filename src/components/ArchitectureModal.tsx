import React, { useState, useEffect } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  X, 
  Database, 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  Terminal,
  Download
} from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [sqlSchema, setSqlSchema] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'manifesto' | 'sql'>('manifesto');

  useEffect(() => {
    if (isOpen && !sqlSchema) {
      fetch('/api/schema/sql')
        .then((res) => res.text())
        .then((data) => setSqlSchema(data))
        .catch((err) => console.error('Failed to load SQL blueprint:', err));
    }
  }, [isOpen, sqlSchema]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([sqlSchema], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ghostpm_supabase_pgvector_schema.sql';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 dark:bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 bg-slate-50/80 dark:bg-zinc-950/80 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold shadow-xs">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-zinc-100 tracking-tight flex items-center gap-2">
                GhostPM Technical Architecture & Supabase Blueprint
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
                Vector Retrieval (RAG), $0 Semantic Caching, and Strict Token Diet Manifesto
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-slate-100/80 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('manifesto')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'manifesto'
                    ? 'bg-white dark:bg-zinc-900 text-emerald-700 dark:text-emerald-400 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
                }`}
              >
                Manifesto & Flow
              </button>
              <button
                onClick={() => setActiveTab('sql')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'sql'
                    ? 'bg-white dark:bg-zinc-900 text-emerald-700 dark:text-emerald-400 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
                }`}
              >
                SQL Schema (pgvector)
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 rounded-xl hover:bg-slate-200/50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
          {activeTab === 'manifesto' ? (
            <div className="space-y-6">
              {/* Section 1: Core Backend Features */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  1. Core Backend Features (The PM Flex)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div className="bg-slate-50/80 dark:bg-zinc-950 p-4 rounded-2xl border border-slate-200/80 dark:border-zinc-800 space-y-1.5 shadow-xs">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 block text-xs">
                      ⚡ Vector Retrieval (RAG)
                    </span>
                    <p className="text-slate-600 dark:text-zinc-400">
                      Supabase pgvector retrieves actual past projects and historical pricing data. The agent never invents quotes from thin air; pricing is mathematically anchored.
                    </p>
                  </div>

                  <div className="bg-slate-50/80 dark:bg-zinc-950 p-4 rounded-2xl border border-slate-200/80 dark:border-zinc-800 space-y-1.5 shadow-xs">
                    <span className="font-bold text-amber-700 dark:text-amber-400 block text-xs">
                      💰 Semantic Caching (The $0 Cost Engine)
                    </span>
                    <p className="text-slate-600 dark:text-zinc-400">
                      Embedding cosine distance matches incoming requirements against past runs. If ≥92% match is found, Gemini LLM calls are bypassed completely, serving output in &lt;15ms.
                    </p>
                  </div>

                  <div className="bg-slate-50/80 dark:bg-zinc-950 p-4 rounded-2xl border border-slate-200/80 dark:border-zinc-800 space-y-1.5 shadow-xs">
                    <span className="font-bold text-teal-700 dark:text-teal-400 block text-xs">
                      🥗 Strict Token Diet
                    </span>
                    <p className="text-slate-600 dark:text-zinc-400">
                      We never feed bloated company history. Supabase retrieves strictly the Top-2 most relevant past benchmark projects into Gemini's context window.
                    </p>
                  </div>

                  <div className="bg-slate-50/80 dark:bg-zinc-950 p-4 rounded-2xl border border-slate-200/80 dark:border-zinc-800 space-y-1.5 shadow-xs">
                    <span className="font-bold text-purple-700 dark:text-purple-400 block text-xs">
                      🛡️ JSON-Enforced Output & Exclusions
                    </span>
                    <p className="text-slate-600 dark:text-zinc-400">
                      Predefined JSON schema forces structured SOW, JIRA-ready dev tickets, and strict out-of-scope safeguards to shield teams from scope creep.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 2: Zero to End Flow */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  2. Zero-to-End GhostPM Execution Pipeline
                </h3>
                <div className="bg-slate-50/80 dark:bg-zinc-950 p-4 rounded-2xl border border-slate-200/80 dark:border-zinc-800 space-y-2 shadow-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">1. Ingestion:</span>
                    <span className="text-slate-700 dark:text-zinc-300">Client raw messy text arrives (Zoom transcripts, WhatsApp audio notes, email threads).</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-teal-700 dark:text-teal-400 font-bold">2. Vectorization:</span>
                    <span className="text-slate-700 dark:text-zinc-300">Transforms text into a 128-dimensional dense semantic embedding vector.</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-amber-700 dark:text-amber-400 font-bold">3. Cache Gate:</span>
                    <span className="text-slate-700 dark:text-zinc-300">Vector compared against <code className="text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/80 px-1 py-0.5 rounded font-mono">semantic_cache</code> table. If similarity ≥ 0.92, returns instant $0 output.</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-indigo-700 dark:text-indigo-400 font-bold">4. RAG Retrieval:</span>
                    <span className="text-slate-700 dark:text-zinc-300">Vector queries <code className="text-indigo-800 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/80 px-1 py-0.5 rounded font-mono">past_projects</code> table to extract Top-2 closest historical delivery benchmarks.</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-purple-700 dark:text-purple-400 font-bold">5. Gemini Synthesis:</span>
                    <span className="text-slate-700 dark:text-zinc-300">System prompt injects Top-2 benchmarks + raw input to generate SOW, JIRA tickets, and founder email in strict JSON.</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-slate-700 dark:text-zinc-300 font-bold">6. Commit & Audit:</span>
                    <span className="text-slate-700 dark:text-zinc-300">Stores generated SOW in semantic cache and logs Run ID, latency, and PM ROI in audit table.</span>
                  </div>
                </div>
              </div>

              {/* Section 3: Tables Overview */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  3. Supabase Schema Tables
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div className="bg-slate-50/80 dark:bg-zinc-950 p-3.5 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
                    <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 block mb-1">past_projects</span>
                    <span className="text-slate-500 dark:text-zinc-400 text-[11px]">id, project_name, raw_description, budget, timeline_weeks, tech_stack, embedding_vector</span>
                  </div>
                  <div className="bg-slate-50/80 dark:bg-zinc-950 p-3.5 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
                    <span className="font-mono font-bold text-amber-700 dark:text-amber-400 block mb-1">semantic_cache</span>
                    <span className="text-slate-500 dark:text-zinc-400 text-[11px]">id, client_query_hash, cached_json_response, hits_count, cost_saved_usd, embedding_vector</span>
                  </div>
                  <div className="bg-slate-50/80 dark:bg-zinc-950 p-3.5 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
                    <span className="font-mono font-bold text-teal-700 dark:text-teal-400 block mb-1">audit_logs</span>
                    <span className="text-slate-500 dark:text-zinc-400 text-[11px]">id, tokens_used, cost_usd, latency_ms, time_saved_hours, matched_projects, stage_breakdown</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* SQL Schema Viewer */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
                  Ready to copy and execute in your Supabase SQL Editor:
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopy}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 border border-slate-200 dark:border-zinc-700 text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs active:scale-[0.99]"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-emerald-700 dark:text-emerald-400 font-bold">Copied SQL!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
                        <span>Copy SQL DDL</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 border border-slate-200 dark:border-zinc-700 text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs active:scale-[0.99]"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
                    <span>Download .sql</span>
                  </button>
                </div>
              </div>

              <pre className="bg-slate-900 dark:bg-zinc-950 p-4 rounded-2xl border border-slate-800 dark:border-zinc-800 text-emerald-400 font-mono text-[11px] overflow-x-auto leading-relaxed whitespace-pre-wrap shadow-inner">
                {sqlSchema || 'Loading Supabase pgvector schema...'}
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 bg-slate-50 dark:bg-zinc-950 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
          <span>Architecture: Full-Stack Express + Supabase pgvector + Gemini 3.7 Flash</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200/80 dark:bg-zinc-800 hover:bg-slate-300 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 font-semibold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
