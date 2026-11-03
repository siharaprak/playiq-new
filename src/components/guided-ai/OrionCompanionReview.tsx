'use client';
import {useState} from 'react';
import {bakeCompanionSprites} from '@/lib/orion/bake-companion';
export default function OrionCompanionReview(){
  const [status,setStatus]=useState('Local review only. Existing course design is unchanged.');const [busy,setBusy]=useState(false);
  async function bake(){setBusy(true);setStatus('Rendering the existing Orion model at fixed sample times…');try{
    const output=await bakeCompanionSprites();const r=await fetch('/dev/orion-companion/export',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(output)});
    if(!r.ok)throw new Error('Atlas export was not confirmed');setStatus('Atlas and manifest written locally. Reload this page to load the new sprites.');
  }catch(e){setStatus(e instanceof Error?e.message:'Bake failed');}finally{setBusy(false);}}
  return <section style={{background:'#fff',color:'#123',border:'2px solid #15a3b0',borderRadius:12,padding:20,margin:20}}>
    <h1>Orion companion — isolated local review</h1><p>The actual PlayIQ lesson UI is below with synthetic records. This companion is not deployed. Drag Orion to move; click to open the existing chat. The ⋯ control offers dock, hide, motion and reset options. When chat is open, Orion is represented in its header rather than blocking the conversation. Transparent pixels pass through.</p>
    <button disabled={busy} onClick={bake} style={{border:'1px solid',padding:8,margin:8}}>Bake transparent sprites from Orion GLB</button>
    {['idle','wave','thinking','chatting','celebrate','boss'].map(state=><button key={state} style={{border:'1px solid',padding:8,margin:4}} onClick={()=>window.dispatchEvent(new CustomEvent('playiq:companion-review',{detail:state}))}>{state}</button>)}
    <button style={{border:'1px solid',padding:8,margin:4}} onClick={()=>document.getElementById('companion-test-panel')?.toggleAttribute('hidden')}>Toggle high-layer test panel</button>
    <p role="status">{status}</p>
    <div id="companion-test-panel" hidden style={{position:'fixed',right:10,bottom:10,width:360,height:260,zIndex:100000,background:'#e1f6fa',border:'3px solid #1d7989',borderRadius:18,padding:30,color:'#123'}}>
      High-layer PlayIQ review panel. Orion should stay above this and its transparent corners should not block this control.
      <button style={{border:'2px solid',margin:20,padding:16}} onClick={e=>{e.currentTarget.textContent='Underlying control clicked';}}>Underlying control — click test</button>
    </div>
  </section>;
}
