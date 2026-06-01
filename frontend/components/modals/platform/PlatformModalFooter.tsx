import React from 'react';
import { Check, GitMerge, HelpCircle } from 'lucide-react';

interface PlatformModalFooterProps {
  helpLabel: string;
  onToggleHelp: () => void;
  showHelp?: boolean;
  onAddDataSource?: () => void;
  isLoading?: boolean;
}

export function PlatformModalFooter({
  helpLabel,
  onToggleHelp,
  showHelp = false,
  onAddDataSource,
  isLoading = false,
}: PlatformModalFooterProps): React.ReactElement {
  const helpClasses = showHelp
    ? 'inline-flex items-center gap-1.5 h-9 px-3 rounded-md text-xs font-semibold bg-blue-500/20 border border-blue-500/50 text-blue-300 cursor-pointer'
    : 'inline-flex items-center gap-1.5 h-9 px-3 rounded-md text-xs font-semibold border border-slate-700/50 text-slate-400 hover:text-slate-200 hover:border-slate-600 cursor-pointer bg-transparent';

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={onToggleHelp}
        className={helpClasses}
      >
        {showHelp ? (
          <Check className="w-4 h-4" />
        ) : (
          <HelpCircle className="w-4 h-4" />
        )}
        <span>{helpLabel}</span>
      </button>

      {onAddDataSource ? (
        <button
          type="button"
          onClick={onAddDataSource}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md text-xs font-semibold border border-slate-700/50 text-slate-400 hover:text-slate-200 hover:border-slate-600 cursor-pointer bg-transparent"
        >
          <GitMerge className="w-4 h-4" />
          <span>Combine Sources</span>
        </button>
      ) : null}
    </div>
  );
}

export default PlatformModalFooter;
