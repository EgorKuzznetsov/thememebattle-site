document.getElementById('year').textContent = new Date().getFullYear();

// Лёгкий параллакс (не ломает раскладку)
const chars = [...document.querySelectorAll('.char')];
function parallax(x,y){
  const cx=(x/innerWidth-.5), cy=(y/innerHeight-.5);
  chars.forEach(el=>{ el.style.transform = `translate3d(${(-cx*6)}px, ${(-cy*4)}px, 0)`; });
}
addEventListener('mousemove',e=>parallax(e.clientX,e.clientY),{passive:true});
addEventListener('deviceorientation',e=>{
  if(e.beta==null||e.gamma==null) return;
  parallax((e.gamma+45)/90*innerWidth,(e.beta+45)/90*innerHeight);
},{passive:true});
