/* Vander — LRCLIB: lirik polos & sinkron (lewat /api/p, cache 24 jam) */
import { httpJSON, proxied } from './http.js';

const TTL=86400;
function shape(d){
  if(!d) return null;
  if(d.statusCode===404||(!d.plainLyrics&&!d.syncedLyrics)) return null;
  return {plain:d.plainLyrics||null,synced:d.syncedLyrics||null,duration:d.duration||0};
}
export async function getLyrics(track){
  const q=new URLSearchParams({artist_name:track.artist||'',track_name:track.title||''});
  if(track.album) q.set('album_name',track.album);
  if(track.durationSec) q.set('duration',String(Math.round(track.durationSec)));
  try{
    const d=await httpJSON(proxied(`https://lrclib.net/api/get?${q}`,TTL),{ttl:TTL,retries:0});
    const s=shape(d); if(s) return s;
  }catch{}
  try{
    const q2=new URLSearchParams({artist_name:track.artist||'',track_name:track.title||''});
    const d=await httpJSON(proxied(`https://lrclib.net/api/search?${q2}`,TTL),{ttl:TTL,retries:0});
    const arr=Array.isArray(d)?d:[];
    const best=arr.find(x=>Math.abs((x.duration||0)-(track.durationSec||0))<=3)||arr[0];
    return shape(best);
  }catch{ return null }
}
