function createBrickTexture(size=64){
  const c=document.createElement('canvas'); c.width=c.height=size; const g=c.getContext('2d'); g.imageSmoothingEnabled=false;
  g.fillStyle='#7d1d1d'; g.fillRect(0,0,size,size);
  const h=size/8,w=size/4;
  for(let y=0;y<size;y+=h){
    for(let x=0;x<size;x+=w){
      const off=((y/h)|0)%2?w/2:0;
      g.fillStyle=`rgb(${120+randi(-15,15)},${30+randi(-10,10)},${30+randi(-10,10)})`;
      g.fillRect((x+off)%size+1,y+1,w-2,h-2);
    }
  }
  g.fillStyle='rgba(0,0,0,.35)'; for(let y=0;y<size;y+=h) g.fillRect(0,y,size,1);
  for(let row=0;row<size/h;row++){ const off=row%2?w/2:0; for(let x=off;x<size+off;x+=w) g.fillRect((x%size)|0,row*h,1,h); }
  return c;
}
function createConcreteTexture(size=64){
  const c=document.createElement('canvas'); c.width=c.height=size; const g=c.getContext('2d'); g.imageSmoothingEnabled=false;
  g.fillStyle='#cfcfcf'; g.fillRect(0,0,size,size);
  for(let i=0;i<800;i++){ g.fillStyle=`rgba(0,0,0,${(Math.random()*0.12).toFixed(3)})`; g.fillRect(randi(0,size-1),randi(0,size-1),1,1); }
  for(let y=0;y<size;y++){ g.fillStyle=`rgba(0,0,0,${(0.05*Math.sin(y/7)+0.06).toFixed(3)})`; g.fillRect(0,y,size,1); }
  return c;
}
function createGlassTexture(size=64){
  const c=document.createElement('canvas'); c.width=c.height=size; const g=c.getContext('2d'); g.imageSmoothingEnabled=false;
  const base=g.createLinearGradient(0,0,0,size); base.addColorStop(0,'#a8e6ff'); base.addColorStop(1,'#5bb3e6');
  g.fillStyle=base; g.fillRect(0,0,size,size);
  g.fillStyle='rgba(255,255,255,.25)'; for(let y=0;y<size;y+=8) g.fillRect(0,y,size,2);
  g.fillStyle='rgba(0,0,0,.12)'; for(let y=4;y<size;y+=8) g.fillRect(0,y,size,1);
  return c;
}
/* asphalt without lane dashes */
function createAsphaltTexture(size=64){
  const c=document.createElement('canvas'); c.width=c.height=size; const g=c.getContext('2d'); g.imageSmoothingEnabled=false;
  g.fillStyle='#2b2b2f'; g.fillRect(0,0,size,size);
  for(let i=0;i<1500;i++){ g.fillStyle=`rgba(255,255,255,${(Math.random()*0.06).toFixed(3)})`; g.fillRect(randi(0,size-1),randi(0,size-1),1,1); }
  return c;
}
function createSidewalkTexture(size=64){
  const c=document.createElement('canvas'); c.width=c.height=size; const g=c.getContext('2d'); g.imageSmoothingEnabled=false;
  g.fillStyle='#bfc5c9'; g.fillRect(0,0,size,size);
  g.strokeStyle='rgba(0,0,0,.25)'; g.lineWidth=1;
  for(let x=0;x<size;x+=8){ g.beginPath(); g.moveTo(x,0); g.lineTo(x,size); g.stroke(); }
  for(let y=0;y<size;y+=8){ g.beginPath(); g.moveTo(0,y); g.lineTo(size,y); g.stroke(); }
  for(let i=0;i<800;i++){ g.fillStyle=`rgba(0,0,0,${(Math.random()*0.12).toFixed(3)})`; g.fillRect(randi(0,size-1),randi(0,size-1),1,1); }
  return c;
}
function createParkTexture(size=64){
  const c=document.createElement('canvas'); c.width=c.height=size; const g=c.getContext('2d'); g.imageSmoothingEnabled=false;
  g.fillStyle='#2f6d2f'; g.fillRect(0,0,size,size);
  for(let i=0;i<1000;i++){ g.fillStyle=`rgba(255,255,255,${(Math.random()*0.08).toFixed(3)})`; g.fillRect(randi(0,size-1),randi(0,size-1),1,1); }
  return c;
}
function createSprayTexture(size=96){
  const c=document.createElement('canvas'); c.width=c.height=size; const g=c.getContext('2d'); g.imageSmoothingEnabled=false;
  const grad=g.createRadialGradient(size/2,size/2,2,size/2,size/2,size/2);
  grad.addColorStop(0,'rgba(255,255,255,.35)'); grad.addColorStop(1,'rgba(255,255,255,0)');
  g.fillStyle=grad; g.fillRect(0,0,size,size); return c;
}
function createTagTexture(text='NY90', w=48,h=32){
  const c=document.createElement('canvas'); c.width=w; c.height=h; const g=c.getContext('2d'); g.imageSmoothingEnabled=false;
  g.fillStyle='rgba(0,0,0,0)'; g.fillRect(0,0,w,h);
  for(let i=0;i<3;i++){ g.font=`bold ${16+i}px Arial`; g.fillStyle=['#ff3bd4','#39ff14','#20d0ff'][i%3]; g.translate(1,0); g.fillText(text, 4+i, 20+i); }
  g.setTransform(1,0,0,1,0,0); return c;
}
/* Crosswalk textures */
function createCrosswalkTextureV(size=64){
  const c=document.createElement('canvas'); c.width=c.height=size; const g=c.getContext('2d'); g.imageSmoothingEnabled=false;
  g.fillStyle='#2b2b2f'; g.fillRect(0,0,size,size);
  g.fillStyle='#ffffff'; for(let x=2; x<size; x+=12){ g.fillRect(x, 0, 6, size); }
  g.globalAlpha=0.12; g.fillStyle='#000'; g.fillRect(0,0,size,size); g.globalAlpha=1;
  return c;
}
function createCrosswalkTextureH(size=64){
  const c=document.createElement('canvas'); c.width=c.height=size; const g=c.getContext('2d'); g.imageSmoothingEnabled=false;
  g.fillStyle='#2b2b2f'; g.fillRect(0,0,size,size);
  g.fillStyle='#ffffff'; for(let y=2; y<size; y+=12){ g.fillRect(0, y, size, 6); }
  g.globalAlpha=0.12; g.fillStyle='#000'; g.fillRect(0,0,size,size); g.globalAlpha=1;
  return c;
}

/* ========= Sprites 16×16 ========= */
function createPoliceSprite(){
  const c=document.createElement('canvas'); c.width=c.height=16; const g=c.getContext('2d'); g.imageSmoothingEnabled=false;
  g.clearRect(0,0,16,16); g.fillStyle='#0b1a5e'; g.fillRect(4,6,8,8);
  g.fillStyle='#f1d2b3'; g.fillRect(6,3,4,3);
  g.fillStyle='#fff'; g.fillRect(5,1,6,2);
  g.fillStyle='#ffd400'; g.fillRect(10,9,2,2);
  g.fillStyle='#09144a'; g.fillRect(5,14,2,2); g.fillRect(9,14,2,2);
  return c;
}
function createCivilianSprite(){
  const c=document.createElement('canvas'); c.width=c.height=16; const g=c.getContext('2d'); g.imageSmoothingEnabled=false;
  const shirt=`hsl(${randi(0,360)},70%,60%)`, pants=`hsl(${randi(0,360)},40%,40%)`;
  g.clearRect(0,0,16,16); g.fillStyle='#f1d8b5'; g.fillRect(6,3,4,3);
  g.fillStyle=shirt; g.fillRect(4,6,8,6);
  g.fillStyle=pants; g.fillRect(5,12,6,3); return c;
}
/* cars front/back */
function createCarFront(color){
  const c=document.createElement('canvas'); c.width=c.height=16; const g=c.getContext('2d'); g.imageSmoothingEnabled=false;
  g.fillStyle=color; g.fillRect(2,4,12,8);
  g.fillStyle='#aee7ff'; g.fillRect(4,1,8,3);
  g.fillStyle='#ffff99'; g.fillRect(1,6,2,2); g.fillRect(13,6,2,2);
  g.fillStyle='#000'; g.fillRect(2,12,12,2);
  return c;
}
function createCarBack(color){
  const c=document.createElement('canvas'); c.width=c.height=16; const g=c.getContext('2d'); g.imageSmoothingEnabled=false;
  g.fillStyle=color; g.fillRect(2,4,12,8);
  g.fillStyle='#aee7ff'; g.fillRect(4,12,8,3);
  g.fillStyle='#ff3333'; g.fillRect(1,8,2,3); g.fillRect(13,8,2,3);
  g.fillStyle='#000'; g.fillRect(2,4,12,2);
  return c;
}
function createPoliceCarFront(phase=false){
  const c=document.createElement('canvas'); c.width=c.height=16; const g=c.getContext('2d'); g.imageSmoothingEnabled=false;
  g.fillStyle='#1b2b8d'; g.fillRect(2,4,12,8);
  g.fillStyle='#fff'; g.fillRect(2,8,12,2);
  g.fillStyle=phase?'#ff3344':'#3aa0ff'; g.fillRect(4,1,3,3);
  g.fillStyle=phase?'#3aa0ff':'#ff3344'; g.fillRect(9,1,3,3);
  g.fillStyle='#ffff99'; g.fillRect(1,6,2,2); g.fillRect(13,6,2,2);
  return c;
}
function createPoliceCarBack(){
  const c=document.createElement('canvas'); c.width=c.height=16; const g=c.getContext('2d'); g.imageSmoothingEnabled=false;
  g.fillStyle='#1b2b8d'; g.fillRect(2,4,12,8);
  g.fillStyle='#fff'; g.fillRect(2,6,12,2);
  g.fillStyle='#ff3333'; g.fillRect(3,11,3,2); g.fillRect(10,11,3,2);
  g.fillStyle='#aee7ff'; g.fillRect(4,12,8,3);
  return c;
}