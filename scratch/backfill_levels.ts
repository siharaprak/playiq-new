import { Client } from 'pg';

const connectionString = 'postgresql://postgres.scdbhpcnqihaswaijptx:O4lkZEsC30Trlaa9@aws-1-us-east-1.pooler.supabase.com:5432/postgres';

async function run() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log('Connected to database. Resolving parent-child links...');

    // 1. Fetch links, parent emails, and current student levels
    const res = await client.query(`
      SELECT 
        l.student_id,
        s.full_name as student_name,
        p.email as parent_email,
        s.learning_level as current_level
      FROM parent_child_links l
      JOIN profiles p ON l.parent_id = p.id
      JOIN profiles s ON l.student_id = s.id
    `);

    const links = res.rows;
    console.log(`Found ${links.length} linked student-parent accounts.`);

    let updatedCount = 0;

    for (const link of links) {
      // 2. Fetch the parent's beta application child_age_band
      const appRes = await client.query(
        'SELECT child_age_band FROM beta_applications WHERE email = $1 LIMIT 1',
        [link.parent_email]
      );

      const app = appRes.rows[0];
      if (!app) {
        console.log(`No beta application found for parent: ${link.parent_email}`);
        continue;
      }

      // 3. Map age band to target learning level
      let targetLevel: 'elementary' | 'middle' | 'high' | 'adult' = 'high';
      if (app.child_age_band === 'under_13') targetLevel = 'elementary';
      else if (app.child_age_band === '13_14') targetLevel = 'middle';
      else if (app.child_age_band === '15_17') targetLevel = 'high';
      else if (app.child_age_band === 'over_17') targetLevel = 'adult';

      if (link.current_level !== targetLevel) {
        // 4. Update the student's learning level
        await client.query(
          'UPDATE profiles SET learning_level = $1 WHERE id = $2',
          [targetLevel, link.student_id]
        );
        console.log(`Updated Student "${link.student_name}" (${link.parent_email}): ${link.current_level} ➜ ${targetLevel}`);
        updatedCount++;
      } else {
        console.log(`Student "${link.student_name}" is already at correct level: ${targetLevel}`);
      }
    }

    console.log(`🎉 Backfill complete! Updated ${updatedCount} student profiles.`);
  } catch (err) {
    console.error('❌ Backfill failed:', err);
  } finally {
    await client.end();
  }
}

run();
