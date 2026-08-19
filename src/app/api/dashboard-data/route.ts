import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { projects, pages, issues, keywords, aiInsights } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const domain = searchParams.get('domain');

  if (!domain) return NextResponse.json({ error: 'Project scope required' }, { status: 400 });

  try {
    const project = await db.select().from(projects).where(eq(projects.domain, domain)).get();
    
    if (!project) return NextResponse.json({ 
        error: 'No operational data found for this domain.',
        hint: 'Please run an initial Discovery scan first.'
    }, { status: 404 });

    const [allPages, allIssues, allKeywords, allAiInsights] = await Promise.all([
      db.select().from(pages).where(eq(pages.projectId, project.id)).limit(200),
      db.select().from(issues).where(eq(issues.projectId, project.id)).limit(100),
      db.select().from(keywords).where(eq(keywords.projectId, project.id)).limit(100),
      db.select().from(aiInsights).where(eq(aiInsights.projectId, project.id)).get()
    ]);

    return NextResponse.json({
      project,
      pages: allPages || [],
      issues: allIssues || [],
      keywords: allKeywords || [],
      ai: allAiInsights || { insight: 'Awaiting discovery results', actionable: 'Run scan to unlock.', priority: 'high', impact: 'None' }
    });
  } catch (e: any) {
    console.error('Data Fetch Failure:', e);
    return NextResponse.json({ error: 'Neural Engine Timeout: ' + e.message }, { status: 500 });
  }
}
