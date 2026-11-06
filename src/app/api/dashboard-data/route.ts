import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { projects, pages, issues, keywords, aiInsights } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { isValidDomain } from '@/lib/security/domain';

export async function GET(req: Request) {
  const domain = new URL(req.url).searchParams.get('domain')?.toLowerCase() ?? null;

  if (!isValidDomain(domain)) {
    return NextResponse.json({ error: 'A valid domain is required.' }, { status: 400 });
  }

  try {
    const project = await db.select().from(projects).where(eq(projects.domain, domain)).get();
    if (!project) {
      return NextResponse.json({
        error: 'No operational data found for this domain.',
        hint: 'Please run an initial Discovery scan first.',
      }, { status: 404 });
    }

    const [allPages, allIssues, allKeywords, allAiInsights] = await Promise.all([
      db.select().from(pages).where(eq(pages.projectId, project.id)).limit(200).all(),
      db.select().from(issues).where(eq(issues.projectId, project.id)).limit(100).all(),
      db.select().from(keywords).where(eq(keywords.projectId, project.id)).limit(100).all(),
      db.select().from(aiInsights).where(eq(aiInsights.projectId, project.id)).get(),
    ]);

    return NextResponse.json({
      project,
      pages: allPages,
      issues: allIssues,
      keywords: allKeywords,
      ai: allAiInsights ?? null,
    });
  } catch (e: unknown) {
    console.error('Dashboard Data Failure:', e);
    return NextResponse.json({ error: 'Project data could not be loaded. Please try again.' }, { status: 500 });
  }
}
