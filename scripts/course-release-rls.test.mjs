// Actual PostgreSQL/WASM execution against synthetic users only. No hosted DB.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PGlite} from '@electric-sql/pglite';
import {LESSON_ACTIVITIES} from '../src/lib/course-release/activities.ts';

const A='10000000-0000-4000-8000-000000000001';
const B='10000000-0000-4000-8000-000000000002';
const C='10000000-0000-4000-8000-000000000003';
test('real offline SQL: migrations, enrollment, owner/shell isolation, feedback and blockers', async () => {
  const db = new PGlite();
  try {
    await db.exec(`CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS;
      CREATE SCHEMA auth;
      CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$
        SELECT nullif(current_setting('request.jwt.claim.sub',true),'')::uuid;
      $$;
      GRANT USAGE ON SCHEMA auth TO authenticated,anon,service_role;
      GRANT EXECUTE ON FUNCTION auth.uid() TO authenticated,anon,service_role;
      CREATE TABLE public.profiles (id uuid PRIMARY KEY,role text);
      INSERT INTO public.profiles VALUES ('${A}','student'),('${B}','student'),('${C}','parent');
      GRANT SELECT,UPDATE ON public.profiles TO authenticated;
      ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
      CREATE POLICY own_profile ON public.profiles TO authenticated USING (id=auth.uid()) WITH CHECK(id=auth.uid());
      ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO authenticated;`);
    // Deliberately no profiles.status column: release eligibility cannot assume it.
    for (const name of ['20261030090000_course_release_learning_records.sql','20261030091000_course_release_blockers.sql']) {
      await db.exec(readFileSync(new URL(`../supabase/migrations/${name}`,import.meta.url),'utf8'));
    }
    for (const table of ['course_release_enrollments','course_release_learning_records','course_release_beta_feedback','course_release_blockers']) {
      for (const privilege of ['TRUNCATE','REFERENCES','TRIGGER']) {
        assert.equal((await db.query('SELECT has_table_privilege($1,$2,$3) AS allowed',['authenticated',`public.${table}`,privilege])).rows[0].allowed,false,`${table} must not inherit ${privilege}`);
      }
    }
    for (const activity of LESSON_ACTIVITIES) for (const option of activity.options) {
      assert.equal((await db.query('SELECT public.course_release_choices_valid($1,$2) AS valid',[activity.moduleNumber,JSON.stringify({[activity.id]:option.id})])).rows[0].valid,true);
      assert.equal((await db.query('SELECT public.course_release_choices_valid($1,$2) AS valid',[(activity.moduleNumber+1)%15,JSON.stringify({[activity.id]:option.id})])).rows[0].valid,false);
    }
    for (const invalid of ['not json','null','[]','true','{"m14-dashboard-cue":"Z"}','{"m2-focus":true}','{"unknown":"A"}']) {
      assert.equal((await db.query('SELECT public.course_release_choices_valid(2,$1) AS valid',[invalid])).rows[0].valid,false);
    }
    const asUser = async id => db.exec(`RESET ROLE; SET ROLE authenticated; SELECT set_config('request.jwt.claim.sub','${id}',false);`);
    const enroll = async (id,shell='beta') => {
      await db.exec('RESET ROLE');
      await db.query('INSERT INTO public.course_release_enrollments(student_id,release_id,shell,enabled) VALUES($1,$2,$3,true)',[id,'playiq-2026-10-30',shell]);
    };
    const save = (id,shell='beta',module=1,answers={topic:'synthetic circuits'}) => db.query(
      'INSERT INTO public.course_release_learning_records(student_id,release_id,shell,module_number,answers) VALUES($1,$2,$3,$4,$5)',
      [id,'playiq-2026-10-30',shell,module,JSON.stringify(answers)]);
    await asUser(A);
    await assert.rejects(()=>save(A),error=>error.code==='42501');
    await assert.rejects(()=>db.query('INSERT INTO public.course_release_enrollments(student_id,release_id,shell,enabled) VALUES($1,$2,$3,true)',[A,'playiq-2026-10-30','beta']),error=>error.code==='42501');
    await enroll(A); await enroll(B);
    await asUser(A); await save(A);
    await assert.rejects(()=>db.exec('TRUNCATE public.course_release_learning_records CASCADE'),error=>error.code==='42501');
    await assert.rejects(()=>db.exec('TRUNCATE public.course_release_beta_feedback CASCADE'),error=>error.code==='42501');
    await assert.rejects(()=>save(A,'beta',2,{lessonChoices:'{"m14-dashboard-cue":"Z"}'}),error=>error.code==='23514');
    await assert.rejects(()=>save(A,'beta',2,{lessonChoices:'not json'}),error=>error.code==='23514');
    const blocker = [A,'playiq-2026-10-30',0,'Synthetic blocker before any lesson completion','Synthetic browser','Synthetic tablet','/student/course-beta?module=0','blocked'];
    const blockerSql='INSERT INTO public.course_release_blockers(student_id,release_id,module_number,message,browser,device,page_path,severity) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id';
    assert.ok((await db.query(blockerSql,blocker)).rows[0].id);
    await assert.rejects(()=>db.query(blockerSql,[...blocker.slice(0,6),'/student/course-beta?module=14','blocked']),error=>error.code==='23514');
    await assert.rejects(()=>db.query("UPDATE public.course_release_blockers SET message='changed'"),error=>error.code==='42501');
    await assert.rejects(()=>save(A,'final'),error=>error.code==='42501');
    await assert.rejects(()=>save(B),error=>error.code==='42501');
    await assert.rejects(()=>save(A,'beta',2,{email:'not an allowed field'}),error=>error.code==='23514');
    await asUser(B);
    assert.equal((await db.query('SELECT * FROM public.course_release_learning_records')).rows.length,0);
    assert.equal((await db.query('SELECT * FROM public.course_release_blockers')).rows.length,0);
    await assert.rejects(()=>db.query(blockerSql,blocker),error=>error.code==='42501');
    await asUser(C);
    await db.query("UPDATE public.profiles SET role='student' WHERE id=$1",[C]);
    await assert.rejects(()=>save(C),error=>error.code==='42501');
    await asUser(A);
    await assert.rejects(()=>db.query('UPDATE public.course_release_enrollments SET enabled=false'),error=>error.code==='42501');
    await assert.rejects(()=>db.query('INSERT INTO public.course_release_beta_feedback(student_id,release_id,module_number,rating,feedback) VALUES($1,$2,1,4,$3)',[A,'playiq-2026-10-30','synthetic feedback']),error=>error.code==='42501');
    await db.query('UPDATE public.course_release_learning_records SET completed=true WHERE student_id=$1 AND shell=$2',[A,'beta']);
    await db.query('INSERT INTO public.course_release_beta_feedback(student_id,release_id,module_number,rating,feedback) VALUES($1,$2,1,4,$3)',[A,'playiq-2026-10-30','synthetic feedback']);
    await asUser(B);
    assert.equal((await db.query('SELECT * FROM public.course_release_beta_feedback')).rows.length,0);
    await db.exec('RESET ROLE');
    await db.query('UPDATE public.course_release_enrollments SET enabled=false WHERE student_id=$1',[A]);
    await asUser(A);
    assert.equal((await db.query('SELECT * FROM public.course_release_learning_records')).rows.length,0);
    assert.equal((await db.query('SELECT * FROM public.course_release_blockers')).rows.length,0);
    await assert.rejects(()=>save(A,'beta',3,{topic:'no longer enrolled'}),error=>error.code==='42501');
  } finally { await db.close(); }
});
