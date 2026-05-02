import React from 'react';
import { Info, Sparkles, Menu } from 'lucide-react';
import { assetPath } from '../../constants';

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

type NavigationProps = {
  activeNav?: 'how-it-works' | 'features' | null;
  variant?: 'landing' | 'info';
  className?: string;
};

export const Navigation: React.FC<NavigationProps> = ({
  activeNav = null,
  variant = 'landing',
  className = ''
}) => {
  return (
    <header className={`h-20 sm:h-24 flex items-center justify-between ${className}`}>
      {/* Logo on the left */}
      <a href={assetPath('/')} className="flex items-center gap-2 sm:gap-3 rounded-xl px-1.5 sm:px-2 py-1 hover:bg-white/5 transition-colors">
        <img src={assetPath('/UI/logo.png')} alt="LiftShift Logo" className="w-6 h-6 sm:w-8 sm:h-8" />
        <span className="text-white font-semibold text-sm sm:text-xl">LiftShift</span>
      </a>

      {/* Navigation buttons grouped on the right - Desktop */}
      <div className="hidden sm:flex items-center gap-4">
        <a
          href={assetPath('how-it-works/')}
          className={`group inline-flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 text-xs font-medium bg-slate-950/50 border shadow-lg ${variant === 'info' && activeNav === 'how-it-works'
              ? 'border-emerald-400 text-emerald-300 shadow-emerald-500/40'
              : 'border-emerald-500/30 text-slate-300 shadow-emerald-500/10 hover:border-emerald-400 hover:text-emerald-300 hover:shadow-emerald-500/30'
            }`}
        >
          <Info className="w-3.5 h-3.5 group-hover:text-emerald-300 transition-colors" />
          <span>How it works</span>
        </a>
        <a
          href={assetPath('features/')}
          className={`group inline-flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 text-xs font-medium bg-slate-950/50 border shadow-lg ${variant === 'info' && activeNav === 'features'
              ? 'border-emerald-400 text-emerald-300 shadow-emerald-500/40'
              : 'border-emerald-500/30 text-slate-300 shadow-emerald-500/10 hover:border-emerald-400 hover:text-emerald-300 hover:shadow-emerald-500/30'
            }`}
        >
          <Sparkles className="w-3.5 h-3.5 group-hover:text-emerald-300 transition-colors" />
          <span>Features</span>
        </a>
        <a
          href="https://github.com/aree6/LiftShift"
          target="_blank"
          rel="noopener noreferrer"
          className={`group inline-flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 text-xs font-medium bg-slate-950/50 border shadow-lg border-emerald-500/30 text-slate-300 shadow-emerald-500/10 hover:border-emerald-400 hover:text-emerald-300 hover:shadow-emerald-500/30`}
        >
          <GithubIcon className="w-3.5 h-3.5 group-hover:text-emerald-300 transition-colors" />
          <span>GitHub</span>
        </a>
      </div>

      {/* Mobile Navigation - all buttons on the right */}
      <div className="sm:hidden flex items-center gap-2">
        <a
          href={assetPath('how-it-works/')}
          className={`inline-flex items-center gap-1 text-xs px-1.5 py-1 transition-colors ${variant === 'info' && activeNav === 'how-it-works'
            ? 'text-emerald-200'
            : 'text-slate-300 hover:text-emerald-200'
            }`}
        >
          <Info className="w-2.5 h-2.5" />
          <span>How it works</span>
        </a>
        <a
          href={assetPath('features/')}
          className={`inline-flex items-center gap-1 text-xs px-1.5 py-1 transition-colors ${variant === 'info' && activeNav === 'features'
            ? 'text-emerald-200'
            : 'text-slate-300 hover:text-emerald-200'
            }`}
        >
          <Sparkles className="w-2.5 h-2.5" />
          <span>Features</span>
        </a>
        <a href="https://github.com/aree6/LiftShift" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-slate-300 hover:text-emerald-200 px-1.5 py-1">
          <GithubIcon className="w-2.5 h-2.5" />
          <span>GitHub</span>
        </a>
      </div>
    </header>
  );
};
