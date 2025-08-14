let RNG = Math.random;
let SEED = (Date.now() ^ (Math.random()*1e9|0)) >>> 0;
document.getElementById('seedLabel').textContent = "seed " + SEED;

const WALL_NONE=0, WALL_BRICK=1, WALL_CONCRETE=2, WALL_GLASS=3;
const FLOOR_SIDEWALK=1, FLOOR_ROAD=2, FLOOR_PARK=3, FLOOR_CROSS_V=4, FLOOR_CROSS_H=5;

const world = {
  width:0, height:0,
  walls: [], floors: [],
  tags: [], decals: [],
  textures: {}, sprites:{},
  spawn:{x:2.5,y:2.5}
};

const player = { x:2.5, y:2.5, dir:0, hp:100, spray:100 };

const civilians = [];
const cops = [];
const cars = [];