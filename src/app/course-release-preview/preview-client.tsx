'use client';
import {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import CourseShellClient, {type CourseShellActions} from '@/components/course-release/CourseShellClient';
import {buildPersonalLearningKnowledgeFile, type CourseModuleRecord, type CourseReleaseState, type CourseShell} from '@/lib/course-release/learning-record';
import type {CourseLesson} from '@/lib/course-release/content';
import {GuidedAIPanel} from '@/components/guided-ai/GuidedAIPanel';

export default function PreviewClient({shell,lesson,navigation,fail,failSaves}:{
  shell:CourseShell; lesson:CourseLesson; navigation:{moduleNumber:number;title:string}[];fail:boolean;failSaves:boolean;
}) {
  const state = useRef<CourseReleaseState>({records:[],assessmentProfile:null});
  const [initial,setInitial] = useState<CourseReleaseState | null>(null);
  const router = useRouter();
  useEffect(() => {
    try { state.current.records = JSON.parse(localStorage.getItem(`playiq-synthetic-${shell}`) || '[]'); } catch { /* Empty synthetic state. */ }
    setInitial(state.current);
    const intercept = (event:MouseEvent) => {
      const anchor = (event.target as Element)?.closest('a');
      if (!anchor) return;
      const url = new URL(anchor.href);
      if (!/^\/student\/course(?:-beta)?$/.test(url.pathname)) return;
      event.preventDefault();
      router.push(`/course-release-preview?shell=${shell}&module=${url.searchParams.get('module') || 0}${fail?'&mode=fail':failSaves?'&mode=savefail':''}`);
    };
    document.addEventListener('click',intercept,true);
    return () => document.removeEventListener('click',intercept,true);
  },[shell,fail,failSaves,router]);
  const failure = {ok:false as const,error:'SYNTHETIC TEST: storage is unavailable. Nothing was saved.'};
  const actions:CourseShellActions = {
    load:async () => fail ? failure : {ok:true,data:state.current},
    save:async input => {
      if (fail || failSaves) return failure;
      const record:CourseModuleRecord = {...input,updatedAt:new Date().toISOString()};
      state.current = {...state.current, records:[...state.current.records.filter(item=>item.moduleNumber!==input.moduleNumber),record]};
      localStorage.setItem(`playiq-synthetic-${shell}`,JSON.stringify(state.current.records));
      return {ok:true,record};
    },
    download:async () => fail ? failure : {ok:true,...buildPersonalLearningKnowledgeFile(state.current,shell,new Date().toISOString())},
    feedback:async () => fail ? failure : {ok:true},
    blocker:async input => fail || failSaves ? failure : {ok:true,ticketId:input.reportId,status:'confirmed'},
  };
  return <>
    <aside style={{padding:16,background:'#fff1b8',color:'#221900',border:'3px solid #ae6900'}}>
      <strong>SYNTHETIC UI TEST — not a student session.</strong> Saves use this browser only, not PlayIQ’s database. No AI provider or real learner data is connected. {fail?'Load-failure mode enabled.':failSaves?'Save-failure mode enabled.':'Success simulation enabled.'}
    </aside>
    {initial ? <CourseShellClient shell={shell} lesson={lesson} navigation={navigation}
      initialResult={fail?failure:{ok:true,data:initial}} actions={actions}/> : <p>Preparing synthetic UI test…</p>}
    <GuidedAIPanel isFloating moduleNumber={lesson.moduleNumber} studentName="Synthetic QA" orion3d={false} />
  </>;
}
