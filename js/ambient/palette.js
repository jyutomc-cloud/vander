/* Vander — ekstraksi 2 warna dominan dari sampul (canvas, CORS aman) */
export function paletteFromImage(url){
  return new Promise(res=>{
    if(!url) return res(null);
    const img=new Image();
    img.crossOrigin='anonymous';
    const to=setTimeout(()=>{img.src='';res(null)},4000);
    img.onload=()=>{
      clearTimeout(to);
      try{
        const c=document.createElement('canvas');
        c.width=c.height=24;
        const x=c.getContext('2d',{willReadFrequently:true});
        x.drawImage(img,0,0,24,24);
        const d=x.getImageData(0,0,24,24).data;
        const buckets=new Map();
        for(let i=0;i<d.length;i+=4){
          const r=d[i],g=d[i+1],b=d[i+2],a=d[i+3];
          if(a<128) continue;
          const mx=Math.max(r,g,b),mn=Math.min(r,g,b);
          const sat=mx?(mx-mn)/mx:0;
          const lum=.2126*r+.7152*g+.0722*b;
          if(sat<.12||lum<18||lum>235) continue;
          const k=(r>>5)+'-'+(g>>5)+'-'+(b>>5);
          const e=buckets.get(k)||{r:0,g:0,b:0,n:0};
          e.r+=r;e.g+=g;e.b+=b;e.n++;
          buckets.set(k,e);
        }
        const top=[...buckets.values()].sort((a,b)=>b.n-a.n).slice(0,2);
        if(!top.length) return res(null);
        const css=e=>`rgb(${Math.round(e.r/e.n)} ${Math.round(e.g/e.n)} ${Math.round(e.b/e.n)})`;
        res([css(top[0]),top[1]?css(top[1]):css(top[0])]);
      }catch{res(null)}
    };
    img.onerror=()=>{clearTimeout(to);res(null)};
    img.src=url;
  });
}
