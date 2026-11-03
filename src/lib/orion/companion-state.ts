/** Local cosmetic behavior only; no tools, model commands, scores or permissions. */
export const COMPANION_ANIMATIONS = {
  idle: {row:0,frames:8,fps:4,loop:true},
  move_right: {row:1,frames:8,fps:12,loop:true},
  move_left: {row:2,frames:8,fps:12,loop:true},
  dragging: {row:3,frames:8,fps:8,loop:true},
  wave: {row:4,frames:8,fps:8,loop:false},
  thinking: {row:5,frames:8,fps:8,loop:true},
  chatting: {row:6,frames:8,fps:8,loop:true},
  celebrate: {row:7,frames:8,fps:8,loop:false},
  boss: {row:8,frames:8,fps:8,loop:false},
} as const;
export type CompanionAnimation = keyof typeof COMPANION_ANIMATIONS;
export type CompanionState = {animation:CompanionAnimation;since:number;dragging:boolean;direction:-1|0|1};
export const idleCompanion = (now=0):CompanionState => ({animation:'idle',since:now,dragging:false,direction:0});
export function transitionCompanion(s:CompanionState,event:'down'|'up'|'left'|'right'|'still'|CompanionAnimation,now:number):CompanionState {
  if(event==='up') return idleCompanion(now);
  if(event==='down') return {animation:'dragging',since:now,dragging:true,direction:0};
  if(event==='left'||event==='right'||event==='still') {
    if(!s.dragging) return s;
    const animation=event==='left'?'move_left':event==='right'?'move_right':'dragging';
    return {...s,animation,since:s.animation===animation?s.since:now,direction:event==='left'?-1:event==='right'?1:0};
  }
  if(s.dragging) return s;
  return Object.hasOwn(COMPANION_ANIMATIONS,event)?{animation:event,since:now,dragging:false,direction:0}:s;
}
export function companionFrame(s:CompanionState,now:number,reduced=false) {
  const a=COMPANION_ANIMATIONS[s.animation];
  const elapsed=Math.max(0,now-s.since);
  if(!a.loop && elapsed>=1000*a.frames/a.fps) return {state:idleCompanion(now),row:0,column:0};
  return {state:s,row:a.row,column:reduced?0:Math.floor(elapsed*a.fps/1000)%a.frames};
}
export function clampCompanion(x:number,y:number,w:number,h:number,size=208) {
  const safe=(v:number)=>Number.isFinite(v)?v:0;
  return {x:Math.max(0,Math.min(safe(x),Math.max(0,safe(w)-size))),y:Math.max(0,Math.min(safe(y),Math.max(0,safe(h)-size)))};
}
/** Only existing fail-closed action/local-event parsers call this adapter. */
export function animationForOrionPose(pose:string):CompanionAnimation {
  if(['cheer','proud','thumbs_up','encourage','hop'].includes(pose)) return 'celebrate';
  if(pose==='barrel_roll') return 'boss';
  if(pose==='think') return 'thinking';
  if(pose==='wave'||pose==='wake') return 'wave';
  if(['concerned','look_left','look_right','look_up','look_down','wink','giggle'].includes(pose)) return 'chatting';
  return 'idle';
}
