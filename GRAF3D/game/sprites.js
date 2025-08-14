function renderSprites(){
  const all=[];
  for(const p of civilians) all.push({x:p.x,y:p.y,img:p.sprite,size:0.65,dist:dist2(player.x,player.y,p.x,p.y),shade:(p.stunT>0?0.4:0)});
  for(const p of cops) all.push({x:p.x,y:p.y,img:world.sprites.police,size:0.85,dist:dist2(player.x,player.y,p.x,p.y),shade:(p.state==='stunned'?0.5:0)});
  // cars choose front/back depending on approaching the player
  for(const c of cars){
    const toPlayerX = player.x - c.x, toPlayerY = player.y - c.y;
    const carDirX = Math.cos(c.dir), carDirY = Math.sin(c.dir);
    const dot = carDirX*toPlayerX + carDirY*toPlayerY; // >0 → heading toward us
    let img;
    if(c.type==='police'){
      img = (dot>0) ? ((Math.sin(c.flashPhase)>0)?world.sprites.pcarFrontOn:world.sprites.pcarFrontOff)
                    : world.sprites.pcarBack;
    }else{
      img = (dot>0) ? c.spriteFront : c.spriteBack;
    }
    all.push({x:c.x,y:c.y,img,size:1.2,dist:dist2(player.x,player.y,c.x,c.y),shade:0});
  }
  for(const d of world.decals) all.push({x:d.x,y:d.y,img:d.img,size:0.8,dist:dist2(player.x,player.y,d.x,d.y),shade:0.2});
  all.sort((a,b)=>b.dist-a.dist);

  const dirX=Math.cos(player.dir), dirY=Math.sin(player.dir);
  const planeX=Math.cos(player.dir + Math.PI/2) * Math.tan(FOV/2);
  const planeY=Math.sin(player.dir + Math.PI/2) * Math.tan(FOV/2);
  const invDet = 1.0 / (planeX*dirY - dirX*planeY + 1e-9);

  for(const s of all){
    const spriteX = s.x - player.x, spriteY = s.y - player.y;
    const transformX = invDet * (dirY * spriteX - dirX * spriteY);
    const transformY = invDet * (-planeY * spriteX + planeX * spriteY);
    if(transformY <= 0.01) continue;

    const screenX = (W/2) * (1 + transformX/transformY);
    const spriteH = Math.abs((H / transformY) * s.size)|0;
    const drawStartY = clamp((-spriteH/2 + HALF_H)|0, 0, H-1);
    const drawEndY   = clamp(( spriteH/2 + HALF_H)|0, 0, H-1);
    const spriteW = spriteH;
    const drawStartX = clamp((-spriteW/2 + screenX)|0, 0, W-1);
    const drawEndX   = clamp(( spriteW/2 + screenX)|0, 0, W-1);

    for(let stripe=drawStartX; stripe<drawEndX; stripe++){
      const texX = Math.floor((stripe - (-spriteW/2 + screenX)) * 16 / spriteW);
      if(transformY>0 && stripe>0 && stripe<W && transformY < zBuffer[stripe]){
        try{
          ctx.drawImage(s.img, texX, 0, 1, 16, stripe, drawStartY, 1, drawEndY-drawStartY);
          if(s.shade>0){ ctx.globalAlpha=s.shade; ctx.fillStyle='#000'; ctx.fillRect(stripe,drawStartY,1,drawEndY-drawStartY); ctx.globalAlpha=1; }
        }catch(_){}
      }
    }
  }
}
function renderSprayOverlay(amount=1){
  ctx.globalAlpha = 0.25 * amount;
  const spr=world.textures.spray; const size=Math.min(W,H)*0.8;
  ctx.drawImage(spr, 0,0,spr.width,spr.height, HALF_W-size/2, HALF_H-size/3, size, size);
  ctx.globalAlpha = 1;
}
