import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
import assert from 'node:assert/strict';
const folder='public/character-assets/orion/companion-v1';
const manifest=JSON.parse(readFileSync(`${folder}/manifest.json`));
const bytes=readFileSync(`${folder}/atlas.png`);
const metadata=await sharp(bytes).metadata();assert.equal(metadata.width,1536);assert.equal(metadata.height,2288);assert.equal(metadata.hasAlpha,true);
assert.equal(createHash('sha256').update(bytes).digest('hex'),manifest.atlasSha256);
for(const [file,hash] of Object.entries(manifest.sourceHashes))assert.equal(createHash('sha256').update(readFileSync(file)).digest('hex'),hash,file);
const frames=[];const clipped=[];
for(let row=0;row<11;row++)for(let column=0;column<8;column++){
  const data=await sharp(bytes).extract({left:column*192,top:row*208,width:192,height:208}).ensureAlpha().raw().toBuffer();
  let count=0,minX=192,minY=208,maxX=0,maxY=0,partial=0;
  for(let y=0;y<208;y++)for(let x=0;x<192;x++){
    const a=data[(y*192+x)*4+3];if(a>0&&a<255)partial++;if(a<32)continue;
    count++;minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);
  }
  assert.ok(count>500,`Empty ${row}:${column}`);assert.ok(count<192*208*.75,`Opaque background ${row}:${column}`);
  if(minX<2||minY<2||maxX>189||maxY>205)clipped.push(`${row}:${column}`);
  assert.ok(partial>0,`No antialiased alpha ${row}:${column}`);
  frames.push({row,column,opaquePixels:count,bounds:[minX,minY,maxX,maxY],sha256:createHash('sha256').update(data).digest('hex')});
}
for(let row=0;row<9;row++)assert.ok(new Set(frames.filter(f=>f.row===row).map(f=>f.sha256)).size>=4,`No real animation row ${row}`);
assert.deepEqual(clipped,[],'Fixed camera must contain every pose');
mkdirSync('tmp/orion-qa',{recursive:true});
writeFileSync('tmp/orion-qa/atlas-validation.json',JSON.stringify({status:'PASS',frames:88,animations:9,stationaryLookPoses:16,clipped,atlasSha256:manifest.atlasSha256,frameDetails:frames},null,2));
console.log(JSON.stringify({status:'PASS',frames:88,animations:9,stationaryLookPoses:16,clipped,atlasSha256:manifest.atlasSha256}));
