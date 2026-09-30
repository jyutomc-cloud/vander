/* Vander — latar ambient mengikuti palet sampul lagu yang diputar */
import { paletteFromImage } from './palette.js';
export function initAmbient(player){
  let seq=0;
  player.addEventListener('track',async()=>{
    const t=player.current;
    const my=++seq;
    const p=t?await paletteFromImage(t.art?.m||t.art?.s):null;
    if(my!==seq) return;
    const r=document.documentElement.style;
    r.setProperty('--amb1',p?p[0]:'#2A2E30');
    r.setProperty('--amb2',p?p[1]:'#151822');
  });
}
