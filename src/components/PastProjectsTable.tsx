import React, { useState } from 'react';
import { 
  Database, 
  Plus, 
  Search, 
  DollarSign, 
  Calendar, 
  Trash2, 
  Edit3, 
  Binary, 
  Layers, 
  Check, 
  Sparkles, 
  Tag, 
  RefreshCw,
  X,
  Building,
  CheckCircle2,
  Clock,
  Download,
  Filter,
  Eye,
  Sliders
} from 'lucide-react';
import { PastProject, User } from '../types';

interface PastProjectsTableProps {
  projects: PastProject[];
  currentUser: User | null;
  onAddProject: (project: Partial<PastProject>) => Promise<void>;
  onUpdateProject: (id: string, updatedData: Partial<PastProject>) => Promise<void>;
  onDeleteProject: (id: string) => Promise<void>;
  onOpenHybridConfig?: () => void;
  onSeedDatabase?: () => Promise<void>;
  isSyncing?: boolean;
}

export const PastProjectsTable: React.FC<PastProjectsTableProps> = ({
  projects,
  currentUser,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
  onOpenHybridConfig,
  onSeedDatabase,
  isSyncing,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedComplexity, setSelectedComplexity] = useState('all');
  const [scopeFilter, setScopeFilter] = useState<'all' | 'my' | 'benchmarks'>('all');

  // Add Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit Modal State
  const [editingProject, setEditingProject] = useState<PastProject | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Detail Modal State
  const [inspectingProject, setInspectingProject] = useState<PastProject | null>(null);

  // Add Form Data
  const [formData, setFormData] = useState({
    project_name: '',
    client_name: '',
    client_industry: 'Fintech',
    raw_description: '',
    budget: 25000,
    timeline_weeks: 6,
    tech_stack: 'React, Node.js, PostgreSQL, Stripe',
    deliverables_summary: '',
    complexity: 'Medium' as PastProject['complexity'],
    status: 'Completed' as PastProject['status'],
  });

  const industries = Array.from(
    new Set(projects.map((p) => p.client_industry).filter(Boolean))
  );

  const myProjectsCount = currentUser
    ? projects.filter((p) => p.user_id === currentUser.id).length
    : projects.filter((p) => p.is_custom).length;

  const benchmarkCount = projects.filter((p) => !p.is_custom).length;

  // Filter logic
  const filteredProjects = projects.filter((p) => {
    // Scope Filter
    if (scopeFilter === 'my') {
      const isMine = currentUser ? p.user_id === currentUser.id : p.is_custom;
      if (!isMine) return false;
    } else if (scopeFilter === 'benchmarks') {
      if (p.is_custom) return false;
    }

    // Search query
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      p.project_name.toLowerCase().includes(q) ||
      p.raw_description.toLowerCase().includes(q) ||
      (p.client_name && p.client_name.toLowerCase().includes(q)) ||
      p.tech_stack.some((t) => t.toLowerCase().includes(q));

    // Industry Filter
    const matchesIndustry =
      selectedIndustry === 'all' || p.client_industry === selectedIndustry;

    // Complexity Filter
    const matchesComplexity =
      selectedComplexity === 'all' || p.complexity === selectedComplexity;

    return matchesSearch && matchesIndustry && matchesComplexity;
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.project_name || !formData.raw_description) return;

    setIsSubmitting(true);
    try {
      await onAddProject({
        ...formData,
        tech_stack: formData.tech_stack.split(',').map((s) => s.trim()).filter(Boolean),
      });
      setShowAddModal(false);
      setFormData({
        project_name: '',
        client_name: '',
        client_industry: 'Fintech',
        raw_description: '',
        budget: 25000,
        timeline_weeks: 6,
        tech_stack: 'React, Node.js, PostgreSQL, Stripe',
        deliverables_summary: '',
        complexity: 'Medium',
        status: 'Completed',
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editingProject.project_name) return;

    setIsUpdating(true);
    try {
      await onUpdateProject(editingProject.id, {
        project_name: editingProject.project_name,
        client_name: editingProject.client_name,
        client_industry: editingProject.client_industry,
        raw_description: editingProject.raw_description,
        budget: Number(editingProject.budget),
        timeline_weeks: Number(editingProject.timeline_weeks),
        tech_stack: editingProject.tech_stack,
        deliverables_summary: editingProject.deliverables_summary,
        complexity: editingProject.complexity,
        status: editingProject.status,
      });
      setEditingProject(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const exportProjectsCSV = () => {
    const headers = [
      'Project Name',
      'Client',
      'Industry',
      'Budget (USD)',
      'Timeline (Weeks)',
      'Complexity',
      'Status',
      'Tech Stack',
      'Deliverables',
    ];
    const rows = filteredProjects.map((p) => [
      `"${p.project_name.replace(/"/g, '""')}"`,
      `"${(p.client_name || 'N/A').replace(/"/g, '""')}"`,
      `"${p.client_industry}"`,
      p.budget,
      p.timeline_weeks,
      `"${p.complexity}"`,
      `"${p.status || 'Completed'}"`,
      `"${p.tech_stack.join(', ')}"`,
      `"${(p.deliverables_summary || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GhostPM_Projects_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getComplexityBadge = (comp: string) => {
    switch (comp) {
      case 'Enterprise':
        return 'bg-purple-100 border-purple-200 text-purple-800';
      case 'High':
        return 'bg-rose-100 border-rose-200 text-rose-800';
      case 'Medium':
        return 'bg-blue-100 border-blue-200 text-blue-800';
      default:
        return 'bg-slate-100 border-slate-200 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Scope Selector & Action Buttons */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
              <Database className="w-3.5 h-3.5" />
              <span>Supabase pgvector Knowledge Base & Projects Store</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
              Past Projects & Pricing Benchmarks ({projects.length})
            </h1>
            <p className="text-xs text-slate-600 dark:text-zinc-400 mt-1.5 max-w-2xl leading-relaxed">
              Manage your verified past project deliveries. Each project is indexed with 128d dense vectors to ground Gemini LLM synthesis in actual delivered pricing and timelines.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
            {onSeedDatabase && (
              <button
                id="seed-benchmarks-btn"
                onClick={onSeedDatabase}
                disabled={isSyncing}
                className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-800 hover:bg-emerald-50 dark:hover:bg-zinc-700 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-zinc-700 text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50 active:scale-[0.99]"
                title="Seed 9 Historical Benchmark Projects with 128-dim pgvector embeddings"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Seeding...' : 'Seed 9 Benchmarks'}</span>
              </button>
            )}

            {onOpenHybridConfig && (
              <button
                id="hybrid-config-btn"
                onClick={onOpenHybridConfig}
                className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs active:scale-[0.99]"
              >
                <Sliders className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
                <span>Hybrid RAG Weights</span>
              </button>
            )}

            <button
              id="export-projects-csv-btn"
              onClick={exportProjectsCSV}
              className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs active:scale-[0.99]"
            >
              <Download className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
              <span>CSV</span>
            </button>

            <button
              id="add-project-btn"
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer shadow-sm shadow-emerald-600/20 active:scale-[0.99]"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>Add New Project</span>
            </button>
          </div>
        </div>

        {/* Scope Tabs & Search Filter Bar */}
        <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
          {/* Scope Filters */}
          <div className="flex items-center bg-slate-100/80 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 p-1 rounded-xl text-xs w-full lg:w-auto">
            <button
              onClick={() => setScopeFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                scopeFilter === 'all'
                  ? 'bg-white dark:bg-zinc-900 text-emerald-700 dark:text-emerald-400 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
              }`}
            >
              All Projects ({projects.length})
            </button>

            <button
              onClick={() => setScopeFilter('my')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                scopeFilter === 'my'
                  ? 'bg-white dark:bg-zinc-900 text-emerald-700 dark:text-emerald-400 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
              }`}
            >
              My Projects ({myProjectsCount})
            </button>

            <button
              onClick={() => setScopeFilter('benchmarks')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                scopeFilter === 'benchmarks'
                  ? 'bg-white dark:bg-zinc-900 text-emerald-700 dark:text-emerald-400 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
              }`}
            >
              Benchmarks ({benchmarkCount})
            </button>
          </div>

          {/* Search and Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, tech stack..."
                className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-zinc-800 shadow-xs"
              />
            </div>

            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-zinc-300 font-medium focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-zinc-800 cursor-pointer shadow-xs"
            >
              <option value="all">All Industries</option>
              {industries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>

            <select
              value={selectedComplexity}
              onChange={(e) => setSelectedComplexity(e.target.value)}
              className="bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-zinc-300 font-medium focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-zinc-800 cursor-pointer shadow-xs"
            >
              <option value="all">All Complexities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Enterprise">Enterprise</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-3xl p-12 text-center space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-zinc-800 mx-auto flex items-center justify-center text-slate-400 dark:text-zinc-500">
            <Database className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">No Matching Projects Found</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mx-auto">
            Try adjusting your search query, industry filter, or click "Add New Project" to add one.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-5 shadow-xs space-y-4 hover:border-slate-300 dark:hover:border-zinc-700 hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-zinc-400 tracking-wider">
                        {project.client_industry}
                      </span>
                      {project.is_custom && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400">
                          My Custom Project
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
                      {project.project_name}
                    </h3>
                    {project.client_name && (
                      <div className="text-[11px] text-slate-500 dark:text-zinc-400 flex items-center gap-1 font-medium">
                        <Building className="w-3 h-3 text-slate-400 dark:text-zinc-500" />
                        <span>Client: {project.client_name}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-1">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-lg border ${getComplexityBadge(
                        project.complexity
                      )}`}
                    >
                      {project.complexity}
                    </span>

                    {/* Inspect Button */}
                    <button
                      onClick={() => setInspectingProject(project)}
                      className="p-1.5 text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                      title="Inspect vector & grounding details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    {/* Edit Button */}
                    <button
                      onClick={() =>
                        setEditingProject({
                          ...project,
                          tech_stack: [...project.tech_stack],
                        })
                      }
                      className="p-1.5 text-slate-400 hover:text-teal-700 dark:hover:text-teal-400 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                      title="Edit project details"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => onDeleteProject(project.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                      title="Delete project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Price & Duration Chips */}
                <div className="flex items-center space-x-2.5 my-3.5 flex-wrap gap-y-2">
                  <div className="bg-emerald-50/80 dark:bg-emerald-950/60 border border-emerald-200/90 dark:border-emerald-800/80 rounded-xl px-3 py-1 flex items-center space-x-1.5 text-xs">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                    <span className="text-slate-600 dark:text-zinc-400 font-medium">Budget:</span>
                    <span className="text-emerald-800 dark:text-emerald-300 font-bold">
                      ${project.budget.toLocaleString()}
                    </span>
                  </div>

                  <div className="bg-teal-50/80 dark:bg-teal-950/60 border border-teal-200/90 dark:border-teal-800/80 rounded-xl px-3 py-1 flex items-center space-x-1.5 text-xs">
                    <Calendar className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
                    <span className="text-slate-600 dark:text-zinc-400 font-medium">Duration:</span>
                    <span className="text-teal-800 dark:text-teal-300 font-bold">
                      {project.timeline_weeks} Weeks
                    </span>
                  </div>

                  <div className="bg-indigo-50/80 dark:bg-indigo-950/60 border border-indigo-200/90 dark:border-indigo-800/80 rounded-xl px-2.5 py-1 flex items-center space-x-1 text-[11px] text-indigo-800 dark:text-indigo-300 font-semibold">
                    <Binary className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                    <span>128-d Vector</span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed bg-slate-50/80 dark:bg-zinc-950/80 p-3.5 rounded-xl border border-slate-200/80 dark:border-zinc-800">
                  {project.raw_description}
                </p>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-zinc-800">
                <div className="flex flex-wrap gap-1.5">
                  {project.tech_stack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {project.deliverables_summary && (
                  <div className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium truncate">
                    Deliverables: {project.deliverables_summary}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =====================================================================
          ADD PROJECT MODAL
      ===================================================================== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 dark:bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col p-6 sm:p-7 shadow-2xl space-y-4 overflow-hidden">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-zinc-800">
              <h2 className="text-sm font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Add Past Project / Benchmark
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 p-1 cursor-pointer rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs overflow-y-auto flex-1 pr-1">
              <div>
                <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">
                  Project Title / Name:
                </label>
                <input
                  type="text"
                  required
                  value={formData.project_name}
                  onChange={(e) =>
                    setFormData({ ...formData, project_name: e.target.value })
                  }
                  placeholder="e.g. HealthVault: HIPAA Telehealth Video Platform"
                  className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-zinc-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">
                    Client Name (Optional):
                  </label>
                  <input
                    type="text"
                    value={formData.client_name}
                    onChange={(e) =>
                      setFormData({ ...formData, client_name: e.target.value })
                    }
                    placeholder="e.g. CareFirst Inc"
                    className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-zinc-800"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">
                    Client Industry:
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.client_industry}
                    onChange={(e) =>
                      setFormData({ ...formData, client_industry: e.target.value })
                    }
                    placeholder="e.g. Healthtech / Telemedicine"
                    className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-zinc-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">
                    Delivered Budget (USD):
                  </label>
                  <input
                    type="number"
                    required
                    min={1000}
                    value={formData.budget}
                    onChange={(e) =>
                      setFormData({ ...formData, budget: Number(e.target.value) })
                    }
                    className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-zinc-800"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">
                    Duration (Weeks):
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.timeline_weeks}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        timeline_weeks: Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-zinc-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">
                    Complexity:
                  </label>
                  <select
                    value={formData.complexity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        complexity: e.target.value as any,
                      })
                    }
                    className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-zinc-800 cursor-pointer"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">
                    Status:
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as any,
                      })
                    }
                    className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-zinc-800 cursor-pointer"
                  >
                    <option value="Completed">Completed</option>
                    <option value="In Production">In Production</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">
                  Tech Stack (comma separated):
                </label>
                <input
                  type="text"
                  value={formData.tech_stack}
                  onChange={(e) =>
                    setFormData({ ...formData, tech_stack: e.target.value })
                  }
                  placeholder="React Native, WebRTC, Node.js, PostgreSQL, Stripe"
                  className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-zinc-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">
                  Raw Description & Scope Overview:
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.raw_description}
                  onChange={(e) =>
                    setFormData({ ...formData, raw_description: e.target.value })
                  }
                  placeholder="Describe the problem, client requirements, core features delivered, and architectural highlights..."
                  className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-zinc-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">
                  Deliverables Summary:
                </label>
                <input
                  type="text"
                  value={formData.deliverables_summary}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      deliverables_summary: e.target.value,
                    })
                  }
                  placeholder="e.g. WebRTC room gateway, EHR patient sync, Stripe billing"
                  className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-zinc-800"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-end space-x-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1.5 cursor-pointer shadow-sm shadow-emerald-600/20 active:scale-[0.99]"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Vectorizing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Index & Store in pgvector</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          EDIT PROJECT MODAL (Full Edit Capabilities Requested by User)
      ===================================================================== */}
      {editingProject && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 dark:bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col p-6 sm:p-7 shadow-2xl space-y-4 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-zinc-800">
              <h2 className="text-sm font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                Edit Past Project Details
              </h2>
              <button
                onClick={() => setEditingProject(null)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 p-1 cursor-pointer rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3.5 text-xs overflow-y-auto flex-1 pr-1">
              <div>
                <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">
                  Project Title / Name:
                </label>
                <input
                  type="text"
                  required
                  value={editingProject.project_name}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      project_name: e.target.value,
                    })
                  }
                  className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-zinc-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">
                    Client Name:
                  </label>
                  <input
                    type="text"
                    value={editingProject.client_name || ''}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        client_name: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-zinc-800"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">
                    Client Industry:
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProject.client_industry}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        client_industry: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-zinc-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">
                    Delivered Budget (USD):
                  </label>
                  <input
                    type="number"
                    required
                    min={1000}
                    value={editingProject.budget}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        budget: Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-zinc-800"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">
                    Duration (Weeks):
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={editingProject.timeline_weeks}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        timeline_weeks: Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-zinc-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">
                    Complexity:
                  </label>
                  <select
                    value={editingProject.complexity}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        complexity: e.target.value as any,
                      })
                    }
                    className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-zinc-800 cursor-pointer"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">
                    Status:
                  </label>
                  <select
                    value={editingProject.status || 'Completed'}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        status: e.target.value as any,
                      })
                    }
                    className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-zinc-800 cursor-pointer"
                  >
                    <option value="Completed">Completed</option>
                    <option value="In Production">In Production</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">
                  Tech Stack (comma separated):
                </label>
                <input
                  type="text"
                  value={editingProject.tech_stack.join(', ')}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      tech_stack: e.target.value
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-zinc-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">
                  Raw Description & Architecture Overview:
                </label>
                <textarea
                  required
                  rows={3}
                  value={editingProject.raw_description}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      raw_description: e.target.value,
                    })
                  }
                  className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-zinc-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">
                  Deliverables Summary:
                </label>
                <input
                  type="text"
                  value={editingProject.deliverables_summary || ''}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      deliverables_summary: e.target.value,
                    })
                  }
                  className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-zinc-800"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-end space-x-2.5">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center space-x-1.5 cursor-pointer shadow-sm shadow-teal-600/20 active:scale-[0.99]"
                >
                  {isUpdating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Re-vectorizing...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Save & Re-index Vector</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          INSPECT PROJECT VECTOR DETAILS MODAL
      ===================================================================== */}
      {inspectingProject && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 dark:bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-zinc-800">
              <div className="flex items-center space-x-2">
                <Binary className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                  pgvector Embedding Details
                </h3>
              </div>
              <button
                onClick={() => setInspectingProject(null)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 p-1 cursor-pointer rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <span className="text-slate-500 dark:text-zinc-400 font-medium block mb-0.5">Project:</span>
                <span className="text-slate-900 dark:text-zinc-100 font-bold text-sm">
                  {inspectingProject.project_name}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-zinc-950 p-3.5 rounded-2xl border border-slate-200 dark:border-zinc-800">
                <div>
                  <span className="text-slate-500 dark:text-zinc-400 text-[10px] font-semibold">Vector Dimensions:</span>
                  <span className="font-mono font-bold text-indigo-800 dark:text-indigo-300 block text-xs mt-0.5">
                    128 dimensions
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-zinc-400 text-[10px] font-semibold">Index Strategy:</span>
                  <span className="font-mono font-bold text-emerald-800 dark:text-emerald-300 block text-xs mt-0.5">
                    HNSW Cosine
                  </span>
                </div>
              </div>

              <div>
                <span className="text-slate-700 dark:text-zinc-300 font-semibold block mb-1">
                  128d Embedding Vector Sample:
                </span>
                <pre className="p-3.5 bg-slate-50 dark:bg-zinc-950 rounded-2xl border border-slate-200 dark:border-zinc-800 text-teal-800 dark:text-teal-300 font-mono text-[10px] overflow-x-auto max-h-32">
                  {inspectingProject.embedding_vector
                    ? JSON.stringify(
                        inspectingProject.embedding_vector.slice(0, 16).map((v) => Number(v.toFixed(4))),
                        null,
                        2
                      ).replace(/\n/g, ' ') + ' ... [112 more dimensions]'
                    : 'Generated on ingestion'}
                </pre>
              </div>

              <div>
                <span className="text-slate-700 dark:text-zinc-300 font-semibold block mb-1">Tech Stack:</span>
                <div className="flex flex-wrap gap-1.5">
                  {inspectingProject.tech_stack.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 text-[11px] font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3.5 border-t border-slate-100 dark:border-zinc-800 flex justify-end">
              <button
                onClick={() => setInspectingProject(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 text-xs font-semibold cursor-pointer"
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
