import React, { useState } from 'react';
import { 
  FileText, 
  DollarSign, 
  Calendar, 
  Layers, 
  ShieldAlert, 
  CheckCircle, 
  Copy, 
  Check, 
  Download, 
  Printer, 
  Sparkles, 
  TrendingUp,
  Cpu,
  ArrowUpRight
} from 'lucide-react';
import { ScopeOfWork, GhostPMOutput } from '../types';
import { ConfidenceScoreWidget } from './ConfidenceScoreWidget';

interface SOWViewProps {
  sow: ScopeOfWork;
  matchedProjects: GhostPMOutput['meta']['matched_past_projects'];
  confidence?: GhostPMOutput['confidence_metric'];
  onExportMarkdown: () => void;
}

export const SOWView: React.FC<SOWViewProps> = ({
  sow,
  matchedProjects,
  confidence,
  onExportMarkdown,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onExportMarkdown();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const benchmarkNames = (matchedProjects || []).map((p) => p.project_name);

  return (
    <div className="space-y-6">
      {/* Confidence Score Metric Card */}
      <ConfidenceScoreWidget
        confidence={confidence || sow.confidence_metric}
        similarityScore={matchedProjects?.[0]?.similarity || 0.9}
        benchmarkNames={benchmarkNames}
      />

      {/* SOW Document Card */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
        {/* Document Header Bar */}
        <div className="bg-slate-50/80 dark:bg-zinc-950/80 p-6 sm:p-8 border-b border-slate-200/80 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Grounded Scope of Work (SOW)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
              {sow.project_title}
            </h1>
            <p className="text-xs text-slate-600 dark:text-zinc-400 mt-1.5 max-w-3xl leading-relaxed">
              {sow.client_problem_summary}
            </p>
          </div>

          <div className="flex items-center space-x-2.5 self-start md:self-auto">
            <button
              id="copy-sow-btn"
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs active:scale-[0.99]"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-700 dark:text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
                  <span>Copy Markdown</span>
                </>
              )}
            </button>

            <button
              id="print-sow-btn"
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs active:scale-[0.99]"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>

        {/* Pricing & Timeline Benchmark Banner (The RAG Flex) */}
        <div className="p-6 sm:p-8 bg-slate-50/40 dark:bg-zinc-950/40 border-b border-slate-200/80 dark:border-zinc-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Budget Estimate Box */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 flex items-center gap-1.5 mb-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Estimated Budget Range
                </span>
                <div className="text-2xl sm:text-3xl font-bold text-emerald-700 dark:text-emerald-400 tracking-tight">
                  ${sow.estimated_budget_usd.recommended.toLocaleString()}{' '}
                  <span className="text-xs text-slate-500 dark:text-zinc-400 font-normal">USD</span>
                </div>
                <div className="text-xs text-slate-500 dark:text-zinc-400 mt-1.5 font-medium">
                  Range: ${sow.estimated_budget_usd.min.toLocaleString()} – $
                  {sow.estimated_budget_usd.max.toLocaleString()}
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <span>✓ Non-speculative RAG benchmark</span>
              </div>
            </div>

            {/* Timeline Estimate Box */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 flex items-center gap-1.5 mb-1.5">
                  <Calendar className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  Estimated Delivery Timeline
                </span>
                <div className="text-2xl sm:text-3xl font-bold text-teal-700 dark:text-teal-400 tracking-tight">
                  {sow.estimated_timeline_weeks.recommended}{' '}
                  <span className="text-xs text-slate-500 dark:text-zinc-400 font-normal">Weeks</span>
                </div>
                <div className="text-xs text-slate-500 dark:text-zinc-400 mt-1.5 font-medium">
                  Phased Range: {sow.estimated_timeline_weeks.min} to{' '}
                  {sow.estimated_timeline_weeks.max} Weeks
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800 text-[11px] text-teal-700 dark:text-teal-400 font-semibold flex items-center gap-1">
                <span>✓ Includes QA & Security Testing</span>
              </div>
            </div>

            {/* Grounded Basis Context */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 flex items-center gap-1.5 mb-1.5">
                  <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  RAG Historical Benchmark Basis
                </span>
                <p className="text-xs text-slate-700 dark:text-zinc-300 line-clamp-3 leading-relaxed">
                  {sow.estimated_budget_usd.grounded_basis}
                </p>
              </div>

              {matchedProjects && matchedProjects.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center space-x-1.5 overflow-x-auto text-[10px]">
                  {matchedProjects.map((p) => (
                    <span
                      key={p.id}
                      className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 font-mono whitespace-nowrap font-medium"
                    >
                      {p.project_name.split(':')[0]}: ${p.budget.toLocaleString()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Proposed Solution & Tech Stack */}
        <div className="p-6 sm:p-8 border-b border-slate-200/80 dark:border-zinc-800 space-y-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 mb-2.5 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Proposed Technical Architecture
            </h3>
            <p className="text-sm text-slate-700 dark:text-zinc-300 leading-relaxed bg-slate-50/80 dark:bg-zinc-950/80 p-5 rounded-2xl border border-slate-200/80 dark:border-zinc-800">
              {sow.proposed_solution}
            </p>
          </div>

          <div>
            <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider block mb-2.5">
              Recommended Technology Stack:
            </span>
            <div className="flex flex-wrap gap-2">
              {sow.recommended_tech_stack.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold shadow-xs"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Phased Milestones Breakdown */}
        <div className="p-6 sm:p-8 border-b border-slate-200/80 dark:border-zinc-800 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Phased Milestone Roadmap & Payment Schedule
            </h3>
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
              Total Duration: ~{sow.estimated_timeline_weeks.recommended} Weeks
            </span>
          </div>

          <div className="space-y-3.5">
            {sow.milestones.map((phase) => (
              <div
                key={phase.phase_number}
                className="bg-slate-50/70 dark:bg-zinc-950/70 border border-slate-200/80 dark:border-zinc-800 rounded-2xl p-5 hover:bg-white dark:hover:bg-zinc-900 hover:border-slate-300 dark:hover:border-zinc-700 hover:shadow-xs transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 font-bold text-xs flex items-center justify-center">
                      P{phase.phase_number}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                        {phase.title}
                      </h4>
                      <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
                        Duration: {phase.duration_weeks} Weeks
                      </span>
                    </div>
                  </div>

                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold self-start sm:self-auto">
                    {phase.milestone_payout_percent}% Payout ($
                    {(
                      (sow.estimated_budget_usd.recommended *
                        phase.milestone_payout_percent) /
                      100
                    ).toLocaleString()}
                    )
                  </div>
                </div>

                <div className="space-y-2 pl-2">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider block">
                    Core Deliverables:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {phase.deliverables.map((deliv, dIdx) => (
                      <div
                        key={dIdx}
                        className="flex items-start space-x-2 text-xs text-slate-700 dark:text-zinc-300"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span>{deliv}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assumptions & Out-of-Scope Exclusions Grid */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/40 dark:bg-zinc-950/40">
          {/* Core Assumptions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              Core Project Assumptions
            </h4>
            <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-5 space-y-2.5 shadow-xs">
              {sow.core_assumptions.map((assump, idx) => (
                <div key={idx} className="flex items-start space-x-2.5 text-xs text-slate-700 dark:text-zinc-300 leading-relaxed">
                  <span className="text-slate-400 dark:text-zinc-500 font-bold mt-0.5">•</span>
                  <span>{assump}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Critical Out-of-Scope Exclusions (The PM Shield) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              Strict Out-of-Scope Exclusions (PM Safeguards)
            </h4>
            <div className="bg-rose-50/60 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/50 rounded-2xl p-5 space-y-2.5 shadow-xs">
              {sow.out_of_scope_exclusions.map((excl, idx) => (
                <div key={idx} className="flex items-start space-x-2.5 text-xs text-rose-900 dark:text-rose-200 leading-relaxed">
                  <span className="text-rose-600 dark:text-rose-400 font-bold mt-0.5">✕</span>
                  <span>{excl}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
