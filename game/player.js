function updatePlayer(dt){
  let forward=(keys['KeyW']?1:0) + (keys['KeyS']?-1:0);
  let strafe=(keys['KeyD']?1:0) + (keys['KeyA']?-1:0);
  let rot=(keys['KeyE']?1:0) + (keys['KeyQ']?-1:0);
  player.dir += rot * ROT_SPEED * dt;
  const fdx=Math.cos(player.dir), fdy=Math.sin(player.dir);
  const rdx=Math.cos(player.dir+Math.PI/2), rdy=Math.sin(player.dir+Math.PI/2);
  const onRoad = (world.floors[player.y|0] && ([FLOOR_ROAD,FLOOR_CROSS_H,FLOOR_CROSS_V].includes(world.floors[player.y|0][player.x|0])));
  const speedMul = onRoad ? ROAD_SPEED_MULT : 1.0;
  let nx=player.x + (fdx*forward*MOVE_SPEED + rdx*strafe*STRAFE_SPEED) * dt * speedMul;
  let ny=player.y + (fdy*forward*MOVE_SPEED + rdy*strafe*STRAFE_SPEED) * dt * speedMul;
  if(!isBlocked(nx,player.y)) player.x=nx;
  if(!isBlocked(player.x,ny)) player.y=ny;

  if(keys['Space']||mouseDown){ fireSpray(dt); renderSprayOverlay(); }
  if(keys['KeyT']){ tryTag(); }
}