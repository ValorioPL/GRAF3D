function updateHUD(){
  const hp=clamp(player.hp,0,100)|0, sp=clamp(player.spray,0,100)|0;
  document.getElementById('hpLabel').textContent=hp;
  document.getElementById('sprayLabel').textContent=sp;
  document.getElementById('hpFill').style.width=hp+'%';
  document.getElementById('sprayFill').style.width=sp+'%';
  const done=world.tags.filter(t=>t.done).length;
  document.getElementById('tagDone').textContent=done;
  document.getElementById('tagNeed').textContent=world.tags.length;
}