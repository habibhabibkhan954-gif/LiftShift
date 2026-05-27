import type { SupportedLanguageCode } from './languageDetection';

export interface TranslationResult {
  translatedText: string;
  detectedLanguage?: string;
}

export interface TranslationEngine {
  readonly name: string;
  readonly available: boolean;
  translate(text: string, targetLang: SupportedLanguageCode): Promise<TranslationResult>;
  translateBatch(texts: string[], targetLang: SupportedLanguageCode): Promise<TranslationResult[]>;
  destroy(): void;
}

declare global {
  const Translator: {
    availability(options: { sourceLanguage: string; targetLanguage: string }): Promise<'available' | 'unavailable' | 'downloadable'>;
    create(options: { sourceLanguage: string; targetLanguage: string; monitor?: (m: any) => void }): Promise<{
      translate(text: string): Promise<string>;
      translateStreaming(text: string): AsyncIterable<string>;
    }>;
  };
}

function splitIntoChunks(texts: string[], chunkSize: number): string[][] {
  const chunks: string[][] = [];
  for (let i = 0; i < texts.length; i += chunkSize) {
    chunks.push(texts.slice(i, i + chunkSize));
  }
  return chunks;
}

type ChromeTranslator = Awaited<ReturnType<typeof Translator.create>>;

export function createChromeTranslationEngine(): TranslationEngine | null {
  if (typeof self === 'undefined' || typeof Translator === 'undefined') return null;

  const translatorCache = new Map<string, Promise<ChromeTranslator>>();
  const availabilityCache = new Map<string, boolean>();

  async function getTranslator(targetLang: SupportedLanguageCode): Promise<ChromeTranslator> {
    const key = `en:${targetLang}`;
    if (translatorCache.has(key)) return translatorCache.get(key)!;

    if (!availabilityCache.has(key)) {
      const status = await Translator.availability({
        sourceLanguage: 'en',
        targetLanguage: targetLang,
      });
      availabilityCache.set(key, status === 'available' || status === 'downloadable');
    }

    if (!availabilityCache.get(key)) throw new Error('Language pair not available');

    const promise = Translator.create({
      sourceLanguage: 'en',
      targetLanguage: targetLang,
    }) as Promise<ChromeTranslator>;

    translatorCache.set(key, promise);
    return promise;
  }

  return {
    name: 'chrome-builtin',
    get available() {
      return typeof Translator !== 'undefined';
    },

    async translate(text: string, targetLang: SupportedLanguageCode) {
      const translator = await getTranslator(targetLang);
      const result = await translator.translate(text);
      return { translatedText: result };
    },

    async translateBatch(texts: string[], targetLang: SupportedLanguageCode) {
      const translator = await getTranslator(targetLang);
      const results: TranslationResult[] = [];

      const chunks = splitIntoChunks(texts, 100);
      for (const chunk of chunks) {
        const joined = chunk.join('\n___SEP___\n');
        const translated = await translator.translate(joined);
        const parts = translated.split('\n___SEP___\n');
        for (let i = 0; i < chunk.length; i++) {
          results.push({ translatedText: (parts[i] ?? chunk[i]!).trim() });
        }
      }

      return results;
    },

    destroy() {
      translatorCache.clear();
      availabilityCache.clear();
    },
  };
}

export function createLibreTranslateEngine(endpoint: string): TranslationEngine {
  const joined = endpoint.replace(/\/+$/, '') + '/translate';

  return {
    name: 'libretranslate',

    get available() {
      return true;
    },

    async translate(text: string, targetLang: SupportedLanguageCode) {
      const response = await fetch(joined, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: text,
          source: 'en',
          target: targetLang,
          format: 'text',
        }),
      });

      if (!response.ok) {
        throw new Error(`LibreTranslate error: ${response.status}`);
      }

      const data = (await response.json()) as {
        translatedText: string;
        detectedLanguage?: { language: string };
      };

      return {
        translatedText: data.translatedText,
        detectedLanguage: data.detectedLanguage?.language,
      };
    },

    async translateBatch(texts: string[], targetLang: SupportedLanguageCode) {
      const chunks = splitIntoChunks(texts, 10);
      const allResults: TranslationResult[] = [];

      for (const chunk of chunks) {
        const batchResults = await Promise.all(
          chunk.map((text) =>
            this.translate(text, targetLang).catch(() => ({
              translatedText: text,
            })),
          ),
        );
        allResults.push(...batchResults);
      }

      return allResults;
    },

    destroy() {},
  };
}

export function detectBestEngine(libreTranslateEndpoint?: string): TranslationEngine | null {
  const chrome = createChromeTranslationEngine();
  if (chrome) return chrome;

  const endpoint =
    libreTranslateEndpoint ??
    (typeof import.meta !== 'undefined' &&
      (import.meta as any).env?.VITE_LIBRETRANSLATE_ENDPOINT);

  if (endpoint) return createLibreTranslateEngine(endpoint as string);

  return null;
}
