export const FONT_OPTIONS = {
  original: {
    key: 'original',
    label: 'Original',
    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
    fontStyle: 'normal',
    letterSpacing: 'normal',
  },
  loraItalic: {
    key: 'loraItalic',
    label: 'Lora Italic (Journal)',
    fontFamily: '"Lora", serif',
    fontStyle: 'italic',
    letterSpacing: '0.02em',
  },
  nunito: {
    key: 'nunito',
    label: 'Nunito',
    fontFamily: '"Nunito", sans-serif',
    fontStyle: 'normal',
    letterSpacing: 'normal',
  },
} as const;

export type FontKey = keyof typeof FONT_OPTIONS;
