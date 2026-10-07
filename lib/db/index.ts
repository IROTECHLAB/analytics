import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { config } from '@/lib/config';
import * as schema from './schema';

const sql = neon(config.db.url);
export const db = drizzle(sql, { schema });
export { schema };
