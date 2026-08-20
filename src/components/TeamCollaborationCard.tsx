import React from 'react';
import { Plus, Check, Clock, AlertCircle } from 'lucide-react';

interface TeamCollaborationCardProps {
  onAddMember?: () => void;
}

export const TeamCollaborationCard: React.FC<TeamCollaborationCardProps> = ({
  onAddMember,
}) => {
  const members = [
    {
      name: 'Alexandra Deff',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      initials: 'AD',
      task: 'Working on Github Project Repository',
      status: 'Completed',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800',
    },
    {
      name: 'Edwin Adenike',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      initials: 'EA',
      task: 'Working on Integrate User Authentication System',
      status: 'In Progress',
      statusColor: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-800',
    },
    {
      name: 'Isaac Oluwatemilorun',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      initials: 'IO',
      task: 'Working on Develop Search and Filter Functionality',
      status: 'Pending',
      statusColor: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-800',
    },
    {
      name: 'David Oshodi',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&auto=format&fit=crop&q=80',
      initials: 'DO',
      task: 'Working on Responsive Layout for Homepage',
      status: 'In Progress',
      statusColor: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-800',
    },
  ];

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
          Team Collaboration
        </h3>
        <button
          onClick={onAddMember}
          className="px-3 py-1.5 rounded-full border border-slate-200 dark:border-zinc-700 text-[11px] font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 flex items-center space-x-1 transition-all cursor-pointer shadow-xs"
        >
          <Plus className="w-3 h-3" />
          <span>Add Member</span>
        </button>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-zinc-800/80">
        {members.map((member, idx) => (
          <div key={idx} className="py-3 flex items-center justify-between gap-3 first:pt-1 last:pb-1">
            <div className="flex items-center space-x-3 min-w-0">
              <img
                src={member.avatar}
                alt={member.name}
                className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-zinc-700 shrink-0"
              />
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-900 dark:text-zinc-100 truncate">
                  {member.name}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate mt-0.5">
                  {member.task}
                </p>
              </div>
            </div>

            <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border shrink-0 ${member.statusColor}`}>
              {member.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
