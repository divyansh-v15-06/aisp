import React from 'react';
import { Sun, Moon, RotateCcw, Sparkles, BookOpen } from 'lucide-react';

interface TopBarProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onReset: () => void;
  onOpenDocsHelp?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  isDark,
  onToggleTheme,
  onReset,
}) => {
  return (
    <header className="w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-base font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
              AI Jargon Buster
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono tracking-tight -mt-0.5">
              Technical Clarity Engine
            </div>
          </div>
        </div>

        {/* Zone 2: Informational Nav Links / Badges */}
        <nav className="hidden md:flex items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
            ELI5 Real-World Analogies
          </span>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
          <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Executive ROI & Architecture
          </span>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
          <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
            Deep Systems Mechanics
          </span>
        </nav>

        {/* Zone 3: Actions (Theme Toggle & Reset) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Reset to default"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            onClick={onToggleTheme}
            className="p-2 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};
