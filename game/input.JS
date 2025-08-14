const keys = Object.create(null);
let mouseDown = false;
addEventListener('keydown', e=>{ keys[e.code]=true; if(e.code==='KeyH'){ const d=document.getElementById('help'); d.open=!d.open; } if(e.code==='KeyP'){ paused=!paused; }});
addEventListener('keyup', e=>{ keys[e.code]=false; });
view.addEventListener('mousedown', e=>{ if(e.button===0) mouseDown = true; });
addEventListener('mouseup', e=>{ if(e.button===0) mouseDown = false; });