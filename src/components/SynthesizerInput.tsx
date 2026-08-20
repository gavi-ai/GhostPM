import React, { useState } from 'react';
import { 
  Sparkles, 
  Sliders, 
  RotateCcw, 
  Zap, 
  Check,
  RefreshCw,
  TrendingDown
} from 'lucide-react';
import { PRESET_INPUTS } from '../data/sampleProjects';

interface SynthesizerInputProps {
  input: string;
  setInput: (val: string) => void;
  onSynthesize: (params: { forceRefresh?: boolean; similarityThreshold?: number }) => void;
  isLoading: boolean;
  similarityThreshold: number;
  setSimilarityThreshold: (val: number) => void;
}

export const SynthesizerInput: React.FC<SynthesizerInputProps> = ({
  input,
  setInput,
  onSynthesize,
  isLoading,
  similarityThreshold,
  setSimilarityThreshold,
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [forceRefresh, setForceRefresh] = useState(false);
  const [selectedPresetIdx, setSelectedPresetIdx] = useState<number | null>(null);

  const handleSelectPreset = (idx: number) => {
    setSelectedPresetIdx(idx);
    setInput(PRESET_INPUTS[idx].prompt);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        onSynthesize({ forceRefresh, similarityThreshold });
      }
    }
  };

  const wordCount = input.trim() ? input.trim().split(/\s+/).length : 0;
  const approxTokens = Math.round(wordCount * 1.3);

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      {/* Top Header & Presets */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Unstructured Requirements Ingestion</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            PM Requirements Synthesizer
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
            Paste raw meeting transcripts, client WhatsApp voice note transcripts, or informal email requirements.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            id="toggle-settings-btn"
            onClick={() => setShowSettings(!showSettings)}
            className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs ${
              showSettings
                ? 'bg-slate-100 border-slate-300 text-slate-800'
                : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-slate-500" />
            <span>RAG & Cache Controls</span>
          </button>
        </div>
      </div>

      {/* Preset Pill Buttons */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Quick Ingestion Presets:
          </span>
          {input.length > 0 && (
            <button
              onClick={() => {
                setInput('');
                setSelectedPresetIdx(null);
              }}
              className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Clear Input
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PRESET_INPUTS.map((preset, idx) => (
            <button
              key={preset.label}
              id={`preset-btn-${idx}`}
              onClick={() => handleSelectPreset(idx)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                selectedPresetIdx === idx
                  ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 shadow-xs'
                  : 'bg-slate-50/70 border-slate-200/80 text-slate-700 hover:bg-white hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className={`text-[10px] uppercase font-bold tracking-wider ${selectedPresetIdx === idx ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {preset.category}
                </span>
                {selectedPresetIdx === idx && (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                )}
              </div>
              <span className="text-xs font-bold text-slate-800 mt-1.5 line-clamp-1">
                {preset.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Settings Panel (Collapsible) */}
      {showSettings && (
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-4 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Threshold Slider */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  Semantic Cache Match Threshold:
                </span>
                <span className="font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  {(similarityThreshold * 100).toFixed(0)}% Match
                </span>
              </div>
              <input
                type="range"
                min="0.80"
                max="0.99"
                step="0.01"
                value={similarityThreshold}
                onChange={(e) => setSimilarityThreshold(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                Queries with Cosine Similarity ≥ {(similarityThreshold * 100).toFixed(0)}% return instant cached JSON with $0 cost.
              </p>
            </div>

            {/* Force Refresh Toggle */}
            <div className="flex flex-col justify-between">
              <label className="flex items-start space-x-3 cursor-pointer p-2.5 rounded-xl hover:bg-slate-100/80 transition-colors">
                <input
                  type="checkbox"
                  checked={forceRefresh}
                  onChange={(e) => setForceRefresh(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer mt-0.5"
                />
                <div>
                  <span className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                    <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
                    Force Fresh LLM Run (Bypass Cache)
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Forces fresh Gemini 3.7 Flash generation even if high semantic cache match exists.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Main Textarea */}
      <div className="space-y-2">
        <textarea
          id="client-raw-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Paste messy client WhatsApp voice note transcript, email thread, or rough requirements here... e.g.:

'Haan bhai, ek app banani hai dog walkers ke liye. Dog owners walkers book kar sakein, live location tracking ho jab walker dog ko walk kar raha ho, aur automated payment gateway laga ho with walker commission payout. Photos upload ho sakein walk ke beech mein. Budget thoda tight hai, 1 mahine mein MVP chahiye.'"
          rows={5}
          className="w-full bg-slate-50/60 border border-slate-200 rounded-2xl p-4 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 font-sans leading-relaxed resize-y transition-all"
        />

        {/* Floating helper badges */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 px-1">
          <div className="flex items-center space-x-3 font-medium">
            <span>{wordCount} words</span>
            <span>•</span>
            <span>~{approxTokens} prompt tokens</span>
            <span>•</span>
            <span className="text-emerald-700 font-semibold">Strict Top-2 RAG token diet</span>
          </div>

          <div className="hidden sm:flex items-center space-x-2 text-slate-500">
            <span>Press</span>
            <kbd className="px-2 py-0.5 text-[10px] bg-slate-100 border border-slate-300/80 rounded-md text-slate-700 font-mono font-semibold">
              ⌘ / Ctrl + Enter
            </kbd>
            <span>to synthesize</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="flex items-center space-x-2 text-xs text-slate-600 font-medium">
          <TrendingDown className="w-4 h-4 text-emerald-600" />
          <span>Grounded against verified Supabase historical benchmarks</span>
        </div>

        <button
          type="button"
          id="synthesize-btn"
          disabled={!input.trim() || isLoading}
          onClick={() => onSynthesize({ forceRefresh, similarityThreshold })}
          className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-semibold text-xs flex items-center justify-center space-x-2.5 transition-all cursor-pointer shadow-sm ${
            !input.trim() || isLoading
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-700/20 active:scale-[0.99]'
          }`}
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span>Executing 5-Stage Pipeline...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-white" />
              <span>Generate SOW, JIRA Tickets & Email</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

