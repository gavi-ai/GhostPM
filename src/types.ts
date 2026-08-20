export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  company_name?: string;
  role: 'Founder' | 'Lead PM' | 'Engineering Manager' | 'Freelance Dev';
  created_at: string;
}

export interface AuthSession {
  token: string;
  user: User;
}

export interface PastProject {
  id: string;
  user_id?: string;
  is_custom?: boolean;
  project_name: string;
  client_name?: string;
  client_industry: string;
  raw_description: string;
  budget: number;
  timeline_weeks: number;
  tech_stack: string[];
  deliverables_summary: string;
  complexity: 'Low' | 'Medium' | 'High' | 'Enterprise';
  status?: 'Completed' | 'In Production' | 'Archived';
  embedding_vector?: number[];
  created_at: string;
  updated_at?: string;
}

export interface HybridSearchWeights {
  vector_weight: number;      // e.g. 0.60
  lexical_weight: number;     // e.g. 0.20
  industry_boost: number;     // e.g. 0.10
  tech_stack_boost: number;   // e.g. 0.10
}

export interface ScoredPastProject {
  project: PastProject;
  dense_vector_score: number;
  lexical_score: number;
  industry_match: boolean;
  tech_stack_overlap_count: number;
  rerank_boost: number;
  final_hybrid_score: number;
  rank: number;
}

export interface SemanticCacheEntry {
  id: string;
  user_id?: string;
  client_query_hash: string;
  query_preview: string;
  embedding_vector?: number[];
  cached_json_response: GhostPMOutput;
  hits_count: number;
  cost_saved_usd: number;
  created_at: string;
  last_accessed_at: string;
}

export interface DevTicket {
  id: string;
  ticket_key: string;
  epic: string;
  title: string;
  type: 'Story' | 'Task' | 'Bug' | 'Spike';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  story_points: number;
  description: string;
  tech_notes: string;
  acceptance_criteria: string[];
  status?: 'Backlog' | 'To Do' | 'In Progress' | 'Done';
}

export interface SOWMilestone {
  phase_number: number;
  title: string;
  duration_weeks: number;
  deliverables: string[];
  milestone_payout_percent: number;
}

export interface ConfidenceMetric {
  score_percent: number; // 0 - 100
  rating: 'High' | 'Moderate' | 'Low' | 'Cautious';
  reasoning: string; // e.g. "Based on 2 highly similar past projects. 18% variance flagged due to unknown hardware integration."
  variance_flags: string[]; // List of specific variance factors & risks
  grounding_factors: {
    historical_matches_weight: number; // 0 - 100
    tech_stack_clarity_weight: number;  // 0 - 100
    scope_ambiguity_penalty: number;    // negative number or percentage
  };
}

export interface ScopeOfWork {
  project_title: string;
  client_problem_summary: string;
  proposed_solution: string;
  recommended_tech_stack: string[];
  confidence_metric?: ConfidenceMetric;
  estimated_timeline_weeks: {
    min: number;
    max: number;
    recommended: number;
  };
  estimated_budget_usd: {
    min: number;
    max: number;
    recommended: number;
    grounded_basis: string;
  };
  milestones: SOWMilestone[];
  core_assumptions: string[];
  out_of_scope_exclusions: string[];
}

export interface ClientEmailDraft {
  subject: string;
  recipient_greeting: string;
  body_intro: string;
  scope_highlights: string[];
  pricing_timeline_summary: string;
  next_steps_cta: string;
  sign_off: string;
  tone_style: 'Executive' | 'Friendly Founder' | 'Strict PM';
}

export interface RiskAnalysis {
  risk_level: 'Low' | 'Medium' | 'High' | 'Critical';
  title: string;
  category: 'Scope Creep' | 'Technical Feasibility' | 'Timeline Constraint' | 'Third-Party Dependency';
  description: string;
  mitigation_strategy: string;
}

export interface MatchedPastProjectSummary {
  id: string;
  project_name: string;
  similarity: number;
  dense_vector_score?: number;
  lexical_score?: number;
  rerank_boost?: number;
  final_hybrid_score?: number;
  budget: number;
  timeline_weeks: number;
  industry?: string;
}

export interface GhostPMOutput {
  meta: {
    generated_at: string;
    model_used: string;
    cache_hit: boolean;
    similarity_score?: number;
    retrieval_method?: 'hybrid_rerank' | 'dense_vector';
    hybrid_weights?: HybridSearchWeights;
    matched_past_projects: MatchedPastProjectSummary[];
  };
  confidence_metric?: ConfidenceMetric;
  sow: ScopeOfWork;
  dev_tickets: DevTicket[];
  client_email: ClientEmailDraft;
  risks: RiskAnalysis[];
}

export interface AuditLog {
  id: string;
  user_id?: string;
  timestamp: string;
  query_snippet: string;
  cache_hit: boolean;
  similarity_score?: number;
  retrieval_method?: string;
  tokens_used: number;
  cost_usd: number;
  latency_ms: number;
  time_saved_hours: number;
  matched_projects: Array<{
    id: string;
    name: string;
    similarity: number;
    dense_score?: number;
    lexical_score?: number;
    rerank_boost?: number;
    final_hybrid_score?: number;
    budget: number;
    timeline: number;
  }>;
  stage_breakdown: {
    ingestion_ms: number;
    embedding_ms: number;
    cache_check_ms: number;
    rag_retrieval_ms: number;
    llm_synthesis_ms: number;
    validation_ms: number;
  };
}

export interface SynthesizeRequest {
  client_input: string;
  similarity_threshold?: number;
  force_refresh?: boolean;
  retrieval_strategy?: 'hybrid_rerank' | 'dense_vector';
  hybrid_weights?: HybridSearchWeights;
  target_industry?: string;
}

export interface SynthesizeResponse {
  success: boolean;
  output: GhostPMOutput;
  audit: AuditLog;
  stage_breakdown: AuditLog['stage_breakdown'];
  is_cache_hit: boolean;
  scored_candidates?: ScoredPastProject[];
}

export interface StatsSummary {
  total_runs: number;
  cache_hits: number;
  cache_hit_rate: number;
  total_cost_spent_usd: number;
  total_cost_saved_usd: number;
  total_pm_hours_saved: number;
  avg_latency_ms: number;
  total_past_projects: number;
  total_user_projects?: number;
  total_cached_queries: number;
}

export interface SecurityPillar {
  id: number;
  name: string;
  category: 'Key & Secrets' | 'Database & RLS' | 'Auth & Session' | 'API & Transport' | 'Data Protection';
  status: 'active' | 'enforced' | 'verified';
  description: string;
  technical_implementation: string;
}

export interface SupabaseStatus {
  connected: boolean;
  url: string;
  pgvector_enabled: boolean;
  tables: {
    profiles: boolean;
    past_projects: boolean;
    semantic_cache: boolean;
    audit_logs: boolean;
  };
  rls_enforced: boolean;
  latency_ms: number;
  synced_count: number;
  mode: 'live_supabase' | 'hybrid_resilient';
}

