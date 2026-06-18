import { Client } from 'pg';

const connectionString = 'postgresql://postgres.scdbhpcnqihaswaijptx:O4lkZEsC30Trlaa9@aws-1-us-east-1.pooler.supabase.com:5432/postgres';

async function run() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log('Connected to database. Running SQL migration...');

    // 1. Create enum type if not exists
    await client.query(`
      DO $$ BEGIN
          CREATE TYPE learning_audience_tier AS ENUM ('elementary', 'middle', 'high', 'adult');
      EXCEPTION
          WHEN duplicate_object THEN null;
      END $$;
    `);
    console.log('✔ Enum type verified/created.');

    // 2. Add column if not exists
    await client.query(`
      ALTER TABLE profiles 
      ADD COLUMN IF NOT EXISTS learning_level learning_audience_tier NOT NULL DEFAULT 'high';
    `);
    console.log('✔ learning_level column verified/created.');

    console.log('🎉 Migration applied successfully!');
  } catch (err) {
    console.error('❌ Migration failed:', err);
  } finally {
    await client.end();
  }
}

run();
