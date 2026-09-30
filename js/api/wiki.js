/* Vander — Wikipedia REST: bio artis (id -> en), hanya jika berkaitan musik */
import { httpJSON } from './http.js';

const MUSIC=/penyanyi|band|musisi|musik|rapper|penyanyi-penulis|grup musik|vokalis|singer|musician|rapper|band|vocalist|songwriter|dj|record producer/i;
const UA={'Api-User-Agent':'Vander/1.0 (music app)'};

async function fromLang(lang,name){
  const base=`https://${lang}.wikipedia.org`;
  const s=await httpJSON(`${base}/w/rest.php/v1/search/title?q=${encodeURIComponent(name)}&limit=4`,{ttl:86400,headers:UA});
  const pages=(s?.pages||[]);
  for(const p of pages){
    const hay=((p.description||'')+' '+(p.excerpt||'')).replace(/<[^>]+>/g,'');
    if(!MUSIC.test(hay)) continue;
    try{
      const sum=await httpJSON(`${base}/api/rest_v1/page/summary/${encodeURIComponent(p.title)}`,{ttl:86400,headers:UA});
      if(!MUSIC.test((sum.description||'')+' '+(sum.extract||''))) continue;
      return {
        title:sum.title, text:sum.extract||'', desc:sum.description||'',
        url:sum.content_urls?.desktop?.page||null,
        photo:sum.originalimage?.source||sum.thumbnail?.source||null,
      };
    }catch{ /* lanjut kandidat berikutnya */ }
  }
  return null;
}
export async function artistBio(name){
  if(!name) return null;
  try{const id=await fromLang('id',name);if(id) return id;}catch{}
  try{return await fromLang('en',name);}catch{ return null }
}
