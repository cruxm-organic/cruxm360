import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const projects = sqliteTable('projects', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  domain: text('domain').notNull().unique(),
  score: integer('score').default(0),
  dr: integer('dr').default(0), // Domain Rating
  ur: integer('ur').default(0), // URL Rating
  backlinks: integer('backlinks').default(0),
  referringDomains: integer('referring_domains').default(0),
  organicTraffic: text('organic_traffic').default('0'),
  trafficValue: text('traffic_value').default('$0'),
  // $defaultFn runs per insert; .default(new Date()) was evaluated once at module load.
  crawledAt: integer('crawled_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  status: text('status').default('active'),
});

export const pages = sqliteTable('pages', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  projectId: integer('project_id').references(() => projects.id),
  url: text('url').notNull(),
  title: text('title'),
  description: text('description'),
  h1: text('h1'),
  wordCount: integer('word_count'),
  loadTime: real('load_time'),
  statusCode: integer('status_code'),
});

export const issues = sqliteTable('issues', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  projectId: integer('project_id').references(() => projects.id),
  pageId: integer('page_id').references(() => pages.id),
  type: text('type').notNull(), // 'error', 'warning', 'info'
  category: text('category').notNull(), // 'seo', 'performance', 'security'
  message: text('message').notNull(),
  fix: text('fix'),
  severity: text('severity').notNull(), // 'high', 'medium', 'low'
});

export const keywords = sqliteTable('keywords', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  projectId: integer('project_id').references(() => projects.id),
  keyword: text('keyword').notNull(),
  volume: integer('volume'),
  difficulty: integer('difficulty'),
  position: integer('position'),
  url: text('url'),
});

export const logs = sqliteTable('logs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  projectId: integer('project_id').references(() => projects.id),
  action: text('action').notNull(),
  details: text('details'),
  timestamp: integer('timestamp', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const aiInsights = sqliteTable('ai_insights', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  projectId: integer('project_id').references(() => projects.id),
  insight: text('insight').notNull(),
  actionable: text('actionable').notNull(),
  priority: text('priority').notNull(), // 'high', 'medium', 'low'
  impact: text('impact').notNull(),
});
