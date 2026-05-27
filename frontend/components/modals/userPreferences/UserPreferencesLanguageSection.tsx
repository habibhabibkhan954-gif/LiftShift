import React from 'react';
import { useTranslation } from '../../translation/TranslationProvider';
import { SUPPORTED_LANGUAGES, type SupportedLanguageCode } from '../../translation/languageConfig';

export const LanguageSection: React.FC = () => {
  const { currentLanguage, setLanguage, isAvailable, engineName } = useTranslation();

  return (
    <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-slate-300 mb-3">Language</h3>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {SUPPORTED_LANGUAGES.map((lang) => {
          const isActive = currentLanguage === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => setLanguage(lang.code)}
              className={`
                px-3 py-2 rounded-lg text-sm font-medium transition-all text-left
                ${isActive
                  ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-400'
                  : 'bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-slate-200 hover:border-slate-600'
                }
              `}
            >
              <div className="text-xs text-slate-500">{lang.code.toUpperCase()}</div>
              <div className="truncate">{lang.nativeLabel}</div>
            </button>
          );
        })}
      </div>

      {currentLanguage !== 'en' && !isAvailable && (
        <div className="mt-3 text-xs text-amber-400/80 bg-amber-400/5 border border-amber-400/20 rounded-md px-3 py-2">
          Translation service not available. Set up a LibreTranslate endpoint or use Chrome 138+ for built-in translation.
        </div>
      )}

      {currentLanguage !== 'en' && isAvailable && engineName && (
        <div className="mt-2 text-xs text-slate-500">
          Translating via {engineName === 'chrome-builtin' ? 'Chrome on-device' : engineName}
        </div>
      )}

      {currentLanguage !== 'en' && (
        <button
          type="button"
          onClick={() => setLanguage('en')}
          className="mt-3 w-full py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 text-xs font-medium hover:text-slate-200 hover:border-slate-600 transition-all"
        >
          Switch back to English
        </button>
      )}
    </div>
  );
};

export type { SupportedLanguageCode };
