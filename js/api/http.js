/* Vander — HTTP: timeout 8 dtk, 1x retry, de-dup in-flight, cache memori + sessionStorage */
const mem=new Map(), inflight=new Map();
const key=(u)=>'vhttp:'+u;

export async function httpJSON(url,{ttl=300,timeout=8000,retries=1,headers}={}){
  const now=Date.now();
  const c=mem.get(url);
  if(c&&now-c.t<c.ttl*1000) return c.d;
  try{
    const raw=sessionStorage.getItem(key(url));
    if(raw){const o=JSON.parse(raw);if(now-o.t<o.ttl*1000){mem.set(url,o);return o.d}}
  }catch{}
  if(inflight.has(url)) return inflight.get(url);
  const p=(async()=>{
    let err;
    for(let i=0;i<=retries;i++){
      try{
        const ac=new AbortController();
        const to=setTimeout(()=>ac.abort(),timeout);
        const res=await fetch(url,{signal:ac.signal,headers});
        clearTimeout(to);
        if(!res.ok) throw new Error('HTTP '+res.status);
        const d=await res.json();
        const rec={t:Date.now(),ttl,d};
        mem.set(url,rec);
        try{sessionStorage.setItem(key(url),JSON.stringify(rec))}catch{}
        return d;
      }catch(e){err=e;if(i<retries)await new Promise(r=>setTimeout(r,500*(i+1)))}
    }
    throw err;
  })();
  inflight.set(url,p);
  try{return await p}finally{inflight.delete(url)}
}
/* proxy serverless Vercel untuk sumber tanpa CORS (Deezer, LRCLIB, Jamendo, Apple RSS) */
export const proxied=(u,ttl=300)=>`/api/p?u=${encodeURIComponent(u)}&ttl=${ttl}`;
