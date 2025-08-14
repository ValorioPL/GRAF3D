function isBlocked(nx,ny, radius=PLAYER_RADIUS, ignore=null){
  const ix=nx|0, iy=ny|0;
  if(ix<0||iy<0||ix>=world.width||iy>=world.height) return true;
  for(let y=iy-1;y<=iy+1;y++) for(let x=ix-1;x<=ix+1;x++){
    if(!inBounds(world.walls,x,y)) continue;
    if(world.walls[y][x]!==WALL_NONE){
      const cx=x+0.5, cy=y+0.5;
      if(Math.abs(nx-cx)<0.5+radius && Math.abs(ny-cy)<0.5+radius) return true;
    }
  }
  for(const c of cars){ if(ignore===c) continue; if(dist2(nx,ny,c.x,c.y)<(radius+CAR_RADIUS)**2) return true; }
  for(const e of cops){ if(ignore===e) continue; if(dist2(nx,ny,e.x,e.y)<(radius+NPC_RADIUS)**2) return true; }
  for(const e of civilians){ if(ignore===e) continue; if(dist2(nx,ny,e.x,e.y)<(radius+NPC_RADIUS)**2) return true; }
  return false;
}
function tryTag(){
  for(const t of world.tags){
    if(t.done) continue;
    const d2 = dist2(player.x,player.y,t.x,t.y);
    if(d2 < 1.0){
      const ang=Math.atan2(t.y-player.y, t.x-player.x);
      const diff=Math.atan2(Math.sin(ang-player.dir), Math.cos(ang-player.dir));
      if(Math.abs(diff) < Math.PI/4){
        t.done=true;
        let dx=0,dy=0; if(t.face==='N') dy=-0.12; else if(t.face==='S') dy=0.12; else if(t.face==='W') dx=-0.12; else dx=0.12;
        world.decals.push({x:t.x+dx, y:t.y+dy, img:(RNG()<0.5?world.textures.tagA:world.textures.tagB)});
        player.spray = clamp(player.spray+2, 0, 100);
        break;
      }
    }
  }
  const done=world.tags.filter(t=>t.done).length;
  if(done>=world.tags.length && world.tags.length>0){ document.getElementById('win').classList.add('show'); paused=true; }
}
function fireSpray(dt){
  if(player.spray<=0) return;
  player.spray = clamp(player.spray - 20*dt, 0, 100);
  function affect(list){
    for(const e of list){
      const dx=e.x-player.x, dy=e.y-player.y; const d=Math.hypot(dx,dy);
      if(d>SPRAY_RANGE) continue;
      const ang=Math.atan2(dy,dx);
      const diff=Math.atan2(Math.sin(ang-player.dir), Math.cos(ang-player.dir));
      if(Math.abs(diff)>SPRAY_ANGLE) continue;
      const hit = castRay(player.x,player.y,ang);
      if(hit.dist > d-0.1){
        if(e.state!==undefined){ e.state='stunned'; e.stunT=STUN_TIME; } else e.stunT=STUN_TIME;
      }
    }
  }
  affect(civilians); affect(cops);
}
function updateCivilianAI(dt){
  for(const c of civilians){
    if(c.stunT>0){ c.stunT-=dt; continue; }
    if(RNG()<0.02) c.dir += (RNG()-0.5)*1.2;
    const speed=1.2;
    let nx=c.x + Math.cos(c.dir)*speed*dt;
    let ny=c.y + Math.sin(c.dir)*speed*dt;
    const fx=nx|0, fy=ny|0;
    if(!inBounds(world.floors,fx,fy) || world.floors[fy][fx]!==FLOOR_SIDEWALK || isBlocked(nx,ny,NPC_RADIUS,c)){
      c.dir += (Math.PI/2) * (RNG()<0.5?-1:1); continue;
    }
    c.x=nx; c.y=ny;
  }
}
function updatePoliceAI(dt){
  for(const p of cops){
    if(p.state==='stunned'){ p.stunT-=dt; if(p.stunT<=0){ p.state='patrol'; p.stunT=0; } continue; }
    const dx=player.x-p.x, dy=player.y-p.y; const d=Math.hypot(dx,dy);
    if(d<6){ const ang=Math.atan2(dy,dx); const hit=castRay(p.x,p.y,ang); if(hit.dist>d-0.1){ p.state='chase'; } }
    if(p.state==='chase'){
      p.dir = Math.atan2(player.y-p.y, player.x-p.x);
      const speed=1.5;
      let nx=p.x + Math.cos(p.dir)*speed*dt;
      let ny=p.y + Math.sin(p.dir)*speed*dt;
      const fx=nx|0, fy=ny|0;
      if(!inBounds(world.floors,fx,fy) || world.floors[fy][fx]===FLOOR_PARK || world.walls[fy][fx]!==WALL_NONE || isBlocked(nx,ny,NPC_RADIUS,p)){
        p.dir += (Math.random()<0.5?1:-1)*0.6; continue;
      }
      p.x=nx; p.y=ny;
      if(dist2(p.x,p.y,player.x,player.y) < (NPC_RADIUS+PLAYER_RADIUS)**2){
        player.hp = clamp(player.hp - DAMAGE_FROM_COP_TOUCH*dt, 0, 100);
        if(player.hp<=0){ document.getElementById('lose').classList.add('show'); paused=true; }
      }
    }else{
      if(RNG()<0.02) p.dir += (RNG()-0.5)*1.2;
      const speed=1.35;
      let nx=p.x + Math.cos(p.dir)*speed*dt;
      let ny=p.y + Math.sin(p.dir)*speed*dt;
      const fx=nx|0, fy=ny|0;
      if(!inBounds(world.floors,fx,fy) || world.floors[fy][fx]!==FLOOR_SIDEWALK || isBlocked(nx,ny,NPC_RADIUS,p)){
        p.dir += (Math.PI/2) * (RNG()<0.5?-1:1); continue;
      }
      p.x=nx; p.y=ny;
    }
  }
}
function updateVehicleAI(dt){
  for(const v of cars){
    const speed=v.speed;
    let nx=v.x + Math.cos(v.dir)*speed*dt;
    let ny=v.y + Math.sin(v.dir)*speed*dt;
    const fx=nx|0, fy=ny|0;
    if(!inBounds(world.floors,fx,fy) || (world.floors[fy][fx]!==FLOOR_ROAD && world.floors[fy][fx]!==FLOOR_CROSS_H && world.floors[fy][fx]!==FLOOR_CROSS_V) || isBlocked(nx,ny,CAR_RADIUS,v)){
      const choices=[];
      const left=v.dir - Math.PI/2, right=v.dir + Math.PI/2;
      function canDir(dir){
        const tx = v.x + Math.cos(dir)*0.8, ty = v.y + Math.sin(dir)*0.8;
        const ix=tx|0, iy=ty|0;
        return inBounds(world.floors,ix,iy) && (world.floors[iy][ix]===FLOOR_ROAD || world.floors[iy][ix]===FLOOR_CROSS_H || world.floors[iy][ix]===FLOOR_CROSS_V);
      }
      if(canDir(left)) choices.push(left);
      if(canDir(right)) choices.push(right);
      if(choices.length>0) v.dir = choices[randi(0,choices.length-1)];
      else v.dir += Math.PI;
      continue;
    }
    v.x=nx; v.y=ny;
    if(v.type==='police') v.flashPhase += dt*6;
    if(dist2(v.x,v.y,player.x,player.y) < (CAR_RADIUS+PLAYER_RADIUS)**2){
      player.hp = clamp(player.hp - DAMAGE_FROM_CAR*dt, 0, 100);
      if(player.hp<=0){ document.getElementById('lose').classList.add('show'); paused=true; }
    }
  }
}
