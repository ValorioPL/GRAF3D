const view = document.getElementById('view');
const ctx = view.getContext('2d', { alpha:false });
const W = view.width, H = view.height;
const HALF_W = W>>1, HALF_H = H>>1;
ctx.imageSmoothingEnabled = false;

const minimap = document.getElementById('minimap');
const mctx = minimap.getContext('2d', { alpha:true });
mctx.imageSmoothingEnabled = false;

let paused = false;
