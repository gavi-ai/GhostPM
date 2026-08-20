import React, { useState } from 'react';
import { 
  Mail, 
  Copy, 
  Check, 
  Send, 
  Sparkles, 
  UserCheck, 
  MessageSquare, 
  Briefcase,
  ShieldAlert
} from 'lucide-react';
import { ClientEmailDraft, ScopeOfWork } from '../types';

interface ClientEmailHubProps {
  email: ClientEmailDraft;
  sow: ScopeOfWork;
}

export const ClientEmailHub: React.FC<ClientEmailHubProps> = ({
  email: initialEmail,
  sow,
}) => {
  const [tone, setTone] = useState<'Executive' | 'Friendly Founder' | 'Strict PM'>(
    initialEmail.tone_style || 'Executive'
  );
  const [copied, setCopied] = useState(false);

  // Generate tone-adjusted body content
  const getSubject = () => {
    if (tone === 'Friendly Founder') {
      return `Excited about your project! Scope & Roadmap: ${sow.project_title.split(':')[0]}`;
    }
    if (tone === 'Strict PM') {
      return `[Technical Scope of Work & Fixed Milestones] ${sow.project_title}`;
    }
    return initialEmail.subject;
  };

  const getGreeting = () => {
    if (tone === 'Friendly Founder') return 'Hey there,';
    if (tone === 'Strict PM') return 'Dear Client,';
    return initialEmail.recipient_greeting || 'Hi there,';
  };

  const getIntro = () => {
    if (tone === 'Friendly Founder') {
      return `Loved chatting through your requirements. We took your initial notes and matched them with our past product launches to map out a clear, phased MVP build.`;
    }
    if (tone === 'Strict PM') {
      return `Our engineering and architecture team has reviewed your technical requirements and completed formal capacity planning and historical benchmark mapping.`;
    }
    return initialEmail.body_intro;
  };

  const getOutro = () => {
    if (tone === 'Friendly Founder') {
      return `Take a look at the attached roadmap and let us know your thoughts. Would love to jump on a quick 15-minute sync to kick things off!`;
    }
    if (tone === 'Strict PM') {
      return `Please review the milestone deliverables and out-of-scope exclusions. Formal kickoff is scheduled upon milestone 1 deposit confirmation.`;
    }
    return initialEmail.next_steps_cta;
  };

  const getFullEmailText = () => {
    return `Subject: ${getSubject()}

${getGreeting()}

${getIntro()}

Key Scope Highlights:
${initialEmail.scope_highlights.map((h) => `• ${h}`).join('\n')}

Budget & Timeline Breakdown:
${initialEmail.pricing_timeline_summary}

Next Steps:
${getOutro()}

${initialEmail.sign_off}
`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getFullEmailText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMailTo = () => {
    const subject = encodeURIComponent(getSubject());
    const body = encodeURIComponent(
      `${getGreeting()}\n\n${getIntro()}\n\nKey Scope Highlights:\n${initialEmail.scope_highlights
        .map((h) => `• ${h}`)
        .join('\n')}\n\nBudget & Timeline:\n${
        initialEmail.pricing_timeline_summary
      }\n\nNext Steps:\n${getOutro()}\n\n${initialEmail.sign_off}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm space-y-5 p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100 dark:border-zinc-800">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
            <Mail className="w-3.5 h-3.5" />
            <span>Founder-Ready Client Communication</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
            Client Email Draft & Proposal Response
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 font-medium">
            1-click copy or open directly in your email client to send to the client.
          </p>
        </div>

        {/* Tone Switcher */}
        <div className="flex items-center space-x-1 bg-slate-100/80 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 p-1 rounded-xl self-start sm:self-auto">
          {(['Executive', 'Friendly Founder', 'Strict PM'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTone(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                tone === t
                  ? 'bg-white dark:bg-zinc-900 text-emerald-700 dark:text-emerald-400 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Formatted Email Box */}
      <div className="bg-slate-50/80 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 rounded-2xl p-6 font-sans text-xs text-slate-800 dark:text-zinc-200 space-y-4">
        {/* Subject */}
        <div className="pb-3 border-b border-slate-200/80 dark:border-zinc-800 flex items-center space-x-2">
          <span className="font-bold text-slate-400 dark:text-zinc-500 uppercase text-[11px] tracking-wider shrink-0">
            Subject:
          </span>
          <span className="text-slate-900 dark:text-zinc-100 font-semibold text-xs truncate">
            {getSubject()}
          </span>
        </div>

        {/* Body Content */}
        <div className="space-y-3.5 leading-relaxed">
          <p className="font-semibold text-slate-900 dark:text-zinc-100">{getGreeting()}</p>
          <p className="text-slate-700 dark:text-zinc-300">{getIntro()}</p>

          <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 p-4 rounded-xl space-y-2 shadow-xs">
            <span className="font-bold text-emerald-700 dark:text-emerald-400 text-[11px] uppercase tracking-wider block">
              Core Scope Highlights:
            </span>
            <ul className="space-y-1.5">
              {initialEmail.scope_highlights.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-2 text-slate-700 dark:text-zinc-300">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 p-4 rounded-xl space-y-2 shadow-xs">
            <span className="font-bold text-teal-700 dark:text-teal-400 text-[11px] uppercase tracking-wider block">
              Timeline & Investment (Grounded in Historical Benchmark):
            </span>
            <p className="text-slate-700 dark:text-zinc-300">
              {initialEmail.pricing_timeline_summary}
            </p>
          </div>

          <p className="text-slate-700 dark:text-zinc-300">{getOutro()}</p>

          <div className="pt-3 border-t border-slate-200/80 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 whitespace-pre-line font-medium">
            {initialEmail.sign_off}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
          Tone preset: <strong className="text-emerald-700 dark:text-emerald-400 font-bold">{tone}</strong>
        </span>

        <div className="flex items-center space-x-2.5 w-full sm:w-auto justify-end">
          <button
            id="copy-client-email-btn"
            onClick={handleCopy}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer shadow-sm shadow-emerald-600/20 active:scale-[0.99]"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-white" />
                <span>1-Click Copy Draft</span>
              </>
            )}
          </button>

          <button
            id="open-mailto-btn"
            onClick={handleMailTo}
            className="px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs active:scale-[0.99]"
          >
            <Send className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
            <span>Open Email Client</span>
          </button>
        </div>
      </div>
    </div>
  );
};
