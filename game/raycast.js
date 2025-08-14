function castRay(px,py, angle){
  const mapW=world.width, mapH=world.height;
  let rayDirX=Math.cos(angle), rayDirY=Math.sin(angle);
  let mapX=px|0, mapY=py|0;
  let sideDistX, sideDistY;
  const deltaDistX=Math.abs(1/(rayDirX||1e-9));
  const deltaDistY=Math.abs(1/(rayDirY||1e-9));
  let stepX, stepY;

  if(rayDirX<0){ stepX=-1; sideDistX=(px-mapX)*deltaDistX; } else { stepX=1; sideDistX=(mapX+1-px)*deltaDistX; }
  if(rayDirY<0){ stepY=-1; sideDistY=(py-mapY)*deltaDistY; } else { stepY=1; sideDistY=(mapY+1-py)*deltaDistY; }

  let hit=false, side=0, type=WALL_NONE, guard=0;
  while(!hit && guard++<2048){
    if(sideDistX<sideDistY){ sideDistX+=deltaDistX; mapX+=stepX; side=0; }
    else { sideDistY+=deltaDistY; mapY+=stepY; side=1; }
    if(mapX<0||mapY<0||mapX>=mapW||mapY>=mapH){ hit=true; type=WALL_BRICK; break; }
    type = world.walls[mapY][mapX];
    if(type!==WALL_NONE) hit=true;
  }
  let perpWallDist = side===0 ? (mapX - px + (1 - stepX)/2) / (rayDirX||1e-9)
                              : (mapY - py + (1 - stepY)/2) / (rayDirY||1e-9);
  perpWallDist = Math.max(0.0001, perpWallDist);
  let wallX = (side===0)? (py + perpWallDist*rayDirY) : (px + perpWallDist*rayDirX);
  wallX -= Math.floor(wallX);
  let texX = (wallX*64)|0;
  if(side===0 && rayDirX>0) texX = 63-texX;
  if(side===1 && rayDirY<0) texX = 63-texX;
  return {dist:perpWallDist, side, texX, type};
}