import {NextResponse} from 'next/server';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
export const runtime='nodejs';
/** Fixed-output local artifact sink. Never enabled or reachable in production. */
export async function POST(request:Request){
  if(process.env.NODE_ENV!=='development'||process.env.PLAYIQ_ORION_COMPANION_REVIEW!=='true')return new Response(null,{status:404});
  let origin:URL;try{origin=new URL(request.headers.get('origin')??'');}catch{return new Response(null,{status:403});}
  // Next may normalize request.url to localhost; verify the actual Host instead.
  if(origin.protocol!=='http:'||!['127.0.0.1','localhost'].includes(origin.hostname)||origin.host!==request.headers.get('host'))return new Response(null,{status:403});
  if(Number(request.headers.get('content-length')??0)>8_000_000)return new Response(null,{status:413});
  const raw=await request.text();if(raw.length>8_000_000)return new Response(null,{status:413});
  try{
    const {png,manifest}=JSON.parse(raw);
    if(typeof png!=='string'||!png.startsWith('data:image/png;base64,')||manifest?.version!==1)return new Response(null,{status:400});
    if(manifest.image!=='atlas.png'||manifest.width!==1536||manifest.height!==2288||manifest.columns!==8||manifest.rows!==11||manifest.cell?.width!==192||manifest.cell?.height!==208)return new Response(null,{status:400});
    if(!manifest.anchors||typeof manifest.anchors!=='object')return new Response(null,{status:400});
    for(let row=0;row<11;row++)for(let column=0;column<8;column++){
      const anchor=manifest.anchors[`${row}:${column}`];
      if(!anchor||!['hat','held'].every(key=>Array.isArray(anchor[key])&&anchor[key].length===2&&anchor[key].every((n:unknown)=>typeof n==='number'&&Number.isFinite(n))))return new Response(null,{status:400});
    }
    const bytes=Buffer.from(png.slice(22),'base64');const info=await sharp(bytes,{limitInputPixels:1536*2288}).metadata();
    if(info.format!=='png'||info.width!==1536||info.height!==2288||!info.hasAlpha)return new Response(null,{status:400});
    const target=path.join(process.cwd(),'public/character-assets/orion/companion-v1');
    const sources=['public/character-assets/orion/orion-reference-v001.glb','public/character-assets/orion/orion-reference-v001.meshopt.glb','src/lib/orion/poses.ts','src/lib/orion/face.ts','src/lib/orion/bake-companion.ts'];
    const sourceHashes:Record<string,string>={};for(const file of sources)sourceHashes[file]=createHash('sha256').update(await readFile(path.join(process.cwd(),file))).digest('hex');
    await mkdir(target,{recursive:true});
    await writeFile(path.join(target,'atlas.png'),bytes);
    await writeFile(path.join(target,'manifest.json'),JSON.stringify({...manifest,sourceHashes,atlasSha256:createHash('sha256').update(bytes).digest('hex')},null,2)+'\n');
    return NextResponse.json({ok:true,path:'/character-assets/orion/companion-v1/manifest.json'});
  }catch{return NextResponse.json({ok:false,error:'Sprite bake rejected; no success claimed.'},{status:400});}
}
