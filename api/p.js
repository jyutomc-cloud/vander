/* Vander — proxy JSON allowlist (Vercel serverless). BUKAN proxy terbuka. */
const ALLOW=new Set(['api.deezer.com','lrclib.net','api.jamendo.com','rss.marketingtools.apple.com']);

export default async function handler(req,res){
  try{
    if(req.method!=='GET') return res.status(400).json({error:'method'});
    const raw=req.query?.u;
    const ttl=Math.min(Math.max(parseInt(req.query?.ttl||'300',10)||300,0),86400);
    if(!raw) return res.status(400).json({error:'missing u'});
    let u;
    try{u=new URL(raw)}catch{return res.status(400).json({error:'bad url'})}
    if(u.protocol!=='https:') return res.status(400).json({error:'https only'});
    if(!ALLOW.has(u.hostname)) return res.status(400).json({error:'host not allowed'});
    if(u.username||u.password) return res.status(400).json({error:'no creds'});

    if(u.hostname==='api.jamendo.com'){
      const cid=process.env.JAMENDO_CLIENT_ID;
      if(!cid) return res.status(503).json({error:'jamendo disabled'});
      if(!u.searchParams.get('client_id')) u.searchParams.set('client_id',cid);
    }

    const ac=new AbortController();
    const to=setTimeout(()=>ac.abort(),8000);
    let up;
    try{
      up=await fetch(u.toString(),{
        signal:ac.signal,redirect:'error',
        headers:{'User-Agent':'Vander/1.0 (music app; contact: local)','Accept':'application/json'},
      });
    }finally{clearTimeout(to)}
    const ct=(up.headers.get('content-type')||'').toLowerCase();
    if(!ct.includes('json')) return res.status(502).json({error:'upstream not json'});
    const text=await up.text();
    if(text.length>2*1024*1024) return res.status(502).json({error:'too large'});
    res.setHeader('Cache-Control',`public, s-maxage=${ttl}, stale-while-revalidate=86400`);
    res.setHeader('Content-Type','application/json; charset=utf-8');
    res.status(up.status).send(text);
  }catch(e){
    res.status(502).json({error:'proxy failed'});
  }
}
