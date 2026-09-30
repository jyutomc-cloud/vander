/* Vander — Radio Browser: stasiun Indonesia, hanya stream https */
import { httpJSON } from './http.js';
import { stationFromRadio } from './normalize.js';

const FALLBACK='https://de1.api.radio-browser.info';
let serverP=null;
function server(){
  if(!serverP) serverP=(async()=>{
    try{
      const d=await httpJSON('https://all.api.radio-browser.info/json/servers',{ttl:86400,timeout:5000,retries:0});
      const hs=(d||[]).map(x=>x.name).filter(Boolean).map(n=>'https://'+n);
      if(hs.length){const h=hs[Math.floor(Math.random()*hs.length)];localStorage.setItem('vander:rb',h);return h;}
    }catch{}
    return localStorage.getItem('vander:rb')||FALLBACK;
  })();
  return serverP;
}
export async function searchStations({tag,name,countrycode='ID',limit=60}={}){
  const base=await server();
  const p=new URLSearchParams({hidebroken:'true',order:'clickcount',reverse:'true',limit:String(limit)});
  if(countrycode) p.set('countrycode',countrycode);
  if(tag) p.set('tag',tag);
  if(name) p.set('name',name);
  try{
    const d=await httpJSON(`${base}/json/stations/search?${p}`,{ttl:900});
    return (d||[]).map(stationFromRadio).filter(Boolean);
  }catch(e){
    if(base!==FALLBACK){
      serverP=null;
      const d=await httpJSON(`${FALLBACK}/json/stations/search?${p}`,{ttl:900});
      return (d||[]).map(stationFromRadio).filter(Boolean);
    }
    throw e;
  }
}
