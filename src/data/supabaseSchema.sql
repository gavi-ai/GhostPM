-- ============================================================================
-- GHOSTPM ENTERPRISE DATABASE SCHEMA & ROW LEVEL SECURITY (RLS) POLICIES
-- Platform: Supabase / PostgreSQL 15+ with pgvector
-- Target URL: https://gmuhxphpwquthattwqom.supabase.co
-- ============================================================================

-- 1. Enable pgvector extension for high-performance dense semantic indexing
create extension if not exists vector;

-- 2. Create PROFILES table linked to Supabase auth.users
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text not null,
  avatar_url text,
  company_name text,
  role text check (role in ('Founder', 'Lead PM', 'Engineering Manager', 'Freelance Dev')) default 'Lead PM',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Create PAST_PROJECTS table (Agency historical benchmark repository & custom user projects)
create table if not exists public.past_projects (
  id text primary key,
  user_id uuid references auth.users(id) on delete set null,
  is_custom boolean default false,
  project_name text not null,
  client_name text,
  client_industry text not null,
  raw_description text not null,
  budget numeric not null check (budget > 0),
  timeline_weeks integer not null check (timeline_weeks > 0),
  tech_stack text[] not null default '{}',
  deliverables_summary text not null,
  complexity text check (complexity in ('Low', 'Medium', 'High', 'Enterprise')) default 'Medium',
  status text check (status in ('Completed', 'In Production', 'Archived')) default 'Completed',
  embedding_vector vector(128),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. Create SEMANTIC_CACHE table ($0 cost instant response cache with 128-dim vector embeddings)
create table if not exists public.semantic_cache (
  id text primary key,
  user_id uuid references auth.users(id) on delete set null,
  client_query_hash text unique not null,
  query_preview text not null,
  embedding_vector vector(128),
  cached_json_response jsonb not null,
  hits_count integer default 1,
  cost_saved_usd numeric default 0,
  created_at timestamptz default now(),
  last_accessed_at timestamptz default now()
);

-- 5. Create AUDIT_LOGS table (Immutable run metrics, token usage, latency & stage breakdowns)
create table if not exists public.audit_logs (
  id text primary key,
  user_id uuid references auth.users(id) on delete set null,
  timestamp timestamptz default now(),
  query_snippet text not null,
  cache_hit boolean not null default false,
  similarity_score numeric,
  retrieval_method text default 'hybrid_rerank',
  tokens_used integer not null default 0,
  cost_usd numeric not null default 0,
  latency_ms integer not null default 0,
  time_saved_hours numeric not null default 0,
  matched_projects jsonb not null default '[]'::jsonb,
  stage_breakdown jsonb not null default '{}'::jsonb
);

-- ============================================================================
-- HIGH PERFORMANCE VECTOR INDEXES (Cosine Distance)
-- ============================================================================
create index if not exists past_projects_vector_idx 
  on public.past_projects 
  using ivfflat (embedding_vector vector_cosine_ops)
  with (lists = 10);

create index if not exists semantic_cache_vector_idx 
  on public.semantic_cache 
  using ivfflat (embedding_vector vector_cosine_ops)
  with (lists = 10);

-- ============================================================================
-- STRICT ROW LEVEL SECURITY (RLS) POLICIES (Enterprise Standard #4 & #7)
-- ============================================================================
alter table public.profiles enable row level security;
alter table public.past_projects enable row level security;
alter table public.semantic_cache enable row level security;
alter table public.audit_logs enable row level security;

-- PROFILES Policies: Users can view all profiles, but only edit their own
create policy "Public profiles are readable by authenticated users"
  on public.profiles for select
  to authenticated
  using (true);

create policy "Users can update only their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

-- PAST_PROJECTS Policies: Everyone can read agency baseline benchmarks; owners can CRUD custom projects
create policy "Authenticated users can read all baseline benchmarks and their own projects"
  on public.past_projects for select
  to authenticated
  using (is_custom = false or user_id = auth.uid());

create policy "Users can insert their own custom projects"
  on public.past_projects for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own custom projects"
  on public.past_projects for update
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can delete their own custom projects"
  on public.past_projects for delete
  to authenticated
  using (auth.uid() = user_id);

-- SEMANTIC_CACHE Policies: Authenticated users can query cache
create policy "Authenticated users can read semantic cache"
  on public.semantic_cache for select
  to authenticated
  using (true);

create policy "Authenticated users or service role can insert semantic cache"
  on public.semantic_cache for insert
  to authenticated
  with check (true);

-- AUDIT_LOGS Policies: Users can read their own logs and global anonymous telemetry
create policy "Users can read their own audit logs"
  on public.audit_logs for select
  to authenticated
  using (user_id is null or user_id = auth.uid());

create policy "Authenticated users can append audit logs"
  on public.audit_logs for insert
  to authenticated
  with check (true);

-- ============================================================================
-- VECTOR RETRIEVAL RPC FUNCTIONS
-- ============================================================================

-- Match Top-K past projects by vector cosine similarity
create or replace function match_past_projects(
  query_embedding vector(128),
  match_threshold float,
  match_count int
)
returns table (
  id text,
  project_name text,
  client_industry text,
  raw_description text,
  budget numeric,
  timeline_weeks int,
  tech_stack text[],
  deliverables_summary text,
  complexity text,
  similarity float
)
language sql stable
as $$
  select
    past_projects.id,
    past_projects.project_name,
    past_projects.client_industry,
    past_projects.raw_description,
    past_projects.budget,
    past_projects.timeline_weeks,
    past_projects.tech_stack,
    past_projects.deliverables_summary,
    past_projects.complexity,
    1 - (past_projects.embedding_vector <=> query_embedding) as similarity
  from past_projects
  where past_projects.embedding_vector is not null
    and 1 - (past_projects.embedding_vector <=> query_embedding) > match_threshold
  order by past_projects.embedding_vector <=> query_embedding
  limit match_count;
$$;

-- Match Semantic Cache for $0 LLM bypass
create or replace function match_semantic_cache(
  query_embedding vector(128),
  match_threshold float
)
returns table (
  id text,
  client_query_hash text,
  query_preview text,
  cached_json_response jsonb,
  hits_count int,
  similarity float
)
language sql stable
as $$
  select
    semantic_cache.id,
    semantic_cache.client_query_hash,
    semantic_cache.query_preview,
    semantic_cache.cached_json_response,
    semantic_cache.hits_count,
    1 - (semantic_cache.embedding_vector <=> query_embedding) as similarity
  from semantic_cache
  where semantic_cache.embedding_vector is not null
    and 1 - (semantic_cache.embedding_vector <=> query_embedding) >= match_threshold
  order by semantic_cache.embedding_vector <=> query_embedding
  limit 1;
$$;
