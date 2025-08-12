// 24h таймер с привязкой к ближайшей полуночи (не сбрасывается при перезагрузке)
const H = id => document.getElementById(id);
const KEY = 'mcb_next_epoch';

function nextEpoch() {
  const now = Date.now();
  let t = Number(localStorage.getItem(KEY));
  if (!t || t <= now) {
    const d = new Date();
    d.setHours(24,0,0,0); // ближайшая полночь
    t = d.getTime();
    localStorage.setItem(KEY, String(t));
  }
  return t;
}
let target = nextEpoch();

function render() {
  const left = target - Date.now();
  if (left <= 0) { localStorage.removeItem(KEY); target = nextEpoch(); return; }
  H('h').textContent = String(Math.floor(left/3_600_000)).padStart(2,'0');
  H('m').textContent = String(Math.floor(left%3_600_000/60_000)).padStart(2,'0');
  H('s').textContent = String(Math.floor(left%60_000/1000)).padStart(2,'0');
}
render(); setInterval(render, 1000);
