import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { SupportedLanguageCode } from '../../utils/translation/languageDetection';
import { detectBrowserLanguageFast, isSupportedLanguage } from '../../utils/translation/languageDetection';
import { detectBestEngine } from '../../utils/translation/translationEngines';
import { DOMTranslator } from '../../utils/translation/domTranslator';
import type { TranslationEngine } from '../../utils/translation/translationEngines';

export interface TranslationContextValue {
  currentLanguage: SupportedLanguageCode;
  setLanguage: (lang: SupportedLanguageCode) => void;
  isTranslating: boolean;
  isAvailable: boolean;
  engineName: string | null;
}

const TranslationContext = createContext<TranslationContextValue | null>(null);

function getSavedLanguage(): SupportedLanguageCode | null {
  try {
    const saved = localStorage.getItem('hevy_analytics_language');
    if (saved && isSupportedLanguage(saved)) return saved;
  } catch {
    // localStorage unavailable
  }
  return null;
}

function saveLanguageToStorage(lang: SupportedLanguageCode): void {
  try {
    localStorage.setItem('hevy_analytics_language', lang);
  } catch {
    // localStorage unavailable
  }
}

let singletonEngine: TranslationEngine | null = null;
let singletonTranslator: DOMTranslator | null = null;
let initialized = false;

function initTranslation(libreTranslateEndpoint?: string): { engine: TranslationEngine | null; translator: DOMTranslator | null } {
  if (initialized) return { engine: singletonEngine, translator: singletonTranslator };
  initialized = true;

  const engine = detectBestEngine(libreTranslateEndpoint);
  singletonEngine = engine;

  if (!engine) return { engine: null, translator: null };

  const lang = getSavedLanguage() ?? detectBrowserLanguageFast();

  const translator = new DOMTranslator({
    engine,
    targetLang: lang,
  });

  singletonTranslator = translator;

  if (lang !== 'en') {
    translator.start();
  }

  return { engine, translator };
}

interface TranslationProviderProps {
  children: React.ReactNode;
  initialLanguage?: SupportedLanguageCode;
  libreTranslateEndpoint?: string;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({
  children,
  initialLanguage,
  libreTranslateEndpoint,
}) => {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguageCode>(() => {
    if (initialLanguage) return initialLanguage;
    return getSavedLanguage() ?? detectBrowserLanguageFast();
  });
  const [isTranslating, setIsTranslating] = useState(false);
  const [engineName] = useState<string | null>(() => {
    const { engine } = initTranslation(libreTranslateEndpoint);
    return engine?.name ?? null;
  });

  const isAvailable = singletonEngine?.available ?? false;

  const setLanguage = useCallback(async (lang: SupportedLanguageCode) => {
    setCurrentLanguage(lang);
    saveLanguageToStorage(lang);
    document.documentElement.lang = lang;

    if (!singletonTranslator) return;

    if (lang === 'en') {
      singletonTranslator.setTargetLanguage(lang);
      return;
    }

    if (!singletonEngine?.available) return;

    setIsTranslating(true);
    try {
      singletonTranslator.setTargetLanguage(lang);
    } finally {
      setTimeout(() => setIsTranslating(false), 300);
    }
  }, []);

  useEffect(() => {
    if (currentLanguage !== 'en') {
      document.documentElement.lang = currentLanguage;
    }
  }, [currentLanguage]);

  const value = useMemo<TranslationContextValue>(
    () => ({ currentLanguage, setLanguage, isTranslating, isAvailable, engineName }),
    [currentLanguage, setLanguage, isTranslating, isAvailable, engineName],
  );

  return <TranslationContext.Provider value={value}>{children}</TranslationContext.Provider>;
};

export const useTranslation = (): TranslationContextValue => {
  const ctx = useContext(TranslationContext);
  if (!ctx) throw new Error('useTranslation must be used within TranslationProvider');
  return ctx;
};
