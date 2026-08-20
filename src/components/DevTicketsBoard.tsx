import React, { useState } from 'react';
import { 
  CheckSquare, 
  Square, 
  Copy, 
  Check, 
  Download, 
  Columns, 
  List, 
  Sparkles, 
  AlertCircle, 
  Tag, 
  Code, 
  CheckCircle2,
  Filter
} from 'lucide-react';
import { DevTicket } from '../types';

interface DevTicketsBoardProps {
  tickets: DevTicket[];
}

export const DevTicketsBoard: React.FC<DevTicketsBoardProps> = ({
  tickets: initialTickets,
}) => {
  const [tickets, setTickets] = useState<DevTicket[]>(initialTickets);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const [checkedCriteria, setCheckedCriteria] = useState<Record<string, boolean>>({});
  const [selectedEpic, setSelectedEpic] = useState<string>('all');

  // Keep state synced if props change
  React.useEffect(() => {
    setTickets(initialTickets);
  }, [initialTickets]);

  const epics = Array.from(new Set(tickets.map((t) => t.epic)));

  const handleToggleCriterion = (ticketId: string, critIdx: number) => {
    const key = `${ticketId}-${critIdx}`;
    setCheckedCriteria((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleStatusChange = (ticketId: string, newStatus: DevTicket['status']) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
    );
  };

  const filteredTickets =
    selectedEpic === 'all'
      ? tickets
      : tickets.filter((t) => t.epic === selectedEpic);

  const copyAsJira = () => {
    let md = `h1. GhostPM Generated PRD & JIRA Tickets\n\n`;
    tickets.forEach((t) => {
      md += `h2. [${t.ticket_key}] ${t.title}\n`;
      md += `*Epic:* ${t.epic} | *Type:* ${t.type} | *Priority:* ${t.priority} | *Points:* ${t.story_points}\n\n`;
      md += `*Description:*\n${t.description}\n\n`;
      md += `*Technical Implementation Notes:*\n{code:typescript}\n${t.tech_notes}\n{code}\n\n`;
      md += `*Acceptance Criteria:*\n`;
      t.acceptance_criteria.forEach((ac) => {
        md += `* [ ] ${ac}\n`;
      });
      md += `\n----\n\n`;
    });

    navigator.clipboard.writeText(md);
    setCopiedFormat('jira');
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  const copyAsLinear = () => {
    let md = `# GhostPM Linear Issues Export\n\n`;
    tickets.forEach((t) => {
      md += `### ${t.ticket_key}: ${t.title}\n`;
      md += `**Epic:** \`${t.epic}\` • **Estimate:** ${t.story_points} pts • **Priority:** ${t.priority}\n\n`;
      md += `${t.description}\n\n`;
      md += `#### Technical Architecture Notes\n\`\`\`\n${t.tech_notes}\n\`\`\`\n\n`;
      md += `#### Acceptance Criteria\n`;
      t.acceptance_criteria.forEach((ac) => {
        md += `- [ ] ${ac}\n`;
      });
      md += `\n---\n\n`;
    });

    navigator.clipboard.writeText(md);
    setCopiedFormat('linear');
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  const exportCSV = () => {
    const headers = ['Key', 'Title', 'Epic', 'Type', 'Priority', 'Points', 'Description', 'Acceptance Criteria'];
    const rows = tickets.map((t) => [
      `"${t.ticket_key}"`,
      `"${t.title.replace(/"/g, '""')}"`,
      `"${t.epic}"`,
      `"${t.type}"`,
      `"${t.priority}"`,
      t.story_points,
      `"${t.description.replace(/"/g, '""')}"`,
      `"${t.acceptance_criteria.join('; ').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GhostPM_Tickets_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getPriorityBadge = (priority: DevTicket['priority']) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300';
      case 'High':
        return 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300';
      case 'Medium':
        return 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300';
      default:
        return 'bg-slate-100 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400';
    }
  };

  return (
    <div className="space-y-5">
      {/* Controls Bar */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="flex items-center space-x-1 bg-slate-100/80 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 p-1 rounded-xl">
            <button
              id="view-kanban-btn"
              onClick={() => setViewMode('kanban')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-zinc-900 text-emerald-700 dark:text-emerald-400 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>

            <button
              id="view-list-btn"
              onClick={() => setViewMode('list')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-zinc-900 text-emerald-700 dark:text-emerald-400 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List / Spec</span>
            </button>
          </div>

          {epics.length > 1 && (
            <div className="flex items-center space-x-1 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
              <select
                value={selectedEpic}
                onChange={(e) => setSelectedEpic(e.target.value)}
                className="bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-slate-700 dark:text-zinc-300 focus:outline-none focus:border-emerald-500 cursor-pointer font-medium"
              >
                <option value="all">All Epics ({tickets.length})</option>
                {epics.map((ep) => (
                  <option key={ep} value={ep}>
                    {ep}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Export Buttons */}
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <button
            id="copy-linear-btn"
            onClick={copyAsLinear}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs active:scale-[0.99]"
          >
            {copiedFormat === 'linear' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-700 dark:text-emerald-400">Copied Linear!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
                <span>Linear Format</span>
              </>
            )}
          </button>

          <button
            id="copy-jira-btn"
            onClick={copyAsJira}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs active:scale-[0.99]"
          >
            {copiedFormat === 'jira' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-700 dark:text-emerald-400">Copied JIRA!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
                <span>JIRA Format</span>
              </>
            )}
          </button>

          <button
            id="export-csv-btn"
            onClick={exportCSV}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs active:scale-[0.99]"
          >
            <Download className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Kanban View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {(['To Do', 'In Progress', 'Done'] as const).map((columnStatus) => {
            const columnTickets = filteredTickets.filter(
              (t) => (t.status || 'To Do') === columnStatus
            );

            return (
              <div
                key={columnStatus}
                className="bg-slate-50/70 dark:bg-zinc-950/70 border border-slate-200/80 dark:border-zinc-800 rounded-2xl p-4.5 flex flex-col space-y-3.5"
              >
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/80 dark:border-zinc-800">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        columnStatus === 'Done'
                          ? 'bg-emerald-500'
                          : columnStatus === 'In Progress'
                          ? 'bg-amber-500'
                          : 'bg-indigo-500'
                      }`}
                    />
                    <h3 className="text-xs font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wider">
                      {columnStatus}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-600 dark:text-zinc-400 bg-white dark:bg-zinc-900 px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-zinc-700 shadow-xs">
                    {columnTickets.length}
                  </span>
                </div>

                {columnTickets.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400 dark:text-zinc-500 font-medium">
                    No tickets in this column
                  </div>
                ) : (
                  <div className="space-y-3">
                    {columnTickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-4.5 shadow-xs hover:border-slate-300 dark:hover:border-zinc-700 hover:shadow-sm transition-all space-y-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-[11px] font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                              {ticket.ticket_key}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getPriorityBadge(
                                ticket.priority
                              )}`}
                            >
                              {ticket.priority}
                            </span>
                          </div>

                          <div className="flex items-center space-x-1 text-[11px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 px-2 py-0.5 rounded-md">
                            <span>{ticket.story_points} SP</span>
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-500 tracking-wider block mb-0.5">
                            {ticket.epic}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-zinc-100 leading-snug">
                            {ticket.title}
                          </h4>
                          <p className="text-[11px] text-slate-600 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                            {ticket.description}
                          </p>
                        </div>

                        {/* Acceptance Criteria Checklist */}
                        <div className="space-y-1.5 pt-2.5 border-t border-slate-100 dark:border-zinc-800">
                          <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">
                            Acceptance Criteria ({ticket.acceptance_criteria.length}):
                          </span>
                          {ticket.acceptance_criteria.map((crit, cIdx) => {
                            const key = `${ticket.id}-${cIdx}`;
                            const isChecked = Boolean(checkedCriteria[key]);

                            return (
                              <button
                                key={cIdx}
                                type="button"
                                onClick={() => handleToggleCriterion(ticket.id, cIdx)}
                                className="flex items-start space-x-2 text-[11px] text-left text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-zinc-100 transition-all w-full cursor-pointer group leading-relaxed"
                              >
                                {isChecked ? (
                                  <CheckSquare className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                                ) : (
                                  <Square className="w-3.5 h-3.5 text-slate-300 dark:text-zinc-600 group-hover:text-slate-500 dark:group-hover:text-zinc-400 shrink-0 mt-0.5" />
                                )}
                                <span className={isChecked ? 'line-through text-slate-400 dark:text-zinc-500' : ''}>
                                  {crit}
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Move Status Dropdown */}
                        <div className="pt-2.5 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-[11px]">
                          <span className="text-slate-500 dark:text-zinc-400 font-medium">Move state:</span>
                          <select
                            value={ticket.status || 'To Do'}
                            onChange={(e) =>
                              handleStatusChange(ticket.id, e.target.value as any)
                            }
                            className="bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-2 py-0.5 text-slate-700 dark:text-zinc-300 text-[11px] cursor-pointer font-medium"
                          >
                            <option value="To Do">To Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Done">Done</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* List / Spec View */
        <div className="space-y-4">
          {filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-5 hover:border-slate-300 dark:hover:border-zinc-700 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200/80 dark:border-zinc-800">
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    {ticket.ticket_key}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
                      {ticket.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-zinc-400 mt-0.5 font-medium">
                      <span>Epic: <strong className="text-slate-700 dark:text-zinc-300 font-bold">{ticket.epic}</strong></span>
                      <span>•</span>
                      <span>Type: <strong className="text-slate-700 dark:text-zinc-300 font-bold">{ticket.type}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-start sm:self-auto">
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${getPriorityBadge(
                      ticket.priority
                    )}`}
                  >
                    {ticket.priority} Priority
                  </span>
                  <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 px-2.5 py-1 rounded-lg">
                    {ticket.story_points} Story Points
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Description & Tech Notes */}
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider block mb-1.5">
                      User Story / Task Description:
                    </span>
                    <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed bg-slate-50 dark:bg-zinc-950 p-4 rounded-xl border border-slate-200/80 dark:border-zinc-800">
                      {ticket.description}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider block mb-1.5">
                      Technical Architecture & Implementation Notes:
                    </span>
                    <pre className="text-[11px] font-mono bg-slate-900 dark:bg-zinc-950 text-teal-300 p-4 rounded-xl border border-slate-800 dark:border-zinc-800 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                      {ticket.tech_notes}
                    </pre>
                  </div>
                </div>

                {/* Acceptance Criteria Checklist */}
                <div className="bg-slate-50/70 dark:bg-zinc-950/70 p-5 rounded-2xl border border-slate-200/80 dark:border-zinc-800 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wider">
                        Acceptance Criteria:
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium">
                        {ticket.acceptance_criteria.filter((_, idx) => checkedCriteria[`${ticket.id}-${idx}`]).length} / {ticket.acceptance_criteria.length} completed
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {ticket.acceptance_criteria.map((crit, cIdx) => {
                        const key = `${ticket.id}-${cIdx}`;
                        const isChecked = Boolean(checkedCriteria[key]);

                        return (
                          <button
                            key={cIdx}
                            type="button"
                            onClick={() => handleToggleCriterion(ticket.id, cIdx)}
                            className="flex items-start space-x-2.5 text-xs text-left text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-zinc-100 transition-all w-full cursor-pointer leading-relaxed"
                          >
                            {isChecked ? (
                              <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-400 dark:text-zinc-600 hover:text-slate-600 dark:hover:text-zinc-400 shrink-0 mt-0.5" />
                            )}
                            <span className={isChecked ? 'line-through text-slate-400 dark:text-zinc-500' : ''}>
                              {crit}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200/80 dark:border-zinc-800 flex items-center justify-between text-xs">
                    <span className="text-slate-600 dark:text-zinc-400 font-medium">Status:</span>
                    <select
                      value={ticket.status || 'To Do'}
                      onChange={(e) =>
                        handleStatusChange(ticket.id, e.target.value as any)
                      }
                      className="bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-slate-800 dark:text-zinc-200 text-xs cursor-pointer font-semibold shadow-xs"
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
