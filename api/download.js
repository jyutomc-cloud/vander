const { tiktok, instagram, youtube, pinterest, twitter, facebook, threads, reddit, spotify } = require("@coflyn/scrapr");

const patterns = [
  ["tiktok", /tiktok\.com|vm\.tiktok\.com/i],
  ["instagram", /instagram\.com/i],
  ["youtube", /youtube\.com|youtu\.be/i],
  ["pinterest", /pinterest\.|pin\.it/i],
  ["twitter", /twitter\.com|x\.com/i],
  ["facebook", /facebook\.com|fb\.watch/i],
  ["threads", /threads\.net/i],
  ["reddit", /reddit\.com/i],
  ["spotify", /spotify\.com/i]
];

function platformOf(url){
  return patterns.find(([,re]) => re.test(url))?.[0] || null;
}

async function firstSuccess(tasks){
  let lastError;
  for(const task of tasks){
    try{
      const res = await task();
      if(res?.status && res?.result) return res.result;
      lastError = res?.message || "No result";
    }catch(error){
      lastError = error?.message || String(error);
    }
  }
  throw new Error(lastError || "All scrapers failed.");
}

module.exports = async (req,res) => {
  if(req.method !== "POST"){
    res.statusCode=405;
    res.setHeader("Allow","POST");
    return res.json({status:false,message:"Method not allowed"});
  }

  try{
    const {url} = req.body || {};
    if(typeof url !== "string" || !url.trim()){
      return res.status(400).json({status:false,message:"URL media belum diberikan."});
    }
    const cleanUrl = url.trim();
    try { new URL(cleanUrl); } catch {
      return res.status(400).json({status:false,message:"URL tidak valid."});
    }

    const platform = platformOf(cleanUrl);
    if(!platform){
      return res.status(400).json({status:false,message:"Platform belum didukung. Coba TikTok, Instagram, YouTube, Pinterest, X, atau Facebook."});
    }

    let result;
    switch(platform){
      case "tiktok":
        result = await firstSuccess([
          () => tiktok.tiktokio(cleanUrl),
          () => tiktok.snaptik(cleanUrl),
          () => tiktok.ssstik(cleanUrl)
        ]);
        break;
      case "instagram":
        result = await firstSuccess([
          () => instagram.direct(cleanUrl),
          () => instagram.snapsave(cleanUrl),
          () => instagram.indown(cleanUrl),
          () => instagram.snapinsta(cleanUrl)
        ]);
        break;
      case "youtube":
        result = await firstSuccess([
          () => youtube.ytmp3(cleanUrl),
          () => youtube.ytmp3gg(cleanUrl)
        ]);
        break;
      case "pinterest":
        result = await firstSuccess([
          () => pinterest.direct(cleanUrl),
          () => pinterest.pindown(cleanUrl)
        ]);
        break;
      case "twitter":
        result = await firstSuccess([
          () => twitter.direct(cleanUrl),
          () => twitter.tvd(cleanUrl),
          () => twitter.savetwt(cleanUrl)
        ]);
        break;
      case "facebook":
        result = await firstSuccess([
          () => facebook.snapsave(cleanUrl),
          () => facebook.fdown(cleanUrl)
        ]);
        break;
      case "threads":
        result = await firstSuccess([() => threads.threadster(cleanUrl)]);
        break;
      case "reddit":
        result = await firstSuccess([() => reddit.rapidsave(cleanUrl)]);
        break;
      case "spotify":
        result = await firstSuccess([
          () => spotify.spotisaver(cleanUrl),
          () => spotify.spotidown(cleanUrl),
          () => spotify.spotmate(cleanUrl)
        ]);
        break;
    }

    const safe = {
      title: result?.title || "Media",
      thumbnail: result?.thumbnail || null,
      type: result?.type || "media",
      author: result?.author || result?.artist || "",
      description: result?.description || "",
      downloads: Array.isArray(result?.downloads) ? result.downloads.filter(x => x?.url).map(x => ({
        url:x.url,
        type:x.type || result.type || "media",
        quality:x.quality || x.label || "Download"
      })) : []
    };

    return res.status(200).json({status:true,result:safe});
  }catch(error){
    console.error("Vander download error:",error);
    return res.status(502).json({
      status:false,
      message:error?.message || "Gagal mengambil media. Coba lagi atau gunakan link publik lain."
    });
  }
};
