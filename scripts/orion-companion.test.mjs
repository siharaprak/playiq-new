import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {COMPANION_ANIMATIONS,transitionCompanion,idleCompanion,companionFrame,clampCompanion,animationForOrionPose} from '../src/lib/orion/companion-state.ts';
import {resolveCompanionScope,companionVisibleOnRoute,companionGeometry,boundCompanion,defaultCompanionPosition} from '../src/lib/orion/companion-policy.ts';
test('nine states have fixed rows, eight frames, timing and loop semantics',()=>{
  assert.equal(Object.keys(COMPANION_ANIMATIONS).length,9);
  assert.deepEqual(Object.values(COMPANION_ANIMATIONS).map(v=>v.row),[0,1,2,3,4,5,6,7,8]);
  for(const a of Object.values(COMPANION_ANIMATIONS)){assert.equal(a.frames,8);assert.ok(a.fps>0);}
});
test('drag actually has a down, directional, stationary and release lifecycle',()=>{
  let s=transitionCompanion(idleCompanion(),'down',100);
  assert.equal(s.dragging,true);assert.equal(s.animation,'dragging');
  s=transitionCompanion(s,'left',200);assert.equal(s.animation,'move_left');assert.equal(s.direction,-1);
  assert.equal(transitionCompanion(s,'wave',201),s,'cosmetic event cannot steal drag');
  s=transitionCompanion(s,'right',220);assert.equal(s.animation,'move_right');
  s=transitionCompanion(s,'still',230);assert.equal(s.animation,'dragging');
  s=transitionCompanion(s,'up',300);assert.deepEqual(s,idleCompanion(300));
});
test('one shots end in idle; loops continue; reduced motion stays still',()=>{
  for(const name of ['wave','celebrate','boss'])assert.equal(companionFrame(transitionCompanion(idleCompanion(),name,0),2000).state.animation,'idle');
  const s=transitionCompanion(idleCompanion(),'thinking',0);
  assert.equal(companionFrame(s,50_000).state.animation,'thinking');assert.equal(companionFrame(s,500,true).column,0);
});
test('visible viewport bounds handle screen resize and invalid saved coordinates',()=>{
  for(const [w,h] of [[390,844],[768,1024],[1280,900],[160,120]])for(const [x,y] of [[-500,-2],[2e9,9e9],[NaN,Infinity],[100,200]]){
    const p=clampCompanion(x,y,w,h);assert.ok(Number.isFinite(p.x)&&Number.isFinite(p.y));assert.ok(p.x>=0&&p.y>=0);assert.ok(p.x<=Math.max(0,w-208)&&p.y<=Math.max(0,h-208));
  }
});
test('pose adaptation stays visual and handles existing boss/AI events',()=>{
  assert.equal(animationForOrionPose('barrel_roll'),'boss');assert.equal(animationForOrionPose('think'),'thinking');assert.equal(animationForOrionPose('cheer'),'celebrate');assert.equal(animationForOrionPose('execute_code'),'idle');
});
test('live default is unchanged; browser pointer capture and alpha hit path are explicit',()=>{
  const panel=readFileSync('src/components/guided-ai/GuidedAIPanel.tsx','utf8');
  assert.match(panel,/companionScope = 'off'/);assert.match(panel,/companion \? null/);
  const web=readFileSync('src/components/guided-ai/OrionCompanion.tsx','utf8');
  assert.match(web,/setPointerCapture/);assert.match(web,/onPointerCancel/);assert.match(web,/localStorage\.setItem/);
  assert.match(web,/data\[\(y \* 192 \+ x\) \* 4 \+ 3\] >= 32/);assert.match(web,/parseCharacterActionEvent/);assert.match(web,/parseOrionLocalEvent/);
});
test('release gate fails closed and beta scope cannot leak into other student routes',()=>{
  for(const mode of [undefined,'','ALL','bogus','off'])for(const admin of [true,false])assert.equal(resolveCompanionScope(mode,admin),'off');
  assert.equal(resolveCompanionScope('admin',false),'off');assert.equal(resolveCompanionScope('admin',true),'all');
  assert.equal(resolveCompanionScope('beta',false),'beta');
  assert.equal(companionVisibleOnRoute('beta','/student/course-beta?module=1'),false,'pathname has no query');
  assert.equal(companionVisibleOnRoute('beta','/student/course-beta'),true);
  for(const route of ['/student/course','/student/assessment','/student/course-beta-other','/parent/home',null])assert.equal(companionVisibleOnRoute('beta',route),false);
  assert.equal(companionVisibleOnRoute('off','/student/course-beta'),false);
});
test('responsive geometry includes keyboard viewport offsets, controls and invalid stored values',()=>{
  const phone={width:390,height:844,offsetLeft:0,offsetTop:0};
  assert.equal(companionGeometry(phone).height,130);assert.equal(companionGeometry(phone,true).width,56);
  const phoneDefaultSprite=defaultCompanionPosition(phone,false);
  const phoneDefaultCompact=defaultCompanionPosition(phone,true);
  assert.equal(phoneDefaultSprite.x,390-120-16);
  assert.equal(phoneDefaultSprite.y,844-130-56);
  assert.equal(phoneDefaultCompact.x,390-56-16);
  assert.equal(phoneDefaultCompact.y,844-56-56);
  for(const compact of [true,false])for(const width of [320,390,768,1440])for(const height of [200,390,844,900]){
    const v={width,height,offsetLeft:12,offsetTop:160},g=companionGeometry(v,compact);
    for(const [x,y] of [[-500,-3],[Infinity,NaN],[10000,20000]]){const p=boundCompanion(x,y,v,compact);assert.ok(p.x>=12&&p.y>=160);assert.ok(p.x+g.width+8<=12+width);assert.ok(p.y+g.height+48<=160+height);}
  }
});
test('one chat, recoverable hidden character, shared preferences and background pause',()=>{
  const web=readFileSync('src/components/guided-ai/OrionCompanion.tsx','utf8');
  for(const value of ['hidden={chatOpen}','loadOrionPreferences','saveOrionPreferences','document.hidden','suppressClick.current = d.moved','onOpenChat()','Hide character / text-only','Reset position','Dock Orion'])assert.ok(web.includes(value),value);
  assert.doesNotMatch(web,/\/api\/guided-ai|\/api\/chat/);
  const layout=readFileSync('src/app/(dashboard)/student/layout.tsx','utf8');assert.match(layout,/resolveCompanionScope\(process.env.ORION_COMPANION_MODE, isAdmin\)/);assert.match(layout,/const showOrion = assessmentCompleted \|\| isAdmin/);
});
test('native host has true native transparency/topmost/click-through without privileged global input',()=>{
  const swift=readFileSync('desktop/orion-macos/OrionCompanion.swift','utf8');
  for(const value of ['.borderless','.nonactivatingPanel','panel.isOpaque=false','panel.backgroundColor = .clear','panel.hasShadow=false','panel.level = .floating','window.ignoresMouseEvents = ignore','window.setFrameOrigin','override func mouseDragged','position.json'])assert.ok(swift.includes(value),value);
  assert.doesNotMatch(swift,/addGlobalMonitor|CGEventTap|AXIsProcessTrusted|URLSession|LaunchAgent/);
});
