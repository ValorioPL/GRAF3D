let zBuffer = new Float32Array(W);
function drawFloor(){
  const texAsphalt=world.textures.asphalt, texSide=world.textures.sidewalk, texPark=world.textures.park;
  const texCrossV=world.textures.crossV, texCrossH=world.textures.crossH;

  // sky
  ctx.fillStyle = '#0a0f16';
  ctx.fillRect(0,0,W,HALF_H);

  const dirX=Math.cos(player.dir), dirY=Math.sin(player.dir);
  const planeX=Math.cos(player.dir + Math.PI/2) * Math.tan(FOV/2);
  const planeY=Math.sin(player.dir + Math.PI/2) * Math.tan(FOV/2);

  const rayDirX0 = dirX - planeX, rayDirY0 = dirY - planeY;
  const rayDirX1 = dirX + planeX, rayDirY1 = dirY + planeY;

  const posX=player.x, posY=player.y, texSize=64;
  const posZ = 0.5 * H;

  for(let y=HALF_H; y<H; y++){
    const p = (y - HALF_H) || 1;
    const rowDist = posZ / p;

    const stepX = rowDist * (rayDirX1 - rayDirX0) / W;
    const stepY = rowDist * (rayDirY1 - rayDirY0) / W;

    let floorX = posX + rowDist * rayDirX0;
    let floorY = posY + rowDist * rayDirY0;

    for(let x=0; x<W; x++){
      const cellX=floorX|0, cellY=floorY|0;
      const ft = (world.floors[cellY] && world.floors[cellY][cellX]) || FLOOR_ROAD;

      let src = texAsphalt;
      if(ft===FLOOR_SIDEWALK) src = texSide;
      else if(ft===FLOOR_PARK) src = texPark;
      else if(ft===FLOOR_CROSS_V) src = texCrossV;
      else if(ft===FLOOR_CROSS_H) src = texCrossH;

      let tx = ((floorX - Math.floor(floorX)) * texSize) | 0;
      let ty = ((floorY - Math.floor(floorY)) * texSize) | 0;

      try{ ctx.drawImage(src, tx, ty, 1,1, x,y, 1,1); }catch(_){}

      floorX += stepX; floorY += stepY;
    }
    const shade = clamp((y - HALF_H) / (H*0.9),0,0.6);
    if(shade>0){ ctx.globalAlpha=shade; ctx.fillStyle='#000'; ctx.fillRect(0,y,W,1); ctx.globalAlpha=1; }
  }
}