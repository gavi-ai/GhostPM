import React, { useState } from 'react';
import { 
  Sliders, 
  Search, 
  Sparkles, 
  X, 
  Check, 
  Binary, 
  FileCode2, 
  Layers, 
  TrendingUp, 
  Zap, 
  Tag,
  ArrowRight,
  Database
} from 'lucide-react';
import { HybridSearchWeights, ScoredPastProject } from '../types';

interface HybridRAGConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  weights: HybridSearchWeights;
  onSaveWeights: (newWeights: HybridSearchWeights) => void;
}

export const HybridRAGConfigModal: React.FC<HybridRAGConfigModalProps> = ({
  isOpen,
  onClose,
  weights: initialWeights,
  onSaveWeights,
}) => {
  const [weights, setWeights] = useState<HybridSearchWeights>(initialWeights);
  const [testQuery, setTestQuery] = useState('Uber-style dog walking app with live GPS tracking and Stripe payouts');
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<ScoredPastProject[] | null>(null);

  if (!isOpen) return null;

  const handleRunTest = async () => {
    if (!testQuery.trim()) return;
    setIsTesting(true);
    try {
      const res = await fetch('/api/retrieval/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: testQuery, weights }),
      });
      const data = await res.json();
      if (data.scored_candidates) {
        setTestResults(data.scored_candidates);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    onSaveWeights(weights);
    onClose();
  };

  const handleResetDefaults = () => {
    setWeights({
      vector_weight: 0.60,
      lexical_weight: 0.20,
      industry_boost: 0.10,
      tech_stack_boost: 0.10,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 dark:bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 bg-slate-50/80 dark:bg-zinc-950/80 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-400 flex items-center justify-center font-bold shadow-xs">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-zinc-100 tracking-tight flex items-center gap-2">
                Advanced Hybrid RAG Retrieval Engine & Re-ranking
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
                Dense Vector Cosine Similarity + BM25 Lexical Keyword Matching + Domain Re-ranking
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 rounded-xl hover:bg-slate-200/50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs text-slate-600 dark:text-zinc-400">
          {/* Mathematical Formula Card */}
          <div className="bg-slate-50/80 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 rounded-2xl p-4 space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-zinc-300">
              <span className="flex items-center gap-1.5 text-teal-700 dark:text-teal-400">
                <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                Hybrid Scoring Mathematical Formula
              </span>
              <span className="text-[11px] font-mono text-slate-500 dark:text-zinc-500">
                Total Combined Max = 1.0000
              </span>
            </div>
            <div className="p-3 bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 font-mono text-[11px] text-teal-900 dark:text-teal-300 overflow-x-auto shadow-xs">
              Final Score = (Dense Vector Score × {(weights.vector_weight * 100).toFixed(0)}%) + (BM25 Lexical Score × {(weights.lexical_weight * 100).toFixed(0)}%) + Industry Boost ({(weights.industry_boost * 100).toFixed(0)}%) + Tech Stack Match ({(weights.tech_stack_boost * 100).toFixed(0)}%)
            </div>
          </div>

          {/* Sliders Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Vector Weight */}
            <div className="bg-slate-50/80 dark:bg-zinc-950 p-4 rounded-2xl border border-slate-200/80 dark:border-zinc-800 space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                  <Binary className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  Dense Vector Cosine Weight
                </span>
                <span className="font-mono font-bold text-indigo-700 dark:text-indigo-400">
                  {(weights.vector_weight * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                min="0.2"
                max="0.9"
                step="0.05"
                value={weights.vector_weight}
                onChange={(e) =>
                  setWeights({ ...weights, vector_weight: parseFloat(e.target.value) })
                }
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                Semantic similarity using 128-dimensional dense vector embeddings.
              </p>
            </div>

            {/* Lexical Weight */}
            <div className="bg-slate-50/80 dark:bg-zinc-950 p-4 rounded-2xl border border-slate-200/80 dark:border-zinc-800 space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                  <FileCode2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  BM25 Lexical Keyword Weight
                </span>
                <span className="font-mono font-bold text-teal-700 dark:text-teal-400">
                  {(weights.lexical_weight * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.5"
                step="0.05"
                value={weights.lexical_weight}
                onChange={(e) =>
                  setWeights({ ...weights, lexical_weight: parseFloat(e.target.value) })
                }
                className="w-full accent-teal-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                Exact keyword and term frequency matching across deliverables and descriptions.
              </p>
            </div>

            {/* Industry Match Boost */}
            <div className="bg-slate-50/80 dark:bg-zinc-950 p-4 rounded-2xl border border-slate-200/80 dark:border-zinc-800 space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  Industry Domain Match Boost
                </span>
                <span className="font-mono font-bold text-amber-700 dark:text-amber-400">
                  +{(weights.industry_boost * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                min="0.0"
                max="0.25"
                step="0.02"
                value={weights.industry_boost}
                onChange={(e) =>
                  setWeights({ ...weights, industry_boost: parseFloat(e.target.value) })
                }
                className="w-full accent-amber-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                Boost candidates matching client domain (Fintech, Health, Logistics, SaaS).
              </p>
            </div>

            {/* Tech Stack Boost */}
            <div className="bg-slate-50/80 dark:bg-zinc-950 p-4 rounded-2xl border border-slate-200/80 dark:border-zinc-800 space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  Tech Stack Overlap Boost
                </span>
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                  +{(weights.tech_stack_boost * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                min="0.0"
                max="0.25"
                step="0.02"
                value={weights.tech_stack_boost}
                onChange={(e) =>
                  setWeights({ ...weights, tech_stack_boost: parseFloat(e.target.value) })
                }
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                Bonus for matching infrastructure keywords (Stripe, PostgreSQL, Next.js).
              </p>
            </div>
          </div>

          {/* Live Diagnostic Retrieval Tester */}
          <div className="bg-slate-50/80 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 rounded-2xl p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-1.5 text-xs">
                <Search className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Live Retrieval Playground & Candidate Scorecard
              </span>
              <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium">Tests full scoring pipeline</span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                placeholder="Enter sample requirements to test RAG scoring..."
                className="flex-1 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 shadow-xs"
              />
              <button
                type="button"
                onClick={handleRunTest}
                disabled={isTesting}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center space-x-1.5 cursor-pointer shadow-xs transition-all disabled:opacity-50 active:scale-[0.99]"
              >
                {isTesting ? <span>Scoring...</span> : <span>Run Test</span>}
              </button>
            </div>

            {/* Test Results Table */}
            {testResults && (
              <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200 dark:border-zinc-800 shadow-xs">
                <table className="w-full text-left text-[11px] text-slate-700 dark:text-zinc-300">
                  <thead className="bg-slate-100 dark:bg-zinc-800/80 text-slate-600 dark:text-zinc-400 font-semibold border-b border-slate-200 dark:border-zinc-700 uppercase text-[10px]">
                    <tr>
                      <th className="px-3 py-2.5">Rank</th>
                      <th className="px-3 py-2.5">Candidate Benchmark</th>
                      <th className="px-3 py-2.5">Dense Vector (60%)</th>
                      <th className="px-3 py-2.5">BM25 Lexical (20%)</th>
                      <th className="px-3 py-2.5">Rerank Boost</th>
                      <th className="px-3 py-2.5 font-bold text-emerald-700 dark:text-emerald-400">Final Hybrid Score</th>
                      <th className="px-3 py-2.5">Gemini Context Selection</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 bg-white dark:bg-zinc-900">
                    {testResults.slice(0, 5).map((cand) => (
                      <tr
                        key={cand.project.id}
                        className={
                          cand.rank <= 2 ? 'bg-emerald-50/80 dark:bg-emerald-950/40 font-medium' : 'hover:bg-slate-50 dark:hover:bg-zinc-800/50'
                        }
                      >
                        <td className="px-3 py-2.5 font-mono font-bold text-slate-500 dark:text-zinc-400">
                          #{cand.rank}
                        </td>
                        <td className="px-3 py-2.5">
                          <div className="font-bold text-slate-900 dark:text-zinc-100 truncate max-w-xs">
                            {cand.project.project_name}
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-zinc-400">
                            {cand.project.client_industry} • ${cand.project.budget.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-3 py-2.5 font-mono text-indigo-700 dark:text-indigo-400">
                          {(cand.dense_vector_score * 100).toFixed(1)}%
                        </td>
                        <td className="px-3 py-2.5 font-mono text-teal-700 dark:text-teal-400">
                          {(cand.lexical_score * 100).toFixed(1)}%
                        </td>
                        <td className="px-3 py-2.5 font-mono text-amber-700 dark:text-amber-400">
                          +{(cand.rerank_boost * 100).toFixed(1)}%
                        </td>
                        <td className="px-3 py-2.5 font-mono font-bold text-emerald-700 dark:text-emerald-400 text-xs">
                          {(cand.final_hybrid_score * 100).toFixed(1)}%
                        </td>
                        <td className="px-3 py-2.5">
                          {cand.rank <= 2 ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold text-[10px]">
                              ✓ Top-2 Selected
                            </span>
                          ) : (
                            <span className="text-slate-400 dark:text-zinc-500 text-[10px]">Filtered out</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 bg-slate-50 dark:bg-zinc-950 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200 font-medium transition-colors cursor-pointer"
          >
            Reset to Default Weights
          </button>

          <div className="flex items-center space-x-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200/80 dark:bg-zinc-800 hover:bg-slate-300 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 font-semibold cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center space-x-1.5 cursor-pointer shadow-sm shadow-emerald-600/20 active:scale-[0.99]"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply Hybrid Weights</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
