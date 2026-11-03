import {loadOrionAssets} from './scene-cache';
import {evaluatePose,applyHover,type OrionPose} from './poses';
import {drawOrionFace} from './face';
import {COMPANION_ANIMATIONS,type CompanionAnimation} from './companion-state';

/** Deterministic, fixed-camera GLB -> RGBA atlas. No generative image provider. */
export async function bakeCompanionSprites() {
  const {three:T,gltf}=await loadOrionAssets();
  const width=192,height=208;
  const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
  const renderer=new T.WebGLRenderer({canvas,alpha:true,antialias:true,preserveDrawingBuffer:true});
  renderer.setSize(width,height,false);renderer.setPixelRatio(1);renderer.setClearColor(0x000000,0);
  renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;
  const scene=new T.Scene();scene.background=null;
  scene.add(new T.HemisphereLight(0xf5ffff,0x647582,2.1));
  const key=new T.DirectionalLight(0xffffff,2.5);key.position.set(-4,7,6);scene.add(key);
  const rim=new T.DirectionalLight(0x78e6ef,1.4);rim.position.set(4,3,-5);scene.add(rim);
  const model=gltf.scene.clone(true);
  const box=new T.Box3().setFromObject(model),center=box.getCenter(new T.Vector3()),extent=box.getSize(new T.Vector3());
  model.position.set(-center.x,-center.y,-center.z);
  const root=new T.Group();root.rotation.order='YXZ';root.add(model);scene.add(root);
  // A single fixed orthographic volume leaves headroom for gestures/rolls.
  const half=Math.max(extent.x,extent.y,extent.z)*0.74;
  const camera=new T.OrthographicCamera(-half*width/height,half*width/height,half,-half,0.1,100);
  camera.position.set(0,0,12);camera.lookAt(0,0,0);camera.updateProjectionMatrix();
  const atlas=document.createElement('canvas');atlas.width=width*8;atlas.height=height*11;
  const ctx=atlas.getContext('2d');if(!ctx)throw new Error('Atlas canvas unavailable');
  const faceCanvas=document.createElement('canvas');faceCanvas.width=512;faceCanvas.height=512;
  const fc=faceCanvas.getContext('2d');if(!fc)throw new Error('Face canvas unavailable');
  const face=model.getObjectByName(T.PropertyBinding.sanitizeNodeName('Face | curved emissive display_export')) as import('three').Mesh;
  if(!face)throw new Error('Existing Orion face mesh missing');
  const material=(face.material as import('three').MeshStandardMaterial).clone();
  const texture=new T.CanvasTexture(faceCanvas);texture.colorSpace=T.SRGBColorSpace;texture.flipY=false;
  material.emissiveMap=texture;material.needsUpdate=true;face.material=material;
  const piv=(name:string)=>{const p=model.getObjectByName(name);if(!p)throw new Error('Missing pivot '+name);return p;};
  const arms=([-1,1] as const).map(side=>{const p=side<0?'L':'R';return {side,
    shoulder:piv(p+'_Shoulder_PIVOT_export'),elbow:piv(p+'_Elbow_PIVOT_export'),wrist:piv(p+'_Wrist_PIVOT_export'),thumb:piv(p+'_Thumb_PIVOT_export'),
    fingers:[0,1,2].map(n=>piv(p+'_Finger_'+n+'_PIVOT_export')),
  };});
  const joints=model.children.length; // recorded for reproducibility, not a rig claim
  const nodes:Array<{object:import('three').Object3D;rotation:import('three').Euler;position:import('three').Vector3}>=[];
  model.traverse(o=>nodes.push({object:o,rotation:o.rotation.clone(),position:o.position.clone()}));
  const stateRows:Record<string,unknown>={};const anchors:Record<string,{hat:[number,number];held:[number,number]}>={};
  function render(name:CompanionAnimation|'look',i:number,row:number,col:number) {
    for(const n of nodes){n.object.rotation.copy(n.rotation);n.object.position.copy(n.position);}
    const t=i/8;
    const poses:Partial<Record<CompanionAnimation,OrionPose>>={wave:'wave',thinking:'think',chatting:'giggle',celebrate:'cheer',boss:'barrel_roll'};
    const durations:Partial<Record<CompanionAnimation,number>>={wave:1.9,celebrate:2.1,boss:1.9};
    const pose=name==='look'?'idle':poses[name]??'idle';
    const f=evaluatePose(pose,t*(name==='look'?1:durations[name]??1),true);
    if(name==='idle')f.face.eyeOpen=i===3?0.06:i===2||i===4?0.65:1;
    if(name==='move_left'||name==='move_right'){
      const d=name==='move_left'?-1:1;
      f.yaw=d*0.72;f.roll=-d*0.12;f.lift=Math.sin(t*Math.PI*2)*0.045;
      f.armL.shoulder=0.3+Math.sin(t*Math.PI*2)*0.3;f.armR.shoulder=0.3-Math.sin(t*Math.PI*2)*0.3;f.thruster=2;
    }
    if(name==='dragging'){f.armL.shoulder=0.65;f.armR.shoulder=0.65;f.roll=Math.sin(t*Math.PI*2)*0.06;f.face.eyeShape='wide';}
    applyHover(f,t*3,false);
    root.rotation.set(f.pitch,(name==='look'?i*Math.PI*2/16:f.yaw)+f.spinYaw,f.roll+f.spinRoll);root.position.y=f.lift;
    for(const arm of arms){const a=arm.side<0?f.armL:f.armR;
      arm.shoulder.rotation.z+=arm.side*a.shoulder;arm.elbow.rotation.z+=arm.side*a.elbow;arm.wrist.rotation.z+=arm.side*a.wrist;arm.thumb.rotation.z+=arm.side*a.thumb;
      for(const finger of arm.fingers)finger.rotation.x=a.finger;
    }
    for(const side of [-1,1]){const p=side<0?'L':'R';piv(p+'_Antenna_PIVOT_export').rotation.z-=side*(f.antennaSpread+(side<0?f.antennaL:f.antennaR));
      const pod=piv(p+'_HoverPod_PIVOT_export');pod.position.y+=f.podLift;pod.rotation.x+=f.podTilt*side;
    }
    drawOrionFace(fc!,512,f.face);texture.needsUpdate=true;
    renderer.render(scene,camera);ctx!.drawImage(canvas,col*width,row*height);
    const project=(v:import('three').Vector3):[number,number]=>{v.project(camera);return [(v.x+1)*width/2,(1-v.y)*height/2];};
    root.updateMatrixWorld(true);
    const head=new T.Vector3(0,extent.y*0.5+0.07,0).applyMatrix4(root.matrixWorld);
    const hand=arms[1].wrist.getWorldPosition(new T.Vector3());
    anchors[`${row}:${col}`]={hat:project(head),held:project(hand)};
  }
  try {
    for(const [name,config] of Object.entries(COMPANION_ANIMATIONS)){
      for(let i=0;i<8;i++)render(name as CompanionAnimation,i,config.row,i);
      stateRows[name]={...config};
      // Yield between rows so the review UI can paint without changing sample times.
      await new Promise<void>(resolve=>requestAnimationFrame(()=>resolve()));
    }
    for(let i=0;i<16;i++)render('look',i,9+Math.floor(i/8),i%8);
    return {png:atlas.toDataURL('image/png'),manifest:{version:1,character:'PlayIQ Orion',status:'LOCAL_REVIEW_ONLY',
      image:'atlas.png',width:atlas.width,height:atlas.height,cell:{width,height,pivot:[96,190]},columns:8,rows:11,
      animations:stateRows,lookPoses:{startRow:9,count:16,stepDegrees:22.5,note:'Stationary views, NOT walking directions'},
      camera:{type:'orthographic',position:[0,0,12],halfHeight:half,exposure:1,scale:1},joints,anchors,
      cosmetics:{slots:['hat','held','paint-accent'],authority:'Display only. Caller supplies verified unlocks; preview controls never grant course rewards.'},
    }};
  } finally {renderer.dispose();material.dispose();texture.dispose();}
}
