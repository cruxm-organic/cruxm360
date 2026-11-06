// One-off CommonJS migration script, run directly with `node manual_migrate.js`.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const Database = require('better-sqlite3');
const db = new Database('cruxm-v2.db');

try {
  console.log('Adding "dr" column...');
  db.prepare('ALTER TABLE projects ADD COLUMN dr INTEGER DEFAULT 0').run();
} catch (e) {
  console.log('Column "dr" potentially already exists, skipping.');
}

try {
  console.log('Adding "ur" column...');
  db.prepare('ALTER TABLE projects ADD COLUMN ur INTEGER DEFAULT 0').run();
} catch (e) {
  console.log('Column "ur" potentially already exists, skipping.');
}

try {
  console.log('Adding "backlinks" column...');
  db.prepare('ALTER TABLE projects ADD COLUMN backlinks INTEGER DEFAULT 0').run();
} catch (e) {
  console.log('Column "backlinks" potentially already exists, skipping.');
}

try {
  console.log('Adding "referring_domains" column...');
  db.prepare('ALTER TABLE projects ADD COLUMN referring_domains INTEGER DEFAULT 0').run();
} catch (e) {
  console.log('Column "referring_domains" potentially already exists, skipping.');
}

try {
  console.log('Adding "organic_traffic" column...');
  db.prepare("ALTER TABLE projects ADD COLUMN organic_traffic TEXT DEFAULT '0'").run();
} catch (e) {
  console.log('Column "organic_traffic" potentially already exists, skipping.');
}

try {
  console.log('Adding "traffic_value" column...');
  db.prepare("ALTER TABLE projects ADD COLUMN traffic_value TEXT DEFAULT '$0'").run();
} catch (e) {
  console.log('Column "traffic_value" potentially already exists, skipping.');
}

console.log('Manual migration finalized.');
db.close();
