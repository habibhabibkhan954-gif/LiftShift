import React from 'react';
import { Moon, Palette, SlidersHorizontal, Sparkles, Sun } from 'lucide-react';
import { ExerciseTrendMode, ThemeMode } from '../../../utils/storage/localStorage';
import { CompactThemeOption } from './UserPreferencesThemeOption';

const formatSecondaryInput = (value: number): string => {
  const fixed = value.toFixed(2);
  return fixed.replace(/\.00$/, '').replace(/(\.\d)0$/, '$1');
};

interface TrendModeSectionProps {
  exerciseTrendMode: ExerciseTrendMode;
  onExerciseTrendModeChange: (mode: ExerciseTrendMode) => void;
}

export const TrendModeSection: React.FC<TrendModeSectionProps> = ({
  exerciseTrendMode,
  onExerciseTrendModeChange,
}) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2 text-slate-200">
      <Sparkles className="w-3.5 h-3.5 text-slate-500" />
      <span className="text-xs font-medium">Trend Reactiveness</span>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      <button
        type="button"
        onClick={() => onExerciseTrendModeChange('stable')}
        className={`flex items-center gap-2 p-2 rounded-lg border transition-all text-left ${
          exerciseTrendMode === 'stable'
            ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
            : 'bg-slate-900/20 border-slate-700/50 text-slate-300 hover:border-slate-600 hover:bg-slate-900/40'
        }`}
      >
        <div
          className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 ${
            exerciseTrendMode === 'stable' ? 'bg-emerald-500/20' : 'bg-slate-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <div className="min-w-0">
          <div className="text-xs font-medium truncate">Stable</div>
          <div className="text-[10px] text-slate-500 truncate">More stable, slower to react</div>
        </div>
      </button>
      <button
        type="button"
        onClick={() => onExerciseTrendModeChange('reactive')}
        className={`flex items-center gap-2 p-2 rounded-lg border transition-all text-left ${
          exerciseTrendMode === 'reactive'
            ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
            : 'bg-slate-900/20 border-slate-700/50 text-slate-300 hover:border-slate-600 hover:bg-slate-900/40'
        }`}
      >
        <div
          className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 ${
            exerciseTrendMode === 'reactive' ? 'bg-emerald-500/20' : 'bg-slate-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <div className="min-w-0">
          <div className="text-xs font-medium truncate">Reactive</div>
          <div className="text-[10px] text-slate-500 truncate">Responds faster to recent sessions (recommended)</div>
        </div>
      </button>
    </div>
  </div>
);

interface ThemeSectionProps {
  themeMode: ThemeMode;
  onThemeModeChange: (mode: ThemeMode) => void;
}

export const ThemeSection: React.FC<ThemeSectionProps> = ({ themeMode, onThemeModeChange }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2 text-slate-200">
      <Palette className="w-3.5 h-3.5 text-slate-500" />
      <span className="text-xs font-medium">Theme</span>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
      <CompactThemeOption
        mode="pure-black"
        currentMode={themeMode}
        onClick={() => onThemeModeChange('pure-black')}
        label="Pure Black"
        icon={<Moon className="w-3.5 h-3.5" />}
      />
      <CompactThemeOption
        mode="midnight-dark"
        currentMode={themeMode}
        onClick={() => onThemeModeChange('midnight-dark')}
        label="Midnight"
        icon={<Sparkles className="w-3.5 h-3.5" />}
      />
      <CompactThemeOption
        mode="medium-dark"
        currentMode={themeMode}
        onClick={() => onThemeModeChange('medium-dark')}
        label="Medium"
        icon={<Moon className="w-3.5 h-3.5" />}
      />
      <CompactThemeOption
        mode="light"
        currentMode={themeMode}
        onClick={() => onThemeModeChange('light')}
        label="Light"
        icon={<Sun className="w-3.5 h-3.5" />}
      />
    </div>
  </div>
);

interface SecondarySetMultiplierSectionProps {
  secondarySetMultiplier: number;
  onSecondarySetMultiplierChange: (value: number) => void;
}

export const SecondarySetMultiplierSection: React.FC<SecondarySetMultiplierSectionProps> = ({
  secondarySetMultiplier,
  onSecondarySetMultiplierChange,
}) => {
  const [draft, setDraft] = React.useState<string>(() => formatSecondaryInput(secondarySetMultiplier));

  React.useEffect(() => {
    setDraft(formatSecondaryInput(secondarySetMultiplier));
  }, [secondarySetMultiplier]);

  const commitDraft = React.useCallback(() => {
    const raw = draft.trim();
    if (!raw) {
      setDraft(formatSecondaryInput(secondarySetMultiplier));
      return;
    }
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) {
      setDraft(formatSecondaryInput(secondarySetMultiplier));
      return;
    }
    const clamped = Math.min(1, Math.max(0, parsed));
    const normalized = Number(clamped.toFixed(2));
    onSecondarySetMultiplierChange(normalized);
    setDraft(formatSecondaryInput(normalized));
  }, [draft, onSecondarySetMultiplierChange, secondarySetMultiplier]);

  return (
    <div className="space-y-2">
    <div className="flex items-center gap-2 text-slate-200">
      <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
      <span className="text-xs font-medium">Secondary Set Value</span>
    </div>
    <div className="rounded-lg border border-slate-700/50 bg-slate-900/20 p-3 space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] text-slate-400">Secondary muscles per set</span>
        <button
          type="button"
          onClick={() => {
            onSecondarySetMultiplierChange(0.5);
            setDraft('0.5');
          }}
          className="rounded-md border border-slate-600 bg-slate-900 px-2 py-1 text-[10px] font-medium text-slate-200 hover:border-slate-500 hover:bg-slate-800 transition-colors"
        >
          Default 0.5
        </button>
      </div>
      <input
        type="text"
        inputMode="decimal"
        value={draft}
        onChange={(e) => {
          const next = e.target.value;
          if (next === '') {
            setDraft('');
            return;
          }
          if (!/^\d*\.?\d*$/.test(next)) return;
          setDraft(next);
        }}
        onBlur={commitDraft}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            commitDraft();
          }
        }}
        className="w-full rounded-md border border-slate-600 bg-slate-950 px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        placeholder="0.00 to 1.00"
        aria-label="Secondary set multiplier"
      />
      <p className="text-[10px] text-slate-500">Primary stays 1.0. Default secondary is 0.5.</p>
    </div>
    </div>
  );
};
