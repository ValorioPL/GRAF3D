/* ========= Init ========= */
function buildArt(){
  world.textures.brick=createBrickTexture(64);
  world.textures.concrete=createConcreteTexture(64);
  world.textures.glass=createGlassTexture(64);
  world.textures.asphalt=createAsphaltTexture(64);
  world.textures.sidewalk=createSidewalkTexture(64);
  world.textures.park=createParkTexture(64);
  world.textures.crossV=createCrosswalkTextureV(64);
  world.textures.crossH=createCrosswalkTextureH(64);
  world.textures.spray=createSprayTexture(96);
  world.textures.tagA=createTagTexture('NY90',48,32);
  world.textures.tagB=createTagTexture('DOOM',48,32);

  world.sprites.police=createPoliceSprite();
  world.sprites.pcarFrontOn=createPoliceCarFront(true);
  world.sprites.pcarFrontOff=createPoliceCarFront(false);
  world.sprites.pcarBack=createPoliceCarBack();
}
function spawnEntities(){
  civilians.length=0; cops.length=0; cars.length=0;
  const civN = Math.max(10, Math.min(30, (world.width*world.height/450)|0));
  const copN = Math.max(4, Math.min(12, (world.width*world.height/1200)|0));
  const carN = Math.max(6, Math.min(16, (world.width*world.height/900)|0));
  for(let i=0;i<civN;i++){
    let safe=3000,x=0,y=0; while(safe-->0){ x=randi(0,world.width-1)+0.5; y=randi(0,world.height-1)+0.5;
      if(inBounds(world.floors,x|0,y|0) && world.floors[y|0][x|0]===FLOOR_SIDEWALK && !isBlocked(x,y,NPC_RADIUS,null)) break; }
    civilians.push({x,y,dir:RNG()*Math.PI*2,stunT:0,sprite:createCivilianSprite()});
  }
  for(let i=0;i<copN;i++){
    let safe=3000,x=0,y=0; while(safe-->0){ x=randi(0,world.width-1)+0.5; y=randi(0,world.height-1)+0.5;
      if(inBounds(world.floors,x|0,y|0) && world.floors[y|0][x|0]===FLOOR_SIDEWALK && !isBlocked(x,y,NPC_RADIUS,null)) break; }
    cops.push({x,y,dir:RNG()*Math.PI*2,state:'patrol',stunT:0});
  }
  for(let i=0;i<carN;i++){
    let safe=3000,x=0,y=0; while(safe-->0){ x=randi(0,world.width-1)+0.5; y=randi(0,world.height-1)+0.5;
      const f = inBounds(world.floors,x|0,y|0) ? world.floors[y|0][x|0] : 0;
      if((f===FLOOR_ROAD || f===FLOOR_CROSS_H || f===FLOOR_CROSS_V) && !isBlocked(x,y,CAR_RADIUS,null)) break; }
    const isPolice=RNG()<0.25;
    const dir=[0,Math.PI/2,Math.PI,-Math.PI/2][randi(0,3)];
    if(isPolice){
      cars.push({x,y,dir,speed:2.3,type:'police',flashPhase:RNG()*Math.PI*2});
    }else{
      const color=`hsl(${randi(0,360)},70%,55%)`;
      cars.push({x,y,dir,speed:1.8,type:'civil',
                 spriteFront:createCarFront(color), spriteBack:createCarBack(color)});
    }
  }
}
function init(){
  try{
    RNG = makeRNG(SEED);
    buildArt();
    const city = generateCityMap(randi(6,9), randi(5,7));
    Object.assign(world, {width:city.width, height:city.height, walls:city.walls, floors:city.floors, tags:city.tags, spawn:city.spawn});
    player.x=world.spawn.x; player.y=world.spawn.y; player.dir=RNG()*Math.PI*2; player.hp=100; player.spray=100;
    spawnEntities();
    document.getElementById('tagNeed').textContent=world.tags.length;
  }catch(e){ console.error("Initialization error:", e); alert("Błąd inicjalizacji. Odśwież stronę (F5)."); }
}

/* ========= Loop ========= */
let lastT=performance.now(), fpsAcc=0, fpsCount=0;
function tick(ts){
  const dt = clamp((ts-lastT)/1000, 0, 0.05); lastT=ts;
  if(!paused){
    try{
      updatePlayer(dt);
      updateCivilianAI(dt);
      updatePoliceAI(dt);
      updateVehicleAI(dt);
      render3D();
      renderSprites();
      renderMinimap();
      updateHUD();
    }catch(e){ console.error("Frame error:", e); }
  }
  fpsAcc+=dt; fpsCount++; if(fpsAcc>=0.5){ document.getElementById('fps').textContent=(fpsCount/fpsAcc|0); fpsAcc=0; fpsCount=0; }
  requestAnimationFrame(tick);
}

/* ========= Start ========= */
(function start(){ init(); requestAnimationFrame(tick); })();

/* ========= Safety logs ========= */
addEventListener('error', e=>console.error("Uncaught error:", e.message, e.filename, e.lineno, e.colno));
addEventListener('unhandledrejection', e=>console.error("Unhandled promise rejection:", e.reason));
