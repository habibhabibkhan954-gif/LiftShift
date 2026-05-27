export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'ru', label: 'Russian', nativeLabel: 'Русский' },
  { code: 'de', label: 'German', nativeLabel: 'Deutsch' },
  { code: 'es', label: 'Spanish', nativeLabel: 'Español' },
  { code: 'pt', label: 'Portuguese', nativeLabel: 'Português' },
  { code: 'fr', label: 'French', nativeLabel: 'Français' },
  { code: 'it', label: 'Italian', nativeLabel: 'Italiano' },
  { code: 'ja', label: 'Japanese', nativeLabel: '日本語' },
  { code: 'ko', label: 'Korean', nativeLabel: '한국어' },
  { code: 'zh', label: 'Chinese', nativeLabel: '中文' },
  { code: 'ar', label: 'Arabic', nativeLabel: 'العربية' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { code: 'nl', label: 'Dutch', nativeLabel: 'Nederlands' },
  { code: 'pl', label: 'Polish', nativeLabel: 'Polski' },
  { code: 'tr', label: 'Turkish', nativeLabel: 'Türkçe' },
  { code: 'uk', label: 'Ukrainian', nativeLabel: 'Українська' },
  { code: 'sv', label: 'Swedish', nativeLabel: 'Svenska' },
  { code: 'nb', label: 'Norwegian', nativeLabel: 'Norsk' },
] as const;

export type SupportedLanguageCode = (typeof SUPPORTED_LANGUAGES)[number]['code'];

const SUPPORTED_CODES = new Set<string>(SUPPORTED_LANGUAGES.map((l) => l.code));

export function isSupportedLanguage(code: string): code is SupportedLanguageCode {
  return SUPPORTED_CODES.has(code);
}

export function detectBrowserLanguage(): SupportedLanguageCode {
  if (typeof navigator === 'undefined') return 'en';

  const raw = navigator.languages?.[0] || navigator.language || 'en';
  const fullCode = raw.toLowerCase().trim();

  if (SUPPORTED_CODES.has(fullCode)) return fullCode as SupportedLanguageCode;

  const primary = fullCode.split('-')[0]!;
  if (SUPPORTED_CODES.has(primary)) return primary as SupportedLanguageCode;

  return 'en';
}

const BROWSER_LANGUAGE_MAP: Record<string, SupportedLanguageCode> = {
  en: 'en', 'en-us': 'en', 'en-gb': 'en',
  ru: 'ru', 'ru-ru': 'ru',
  de: 'de', 'de-de': 'de', 'de-at': 'de', 'de-ch': 'de',
  es: 'es', 'es-es': 'es', 'es-mx': 'es', 'es-ar': 'es',
  pt: 'pt', 'pt-br': 'pt', 'pt-pt': 'pt',
  fr: 'fr', 'fr-fr': 'fr', 'fr-ca': 'fr',
  it: 'it', 'it-it': 'it',
  ja: 'ja', 'ja-jp': 'ja',
  ko: 'ko', 'ko-kr': 'ko',
  zh: 'zh', 'zh-cn': 'zh', 'zh-tw': 'zh',
  ar: 'ar',
  hi: 'hi', 'hi-in': 'hi',
  nl: 'nl', 'nl-nl': 'nl', 'nl-be': 'nl',
  pl: 'pl', 'pl-pl': 'pl',
  tr: 'tr', 'tr-tr': 'tr',
  uk: 'uk', 'uk-ua': 'uk',
  sv: 'sv', 'sv-se': 'sv',
  nb: 'nb', 'nb-no': 'nb',
};

export function detectBrowserLanguageFast(): SupportedLanguageCode {
  if (typeof navigator === 'undefined') return 'en';
  const raw = (navigator.language || 'en').toLowerCase().trim();
  return BROWSER_LANGUAGE_MAP[raw] ?? detectBrowserLanguage();
}
