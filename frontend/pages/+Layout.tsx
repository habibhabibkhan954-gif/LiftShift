export { Layout };

import React from 'react';
import type { PageContext } from 'vike/types';
import { ThemeProvider } from '../components/theme/ThemeProvider';
import { FontProvider } from '../components/theme/FontProvider';
import { TranslationProvider } from '../components/translation/TranslationProvider';
import '../tailwind.css';

type LayoutProps = {
  children: React.ReactNode;
  pageContext: PageContext;
};

function Layout({ children }: LayoutProps) {
  return (
    <TranslationProvider>
      <ThemeProvider>
        <FontProvider>{children}</FontProvider>
      </ThemeProvider>
    </TranslationProvider>
  );
}
