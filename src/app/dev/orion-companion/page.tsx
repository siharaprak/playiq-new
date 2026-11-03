import {notFound} from 'next/navigation';
import {loadCourseLessons} from '@/lib/course-release/content';
import PreviewClient from '@/app/course-release-preview/preview-client';
import OrionCompanionReview from '@/components/guided-ai/OrionCompanionReview';
export const dynamic='force-dynamic';
export default async function Review({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
  if(process.env.NODE_ENV!=='development'||process.env.PLAYIQ_ORION_COMPANION_REVIEW!=='true')notFound();
  const lessons=loadCourseLessons('beta');
  const query=await searchParams;
  const moduleNumber=typeof query.module==='string'&&/^(?:[0-9]|1[0-4])$/.test(query.module)?Number(query.module):1;
  return <><OrionCompanionReview/><PreviewClient shell="beta" lesson={lessons[moduleNumber]} navigation={lessons.map(({moduleNumber,title})=>({moduleNumber,title}))} fail={false} failSaves={false} companion/></>;
}
