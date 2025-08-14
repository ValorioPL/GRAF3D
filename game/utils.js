function clamp(x,a,b){ return x<a?a:(x>b?b:x); }
function dist2(ax,ay,bx,by){ const dx=ax-bx,dy=ay-by; return dx*dx+dy*dy; }
function randi(a,b){ return (Math.random()*(b-a+1)|0)+a; }
function inBounds(arr,x,y){ return y>=0 && y<arr.length && x>=0 && x<arr[0].length; }
function makeRNG(seed){ let t=seed>>>0; return function(){ t+=0x6D2B79F5; let r=Math.imul(t^t>>>15,1|t); r^=r+Math.imul(r^r>>>7,61|r); return ((r^r>>>14)>>>0)/4294967296; }; }

