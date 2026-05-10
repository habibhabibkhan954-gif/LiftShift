export { Head };

import React from 'react';
import type { PageContext } from 'vike/types';

function Head() {
  const baseUrl = import.meta.env.BASE_URL;
  const base = typeof baseUrl === 'string' ? baseUrl : '/';
  const withBase = (path: string) => `${base}${path.replace(/^\/+/, '')}`;
  const themeInitScript = `
    (function () {
      try {
        var key = 'hevy_analytics_theme_mode';
        var stored = localStorage.getItem(key);
        var mode =
          stored === 'light' || stored === 'medium-dark' || stored === 'midnight-dark' || stored === 'pure-black'
            ? stored
            : 'pure-black';
        document.documentElement.dataset.theme = mode;
        document.documentElement.style.colorScheme = mode === 'light' ? 'light' : 'dark';
      } catch (e) {
        // ignore
      }
    })();
  `;

  return (
    <>
      <link rel="icon" href={withBase('favicon.ico')} />
      <link rel="icon" href={withBase('favicon.png')} type="image/png" sizes="48x48" />
      <link rel="shortcut icon" href={withBase('favicon.ico')} />
      <link rel="apple-touch-icon" href={withBase('UI/logo.png')} sizes="180x180" />

      <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap" rel="stylesheet" />
      <script>{`
        try {
          var font = localStorage.getItem('hevy_analytics_font_choice');
          if (!font || !['original', 'loraItalic', 'nunito'].includes(font)) font = 'nunito';
          document.documentElement.dataset.font = font;
        } catch(e) {}
      `}</script>
    </>
  );
}
