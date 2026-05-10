import React, { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { FontChoice, getFontChoice, saveFontChoice } from '../../utils/storage/localStorage';

interface FontContextValue {
  font: FontChoice;
  setFont: (font: FontChoice) => void;
}

const FontContext = createContext<FontContextValue | null>(null);

export const FontProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [font, setFontState] = useState<FontChoice>(() => {
    if (typeof window === 'undefined') return 'nunito';
    return getFontChoice();
  });

  const setFont = useCallback((next: FontChoice) => {
    setFontState(next);
  }, []);

  useLayoutEffect(() => {
    document.documentElement.dataset.font = font;
  }, [font]);

  useEffect(() => {
    saveFontChoice(font);
  }, [font]);

  const value = useMemo<FontContextValue>(() => ({ font, setFont }), [font]);

  return <FontContext.Provider value={value}>{children}</FontContext.Provider>;
};

export const useFont = (): FontContextValue => {
  const ctx = useContext(FontContext);
  if (!ctx) throw new Error('useFont must be used within FontProvider');
  return ctx;
};
