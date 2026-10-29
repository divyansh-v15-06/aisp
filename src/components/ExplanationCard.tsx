import React, { useState } from 'react';
import {
  BookOpen,
  Share2,
  Copy,
  Check,
  Download,
  Lightbulb,
  TrendingUp,
  Cpu,
  Clock,
  Layers,
  Sparkles,
} from 'lucide-react';
import { ToneExplanation, ToneType, JargonTerm } from '../types';
import { HighlightedText } from './HighlightedText';
import { AudioPlayer } from './AudioPlayer';

interface ExplanationCardProps {
  explanation: ToneExplanation;
  tone: ToneType;
  onChangeTone: (tone: ToneType) => void;
  domain: string;
  onOpenGlossary: () => void;
  onOpenShareModal: () => void;
}

export const ExplanationCard: React.FC<ExplanationCardProps> = ({
  explanation,
  tone,
  onChangeTone,
  domain,
  onOpenGlossary,
  onOpenShareModal,
}) => {
  const [copied, setCopied] = useState(false);

  const toneMeta: Record<
    ToneType,
    { label: string; icon: string; description: string; color: string }
  > = {
    eli5: {
      label: "Explain like I'm 5",
      icon: '🧸',
      description: 'Everyday intuitive analogies & zero jargon',
      color: 'indigo',
    },
    executive: {
      label: 'Executive Summary',
      icon: '💼',
      description: 'Strategic value, architecture trade-offs & ROI',
      color: 'emerald',
    },
    technical: {
      label: 'Deep Technical Breakdown',
      icon: '🔬',
      description: 'Low-level protocols, state mechanics & edge cases',
      color: 'sky',
    },
  };

  const handleCopyMarkdown = () => {
    const md = `# ${explanation.title}\n*Tone: ${toneMeta[tone].label} | Domain: ${domain}*\n\n${explanation.coreExplanation}\n\n## Takeaways\n${explanation.keyTakeaways.map((t) => `- ${t}`).join('\n')}`;
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const md = `# ${explanation.title}\n*Tone: ${toneMeta[tone].label} | Domain: ${domain}*\n\n${explanation.coreExplanation}\n\n## Key Takeaways\n${explanation.keyTakeaways.map((t) => `- ${t}`).join('\n')}`;
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tone}-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex flex-col h-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
      {/* Header Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 space-y-3 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Domain tag */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              {domain}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
              <Clock className="w-3 h-3" />
              {explanation.readingTime}
            </span>
          </div>

          {/* Quick Tone Switcher Buttons */}
          <div className="flex items-center gap-1 p-1 bg-slate-200/60 dark:bg-slate-800/80 rounded-xl">
            {(['eli5', 'executive', 'technical'] as ToneType[]).map((t) => (
              <button
                key={t}
                onClick={() => onChangeTone(t)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                  tone === t
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>{toneMeta[t].icon}</span>
                <span className="hidden sm:inline">
                  {t === 'eli5' ? 'ELI5' : t === 'executive' ? 'Executive' : 'Deep Technical'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Title & Short description */}
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            {explanation.title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {toneMeta[tone].description}
          </p>
        </div>

        {/* Audio Player */}
        <AudioPlayer
          textToSpeak={explanation.coreExplanation}
          title={explanation.title}
          toneName={toneMeta[tone].label}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
        {/* Core Explanation with interactive terms */}
        <div className="prose dark:prose-invert max-w-none">
          <HighlightedText
            text={explanation.coreExplanation}
            terms={explanation.jargonTerms}
          />
        </div>

        {/* Persona-specific callout block */}
        {tone === 'eli5' && explanation.analogy && (
          <div className="p-4 rounded-xl bg-amber-50/90 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/40 space-y-1.5">
            <div className="text-xs font-semibold text-amber-900 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              The Everyday Analogy
            </div>
            <p className="text-xs sm:text-sm text-amber-900 dark:text-amber-200/90 leading-relaxed italic">
              "{explanation.analogy}"
            </p>
          </div>
        )}

        {tone === 'executive' && explanation.businessImpact && (
          <div className="p-4 rounded-xl bg-emerald-50/90 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/40 space-y-1.5">
            <div className="text-xs font-semibold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Strategic Business & Architectural Impact
            </div>
            <p className="text-xs sm:text-sm text-emerald-900 dark:text-emerald-200/90 leading-relaxed">
              {explanation.businessImpact}
            </p>
          </div>
        )}

        {tone === 'technical' && explanation.architectureMechanics && (
          <div className="p-4 rounded-xl bg-sky-50/90 dark:bg-sky-950/30 border border-sky-200/80 dark:border-sky-800/40 space-y-1.5">
            <div className="text-xs font-semibold text-sky-900 dark:text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              Systems Execution & Internal Flow
            </div>
            <p className="text-xs sm:text-sm text-sky-900 dark:text-sky-200/90 leading-relaxed font-mono">
              {explanation.architectureMechanics}
            </p>
          </div>
        )}

        {/* 3 Key Takeaways */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850/50 space-y-2.5">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            Key Mental Models & Takeaways
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            {explanation.keyTakeaways.map((takeaway, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Interactive Jargon Strip */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              De-Jargonized Vocabulary ({explanation.jargonTerms.length})
            </span>
            <button
              onClick={onOpenGlossary}
              className="text-indigo-600 dark:text-indigo-400 hover:underline text-xs font-medium flex items-center gap-1"
            >
              <span>View Full Glossary</span>
              <span>→</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {explanation.jargonTerms.map((term, i) => (
              <button
                key={i}
                onClick={onOpenGlossary}
                className="px-2 py-1 text-xs rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 text-slate-700 dark:text-slate-300 font-mono transition-colors"
                title={`${term.term}: ${term.simpleDefinition}`}
              >
                {term.term}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900 flex flex-wrap items-center justify-between gap-2 text-xs">
        <button
          onClick={onOpenGlossary}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors font-medium"
        >
          <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
          <span>Glossary ({explanation.jargonTerms.length})</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyMarkdown}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors font-medium"
            title="Copy as Markdown"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Copy MD</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors font-medium"
            title="Download .md file"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <button
            onClick={onOpenShareModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors shadow-xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Brief</span>
          </button>
        </div>
      </div>
    </div>
  );
};
