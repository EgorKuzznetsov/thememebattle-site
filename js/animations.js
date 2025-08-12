window.addEventListener('load', ()=>{
  const items = [...document.querySelectorAll('.char, .btn-join')];
  items.forEach((el,i)=>{
    el.style.opacity = '0';
    el.style.transform += ' translateY(12px)';
    setTimeout(()=>{
      el.style.transition = 'opacity .5s ease, transform .5s ease';
      el.style.opacity = '1';
      el.style.transform = el.style.transform.replace(' translateY(12px)','');
    }, 120 + i*60);
  });
});