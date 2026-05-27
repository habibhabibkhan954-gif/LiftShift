import type { SupportedLanguageCode } from './languageDetection';
import type { TranslationEngine } from './translationEngines';

const TRANSLATED_MARKER = 'data-ls-translated';
const SKIP_ATTR = 'translate';

interface DOMTranslatorOptions {
  engine: TranslationEngine;
  targetLang: SupportedLanguageCode;
  rootSelector?: string;
  debounceMs?: number;
}

const SKIP_TAGS = new Set([
  'SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE',
  'CODE', 'PRE', 'KBD', 'VAR', 'SAMP',
  'TEXTAREA', 'INPUT', 'IFRAME', 'CANVAS',
  'VIDEO', 'AUDIO', 'OBJECT', 'MATH',
]);

const SVG_TRANSLATABLE = new Set(['text', 'tspan', 'textpath']);

const NUMBER_ONLY_RE = /^[\d\s.,+\-/()%×x^=<>≤≥:]+$/;
const WHITESPACE_ONLY_RE = /^[\s\u200B\u00A0]*$/;

function isSkippableText(text: string): boolean {
  return text.length === 0 || WHITESPACE_ONLY_RE.test(text) || NUMBER_ONLY_RE.test(text.trim());
}

function isElementHidden(el: Element): boolean {
  if (!el.isConnected) return true;
  const rect = el.getBoundingClientRect();
  return rect.width === 0 && rect.height === 0;
}

function createTextWalker(root: ParentNode): TreeWalker {
  return document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node: Text): number {
      const parent = node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      if (isElementHidden(parent)) return NodeFilter.FILTER_REJECT;

      const tag = parent.tagName;
      if (SKIP_TAGS.has(tag)) return NodeFilter.FILTER_REJECT;
      if (parent.closest('[translate="no"]')) return NodeFilter.FILTER_REJECT;
      if (parent.hasAttribute(TRANSLATED_MARKER)) return NodeFilter.FILTER_REJECT;

      if (parent.namespaceURI === 'http://www.w3.org/2000/svg') {
        const localName = tag.toLowerCase();
        if (!SVG_TRANSLATABLE.has(localName)) return NodeFilter.FILTER_REJECT;
        if (!parent.closest('.recharts-text, .recharts-label, .recharts-legend-item-text, .recharts-cartesian-axis-tick-value')) {
          return NodeFilter.FILTER_REJECT;
        }
      }

      const text = node.nodeValue?.trim() ?? '';
      if (isSkippableText(text)) return NodeFilter.FILTER_REJECT;

      return NodeFilter.FILTER_ACCEPT;
    },
  });
}

function collectTextNodes(root: ParentNode): Text[] {
  const walker = createTextWalker(root);
  const nodes: Text[] = [];
  let node: Text | null;
  while ((node = walker.nextNode() as Text | null)) {
    nodes.push(node);
  }
  return nodes;
}

function isInViewport(el: Element, margin = 300): boolean {
  const rect = el.getBoundingClientRect();
  return (
    rect.top < window.innerHeight + margin &&
    rect.bottom > -margin &&
    rect.left < window.innerWidth + margin &&
    rect.right > -margin
  );
}

function getTranslationKey(text: string, targetLang: SupportedLanguageCode): string {
  return `en:${targetLang}:${text}`;
}

export class DOMTranslator {
  private engine: TranslationEngine;
  private targetLang: SupportedLanguageCode;
  private rootSelector: string;
  private debounceMs: number;

  private mo: MutationObserver | null = null;
  private io: IntersectionObserver | null = null;

  private translatedNodes = new WeakSet<Text>();
  private translatingNodes = new WeakSet<Text>();
  private originalStore = new WeakMap<Text, string>();

  private translationCache = new Map<string, string>();
  private readonly MAX_CACHE = 5000;

  private pendingNodes = new Set<Text>();
  private pendingTimeout: ReturnType<typeof setTimeout> | null = null;
  private ioPending = new Set<Element>();
  private ioTimeout: ReturnType<typeof setTimeout> | null = null;

  private isDestroyed = false;

  constructor(options: DOMTranslatorOptions) {
    this.engine = options.engine;
    this.targetLang = options.targetLang;
    this.rootSelector = options.rootSelector ?? '#root';
    this.debounceMs = options.debounceMs ?? 250;

    this.io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.io!.unobserve(entry.target);
            this.ioPending.add(entry.target);
          }
        }
        if (this.ioPending.size > 0) this.scheduleIOFlush();
      },
      { rootMargin: '300px 0px', threshold: 0 },
    );
  }

  setTargetLanguage(lang: SupportedLanguageCode): void {
    this.targetLang = lang;
    this.translationCache.clear();
    this.clearAllTranslations();

    if (lang !== 'en' && this.engine.available) {
      this.startLazyTranslation();
    }
  }

  setEngine(engine: TranslationEngine): void {
    this.engine.destroy();
    this.engine = engine;
    this.translationCache.clear();
    this.clearAllTranslations();

    if (this.targetLang !== 'en' && engine.available) {
      this.startLazyTranslation();
    }
  }

  start(): void {
    if (this.isDestroyed) return;
    if (this.targetLang === 'en' || !this.engine.available) return;

    this.startLazyTranslation();

    const root = document.querySelector(this.rootSelector);
    if (!root) return;

    this.mo = new MutationObserver(this.onMutations);
    this.mo.observe(root, {
      childList: true,
      subtree: true,
      characterData: true,
      characterDataOldValue: true,
    });
  }

  private startLazyTranslation(): void {
    this.io?.disconnect();

    const root = document.querySelector(this.rootSelector);
    if (!root) return;

    const containers = root.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, li, td, th, label, button, a, figcaption, legend');
    for (const el of containers) {
      if (el instanceof HTMLElement && el.textContent && !isSkippableText(el.textContent)) {
        if (isInViewport(el)) {
          this.ioPending.add(el);
        } else {
          this.io!.observe(el);
        }
      }
    }

    if (this.ioPending.size > 0) this.scheduleIOFlush();
  }

  destroy(): void {
    this.isDestroyed = true;
    this.mo?.disconnect();
    this.mo = null;
    this.io?.disconnect();
    this.io = null;
    if (this.pendingTimeout) clearTimeout(this.pendingTimeout);
    if (this.ioTimeout) clearTimeout(this.ioTimeout);
    this.translatedNodes = new WeakSet();
    this.originalStore = new WeakMap();
    this.translationCache.clear();
    this.engine.destroy();
  }

  private onMutations = (mutations: MutationRecord[]): void => {
    if (this.isDestroyed || this.targetLang === 'en' || !this.engine.available) return;

    for (const m of mutations) {
      if (m.type === 'characterData') {
        const node = m.target as Text;
        if (this.translatingNodes.has(node)) continue;
        if (this.translatedNodes.has(node)) continue;

        const parent = node.parentElement;
        if (!parent || parent.closest('[translate="no"]')) continue;

        const text = node.nodeValue?.trim() ?? '';
        if (isSkippableText(text)) continue;

        this.pendingNodes.add(node);
      }

      if (m.type === 'childList') {
        for (const added of m.addedNodes) {
          if (added instanceof Text) {
            if (!this.translatingNodes.has(added) && !this.translatedNodes.has(added)) {
              this.pendingNodes.add(added);
            }
          } else if (added instanceof Element) {
            if (isInViewport(added)) {
              const found = collectTextNodes(added);
              for (const tn of found) {
                this.pendingNodes.add(tn);
              }
            } else {
              this.io!.observe(added);
            }
          }
        }
      }
    }

    if (this.pendingNodes.size > 0) this.scheduleMutationFlush();
  };

  private scheduleMutationFlush(): void {
    if (this.pendingTimeout) clearTimeout(this.pendingTimeout);
    this.pendingTimeout = setTimeout(() => {
      this.pendingTimeout = null;
      this.processPendingNodes().catch(() => {});
    }, this.debounceMs);
  }

  private scheduleIOFlush(): void {
    if (this.ioTimeout) clearTimeout(this.ioTimeout);
    this.ioTimeout = setTimeout(() => {
      this.ioTimeout = null;
      this.processIOPending().catch(() => {});
    }, 100);
  }

  private async processIOPending(): Promise<void> {
    if (this.isDestroyed) return;

    const elements = Array.from(this.ioPending);
    this.ioPending.clear();

    const allNodes: Text[] = [];
    for (const el of elements) {
      if (!el.isConnected) continue;
      const found = collectTextNodes(el);
      allNodes.push(...found);
    }

    if (allNodes.length > 0) {
      await this.translateNodes(allNodes);
    }
  }

  private async processPendingNodes(): Promise<void> {
    if (this.isDestroyed) return;

    const nodes = Array.from(this.pendingNodes);
    this.pendingNodes.clear();

    const live = nodes.filter((n) => {
      if (!n.isConnected) return false;
      if (this.translatedNodes.has(n)) return false;
      if (this.translatingNodes.has(n)) return false;
      const parent = n.parentElement;
      if (!parent || parent.closest('[translate="no"]')) return false;
      const text = n.nodeValue?.trim() ?? '';
      return !isSkippableText(text);
    });

    if (live.length === 0) return;
    await this.translateNodes(live);
  }

  private async translateNodes(nodes: Text[]): Promise<void> {
    const textToNodes = new Map<string, Text[]>();
    for (const node of nodes) {
      if (!node.isConnected) continue;
      if (this.translatedNodes.has(node)) continue;
      if (this.translatingNodes.has(node)) continue;

      const text = node.nodeValue?.trim() ?? '';
      if (isSkippableText(text)) continue;

      const existing = textToNodes.get(text);
      if (existing) {
        existing.push(node);
      } else {
        textToNodes.set(text, [node]);
      }
    }

    if (textToNodes.size === 0) return;

    const uniqueTexts = Array.from(textToNodes.keys());
    const cacheHits = new Map<string, string>();
    const toTranslate: string[] = [];

    for (const text of uniqueTexts) {
      const key = getTranslationKey(text, this.targetLang);
      const cached = this.translationCache.get(key);
      if (cached !== undefined) {
        cacheHits.set(text, cached);
      } else {
        toTranslate.push(text);
      }
    }

    if (toTranslate.length > 0) {
      try {
        const results = await this.engine.translateBatch(toTranslate, this.targetLang);
        for (let i = 0; i < toTranslate.length; i++) {
          const original = toTranslate[i]!;
          const translated = results[i]?.translatedText ?? original;

          cacheHits.set(original, translated);

          const key = getTranslationKey(original, this.targetLang);
          this.translationCache.set(key, translated);

          if (this.translationCache.size > this.MAX_CACHE) {
            const firstKey = this.translationCache.keys().next().value;
            if (firstKey) this.translationCache.delete(firstKey);
          }
        }
      } catch {
        for (const text of toTranslate) {
          cacheHits.set(text, text);
        }
      }
    }

    for (const [original, translation] of cacheHits) {
      if (translation === original) continue;

      const nodeList = textToNodes.get(original);
      if (!nodeList) continue;

      for (const node of nodeList) {
        if (!node.isConnected) continue;
        if (this.translatedNodes.has(node)) continue;

        this.translatingNodes.add(node);

        const current = node.nodeValue?.trim() ?? '';
        if (current !== original) {
          this.translatingNodes.delete(node);
          continue;
        }

        this.originalStore.set(node, original);
        node.nodeValue = translation;
        this.translatedNodes.add(node);

        const parent = node.parentElement;
        if (parent && !parent.hasAttribute(TRANSLATED_MARKER)) {
          parent.setAttribute(TRANSLATED_MARKER, 'true');
        }

        this.translatingNodes.delete(node);
      }
    }
  }

  private clearAllTranslations(): void {
    const root = document.querySelector(this.rootSelector);
    if (!root) return;

    const marked = root.querySelectorAll(`[${TRANSLATED_MARKER}]`);
    for (const el of marked) {
      el.removeAttribute(TRANSLATED_MARKER);
      for (let i = 0; i < el.childNodes.length; i++) {
        const child = el.childNodes[i];
        if (child instanceof Text && this.originalStore.has(child)) {
          child.nodeValue = this.originalStore.get(child) ?? child.nodeValue;
          this.originalStore.delete(child);
          this.translatedNodes.delete(child);
        }
      }
    }

    this.translatedNodes = new WeakSet();
    this.originalStore = new WeakMap();
  }
}
