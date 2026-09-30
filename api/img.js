/* Vander — proxy gambar allowlist, hanya image/*, dipakai sebagai fallback CORS */
const HOSTS=[/\.mzstatic\.com$/,/\.dzcdn\.net$/,/\.audius\.co$/,/\.jamendo\.com$/,/^upload\.wikimedia\.org$/,/^is\d+-ssl\.mzstatic\.com$/];

export default async function handler(req,res){
  try{
    if(req.method!=='GET') return res.status(400).end();
    const raw=req.query?.u;
    if(!raw) return res.status(400).end();
    let u;
    try{u=new URL(raw)}catch{return res.status(400).end()}
    if(u.protocol!=='https:') return res.status(400).end();
    if(!HOSTS.some(rx=>rx.test(u.hostname))) return res.status(400).end();

    const ac=new AbortController();
    const to=setTimeout(()=>ac.abort(),8000);
    let up;
    try{
      up=await fetch(u.toString(),{signal:ac.signal,redirect:'error',
        headers:{'User-Agent':'Vander/1.0','Accept':'image/*'}});
    }finally{clearTimeout(to)}
    const ct=(up.headers.get('content-type')||'').toLowerCase();
    if(!ct.startsWith('image/')) return res.status(502).end();
    const buf=Buffer.from(await up.arrayBuffer());
    if(buf.length>6*1024*1024) return res.status(502).end();
    res.setHeader('Content-Type',ct);
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Cache-Control','public, max-age=31536000, immutable');
    res.status(200).send(buf);
  }catch{
    res.status(502).end();
  }
}
