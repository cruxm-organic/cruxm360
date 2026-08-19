import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { projects, pages, issues, keywords, aiInsights } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const domain = searchParams.get('domain');

  if (!domain) {
    return NextResponse.json({ error: 'Domain param required' }, { status: 400 });
  }

  try {
    // 1. Get Project
    const project = await db.select().from(projects).where(eq(projects.domain, domain)).get();

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // 2. Get Related Data
    const projectPages = await db.select().from(pages).where(eq(pages.projectId, project.id)).all();
    const projectIssues = await db.select().from(issues).where(eq(issues.projectId, project.id)).all();
    const projectKeywords = await db.select().from(keywords).where(eq(keywords.projectId, project.id)).all();
    const projectAi = await db.select().from(aiInsights).where(eq(aiInsights.projectId, project.id)).get();

    return NextResponse.json({
      project,
      pages: projectPages,
      issues: projectIssues,
      keywords: projectKeywords,
      ai: projectAi,
      lastUpdate: project.crawledAt
    });

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Server Audit Retrieval Failed' }, { status: 500 });
  }
}
