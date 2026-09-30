/* Vander — Audius: lagu penuh gratis, CORS OK, tanpa kunci */
import { httpJSON } from './http.js';
import { trackFromAudius } from './normalize.js';

let hostP=null;
export function host(){
  if(!hostP) hostP=(async()=>{
    try{
      const d=await httpJSON('https://api.audius.co',{ttl:21600});
      const hs=(d?.data||[]).filter(Boolean);
      if(hs.length) return hs[Math.floor(Math.random()*hs.length)];
    }catch{}
    return 'https://discoveryprovider.audius.co';
  })();
  return hostP;
}
async function au(path,ttl=600){
  const h=await host();
  return httpJSON(`${h}/v1${path}${path.includes('?')?'&':'?'}app_name=Vander`,{ttl});
}
const clean=(a)=>(a||[]).filter(Boolean);

export async function trending({genre,time='week',limit=20}={}){
  const g=genre?`&genre=${encodeURIComponent(genre)}`:'';
  const d=await au(`/tracks/trending?time=${time}&limit=${limit}${g}`,1800);
  const h=await host();
  return clean((d?.data||[]).map(t=>trackFromAudius(t,h)));
}
export async function searchTracks(q,limit=15){
  const d=await au(`/tracks/search?query=${encodeURIComponent(q)}&limit=${limit}`,300);
  const h=await host();
  return clean((d?.data||[]).map(t=>trackFromAudius(t,h)));
}
