// Лёгкий рендер графика + CoinGecko. Плавная деградация, если API не отвечает.
const ctx = document.getElementById('priceChart').getContext('2d', {alpha:false});
const state = {maxPoints:150, bonk:[], pump:[], labels:[]};

function fit() {
  const dpr = devicePixelRatio || 1;
  const {clientWidth:w, clientHeight:h} = ctx.canvas;
  ctx.canvas.width  = Math.round(w*dpr);
  ctx.canvas.height = Math.round(h*dpr);
  ctx.setTransform(dpr,0,0,dpr,0,0);
  draw();
}
addEventListener('resize', fit, {passive:true}); fit();

function draw(){
  const {width,height} = ctx.canvas;
  ctx.clearRect(0,0,width,height);
  ctx.fillStyle='#0b0f17'; ctx.fillRect(0,0,width,height);

  ctx.strokeStyle='#22304a'; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(40,10); ctx.lineTo(40,height-30); ctx.lineTo(width-10,height-30); ctx.stroke();

  const padL=40,padR=10,padT=10,padB=30,w=width-padL-padR,h=height-padT-padB;
  const maxY=Math.max(1,...state.bonk,...state.pump),
        minY=Math.min(...state.bonk,...state.pump,maxY-1);
  const toX=i=>padL+(i/Math.max(1,state.labels.length-1))*w;
  const toY=v=>padT+(1-(v-minY)/Math.max(1e-9,(maxY-minY)))*h;

  ctx.strokeStyle='#1b2640'; ctx.setLineDash([4,6]);
  for(let i=0;i<5;i++){const y=padT+i*(h/4); ctx.beginPath(); ctx.moveTo(padL,y); ctx.lineTo(width-padR,y); ctx.stroke();}
  ctx.setLineDash([]);

  function line(d,color){
    ctx.strokeStyle=color; ctx.lineWidth=2; ctx.beginPath();
    d.forEach((v,i)=>{const x=toX(i), y=toY(v); i?ctx.lineTo(x,y):ctx.moveTo(x,y)}); ctx.stroke();
  }
  line(state.bonk,'#ffd24a'); line(state.pump,'#3fb0ff');

  ctx.fillStyle='#ffd24a'; ctx.fillRect(width-160,18,12,12); ctx.fillStyle='#fff'; ctx.fillText('BONK',width-142,28);
  ctx.fillStyle='#3fb0ff'; ctx.fillRect(width-90,18,12,12); ctx.fillStyle='#fff'; ctx.fillText('PUMP',width-72,28);
}

async function fetchPrice(id){
  try{
    const r = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`,{cache:'no-store'});
    if(!r.ok) throw 0; const d = await r.json(); const v = d?.[id]?.usd;
    return typeof v==='number' ? v : null;
  }catch{ return null; }
}
function push(arr,v){ if(arr.length>=state.maxPoints) arr.shift(); arr.push(v); }

async function poll(){
  const [b,p] = await Promise.all([fetchPrice('bonk'), fetchPrice('pump')]);
  const lb = state.bonk.at(-1) ?? 1, lp = state.pump.at(-1) ?? 1.2;
  push(state.bonk, b ?? lb*(1+(Math.random()-.5)*0.01));
  push(state.pump, p ?? lp*(1+(Math.random()-.5)*0.01));
  push(state.labels, new Date().toLocaleTimeString());
  if(state.labels.length>state.maxPoints) state.labels.shift();
  draw();
}

for(let i=0;i<20;i++){ push(state.bonk,1+Math.random()*0.05); push(state.pump,1.2+Math.random()*0.05); push(state.labels,''); }
draw(); poll(); setInterval(poll, 10_000);

// ссылки на покупку — подставь свои
document.getElementById('buy-bonk').href = '#';
document.getElementById('buy-pump').href = '#';
