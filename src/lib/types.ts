// Shapes of the JSON returned by /api/project-data (rows serialized from SQLite).

export interface ProjectRow {
  id: number;
  domain: string;
  score: number | null;
  dr: number | null;
  ur: number | null;
  backlinks: number | null;
  referringDomains: number | null;
  organicTraffic: string | null;
  trafficValue: string | null;
  crawledAt: string | null;
  status: string | null;
}

export interface PageRow {
  id: number;
  projectId: number | null;
  url: string;
  title: string | null;
  description: string | null;
  h1: string | null;
  wordCount: number | null;
  loadTime: number | null;
  statusCode: number | null;
}

export interface IssueRow {
  id: number;
  projectId: number | null;
  pageId: number | null;
  type: string;
  category: string;
  message: string;
  fix: string | null;
  severity: string;
}

export interface KeywordRow {
  id: number;
  projectId: number | null;
  keyword: string;
  volume: number | null;
  difficulty: number | null;
  position: number | null;
  url: string | null;
}

export interface AiInsightRow {
  insight: string;
  actionable: string;
  priority: string;
  impact: string;
}

export interface ProjectData {
  project?: ProjectRow;
  pages?: PageRow[];
  issues?: IssueRow[];
  keywords?: KeywordRow[];
  ai?: AiInsightRow | null;
  error?: string;
  hint?: string;
}
