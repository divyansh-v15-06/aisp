import React from 'react';
import { X, Lightbulb, Tag, BookMarked } from 'lucide-react';
import { JargonTerm } from '../types';

interface TermTooltipProps {
  term: JargonTerm;
  onClose: () => void;
  position?: { top: number; left: number };
}

export const TermTooltip: React.FC<TermTooltipProps> = ({ term, onClose }) => {
  return (
    <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl shadow-slate-900/10 dark:shadow-black/40 text-left max-w-sm w-80 animate-in fade-in zoom-in-95 duration-150 z-50">
      <div className="flex items-start justify-between gap-2 mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1">
            <Tag className="w-3 h-3" />
            {term.category}
          </span>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
            {term.term}
          </h4>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close tooltip"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2.5 text-xs">
        <div>
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5 flex items-center gap-1">
            <BookMarked className="w-3 h-3 text-slate-400" />
            Plain-English Meaning
          </div>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            {term.simpleDefinition}
          </p>
        </div>

        {term.analogy && (
          <div className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 rounded-lg p-2.5">
            <div className="text-[11px] font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wider mb-0.5 flex items-center gap-1">
              <Lightbulb className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              Everyday Analogy
            </div>
            <p className="text-amber-900 dark:text-amber-200/90 leading-relaxed italic">
              "{term.analogy}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
