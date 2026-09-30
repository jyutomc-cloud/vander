/* Vander — Jamendo (opsional): aktif hanya jika JAMENDO_CLIENT_ID dipasang di Vercel */
import { httpJSON, proxied } from './http.js';
import { trackFromJamendo } from './normalize.js';

let enabled=null;
export async function isEnabled(){
  if(enabled!==null) return enabled;
  try{
    await httpJSON(proxied('https://api.jamendo.com/v3.0/tracks/?limit=1&format=json',3600),{ttl:3600,retries:0,timeout:5000});
    enabled=true;
  }catch{ enabled=false }
  return enabled;
}
export async function popular(limit=12){
  if(!await isEnabled()) return [];
  try{
    const d=await httpJSON(proxied(`https://api.jamendo.com/v3.0/tracks/?limit=${limit}&order=popularity_week&format=json`,1800),{ttl:1800});
    return (d?.results||[]).map(trackFromJamendo).filter(Boolean);
  }catch{ return [] }
}
