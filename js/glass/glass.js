/* Vander — kaca Tier-2: lensa kapsul tab bar yang meluncur & sedikit meregang */
export function initLens(nav){
  if(!nav) return {move(){}};
  const lens=document.createElement('div');
  lens.className='tab-lens';
  nav.prepend(lens);
  let t=null;
  const move=()=>{
    const a=nav.querySelector('a.active');
    if(!a){lens.style.width='0px';return}
    const nr=nav.getBoundingClientRect();
    const ar=a.getBoundingClientRect();
    lens.classList.add('moving');
    lens.style.width=ar.width+'px';
    lens.style.transform=`translateX(${ar.left-nr.left}px)`;
    clearTimeout(t);
    t=setTimeout(()=>lens.classList.remove('moving'),320);
  };
  /* tunggu font/layout stabil */
  requestAnimationFrame(move);
  setTimeout(move,350);
  window.addEventListener('resize',move);
  if(document.fonts?.ready) document.fonts.ready.then(()=>move());
  return {move};
}
