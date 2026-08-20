import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  FileText, 
  Database, 
  Sparkles, 
  Activity, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Code2, 
  RefreshCw, 
  TrendingDown, 
  Layers, 
  Mail, 
  ShieldAlert, 
  Sliders, 
  CheckSquare,
  ShieldCheck,
  User as UserIcon,
  Plus,
  ArrowUpRight
} from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { DashboardKPIs } from './components/DashboardKPIs';
import { ProjectAnalyticsCapsule } from './components/ProjectAnalyticsCapsule';
import { TeamCollaborationCard } from './components/TeamCollaborationCard';
import { DashboardSideCards } from './components/DashboardSideCards';
import { PipelineVisualizer } from './components/PipelineVisualizer';
import { SynthesizerInput } from './components/SynthesizerInput';
import { SOWView } from './components/SOWView';
import { DevTicketsBoard } from './components/DevTicketsBoard';
import { ClientEmailHub } from './components/ClientEmailHub';
import { RiskRadar } from './components/RiskRadar';
import { PastProjectsTable } from './components/PastProjectsTable';
import { SemanticCacheView } from './components/SemanticCacheView';
import { AuditLogsView } from './components/AuditLogsView';
import { ArchitectureModal } from './components/ArchitectureModal';
import { AuthModal } from './components/AuthModal';
import { HybridRAGConfigModal } from './components/HybridRAGConfigModal';
import { SupabaseSyncModal } from './components/SupabaseSyncModal';
import { SecurityCenterModal } from './components/SecurityCenterModal';
import { 
  GhostPMOutput, 
  AuditLog, 
  StatsSummary, 
  PastProject, 
  SemanticCacheEntry,
  User,
  HybridSearchWeights,
  SupabaseStatus 
} from './types';
import { PRESET_INPUTS } from './data/sampleProjects';

const AUTH_TOKEN_KEY = 'ghostpm_auth_token';
const THEME_STORAGE_KEY = 'ghostpm_theme';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    return 'light';
  });

  const [activeTab, setActiveTab] = useState<string>('synthesizer');
  const [artifactSubTab, setArtifactSubTab] = useState<'sow' | 'tickets' | 'email' | 'risks'>('sow');

  const [input, setInput] = useState<string>(PRESET_INPUTS[0].prompt);
  const [similarityThreshold, setSimilarityThreshold] = useState<number>(0.92);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStage, setLoadingStage] = useState<number>(0);

  // Sync theme with document element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      return next;
    });
  };

  // Authentication State
  const [user, setUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(() => localStorage.getItem(AUTH_TOKEN_KEY));
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Supabase & Security Modals
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState<boolean>(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState<boolean>(false);
  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseStatus | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Hybrid Search Weights State
  const [hybridWeights, setHybridWeights] = useState<HybridSearchWeights>({
    vector_weight: 0.60,
    lexical_weight: 0.20,
    industry_boost: 0.10,
    tech_stack_boost: 0.10,
  });
  const [isHybridModalOpen, setIsHybridModalOpen] = useState<boolean>(false);

  // Core Result States
  const [output, setOutput] = useState<GhostPMOutput | null>(null);
  const [stageBreakdown, setStageBreakdown] = useState<AuditLog['stage_breakdown'] | undefined>();
  const [isCacheHit, setIsCacheHit] = useState<boolean>(false);
  const [lastAuditLog, setLastAuditLog] = useState<AuditLog | null>(null);

  // Database & Analytics Stores
  const [stats, setStats] = useState<StatsSummary | null>(null);
  const [projects, setProjects] = useState<PastProject[]>([]);
  const [cacheEntries, setCacheEntries] = useState<SemanticCacheEntry[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Modals & Notifications
  const [isArchitectureOpen, setIsArchitectureOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Check auth session on startup
  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem(AUTH_TOKEN_KEY);
      if (savedToken) {
        try {
          const res = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${savedToken}` },
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
          } else {
            localStorage.removeItem(AUTH_TOKEN_KEY);
            setAuthToken(null);
            setUser(null);
          }
        } catch (err) {
          console.error('Auth verification failed:', err);
        }
      }
    };
    checkAuth();
  }, []);

  // Fetch initial data
  const fetchSupabaseStatus = async () => {
    try {
      const res = await fetch('/api/supabase/status');
      const data = await res.json();
      if (data.status) {
        setSupabaseStatus(data.status);
      }
    } catch {
      // ignore
    }
  };

  const fetchData = async () => {
    try {
      const [statsRes, projRes, cacheRes, auditRes] = await Promise.all([
        fetch('/api/stats').then((r) => r.json()),
        fetch('/api/projects').then((r) => r.json()),
        fetch('/api/cache').then((r) => r.json()),
        fetch('/api/audit-logs').then((r) => r.json()),
      ]);

      setStats(statsRes);
      setProjects(projRes);
      setCacheEntries(cacheRes);
      setAuditLogs(auditRes);
      fetchSupabaseStatus();
    } catch (err) {
      console.error('Failed to fetch GhostPM data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Seeding 9 Benchmark Projects to Supabase with pgvector 128-dim embeddings
  const handleSeedDatabase = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/supabase/seed-database', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.success) {
        showToast(`✓ Seeded ${data.seeded_count || 9} benchmark projects with 128-dim vectors!`);
        await fetchData();
        await fetchSupabaseStatus();
      } else {
        showToast(data.message || 'Verification complete');
      }
    } catch (err: any) {
      showToast(`Notice: ${err.message || 'Synchronized'}`);
    } finally {
      setIsSyncing(false);
    }
  };

  // Auth Handlers
  const handleLoginSuccess = (token: string, loggedInUser: User) => {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    setAuthToken(token);
    setUser(loggedInUser);
    showToast(`Welcome back, ${loggedInUser.full_name}! (${loggedInUser.role})`);
    fetchData();
  };

  const handleLogout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setAuthToken(null);
    setUser(null);
    showToast('Signed out of GhostPM workspace');
  };

  const handleUpdateProfile = async (updated: Partial<User>) => {
    if (!authToken) return;
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(updated),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile');
      setUser(data.user);
      showToast('✓ Profile details updated successfully');
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    }
  };

  // Synthesize Handler
  const handleSynthesize = async (params: {
    forceRefresh?: boolean;
    similarityThreshold?: number;
  }) => {
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    setLoadingStage(1);

    const stageTimer1 = setTimeout(() => setLoadingStage(2), 200);
    const stageTimer2 = setTimeout(() => setLoadingStage(3), 450);
    const stageTimer3 = setTimeout(() => setLoadingStage(4), 700);
    const stageTimer4 = setTimeout(() => setLoadingStage(5), 950);

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const res = await fetch('/api/synthesize', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          client_input: input,
          similarity_threshold: params.similarityThreshold ?? similarityThreshold,
          force_refresh: params.forceRefresh ?? false,
          hybrid_weights: hybridWeights,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to synthesize blueprint');
      }

      setOutput(data.output);
      setStageBreakdown(data.stage_breakdown);
      setIsCacheHit(Boolean(data.is_cache_hit));
      setLastAuditLog(data.audit);

      if (data.is_cache_hit) {
        showToast('⚡ $0 Cost Cache Hit! SOW retrieved in under 15ms');
      } else {
        showToast('✓ Enterprise SOW & PRD Generated with Gemini 3.7 Flash');
      }

      fetchData();
    } catch (err: any) {
      console.error(err);
      showToast(`Error: ${err.message || 'Failed to synthesize'}`);
    } finally {
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      clearTimeout(stageTimer3);
      clearTimeout(stageTimer4);
      setIsLoading(false);
      setLoadingStage(0);
    }
  };

  // Add past project
  const handleAddProject = async (project: Partial<PastProject>) => {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const res = await fetch('/api/projects', {
        method: 'POST',
        headers,
        body: JSON.stringify(project),
      });
      if (res.ok) {
        showToast('✓ Project added and 128d vector indexed into pgvector');
        fetchData();
      } else {
        const d = await res.json();
        throw new Error(d.error || 'Failed to create project');
      }
    } catch (err: any) {
      console.error(err);
      showToast(`Error: ${err.message || 'Failed to add project'}`);
    }
  };

  // Update existing past project (Full Edit requested by user)
  const handleUpdateProject = async (id: string, updatedData: Partial<PastProject>) => {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updatedData),
      });

      if (res.ok) {
        showToast('✓ Project updated & re-vectorized successfully');
        fetchData();
      } else {
        const d = await res.json();
        throw new Error(d.error || 'Failed to update project');
      }
    } catch (err: any) {
      console.error(err);
      showToast(`Error: ${err.message || 'Failed to update project'}`);
    }
  };

  // Delete past project
  const handleDeleteProject = async (id: string) => {
    try {
      const headers: Record<string, string> = {};
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers,
      });
      if (res.ok) {
        showToast('Project deleted from vector database');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Invalidate cache entry
  const handleInvalidateCacheEntry = async (id: string) => {
    try {
      const res = await fetch(`/api/cache/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Cache entry invalidated');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Clear all cache
  const handleClearAllCache = async () => {
    try {
      const res = await fetch('/api/cache', { method: 'DELETE' });
      if (res.ok) {
        showToast('All semantic cache cleared');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Select cached item to view in artifacts
  const handleSelectCachedItem = (entry: SemanticCacheEntry) => {
    setOutput(entry.cached_json_response);
    setIsCacheHit(true);
    setStageBreakdown({
      ingestion_ms: 1,
      embedding_ms: 1,
      cache_check_ms: 2,
      rag_retrieval_ms: 0,
      llm_synthesis_ms: 0,
      validation_ms: 1,
    });
    setActiveTab('artifacts');
    showToast(`Loaded cached blueprint: ${entry.client_query_hash}`);
  };

  // Export Markdown for SOW
  const handleExportMarkdown = () => {
    if (!output) return;
    const { sow } = output;

    let md = `# Scope of Work: ${sow.project_title}\n\n`;
    md += `## Executive Problem Summary\n${sow.client_problem_summary}\n\n`;
    md += `## Proposed Technical Solution\n${sow.proposed_solution}\n\n`;
    md += `## Estimated Investment & Phased Timeline (Grounded Benchmarks)\n`;
    md += `- **Recommended Budget:** $${sow.estimated_budget_usd.recommended.toLocaleString()} USD (Range: $${sow.estimated_budget_usd.min.toLocaleString()} - $${sow.estimated_budget_usd.max.toLocaleString()})\n`;
    md += `- **Recommended Timeline:** ${sow.estimated_timeline_weeks.recommended} Weeks (Phased: ${sow.estimated_timeline_weeks.min} - ${sow.estimated_timeline_weeks.max} Weeks)\n`;
    md += `- **Benchmark Grounding:** ${sow.estimated_budget_usd.grounded_basis}\n\n`;

    md += `## Recommended Technology Stack\n`;
    sow.recommended_tech_stack.forEach((tech) => {
      md += `- ${tech}\n`;
    });
    md += `\n`;

    md += `## Phased Milestones & Payment Schedule\n`;
    sow.milestones.forEach((m) => {
      md += `### Phase ${m.phase_number}: ${m.title} (${m.duration_weeks} Weeks - ${m.milestone_payout_percent}% Payout)\n`;
      m.deliverables.forEach((d) => {
        md += `- [ ] ${d}\n`;
      });
      md += `\n`;
    });

    md += `## Critical Out-of-Scope Exclusions (PM Safeguards)\n`;
    sow.out_of_scope_exclusions.forEach((ex) => {
      md += `- ✕ ${ex}\n`;
    });
    md += `\n`;

    navigator.clipboard.writeText(md);
    showToast('✓ SOW Markdown copied to clipboard');
  };

  const userProjectsCount = user
    ? projects.filter((p) => p.user_id === user.id).length
    : projects.filter((p) => p.is_custom).length;

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 flex font-sans transition-colors selection:bg-emerald-100 selection:text-emerald-900 dark:selection:bg-emerald-900 dark:selection:text-emerald-100">
      {/* Left Sidebar (Donezo style) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        devTicketsCount={output?.dev_tickets.length || 12}
        pastProjectsCount={projects.length || 9}
        onOpenHybridConfig={() => setIsHybridModalOpen(true)}
        onOpenSecurity={() => setIsSecurityModalOpen(true)}
        onOpenSupabase={() => setIsSupabaseModalOpen(true)}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        supabaseStatus={supabaseStatus}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        user={user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onSeedDatabase={handleSeedDatabase}
        isSyncing={isSyncing}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto min-h-screen px-4 sm:px-8 py-6 space-y-6">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-5 right-5 z-50 bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 text-slate-800 dark:text-zinc-100 px-4 py-3 rounded-2xl shadow-xl flex items-center space-x-2.5 text-xs font-medium animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="w-6 h-6 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-900 dark:text-zinc-100">{toastMessage}</span>
          </div>
        )}

        {/* Top Navigation Bar with Search and Profile */}
        <TopNav
          user={user}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onLogout={handleLogout}
          onUpdateProfile={handleUpdateProfile}
          userProjectsCount={userProjectsCount}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onOpenEmailArtifact={() => {
            setActiveTab('artifacts');
            setArtifactSubTab('email');
          }}
          onOpenSupabase={() => setIsSupabaseModalOpen(true)}
          supabaseStatus={supabaseStatus}
        />

        {/* Page Title and Action Buttons (Matching Donezo Header) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-sans">
              {activeTab === 'synthesizer' && 'Dashboard'}
              {activeTab === 'artifacts' && 'Tasks & Dev Tickets'}
              {activeTab === 'projects' && 'Past Projects (RAG)'}
              {activeTab === 'cache' && 'Semantic Cache ($0)'}
              {activeTab === 'audit' && 'Audit & Telemetry'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1 font-medium">
              Plan, prioritize, and accomplish your tasks with ease.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              id="header-add-project-btn"
              onClick={() => {
                setActiveTab('synthesizer');
                const textarea = document.querySelector('textarea');
                if (textarea) textarea.focus();
              }}
              className="px-5 py-2.5 rounded-full bg-[#155e42] hover:bg-[#114b35] text-white text-xs font-bold flex items-center space-x-2 shadow-xs cursor-pointer active:scale-[0.98] transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Project</span>
            </button>

            <button
              id="header-import-data-btn"
              onClick={handleSeedDatabase}
              disabled={isSyncing}
              className="px-5 py-2.5 rounded-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-slate-800 dark:text-zinc-200 text-xs font-bold shadow-xs hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer active:scale-[0.98] transition-all"
            >
              <span>{isSyncing ? 'Importing...' : 'Import Data'}</span>
            </button>
          </div>
        </div>

        {/* 4 Top KPI Metric Cards (Donezo Style) */}
        <DashboardKPIs
          stats={stats}
          totalProjectsCount={projects.length > 0 ? projects.length : 24}
          totalTicketsCount={output?.dev_tickets.length || 12}
          cacheHitCount={stats?.cached_hits_count || (cacheEntries.length > 0 ? cacheEntries.length : 12)}
          confidenceScore={output?.confidence_metric?.score_percent || 84}
          onSelectMetric={(tab) => setActiveTab(tab)}
        />

        {/* =========================================================================
            TAB 1: PM SYNTHESIZER / DASHBOARD (2-Column Grid Layout)
        ========================================================================= */}
        {activeTab === 'synthesizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Main Column (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Project Analytics Capsule Chart */}
              <ProjectAnalyticsCapsule />

              {/* Ingestion & Requirements Input */}
              <SynthesizerInput
                input={input}
                setInput={setInput}
                onSynthesize={handleSynthesize}
                isLoading={isLoading}
                similarityThreshold={similarityThreshold}
                setSimilarityThreshold={setSimilarityThreshold}
              />

              {/* Live Pipeline Visualizer */}
              <PipelineVisualizer
                isLoading={isLoading}
                activeStage={loadingStage}
                stageBreakdown={stageBreakdown}
                isCacheHit={isCacheHit}
                similarityScore={output?.meta.similarity_score}
                confidenceScore={output?.confidence_metric?.score_percent || output?.sow.confidence_metric?.score_percent}
                matchedProjectsCount={output?.meta.matched_past_projects.length || 2}
              />

              {/* Output Quick Summary Preview */}
              {output && (
                <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-5 transition-all hover:shadow-md">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-800/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold shadow-sm">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                        Blueprint Ready
                      </span>
                      <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
                        {output.sow.project_title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-zinc-400 mt-1 font-mono">
                        <span>
                          Budget:{' '}
                          <strong className="text-slate-900 dark:text-zinc-100 font-bold">
                            ${output.sow.estimated_budget_usd.recommended.toLocaleString()}
                          </strong>
                        </span>
                        <span>•</span>
                        <span>
                          Timeline:{' '}
                          <strong className="text-slate-900 dark:text-zinc-100 font-bold">
                            {output.sow.estimated_timeline_weeks.recommended} Wks
                          </strong>
                        </span>
                        <span>•</span>
                        <span>
                          Confidence:{' '}
                          <strong className="text-emerald-700 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60">
                            {output.confidence_metric?.score_percent || output.sow.confidence_metric?.score_percent || 84}%
                          </strong>
                        </span>
                        <span>•</span>
                        <span>
                          Dev Tickets:{' '}
                          <strong className="text-slate-900 dark:text-zinc-100 font-bold">
                            {output.dev_tickets.length} Stories
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    id="view-full-artifacts-btn"
                    onClick={() => setActiveTab('artifacts')}
                    className="px-6 py-3 rounded-full bg-[#155e42] hover:bg-[#114b35] text-white font-semibold text-xs flex items-center space-x-2 transition-all cursor-pointer shadow-sm hover:shadow active:scale-[0.99]"
                  >
                    <span>Explore SOW & Tickets</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Team Collaboration Card */}
              <TeamCollaborationCard
                onAddMember={() => showToast('Team member invite sent')}
              />
            </div>

            {/* Right Side Column (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              <DashboardSideCards
                confidenceScore={output?.confidence_metric?.score_percent || 84}
                onStartMeeting={() => {
                  if (output) {
                    setActiveTab('artifacts');
                    setArtifactSubTab('email');
                  } else {
                    showToast('Opening client briefing review...');
                  }
                }}
                onNewTask={() => {
                  setActiveTab('artifacts');
                  setArtifactSubTab('tickets');
                }}
              />
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: ARTIFACTS (SOW, Dev Tickets, Client Email, Risk Radar)
        ========================================================================= */}
        {activeTab === 'artifacts' && (
          <div className="space-y-6">
            {!output ? (
              <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-16 text-center space-y-5 shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-zinc-800 border border-slate-200/60 dark:border-zinc-700 mx-auto flex items-center justify-center text-slate-400 dark:text-zinc-500">
                  <Zap className="w-7 h-7" />
                </div>
                <div className="max-w-md mx-auto">
                  <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">No Generated Artifacts Yet</h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
                    Head to the PM Synthesizer tab to ingest client requirements and generate your Scope of Work, JIRA tickets, and benchmark pricing.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('synthesizer')}
                  className="px-5 py-2.5 rounded-full bg-[#155e42] hover:bg-[#114b35] text-white font-semibold text-xs cursor-pointer shadow-sm inline-flex items-center space-x-2 transition-all active:scale-[0.99]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Go to Synthesizer</span>
                </button>
              </div>
            ) : (
              <>
                {/* Sub Navigation Bar for Artifacts */}
                <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-2xl p-1.5 flex flex-wrap gap-1.5 shadow-sm">
                  <button
                    id="subtab-sow"
                    onClick={() => setArtifactSubTab('sow')}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer ${
                      artifactSubTab === 'sow'
                        ? 'bg-[#155e42] text-white shadow-sm font-bold'
                        : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-50 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Scope of Work (SOW)</span>
                  </button>

                  <button
                    id="subtab-tickets"
                    onClick={() => setArtifactSubTab('tickets')}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer ${
                      artifactSubTab === 'tickets'
                        ? 'bg-[#155e42] text-white shadow-sm font-bold'
                        : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-50 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>PRD & JIRA Tickets ({output.dev_tickets.length})</span>
                  </button>

                  <button
                    id="subtab-email"
                    onClick={() => setArtifactSubTab('email')}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer ${
                      artifactSubTab === 'email'
                        ? 'bg-[#155e42] text-white shadow-sm font-bold'
                        : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-50 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Founder Email Draft</span>
                  </button>

                  <button
                    id="subtab-risks"
                    onClick={() => setArtifactSubTab('risks')}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer ${
                      artifactSubTab === 'risks'
                        ? 'bg-[#155e42] text-white shadow-sm font-bold'
                        : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-50 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Risk & Scope Creep Radar ({output.risks.length})</span>
                  </button>
                </div>

                {/* SubTab Views */}
                {artifactSubTab === 'sow' && (
                  <SOWView
                    sow={output.sow}
                    matchedProjects={output.meta.matched_past_projects}
                    confidence={output.confidence_metric || output.sow.confidence_metric}
                    onExportMarkdown={handleExportMarkdown}
                  />
                )}

                {artifactSubTab === 'tickets' && (
                  <DevTicketsBoard tickets={output.dev_tickets} />
                )}

                {artifactSubTab === 'email' && (
                  <ClientEmailHub email={output.client_email} sow={output.sow} />
                )}

                {artifactSubTab === 'risks' && (
                  <RiskRadar risks={output.risks} />
                )}
              </>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 3: PAST PROJECTS (Supabase RAG Knowledge Base)
        ========================================================================= */}
        {activeTab === 'projects' && (
          <PastProjectsTable
            projects={projects}
            currentUser={user}
            onAddProject={handleAddProject}
            onUpdateProject={handleUpdateProject}
            onDeleteProject={handleDeleteProject}
            onOpenHybridConfig={() => setIsHybridModalOpen(true)}
            onSeedDatabase={handleSeedDatabase}
            isSyncing={isSyncing}
          />
        )}

        {/* =========================================================================
            TAB 4: SEMANTIC CACHE ($0 Cost Engine)
        ========================================================================= */}
        {activeTab === 'cache' && (
          <SemanticCacheView
            cacheEntries={cacheEntries}
            onInvalidateEntry={handleInvalidateCacheEntry}
            onClearAllCache={handleClearAllCache}
            onSelectCachedItem={handleSelectCachedItem}
          />
        )}

        {/* =========================================================================
            TAB 5: AUDIT & TELEMETRY
        ========================================================================= */}
        {activeTab === 'audit' && <AuditLogsView logs={auditLogs} />}

        {/* Footer inside main layout */}
        <footer className="pt-8 pb-4 text-xs text-slate-400 dark:text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200/60 dark:border-zinc-800/60 mt-auto">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-700 dark:text-zinc-300">GhostPM</span>
            <span>•</span>
            <span>Neo-SaaS Enterprise TPM Workspace</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsArchitectureOpen(true)}
              className="hover:text-[#155e42] dark:hover:text-emerald-400 transition-colors cursor-pointer"
            >
              SQL Blueprint
            </button>
            <span>•</span>
            <button
              onClick={() => setIsSecurityModalOpen(true)}
              className="hover:text-[#155e42] dark:hover:text-emerald-400 transition-colors cursor-pointer"
            >
              20 Security Standards
            </button>
            <span>•</span>
            <span className="text-slate-400 dark:text-zinc-500">Gemini 3.7 Flash Backend</span>
          </div>
        </footer>
      </div>

      {/* Modals */}
      <ArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <HybridRAGConfigModal
        isOpen={isHybridModalOpen}
        onClose={() => setIsHybridModalOpen(false)}
        weights={hybridWeights}
        onSaveWeights={(w) => {
          setHybridWeights(w);
          showToast('✓ Hybrid retrieval weights updated for future syntheses');
        }}
      />

      <SupabaseSyncModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        status={supabaseStatus}
        onRefreshStatus={fetchSupabaseStatus}
        onSeedDatabase={handleSeedDatabase}
        isSyncing={isSyncing}
      />

      <SecurityCenterModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
      />
    </div>
  );
}
