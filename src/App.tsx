import React, { useState, useEffect } from 'react';
import { TopBar } from './components/TopBar';
import { InputPanel } from './components/InputPanel';
import { ExplanationCard } from './components/ExplanationCard';
import { CompareView } from './components/CompareView';
import { GlossaryModal } from './components/GlossaryModal';
import { ShareableCardModal } from './components/ShareableCardModal';
import { PRESET_SNIPPETS } from './presets';
import { JargonBusterResponse, ToneType } from './types';
import {
  Sparkles,
  AlertCircle,
  HelpCircle,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Cpu,
} from 'lucide-react';

export default function App() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('jb_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  const [inputText, setInputText] = useState<string>(PRESET_SNIPPETS[0].content);
  const [selectedTone, setSelectedTone] = useState<ToneType>('eli5');
  const [isCompareMode, setIsCompareMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<JargonBusterResponse | null>(null);
  const [activeModal, setActiveModal] = useState<'glossary' | 'share' | null>(null);

  // Sync theme with html class
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('jb_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('jb_theme', 'light');
    }
  }, [isDark]);

  const handleToggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const handleReset = () => {
    setInputText(PRESET_SNIPPETS[0].content);
    setSelectedTone('eli5');
    setIsCompareMode(false);
    setError(null);
    setResponse(null);
    setActiveModal(null);
  };

  const handleBustJargon = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/bust-jargon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText,
          tone: selectedTone,
        }),
      });

      if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}));
        throw new Error(
          errorJson.error || `Server responded with status ${res.status}`
        );
      }

      const data: JargonBusterResponse = await res.json();
      setResponse(data);
    } catch (err: any) {
      console.error('Failed to bust jargon:', err);
      setError(
        err.message || 'Unable to de-jargonize text. Please verify the Gemini API key.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Collect all unique terms from current response for the modal
  const allTerms = response
    ? Array.from(
        new Map(
          [
            ...response.explanations.eli5.jargonTerms,
            ...response.explanations.executive.jargonTerms,
            ...response.explanations.technical.jargonTerms,
          ].map((item) => [item.term.toLowerCase(), item])
        ).values()
      )
    : [];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors selection:bg-indigo-500/20 selection:text-indigo-600 dark:selection:text-indigo-400">
      {/* Top Bar adhering to Top Bar Contract */}
      <TopBar
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        onReset={handleReset}
      />

      {/* Main Workspace Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col">
        {/* Error notification */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs sm:text-sm flex items-start justify-between gap-3 animate-in fade-in">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">De-Jargonizing Error: </span>
                <span>{error}</span>
              </div>
            </div>
            <button
              onClick={handleBustJargon}
              className="px-3 py-1 rounded-lg bg-rose-200 dark:bg-rose-800/60 hover:bg-rose-300 dark:hover:bg-rose-800 text-rose-900 dark:text-white font-medium shrink-0 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Workbench Layout: If compare mode is active and we have response, we can render CompareView prominently */}
        {isCompareMode && response ? (
          <div className="flex-1 flex flex-col space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Compare Mode Active
                </span>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                <span className="text-slate-500 dark:text-slate-400">
                  Analyzing all three personas simultaneously
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsCompareMode(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium transition-colors"
                >
                  Switch to Single-Tone View
                </button>
                <button
                  onClick={() => setActiveModal('glossary')}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors"
                >
                  View Full Glossary ({allTerms.length})
                </button>
              </div>
            </div>

            <div className="flex-1">
              <CompareView
                response={response}
                onSelectTone={(tone) => {
                  setSelectedTone(tone);
                  setIsCompareMode(false);
                }}
                onOpenGlossary={() => setActiveModal('glossary')}
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Input Workbench (5 cols on lg) */}
            <div className="lg:col-span-5 h-full">
              <InputPanel
                inputText={inputText}
                setInputText={setInputText}
                selectedTone={selectedTone}
                setSelectedTone={setSelectedTone}
                isCompareMode={isCompareMode}
                setIsCompareMode={setIsCompareMode}
                onSubmit={handleBustJargon}
                isLoading={isLoading}
              />
            </div>

            {/* Right Column: Output Explanation Canvas (7 cols on lg) */}
            <div className="lg:col-span-7 h-full min-h-[500px]">
              {isLoading ? (
                /* Loading Skeleton */
                <div className="h-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-6 shadow-xs animate-pulse">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div className="space-y-2">
                      <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded-md" />
                      <div className="h-6 w-64 bg-slate-300 dark:bg-slate-700 rounded-lg" />
                    </div>
                    <div className="h-8 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                  </div>

                  <div className="h-12 w-full bg-slate-100 dark:bg-slate-850 rounded-xl" />

                  <div className="space-y-3">
                    <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-md" />
                    <div className="h-4 w-11/12 bg-slate-200 dark:bg-slate-800 rounded-md" />
                    <div className="h-4 w-4/5 bg-slate-200 dark:bg-slate-800 rounded-md" />
                    <div className="h-4 w-9/12 bg-slate-200 dark:bg-slate-800 rounded-md" />
                  </div>

                  <div className="h-24 w-full bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100/50 dark:border-indigo-900/30" />

                  <div className="h-28 w-full bg-slate-100 dark:bg-slate-850 rounded-xl" />

                  <div className="text-center text-xs text-slate-400 font-mono">
                    Translating concepts, extracting terminology & generating analogies...
                  </div>
                </div>
              ) : response ? (
                /* Populated Explanation State */
                <ExplanationCard
                  explanation={response.explanations[selectedTone]}
                  tone={selectedTone}
                  onChangeTone={setSelectedTone}
                  domain={response.detectedDomain}
                  onOpenGlossary={() => setActiveModal('glossary')}
                  onOpenShareModal={() => setActiveModal('share')}
                />
              ) : (
                /* Zero / Ready State */
                <div className="h-full rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center shadow-inner">
                    <Sparkles className="w-8 h-8" />
                  </div>

                  <div className="max-w-md space-y-2">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                      Ready to Demystify Jargon
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      Paste any complex technical text, code snippet, or engineering RFC on the left.
                      Choose your preferred tone or load one of our quick presets to see it in action.
                    </p>
                  </div>

                  {/* 3 Tone Value Props */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg text-left text-xs">
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-1">
                      <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>🧸</span>
                        <span>ELI5</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        Everyday kitchen & traffic analogies. Simple intuition.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-1">
                      <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>💼</span>
                        <span>Executive</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        Business impact, scalability, risks & resource trade-offs.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-1">
                      <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>🔬</span>
                        <span>Deep Dive</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        Internal protocols, CPU/memory guarantees & edge cases.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleBustJargon}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-indigo-600/20 active:scale-95"
                  >
                    <span>Run Sample Preset</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 dark:border-slate-800 py-4 px-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              AI Jargon Buster
            </span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
            <span>Powered by Gemini 3.8 Flash & Lite TTS</span>
          </div>
          <div className="text-slate-400 font-mono text-[11px]">
            Zero-Jargon Guaranteed
          </div>
        </div>
      </footer>

      {/* Modals */}
      {activeModal === 'glossary' && response && (
        <GlossaryModal
          terms={allTerms}
          detectedDomain={response.detectedDomain}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'share' && response && (
        <ShareableCardModal
          explanation={response.explanations[selectedTone]}
          tone={selectedTone}
          domain={response.detectedDomain}
          originalSummary={response.originalSummary}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
}
