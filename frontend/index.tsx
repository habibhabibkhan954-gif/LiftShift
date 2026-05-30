import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { HashRouter } from 'react-router';
import { initGA } from './utils/integrations/ga';
import { ThemeProvider } from './components/theme/ThemeProvider';
import './tailwind.css';
import bgImage from './src/assets/images/misc/P15.avif';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

initGA();

// Preload the background image for instant display
const preloadLink = document.createElement('link');
preloadLink.rel = 'preload';
preloadLink.as = 'image';
preloadLink.href = bgImage;
document.head.appendChild(preloadLink);

const getRouterBasename = (): string => {
  const baseUrl = import.meta.env.BASE_URL;
  if (typeof baseUrl !== 'string') return '/';
  const trimmed = baseUrl.replace(/\/+$/g, '');
  return trimmed || '/';
};

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <HashRouter basename={getRouterBasename()}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </HashRouter>
  </React.StrictMode>
);
