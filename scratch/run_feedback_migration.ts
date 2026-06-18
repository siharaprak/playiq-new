import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

const connectionString = 'postgresql://postgres.scdbhpcnqihaswaijptx:O4lkZEsC30Trlaa9@aws-1-us-east-1.pooler.supabase.com:5432/postgres';

async function run() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log('Connected to database.');

    // const sqlPath = path.join(__dirname, '../supabase/migrations/0010_feedback_requests.sql');
    // console.log('Reading migration file:', sqlPath);
    // const sql = fs.readFileSync(sqlPath, 'utf8');

    // console.log('Executing migration SQL...');
    // await client.query(sql);
    // console.log('✔ Migration SQL executed successfully.');

    // Let's verify if the table exists now
    const res = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'feedback_requests'
      );
    `);
    console.log('Table exists check:', res.rows[0]);

    console.log('Notifying pgrst to reload schema...');
    await client.query("NOTIFY pgrst, 'reload schema';");
    console.log('✔ Schema reload notified.');

  } catch (err) {
    console.error('❌ Migration failed:', err);
  } finally {
    await client.end();
  }
}

run();
