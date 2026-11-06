import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('node:dns/promises', () => ({
  lookup: vi.fn(async (host: string) => {
    if (host === 'public.example' || host === 'ahrefs.com') return [{ address: '93.184.216.34', family: 4 }];
    throw Object.assign(new Error(`ENOTFOUND ${host}`), { code: 'ENOTFOUND' });
  }),
}));

import { CRUXMProductionEngine } from '@/lib/cruxm-tools';
import { UnsafeUrlError } from '@/lib/security/url-guard';

const SAMPLE_HTML = `<!doctype html><html><head>
  <title>Sample Page</title>
  <meta name="description" content="A sample page for tests">
  <meta name="viewport" content="width=device-width">
  <link rel="canonical" href="https://public.example/">
  <meta property="og:title" content="Sample">
</head><body><h1>Hello</h1><p>Some content about widgets and gadgets for testing.</p>
<a href="/about">About</a><a href="https://other.test/">Other</a></body></html>`;

describe('CRUXMProductionEngine', () => {
  const engine = new CRUXMProductionEngine();

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(SAMPLE_HTML, { status: 200, headers: { 'content-type': 'text/html' } })));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('refuses a private target before any request is made', async () => {
    await expect(engine.runFullSuite('http://127.0.0.1/admin')).rejects.toBeInstanceOf(UnsafeUrlError);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('reports null for authority metrics it cannot measure instead of random numbers', async () => {
    const result = await engine.runFullSuite('public.example');
    expect(result.dr).toBeNull();
    expect(result.ur).toBeNull();
    expect(result.backlinks).toBeNull();
    expect(result.referringDomains).toBeNull();
    expect(result.organicTraffic).toBeNull();
    expect(result.trafficValue).toBeNull();
  });

  it('is deterministic for identical pages (no random data)', async () => {
    const a = await engine.runFullSuite('public.example');
    const b = await engine.runFullSuite('public.example');
    // timestamp and measured response time differ between runs; everything else must match exactly
    const normalize = (r: typeof a) => ({ ...r, timestamp: '', performance: { ...r.performance, ttfb: 0 } });
    expect(normalize(a)).toEqual(normalize(b));
  });

  it('stores keyword metrics as null, never invented', async () => {
    const result = await engine.runFullSuite('public.example');
    expect(result.keywords.extraction.length).toBeGreaterThan(0);
    for (const k of result.keywords.extraction) {
      expect(k.volume).toBeNull();
      expect(k.difficulty).toBeNull();
      expect(k.position).toBeNull();
    }
  });

  it('extracts keywords from visible text only, not from script or style content', async () => {
    const html = `<html><head><title>T</title></head><body>
      <p>widgets widgets widgets</p>
      <script>function sanitize(){ return charCodeAt(rangeerror) }</script>
      <style>.container { display: block }</style>
      <noscript>enablejavascript</noscript>
    </body></html>`;
    vi.stubGlobal('fetch', vi.fn(async () => new Response(html, { status: 200 })));
    const result = await engine.runFullSuite('public.example');
    const words = result.keywords.extraction.map((k) => k.word);
    expect(words).toContain('widgets');
    for (const codeWord of ['function', 'sanitize', 'charcodeat', 'rangeerror', 'container', 'display', 'enablejavascript']) {
      expect(words).not.toContain(codeWord);
    }
  });

  it('still counts JSON-LD after keyword extraction strips scripts from its copy', async () => {
    const html = `<html><head><title>T</title><script type="application/ld+json">{"@type":"Thing"}</script></head>
      <body><p>content words here</p><script type="application/ld+json">{"@type":"Other"}</script></body></html>`;
    vi.stubGlobal('fetch', vi.fn(async () => new Response(html, { status: 200 })));
    const result = await engine.runFullSuite('public.example');
    expect(result.semantic.schemaCount).toBe(2);
  });

  it('scores the page from its real issues and counts links by hostname', async () => {
    const result = await engine.runFullSuite('public.example');
    expect(result.meta.title).toBe('Sample Page');
    expect(result.links.internal).toBe(1); // /about
    expect(result.links.external).toBe(1); // other.test
    expect(result.score).toBeGreaterThanOrEqual(10);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it('returns a zero-score result, not an exception, when the host cannot be reached', async () => {
    const result = await engine.runFullSuite('nowhere-at-all.example');
    expect(result.score).toBe(0);
    expect(result.issues[0].category).toBe('NETWORK');
  });

  it('keeps the sample authority figures for a known domain only', async () => {
    const result = await engine.runFullSuite('ahrefs.com');
    expect(result.dr).toBe(92);
    const unknown = await engine.runFullSuite('public.example');
    expect(unknown.dr).toBeNull();
  });
});
