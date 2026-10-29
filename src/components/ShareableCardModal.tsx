import React, { useState } from 'react';
import { X, Copy, Check, Download, Share2, Sparkles } from 'lucide-react';
import { ToneExplanation, ToneType } from '../types';

interface ShareableCardModalProps {
  explanation: ToneExplanation;
  tone: ToneType;
  domain: string;
  originalSummary: string;
  onClose: () => void;
}

export const ShareableCardModal: React.FC<ShareableCardModalProps> = ({
  explanation,
  tone,
  domain,
  originalSummary,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedMd, setCopiedMd] = useState(false);

  const toneLabelMap: Record<ToneType, string> = {
    eli5: "Explain Like I'm 5",
    executive: 'Executive Summary',
    technical: 'Deep Technical Breakdown',
  };

  const generateMarkdown = () => {
    return `# ${explanation.title}
*Tone: ${toneLabelMap[tone]} | Domain: ${domain} | Reading Time: ${explanation.readingTime}*

## Summary
${explanation.coreExplanation}

${
  explanation.analogy
    ? `### Everyday Analogy\n> "${explanation.analogy}"\n`
    : explanation.businessImpact
    ? `### Business Impact & Strategy\n${explanation.businessImpact}\n`
    : explanation.architectureMechanics
    ? `### Architecture Mechanics\n${explanation.architectureMechanics}\n`
    : ''
}

## Key Takeaways
${explanation.keyTakeaways.map((t) => `- ${t}`).join('\n')}

## De-Jargonized Vocabulary
${explanation.jargonTerms
  .map((jt) => `### ${jt.term} (${jt.category})\n- **Definition**: ${jt.simpleDefinition}\n- **Analogy**: *${jt.analogy}*`)
  .join('\n\n')}

---
*Generated via AI Jargon Buster*
`;
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generateMarkdown());
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const md = generateMarkdown();
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jargon-buster-${tone}-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyText = () => {
    const text = `💡 ${explanation.title} (${toneLabelMap[tone]})\n\n${explanation.coreExplanation}\n\nKey Takeaways:\n${explanation.keyTakeaways.map((t) => `• ${t}`).join('\n')}\n\n— Generated with AI Jargon Buster`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl max-h-[90vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Shareable Technical Brief
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Canvas */}
        <div className="p-5 overflow-y-auto space-y-4">
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-linear-to-b from-slate-50 to-white dark:from-slate-800/60 dark:to-slate-900/80 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-indigo-600 dark:text-indigo-400 font-semibold tracking-wider uppercase text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800">
                {toneLabelMap[tone]}
              </span>
              <span className="text-slate-400 font-mono text-[11px]">{domain}</span>
            </div>

            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {explanation.title}
            </h2>

            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {explanation.coreExplanation}
            </p>

            {explanation.analogy && (
              <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-800/30 text-xs text-amber-900 dark:text-amber-200 italic">
                "{explanation.analogy}"
              </div>
            )}

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Core Takeaways
              </div>
              <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                {explanation.keyTakeaways.map((takeaway, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-indigo-500 font-bold">✓</span>
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-500" />
                AI Jargon Buster
              </span>
              <span>{explanation.readingTime}</span>
            </div>
          </div>
        </div>

        {/* Action bar */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-wrap items-center justify-end gap-2 text-xs">
          <button
            onClick={handleCopyText}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors font-medium"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy Text</span>
          </button>

          <button
            onClick={handleCopyMarkdown}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors font-medium"
          >
            {copiedMd ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy Markdown</span>
          </button>

          <button
            onClick={handleDownloadMarkdown}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors font-medium shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .md</span>
          </button>
        </div>
      </div>
    </div>
  );
};
