import * as cheerio from 'cheerio';
import type { CheerioAPI } from 'cheerio';
import { parseAuditUrl, UnsafeUrlError } from './security/url-guard';
import { fetchPublicPage } from './security/safe-fetch';

export interface Issue {
  message: string;
  fix: string;
  type: 'error' | 'warning';
  category: string;
}

export interface KeywordSample {
  word: string;
  count?: number;
  volume?: number | null;
  difficulty?: number | null;
  position?: number | null;
}

export interface AuditResult {
  url: string;
  domain: string;
  timestamp: string;
  score: number;
  meta: { title: string; desc: string | undefined; issues: Issue[] };
  security: { hsts: boolean; xframe: boolean; issues: Issue[] };
  performance: { ttfb: number; size: string; issues: Issue[] };
  semantic: { schemaCount: number; issues: Issue[] };
  a11y: { imgMissingAlt: number; issues: Issue[] };
  links: { internal: number; external: number; issues: Issue[] };
  keywords: { extraction: KeywordSample[]; issues: Issue[] };
  social: { ogTitle: string | undefined; issues: Issue[] };
  technical: { canonical: string | undefined; robots: boolean; issues: Issue[] };
  mobile: { viewport: string | undefined; issues: Issue[] };
  content: { h1Count: number; issues: Issue[] };
  issues: Issue[];
  ai: { insight: string; actionable: string; priority: string; impact: string };
  // Authority metrics are null when we have no real source for them.
  dr: number | null;
  ur: number | null;
  backlinks: number | null;
  referringDomains: number | null;
  organicTraffic: string | null;
  trafficValue: string | null;
}

interface IntelEntry {
  dr: number;
  ur: number;
  backlinks: number;
  referringDomains: number;
  organicTraffic: string;
  trafficValue: string;
  keywords: KeywordSample[];
}

// Hand-entered sample figures for a few well-known domains. These are NOT
// measured values; they are only used when the audited domain is in this list.
const TOP_DOMAINS_INTEL: Record<string, IntelEntry> = {
  'google.com': { dr: 98, ur: 91, backlinks: 13000000000, referringDomains: 12000000, organicTraffic: '28.4B', trafficValue: '$1.2B', keywords: [
    { word: 'google', volume: 450000000, difficulty: 99, position: 1 },
    { word: 'gmail', volume: 150000000, difficulty: 95, position: 1 },
    { word: 'google translate', volume: 80000000, difficulty: 88, position: 1 },
    { word: 'calendar', volume: 45000000, difficulty: 82, position: 1 },
    { word: 'maps', volume: 65000000, difficulty: 85, position: 1 },
    { word: 'drive', volume: 30000000, difficulty: 78, position: 1 },
    { word: 'classroom', volume: 20000000, difficulty: 70, position: 1 },
  ]},
  'ahrefs.com': { dr: 92, ur: 84, backlinks: 240000000, referringDomains: 65000, organicTraffic: '1.2M', trafficValue: '$5.4M', keywords: [
    { word: 'keyword explorer', volume: 45000, difficulty: 72, position: 1 },
    { word: 'backlink checker', volume: 88000, difficulty: 85, position: 1 },
    { word: 'seo analyzer', volume: 12000, difficulty: 65, position: 1 },
    { word: 'ahrefs', volume: 500000, difficulty: 90, position: 1 },
  ]},
  'semrush.com': { dr: 91, ur: 82, backlinks: 180000000, referringDomains: 58000, organicTraffic: '2.1M', trafficValue: '$8.2M', keywords: [
    { word: 'keyword tool', volume: 150000, difficulty: 92, position: 2 },
    { word: 'seo audit', volume: 35000, difficulty: 78, position: 3 },
  ]}
};

const CRAWL_HEADERS: Record<string, string> = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 CruxM360/1.0',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
};

export class CRUXMProductionEngine {
  /** Throws UnsafeUrlError when the target is not allowed by the URL policy. */
  async runFullSuite(input: string): Promise<AuditResult> {
    const check = parseAuditUrl(input);
    if (!check.ok) throw new UnsafeUrlError(check.reason);
    const target = check.url;
    const cleanUrl = target.toString();
    const domain = target.hostname.replace(/^www\./, '');
    const startTime = Date.now();

    // Only exact own-property matches count, so "constructor" or "__proto__" cannot hit Object.prototype.
    const powerData = Object.prototype.hasOwnProperty.call(TOP_DOMAINS_INTEL, domain)
      ? TOP_DOMAINS_INTEL[domain]
      : null;

    let html = '';
    let responseTime = 0;
    let responseHeaders = new Headers();

    try {
      const page = await fetchPublicPage(target, CRAWL_HEADERS);
      html = page.html;
      responseTime = Date.now() - startTime;
      responseHeaders = page.headers;
    } catch (e: unknown) {
      if (e instanceof UnsafeUrlError) throw e;
      const message = e instanceof Error ? e.message : 'Unknown network error';
      console.warn('Network Error Stage 1:', message);
      if (!powerData) return this.generateEmptyResult(cleanUrl, domain, message);
      html = '<html><body></body></html>';
    }

    const $ = cheerio.load(html || '<html><body></body></html>');

    const meta = this.auditMetadata($);
    const security = this.auditSecurity(responseHeaders);
    const performance = this.auditPerformance(responseTime, html.length);
    const semantic = this.auditSemanticGraph($);
    const a11y = this.auditAccessibility($);
    const links = this.auditLinks($, cleanUrl, domain);
    const keywords = powerData
      ? { extraction: powerData.keywords, issues: [] as Issue[] }
      : this.auditKeywords($);
    const social = this.auditSocial($);
    const technical = this.auditTechnical($, responseHeaders);
    const mobile = this.auditMobile($);
    const content = this.auditContent($);

    const allIssues: Issue[] = [
      ...meta.issues, ...security.issues, ...performance.issues,
      ...semantic.issues, ...a11y.issues, ...links.issues,
      ...keywords.issues, ...social.issues, ...technical.issues,
      ...mobile.issues, ...content.issues,
    ];

    const errorCount = allIssues.filter((i) => i.type === 'error').length;
    const warningCount = allIssues.filter((i) => i.type === 'warning').length;
    const score = Math.max(10, 100 - errorCount * 5 - warningCount * 2);

    const ai = {
      insight: `CruxM Neural Engine processed ${allIssues.length} signals for ${domain}. ${powerData ? 'Sample authority data is shown for this domain.' : 'Deep analysis complete.'}`,
      actionable: `Fixing ${errorCount} critical technical gaps would accelerate ${domain}'s organic velocity.`,
      priority: score < 70 ? 'high' : 'medium',
      impact: powerData ? 'Sample authority data available.' : 'Authority metrics are not measured by this engine.',
    };

    return {
      url: cleanUrl,
      domain,
      timestamp: new Date().toISOString(),
      score,
      meta, security, performance, semantic, a11y, links, keywords, social, technical, mobile, content,
      issues: allIssues,
      ai,
      dr: powerData?.dr ?? null,
      ur: powerData?.ur ?? null,
      backlinks: powerData?.backlinks ?? null,
      referringDomains: powerData?.referringDomains ?? null,
      organicTraffic: powerData?.organicTraffic ?? null,
      trafficValue: powerData?.trafficValue ?? null,
    };
  }

  private generateEmptyResult(url: string, domain: string, error: string): AuditResult {
    const issues: Issue[] = [{
      message: `Network Connection Timeout: ${error}`,
      fix: 'Ensure the URL is reachable and does not have strict bot blocking.',
      type: 'error',
      category: 'NETWORK',
    }];
    return {
      url, domain, timestamp: new Date().toISOString(), score: 0,
      meta: { title: '', desc: undefined, issues: [] },
      security: { hsts: false, xframe: false, issues: [] },
      performance: { ttfb: 0, size: '0KB', issues: [] },
      semantic: { schemaCount: 0, issues: [] },
      a11y: { imgMissingAlt: 0, issues: [] },
      links: { internal: 0, external: 0, issues: [] },
      keywords: { extraction: [], issues: [] },
      social: { ogTitle: undefined, issues: [] },
      technical: { canonical: undefined, robots: false, issues: [] },
      mobile: { viewport: undefined, issues: [] },
      content: { h1Count: 0, issues: [] },
      issues,
      ai: { insight: 'Discovery Delayed', actionable: 'Fix connection issues to unlock neural insights.', priority: 'high', impact: 'None' },
      dr: null, ur: null, backlinks: null, referringDomains: null, organicTraffic: null, trafficValue: null,
    };
  }

  private auditMetadata($: CheerioAPI) {
    const issues: Issue[] = [];
    const title = $('title').first().text().trim();
    const desc = $('meta[name="description"], meta[property="og:description"]').first().attr('content');
    if (!title) issues.push({ message: 'Missing Title Tag', fix: 'Add a <title> element.', type: 'error', category: 'METADATA' });
    if (!desc) issues.push({ message: 'Missing Description', fix: 'Add meta description.', type: 'error', category: 'METADATA' });
    return { title, desc, issues };
  }

  private auditSecurity(headers: Headers) {
    const issues: Issue[] = [];
    const hsts = !!headers.get('strict-transport-security');
    const xframe = !!headers.get('x-frame-options');
    if (!hsts) issues.push({ message: 'Missing Security Shield: HSTS', fix: 'Enable HSTS.', type: 'error', category: 'SECURITY' });
    return { hsts, xframe, issues };
  }

  private auditPerformance(duration: number, size: number) {
    const issues: Issue[] = [];
    if (duration > 1500) issues.push({ message: 'High Latency TTFB', fix: 'Optimize edge cache.', type: 'error', category: 'PERFORMANCE' });
    return { ttfb: duration, size: `${(size / 1024).toFixed(1)}KB`, issues };
  }

  private auditSemanticGraph($: CheerioAPI) {
    const issues: Issue[] = [];
    let schemaCount = 0;
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        JSON.parse($(el).html() || '{}');
        schemaCount++;
      } catch {
        // invalid JSON-LD is not counted
      }
    });
    if (schemaCount === 0) issues.push({ message: 'No Structured Data', fix: 'Add JSON-LD.', type: 'warning', category: 'SEMANTIC' });
    return { schemaCount, issues };
  }

  private auditAccessibility($: CheerioAPI) {
    const issues: Issue[] = [];
    const imgMissingAlt = $('img:not([alt])').length;
    if (imgMissingAlt > 0) issues.push({ message: 'A11y: Missing Alt Tags', fix: 'Apply Alt attributes.', type: 'warning', category: 'ACCESSIBILITY' });
    return { imgMissingAlt, issues };
  }

  private auditLinks($: CheerioAPI, pageUrl: string, domain: string) {
    let internal = 0;
    let external = 0;
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href');
      if (!href) return;
      let host: string;
      try {
        host = new URL(href, pageUrl).hostname.replace(/^www\./, '');
      } catch {
        return; // unparseable href, neither internal nor external
      }
      if (host === domain || host.endsWith('.' + domain)) internal++;
      else external++;
    });
    return { internal, external, issues: [] as Issue[] };
  }

  private auditKeywords($: CheerioAPI) {
    // Work on a copy so other auditors still see the original document.
    // Script, style and similar tags hold code, not visible content, so they must not count as keywords.
    const body = $('body').clone();
    body.find('script, style, noscript, template, svg').remove();
    const text = body.text().replace(/\s+/g, ' ');
    const words = text.toLowerCase().match(/\b\w{5,}\b/g) || [];
    const counts = new Map<string, number>();
    for (const w of words) counts.set(w, (counts.get(w) ?? 0) + 1);
    const extraction: KeywordSample[] = [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([word, count]) => ({ word, count, volume: null, difficulty: null, position: null }));
    return { extraction, issues: [] as Issue[] };
  }

  private auditSocial($: CheerioAPI) {
    const issues: Issue[] = [];
    const ogTitle = $('meta[property="og:title"]').attr('content');
    if (!ogTitle) issues.push({ message: 'Open Graph Incomplete', fix: 'Add OG metatags.', type: 'warning', category: 'SOCIAL' });
    return { ogTitle, issues };
  }

  private auditTechnical($: CheerioAPI, headers: Headers) {
    const issues: Issue[] = [];
    const canonical = $('link[rel="canonical"]').attr('href');
    if (!canonical) issues.push({ message: 'No Canonical Link', fix: 'Define primary URL.', type: 'error', category: 'TECHNICAL' });
    return { canonical, robots: !!headers.get('x-robots-tag'), issues };
  }

  private auditMobile($: CheerioAPI) {
    const issues: Issue[] = [];
    const viewport = $('meta[name="viewport"]').attr('content');
    if (!viewport) issues.push({ message: 'Mobile: No Viewport Tag', fix: 'Add viewport meta.', type: 'error', category: 'MOBILE' });
    return { viewport, issues };
  }

  private auditContent($: CheerioAPI) {
    const issues: Issue[] = [];
    const h1Count = $('h1').length;
    if (h1Count !== 1) issues.push({ message: h1Count === 0 ? 'Missing H1' : 'Multiple H1s', fix: 'Ensure exactly one H1.', type: 'warning', category: 'CONTENT' });
    return { h1Count, issues };
  }
}

export const cruxMEngine = new CRUXMProductionEngine();
