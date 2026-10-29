import React, { useEffect, useRef } from 'react';
import {
  Sparkles,
  ClipboardPaste,
  Trash2,
  Columns,
  Layers,
  ArrowRight,
  Code2,
  ChevronDown,
} from 'lucide-react';
import { PRESET_SNIPPETS } from '../presets';
import { PresetSnippet, ToneType } from '../types';

interface InputPanelProps {
  inputText: string;
  setInputText: (text: string) => void;
  selectedTone: ToneType;
  setSelectedTone: (tone: ToneType) => void;
  isCompareMode: boolean;
  setIsCompareMode: (compare: boolean) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  inputText,
  setInputText,
  selectedTone,
  setSelectedTone,
  isCompareMode,
  setIsCompareMode,
  onSubmit,
  isLoading,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const charCount = inputText.length;

  const handleSelectPreset = (preset: PresetSnippet) => {
    setInputText(preset.content);
    setSelectedTone(preset.recommendedTone);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInputText(text);
      }
    } catch (err) {
      console.warn('Clipboard access denied or unavailable', err);
    }
  };

  // Keyboard shortcut: Cmd+Enter or Ctrl+Enter to submit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        if (!isLoading && inputText.trim().length > 0) {
          e.preventDefault();
          onSubmit();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLoading, inputText, onSubmit]);

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Preset Snippets Strip */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-500" />
            Quick Presets
          </span>
          <span className="text-[11px] hidden sm:inline text-slate-400">
            Click to load test documentation
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {PRESET_SNIPPETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className="p-2.5 text-left rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-xs transition-all group"
            >
              <div className="text-[10px] font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-semibold mb-0.5">
                {preset.category}
              </div>
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                {preset.title}
              </div>
              <div className="text-[10px] text-slate-400 truncate mt-0.5">
                {preset.subtitle}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Editor Container */}
      <div className="flex-1 flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
        {/* Editor Toolbar */}
        <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs bg-slate-50/60 dark:bg-slate-900/60">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium">
            <Code2 className="w-4 h-4 text-indigo-500" />
            <span>Technical Input</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePasteClipboard}
              className="flex items-center gap-1 px-2.5 py-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-md hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
              title="Paste from clipboard"
            >
              <ClipboardPaste className="w-3.5 h-3.5" />
              <span>Paste</span>
            </button>
            {inputText.length > 0 && (
              <button
                onClick={() => setInputText('')}
                className="flex items-center gap-1 px-2.5 py-1 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-md hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
                title="Clear input"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Text Area */}
        <div className="relative flex-1 min-h-[220px]">
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste convoluted technical documentation, code snippets, architectural RFCs, or cryptic DevOps errors here to demystify..."
            className="w-full h-full p-4 font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200 bg-transparent resize-none focus:outline-hidden placeholder:text-slate-400 leading-relaxed"
            rows={10}
          />
        </div>

        {/* Editor Footer / Word Count */}
        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono tabular-nums">
          <span>
            {wordCount} words · {charCount} chars
          </span>
          <span className="hidden sm:inline">Press ⌘+Enter to de-jargonize</span>
        </div>
      </div>

      {/* Controls & Submit Area */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
          {/* Tone Selector Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Select Explanation Tone
            </label>
            <div className="relative">
              <select
                value={selectedTone}
                onChange={(e) => setSelectedTone(e.target.value as ToneType)}
                className="w-full appearance-none px-3.5 py-2.5 pr-10 text-xs sm:text-sm font-medium rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="eli5">🧸 Explain like I'm 5</option>
                <option value="executive">💼 Executive Summary</option>
                <option value="technical">🔬 Deep Technical Breakdown</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-3 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Compare Toggle */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Comparison Mode
            </label>
            <button
              type="button"
              onClick={() => setIsCompareMode(!isCompareMode)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs sm:text-sm font-medium rounded-xl border transition-all ${
                isCompareMode
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60'
              }`}
            >
              <span className="flex items-center gap-2">
                <Columns className="w-4 h-4 text-indigo-500" />
                <span>Side-by-Side Comparison</span>
              </span>
              <span
                className={`w-2 h-2 rounded-full ${
                  isCompareMode ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Submit CTA */}
        <button
          onClick={onSubmit}
          disabled={isLoading || inputText.trim().length === 0}
          className="w-full py-3 px-4 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>De-jargonizing with Gemini 3.8...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Bust Jargon Now</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
