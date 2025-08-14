function renderMinimap(){
  const mw=world.width, mh=world.height;
  const sx=minimap.width/mw, sy=minimap.height/mh;
  mctx.clearRect(0,0,minimap.width,minimap.height);
  mctx.fillStyle='#061019'; mctx.fillRect(0,0,minimap.width,minimap.height);
  for(let y=0;y<mh;y++) for(let x=0;x<mw;x++){
    const fx=(x*sx)|0, fy=(y*sy)|0;
    const f=world.floors[y][x];
    if(f===FLOOR_ROAD) mctx.fillStyle='#1b1f24';
    else if(f===FLOOR_SIDEWALK) mctx.fillStyle='#b6c1c7';
    else if(f===FLOOR_PARK) mctx.fillStyle='#1f4d1f';
    else mctx.fillStyle='#f6f6f6';
    mctx.fillRect(fx,fy, Math.ceil(sx), Math.ceil(sy));
    if(world.walls[y][x]!==WALL_NONE){ mctx.fillStyle='#aa3333'; mctx.fillRect(fx,fy, Math.ceil(sx), Math.ceil(sy)); }
  }
  for(const t of world.tags){ mctx.fillStyle = t.done?'#39ff14':'#ffcc00'; mctx.fillRect((t.x*sx)|0-1,(t.y*sy)|0-1,3,3); }
  function dot(x,y,col){ mctx.fillStyle=col; mctx.fillRect((x*sx)|0-1,(y*sy)|0-1,3,3); }
  for(const c of civilians) dot(c.x,c.y,'#ffffff');
  for(const c of cops) dot(c.x,c.y,'#2d3cff');
  for(const c of cars) dot(c.x,c.y, c.type==='police'?'#2d3cff':'#ff66aa');
  mctx.fillStyle='#39ff14'; mctx.beginPath(); const px=player.x*sx, py=player.y*sy; mctx.arc(px,py,3,0,Math.PI*2); mctx.fill();
  mctx.strokeStyle='#39ff14'; mctx.beginPath(); mctx.moveTo(px,py); mctx.lineTo(px+Math.cos(player.dir)*8, py+Math.sin(player.dir)*8); mctx.stroke();
}