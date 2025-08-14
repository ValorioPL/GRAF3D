/**
 * generateCityMap — siatka bloków, ulice 4× szersze od chodników; losowe parki;
 * tagi na obwodzie budynków; przejścia dla pieszych dodawane RZADKO i tylko
 * przy wybranych skrzyżowaniach (probabilistycznie), w małych "ramionach".
 */
function generateCityMap(blocksX=7, blocksY=6){
  const sidewalkW=1, roadW=4, buildingW=6;
  const mapW = roadW + blocksX*(sidewalkW*2 + buildingW) + (blocksX-1)*roadW + roadW;
  const mapH = roadW + blocksY*(sidewalkW*2 + buildingW) + (blocksY-1)*roadW + roadW;
  const walls = Array.from({length:mapH},()=>new Int8Array(mapW));
  const floors = Array.from({length:mapH},()=>new Int8Array(mapW));
  const tags = [];

  function fillRect(ax,ay,w,h, fn){
    for(let y=ay;y<ay+h;y++){ if(y<0||y>=mapH) continue;
      for(let x=ax;x<ax+w;x++){ if(x<0||x>=mapW) continue; fn(x,y); }
    }
  }
  // default: road
  for(let y=0;y<mapH;y++) for(let x=0;x<mapW;x++) floors[y][x]=FLOOR_ROAD;

  let yCursor = roadW;
  for(let by=0; by<blocksY; by++){
    // top sidewalk
    fillRect(0, yCursor, mapW, sidewalkW, (x,y)=>{ floors[y][x]=FLOOR_SIDEWALK; });
    yCursor += sidewalkW;

    let xCursor = roadW;
    for(let bx=0; bx<blocksX; bx++){
      // left sidewalk
      fillRect(xCursor, yCursor, sidewalkW, buildingW, (x,y)=>{ floors[y][x]=FLOOR_SIDEWALK; });
      xCursor += sidewalkW;

      // building or park
      const isPark = RNG() < 0.16;
      const mat = [WALL_BRICK,WALL_CONCRETE,WALL_GLASS][randi(0,2)];
      if(isPark){
        fillRect(xCursor, yCursor, buildingW, buildingW, (x,y)=>{ floors[y][x]=FLOOR_PARK; walls[y][x]=WALL_NONE; });
      }else{
        fillRect(xCursor, yCursor, buildingW, buildingW, (x,y)=>{ floors[y][x]=FLOOR_SIDEWALK; walls[y][x]=mat; });
        // tags around edges
        for(let tx=0; tx<buildingW; tx+=Math.max(2, (2 + (RNG()*3|0)))) if(inBounds(floors, xCursor+tx, yCursor-1)) tags.push({x:xCursor+tx+0.5, y:yCursor-0.1, face:'N', done:false, color:`hsl(${randi(0,360)},80%,60%)`});
        for(let tx=1; tx<buildingW; tx+=Math.max(2, (2 + (RNG()*3|0)))) if(inBounds(floors, xCursor+tx, yCursor+buildingW)) tags.push({x:xCursor+tx+0.5, y:yCursor+buildingW+0.1, face:'S', done:false, color:`hsl(${randi(0,360)},80%,60%)`});
        for(let ty=1; ty<buildingW; ty+=Math.max(2, (2 + (RNG()*3|0)))) if(inBounds(floors, xCursor-1, yCursor+ty)) tags.push({x:xCursor-0.1, y:yCursor+ty+0.5, face:'W', done:false, color:`hsl(${randi(0,360)},80%,60%)`});
        for(let ty=0; ty<buildingW; ty+=Math.max(2, (2 + (RNG()*3|0)))) if(inBounds(floors, xCursor+buildingW, yCursor+ty)) tags.push({x:xCursor+buildingW+0.1, y:yCursor+ty+0.5, face:'E', done:false, color:`hsl(${randi(0,360)},80%,60%)`});
      }

      xCursor += buildingW;
      // right sidewalk
      fillRect(xCursor, yCursor, sidewalkW, buildingW, (x,y)=>{ floors[y][x]=FLOOR_SIDEWALK; });
      xCursor += sidewalkW;

      // vertical road between blocks
      if(bx < blocksX-1){
        fillRect(xCursor, yCursor-sidewalkW, roadW, buildingW+2*sidewalkW, (x,y)=>{ floors[y][x]=FLOOR_ROAD; walls[y][x]=WALL_NONE; });
        xCursor += roadW;
      }
    }

    // bottom sidewalk
    fillRect(0, yCursor+buildingW, mapW, sidewalkW, (x,y)=>{ floors[y][x]=FLOOR_SIDEWALK; });
    yCursor += buildingW + sidewalkW;

    // horizontal road between block rows
    if(by < blocksY-1){
      fillRect(0, yCursor, mapW, roadW, (x,y)=>{ floors[y][x]=FLOOR_ROAD; walls[y][x]=WALL_NONE; });
      yCursor += roadW;
    }
  }
  // outer belt roads thicken
  for(let y=0;y<mapH;y++){ for(let x=0;x<4;x++){ floors[y][x]=FLOOR_ROAD; floors[y][mapW-1-x]=FLOOR_ROAD; } }

  /* ---- Crosswalks: choose RARE intersections only, then paint tiny bands ----
     Heurystyka:
      - komórka jest skrzyżowaniem jeśli N/S/E/W to ROAD
      - losowość: tylko ~8% takich komórek
      - dodatkowo anti-cluster: jeśli w promieniu 3 już jest crosswalk, pomiń
      - malujemy mały plusik: H i V po 3×3 kafle — nie rozlewa się po ulicach
  */
  function areaHasCrosswalk(cx,cy){
    for(let yy=cy-3; yy<=cy+3; yy++)
      for(let xx=cx-3; xx<=cx+3; xx++)
        if(inBounds(floors,xx,yy) && (floors[yy][xx]===FLOOR_CROSS_H || floors[yy][xx]===FLOOR_CROSS_V)) return true;
    return false;
  }
  for(let y=2;y<mapH-2;y++){
    for(let x=2;x<mapW-2;x++){
      if(floors[y][x]!==FLOOR_ROAD) continue;
      if(!(floors[y-1][x]===FLOOR_ROAD && floors[y+1][x]===FLOOR_ROAD && floors[y][x-1]===FLOOR_ROAD && floors[y][x+1]===FLOOR_ROAD)) continue;
      if(RNG() > 0.08) continue;               // rzadko
      if(areaHasCrosswalk(x,y)) continue;      // anti-cluster

      // poziome ramię (3x3 w poziomie)
      for(let dx=-1; dx<=1; dx++)
        for(let t=-1; t<=1; t++){
          const xx=x+dx, yy=y+t;
          if(inBounds(floors,xx,yy) && floors[yy][xx]===FLOOR_ROAD) floors[yy][xx]=FLOOR_CROSS_H;
        }
      // pionowe ramię (3x3 w pionie)
      for(let dy=-1; dy<=1; dy++)
        for(let t=-1; t<=1; t++){
          const xx=x+t, yy=y+dy;
          if(inBounds(floors,xx,yy) && floors[yy][xx]===FLOOR_ROAD) floors[yy][xx]=FLOOR_CROSS_V;
        }
    }
  }

  // spawn on sidewalk
  let sx=2, sy=2, safety=5000;
  while(safety-->0){
    sx = randi(4, mapW-5); sy = randi(4, mapH-5);
    if(inBounds(walls,sx,sy) && walls[sy][sx]===WALL_NONE && floors[sy][sx]===FLOOR_SIDEWALK) break;
  }
  return {width:mapW, height:mapH, walls, floors, tags, spawn:{x:sx+0.5,y:sy+0.5}};
}
