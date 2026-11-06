import { NextResponse } from 'next/server';
import { cruxMEngine, type AuditResult, type KeywordSample } from '@/lib/cruxm-tools';
import { UnsafeUrlError, parseAuditUrl } from '@/lib/security/url-guard';
import { db } from '@/lib/db';
import { projects, pages, issues, keywords, aiInsights } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const MAX_BODY_BYTES = 4096;

function errorResponse(status: number, error: string) {
  return NextResponse.json({ error }, { status });
}

/** Replaces this domain's audit data in one transaction, so a failure cannot leave it half-written. */
function persistAudit(result: AuditResult) {
  return db.transaction((tx) => {
    const existing = tx.select().from(projects).where(eq(projects.domain, result.domain)).get();
    const projectValues = {
      score: result.score,
      dr: result.dr,
      ur: result.ur,
      backlinks: result.backlinks,
      referringDomains: result.referringDomains,
      organicTraffic: result.organicTraffic,
      trafficValue: result.trafficValue,
      crawledAt: new Date(),
      status: 'active',
    };

    const project = existing
      ? tx.update(projects).set(projectValues).where(eq(projects.id, existing.id)).returning().get()
      : tx.insert(projects).values({ domain: result.domain, ...projectValues }).returning().get();

    // Child rows go first: issues reference pages, so they must be removed before pages.
    tx.delete(issues).where(eq(issues.projectId, project.id)).run();
    tx.delete(keywords).where(eq(keywords.projectId, project.id)).run();
    tx.delete(aiInsights).where(eq(aiInsights.projectId, project.id)).run();
    tx.delete(pages).where(eq(pages.projectId, project.id)).run();

    const wordCount = result.keywords.extraction.reduce((acc, k) => acc + (k.count ?? 0), 0);
    const page = tx.insert(pages).values({
      projectId: project.id,
      url: result.url,
      title: result.meta.title,
      description: result.meta.desc ?? '',
      h1: result.content.h1Count ? 'H1 Detected' : 'No H1',
      wordCount,
      loadTime: result.performance.ttfb,
      statusCode: 200,
    }).returning().get();

    if (result.issues.length > 0) {
      tx.insert(issues).values(
        result.issues.slice(0, 50).map((i) => ({
          projectId: project.id,
          pageId: page.id,
          type: i.type,
          category: i.category.toLowerCase(),
          message: i.message,
          fix: i.fix,
          severity: i.type === 'error' ? 'high' : 'medium',
        }))
      ).run();
    }

    // Unknown keyword metrics are stored as NULL. They are never invented.
    if (result.keywords.extraction.length > 0) {
      tx.insert(keywords).values(
        result.keywords.extraction.map((k: KeywordSample) => ({
          projectId: project.id,
          keyword: k.word,
          volume: k.volume ?? null,
          difficulty: k.difficulty ?? null,
          position: k.position ?? null,
          url: result.url,
        }))
      ).run();
    }

    tx.insert(aiInsights).values({
      projectId: project.id,
      insight: result.ai.insight,
      actionable: result.ai.actionable,
      priority: result.ai.priority,
      impact: result.ai.impact,
    }).run();

    return project;
  });
}

export async function POST(req: Request) {
  const declared = Number(req.headers.get('content-length') ?? '0');
  if (declared > MAX_BODY_BYTES) return errorResponse(413, 'Request body is too large.');

  let body: unknown;
  try {
    const text = await req.text();
    if (text.length > MAX_BODY_BYTES) return errorResponse(413, 'Request body is too large.');
    body = JSON.parse(text);
  } catch {
    return errorResponse(400, 'Request body must be valid JSON.');
  }

  const rawUrl = typeof body === 'object' && body !== null ? (body as { url?: unknown }).url : undefined;
  const check = parseAuditUrl(rawUrl);
  if (!check.ok) return errorResponse(400, check.reason);

  try {
    const result = await cruxMEngine.runFullSuite(check.url.toString());
    persistAudit(result);
    return NextResponse.json(result);
  } catch (e: unknown) {
    if (e instanceof UnsafeUrlError) return errorResponse(400, e.message);
    console.error('Audit Engine Failure:', e);
    return errorResponse(500, 'The audit could not be completed. Please try again.');
  }
}
