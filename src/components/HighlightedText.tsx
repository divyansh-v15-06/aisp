import React, { useState, useRef, useEffect } from 'react';
import { JargonTerm } from '../types';
import { TermTooltip } from './TermTooltip';

interface HighlightedTextProps {
  text: string;
  terms: JargonTerm[];
  onSelectTerm?: (term: JargonTerm) => void;
}

export const HighlightedText: React.FC<HighlightedTextProps> = ({
  text,
  terms,
  onSelectTerm,
}) => {
  const [activeTerm, setActiveTerm] = useState<JargonTerm | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveTerm(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  if (!terms || terms.length === 0 || !text) {
    return <div className="whitespace-pre-line text-slate-800 dark:text-slate-200 leading-relaxed">{text}</div>;
  }

  // Sort terms by length descending to match longer multi-word phrases first
  const sortedTerms = [...terms].sort((a, b) => b.term.length - a.term.length);

  // Build regex pattern matching any of the terms
  const escapedTerms = sortedTerms.map((t) => t.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const pattern = new RegExp(`\\b(${escapedTerms.join('|')})\\b`, 'gi');

  const paragraphs = text.split('\n\n');

  const renderContent = (paragraphText: string, pIdx: number) => {
    const parts = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    pattern.lastIndex = 0;
    while ((match = pattern.exec(paragraphText)) !== null) {
      const matchStart = match.index;
      const matchEnd = pattern.lastIndex;
      const matchedString = match[0];

      // Push preceding text
      if (matchStart > lastIndex) {
        parts.push(paragraphText.substring(lastIndex, matchStart));
      }

      // Find corresponding term object (case-insensitive)
      const foundTerm = sortedTerms.find(
        (t) => t.term.toLowerCase() === matchedString.toLowerCase()
      );

      if (foundTerm) {
        parts.push(
          <button
            key={`highlight-${pIdx}-${matchStart}`}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveTerm(foundTerm);
              if (onSelectTerm) onSelectTerm(foundTerm);
            }}
            className="inline-flex items-center mx-0.5 px-1.5 py-0.5 text-xs font-semibold rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors cursor-pointer align-baseline group"
            title={`Click to de-jargonize: ${foundTerm.term}`}
          >
            <span>{matchedString}</span>
            <span className="ml-1 text-[9px] opacity-60 group-hover:opacity-100 font-mono">?</span>
          </button>
        );
      } else {
        parts.push(matchedString);
      }

      lastIndex = matchEnd;
    }

    if (lastIndex < paragraphText.length) {
      parts.push(paragraphText.substring(lastIndex));
    }

    return (
      <p key={pIdx} className="mb-4 text-slate-800 dark:text-slate-200 leading-relaxed text-sm sm:text-base">
        {parts}
      </p>
    );
  };

  return (
    <div ref={containerRef} className="relative">
      {paragraphs.map((p, idx) => renderContent(p, idx))}

      {activeTerm && (
        <div className="fixed inset-0 sm:absolute sm:inset-auto sm:top-2 sm:right-2 z-50 flex items-center justify-center sm:block p-4 sm:p-0 bg-black/40 sm:bg-transparent backdrop-blur-xs sm:backdrop-blur-none">
          <TermTooltip
            term={activeTerm}
            onClose={() => setActiveTerm(null)}
          />
        </div>
      )}
    </div>
  );
};
