function render3D(){
  drawFloor();

  const dirX=Math.cos(player.dir), dirY=Math.sin(player.dir);
  const planeX=Math.cos(player.dir + Math.PI/2) * Math.tan(FOV/2);
  const planeY=Math.sin(player.dir + Math.PI/2) * Math.tan(FOV/2);

  const texBrick=world.textures.brick, texConc=world.textures.concrete, texGlass=world.textures.glass;

  for(let x=0;x<W;x++){
    const cameraX = 2 * x / W - 1;
    const rayDirX = dirX + planeX * cameraX;
    const rayDirY = dirY + planeY * cameraX;
    const a = Math.atan2(rayDirY, rayDirX);
    const hit = castRay(player.x, player.y, a);

    const perpDist = hit.dist;
    zBuffer[x] = perpDist;

    let lineH = (H / perpDist)|0;
    let drawStart = -lineH/2 + HALF_H; if(drawStart<0) drawStart=0;
    let drawEnd   =  lineH/2 + HALF_H; if(drawEnd>=H) drawEnd=H-1;

    const texX = clamp(hit.texX|0,0,63);
    let src = texBrick; if(hit.type===WALL_CONCRETE) src=texConc; else if(hit.type===WALL_GLASS) src=texGlass;
    try{ ctx.drawImage(src, texX, 0, 1, 64, x, drawStart, 1, drawEnd-drawStart); }catch(_){}

    const shade = clamp(perpDist/14,0,0.7) + (hit.side?0.06:0);
    if(shade>0){ ctx.globalAlpha=shade; ctx.fillStyle='#000'; ctx.fillRect(x, drawStart, 1, drawEnd-drawStart); ctx.globalAlpha=1; }
  }
}
