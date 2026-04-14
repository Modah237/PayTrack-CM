import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

async function migrate() {
  const sqlPath = path.resolve(__dirname, 'setup.sql');

  if (!fs.existsSync(sqlPath)) {
    console.error(`[Migrate] setup.sql not found at ${sqlPath}`);
    process.exit(1);
  }

  const sql = fs.readFileSync(sqlPath, 'utf-8');

  try {
    console.log('[Migrate] Running database migrations...');
    await pool.query(sql);
    console.log('[Migrate] ✅ Database schema applied successfully.');
  } catch (err: any) {
    console.error('[Migrate] ❌ Migration failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
