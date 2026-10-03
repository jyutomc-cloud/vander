(() => {
  const input = document.getElementById("urlInput");
  const btn = document.getElementById("downloadBtn");
  const clearBtn = document.getElementById("clearBtn");
  const label = document.getElementById("platformLabel");
  const result = document.getElementById("resultSection");
  const errorBox = document.getElementById("errorBox");
  const loadingBox = document.getElementById("loadingBox");
  const loadingText = document.getElementById("loadingText");
  const resultTitle = document.getElementById("resultTitle");
  const resultType = document.getElementById("resultType");
  const resultAuthor = document.getElementById("resultAuthor");
  const resultDescription = document.getElementById("resultDescription");
  const thumb = document.getElementById("thumb");
  const thumbPlaceholder = document.getElementById("thumbPlaceholder");
  const downloadList = document.getElementById("downloadList");

  const detector = [
    [/tiktok\.com|vm\.tiktok\.com/i, "TikTok"],
    [/instagram\.com/i, "Instagram"],
    [/youtube\.com|youtu\.be/i, "YouTube"],
    [/pinterest\.|pin\.it/i, "Pinterest"],
    [/twitter\.com|x\.com/i, "X"],
    [/facebook\.com|fb\.watch/i, "Facebook"],
    [/threads\.net/i, "Threads"],
    [/reddit\.com/i, "Reddit"],
    [/spotify\.com/i, "Spotify"]
  ];

  function detect(value){
    return detector.find(([re]) => re.test(value))?.[1] || "";
  }

  function setState(type, message=""){
    errorBox.hidden = type !== "error";
    loadingBox.hidden = type !== "loading";
    if(type === "error") errorBox.textContent = message;
  }

  function setUrlState(){
    const value = input.value.trim();
    const platform = detect(value);
    label.textContent = platform ? platform + " detected" : "Paste a link to begin";
    clearBtn.hidden = !value;
  }

  input.addEventListener("input", setUrlState);
  clearBtn.addEventListener("click", () => {
    input.value = "";
    setUrlState();
    input.focus();
    result.hidden = true;
    setState("idle");
  });
  input.addEventListener("keydown", e => {
    if(e.key === "Enter") resolve();
  });
  btn.addEventListener("click", resolve);

  function escapeHtml(s){
    return String(s ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;" }[c]));
  }

  function normalizeDownloads(items){
    return Array.isArray(items) ? items.filter(x => x && x.url) : [];
  }

  async function resolve(){
    const url = input.value.trim();
    if(!url) return;
    try { new URL(url); } catch { setState("error","URL tidak valid. Tempel tautan publik yang lengkap."); return; }

    setState("loading");
    loadingText.textContent = "Resolving " + (detect(url) || "media") + "…";
    btn.disabled = true;
    result.hidden = true;

    try{
      const response = await fetch("/api/download",{
        method:"POST",
        headers:{"content-type":"application/json"},
        body:JSON.stringify({url})
      });
      const data = await response.json().catch(() => ({}));
      if(!response.ok || !data?.status) throw new Error(data?.message || "Media tidak berhasil ditemukan.");
      renderResult(data.result || {});
      setState("idle");
    }catch(err){
      setState("error", err.message || "Terjadi kesalahan saat mengambil media.");
    }finally{
      btn.disabled = false;
    }
  }

  function renderResult(data){
    resultTitle.textContent = data.title || "Media found";
    resultType.textContent = String(data.type || "MEDIA").toUpperCase();
    resultAuthor.textContent = data.author || "";
    resultDescription.textContent = data.description || "Pilih format media yang ingin disimpan.";
    downloadList.innerHTML = "";

    if(data.thumbnail){
      thumb.src = data.thumbnail;
      thumb.alt = data.title || "Preview";
      thumb.hidden = false;
      thumbPlaceholder.hidden = true;
    }else{
      thumb.hidden = true;
      thumbPlaceholder.hidden = false;
    }

    const downloads = normalizeDownloads(data.downloads);
    if(!downloads.length){
      downloadList.innerHTML = '<div class="message error">Tidak ada media yang bisa diunduh dari link ini.</div>';
    }else{
      downloads.forEach((item,index) => {
        const a = document.createElement("a");
        a.className = "media-link";
        a.href = item.url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.innerHTML = '<span class="media-main"><span class="media-type">'+escapeHtml(item.type || "MEDIA")+'</span><span class="media-quality">'+escapeHtml(item.quality || ("Download "+(index+1)))+'</span></span><span class="arrow">↗</span>';
        downloadList.appendChild(a);
      });
    }

    result.hidden = false;
    requestAnimationFrame(() => result.scrollIntoView({behavior:"smooth",block:"start"}));
  }

  window.addEventListener("DOMContentLoaded", () => {
    setUrlState();
    if(window.liquidGL){
      const glass = liquidGL({
        target: ".liquidGL",
        snapshot: "body",
        engine: "auto",
        resolution: Math.min(1.6, Math.max(1, window.devicePixelRatio || 1)),
        refraction: 0.032,
        aberration: 0.028,
        bevelDepth: 0.12,
        bevelWidth: 0.18,
        frost: 1.05,
        shadow: true,
        specular: true,
        interaction: "fluid",
        interactionStrength: 0.28,
        interactionRadius: 0.32,
        interactionViscosity: 0.76,
        tint: "rgba(255,255,255,0.10)"
      });
      if(glass) {
        document.querySelectorAll(".liquidGL").forEach(el => {
          el.addEventListener("pointermove", e => {
            const r = el.getBoundingClientRect();
            el.style.setProperty("--gx", ((e.clientX-r.left)/r.width*100).toFixed(1)+"%");
            el.style.setProperty("--gy", ((e.clientY-r.top)/r.height*100).toFixed(1)+"%");
          }, {passive:true});
        });
      }
    }
  });
})();