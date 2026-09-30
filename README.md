# Vander — Dengarkan dunia. Gratis.

Aplikasi web musik phone-first berbahasa Indonesia. Vanilla HTML/CSS/JS (ES modules), tanpa framework, tanpa akun, tanpa iklan, biaya Rp0.

## Fitur

- **Beranda** — sapaan waktu, ubin sorotan, shelf Lanjutkan, Top Indonesia, Rilisan baru, trending Audius (lagu penuh), artis populer, radio Indonesia, chip suasana hati.
- **Jelajahi** — grid 2 kolom 15 kategori; halaman kategori dengan top lagu, artis, playlist, dan shelf lagu penuh.
- **Radio** — stasiun Indonesia via Radio Browser (hanya stream https), chip tag, pencarian nama, badge Live + equalizer CSS.
- **Perpustakaan** — Favorit, Playlist (buat/ubah nama/hapus), Riwayat; ekspor & impor JSON; pengaturan (sembunyikan eksplisit, hapus data, sumber data).
- **Cari** — debounce 350 ms, pencarian terakhir, hasil berkelompok (Terbaik, Lagu, Artis, Album, Lagu penuh, Stasiun).
- **Now Playing** — lembar layar penuh, geser ke bawah untuk tutup, antrean "Berikutnya", lirik LRCLIB (sinkron hanya untuk lagu penuh), badge sumber + tautan "Dengarkan lengkap".
- **Pemutar** — satu `<audio>`, antrean acak/ulangi, preload lagu berikutnya, Media Session, antrean & posisi tersimpan (pulih dalam keadaan jeda), shortcut desktop (Spasi, ←/→, N, P, M).
- **PWA** — manifest + service worker (cache app shell saja, tidak pernah audio), theme `#07080C`.

## Sumber data (semua gratis, tanpa kartu)

| Sumber | Dipakai untuk | Akses |
|---|---|---|
| iTunes Search/Lookup + Apple RSS | pencarian, tangga lagu Indonesia, preview 30 dtk | langsung (RSS via `/api/p`) |
| Deezer | genre, artis, album, playlist, preview 30 dtk | via `/api/p` |
| Audius | lagu penuh gratis | langsung (`app_name=Vander`) |
| Radio Browser | radio langsung Indonesia | langsung |
| LRCLIB | lirik polos & sinkron | via `/api/p` |
| Wikipedia REST | bio & foto artis | langsung |
| Jamendo (opsional) | musik CC | via `/api/p` + env `JAMENDO_CLIENT_ID` |

Preview 30 detik diberi badge "Preview 30 dtk" dan tombol "Dengarkan lengkap" ke halaman resmi. Tidak ada scraping, tidak ada API tidak resmi.

## Menjalankan lokal

File statis bisa langsung dibuka lewat server statis apa pun, tetapi fitur Deezer/LRCLIB/tangga lagu butuh proxy serverless:

```bash
npm i -g vercel   # sekali saja
vercel dev        # menjalankan web + /api/*
```

Tanpa `vercel dev` (mis. server statis biasa), aplikasi tetap jalan: shelf Deezer/tangga lagu otomatis disembunyikan, dan iTunes, Audius, Radio, Wikipedia tetap berfungsi.

## Deploy ke Vercel (Hobby, gratis)

```bash
vercel            # dari folder proyek
```

Opsional: pasang `JAMENDO_CLIENT_ID` di dashboard Vercel → Settings → Environment Variables untuk mengaktifkan Jamendo.

## Struktur

```
vander/
├─ index.html  manifest.webmanifest  sw.js  vercel.json
├─ api/        p.js (proxy JSON allowlist)  img.js (proxy gambar allowlist)
├─ css/        tokens.css  base.css  components.css  glass.css
└─ js/
   ├─ app.js  router.js  store.js  util.js  categories.js
   ├─ api/    http.js normalize.js itunes.js deezer.js audius.js radio.js lrclib.js wiki.js jamendo.js
   ├─ player/ engine.js queue.js mediasession.js
   ├─ ambient/ palette.js ambient.js
   ├─ glass/  glass.js
   └─ ui/     components.js chrome.js nowplaying.js screens/…
```

## Catatan keamanan proxy

`api/p.js` hanya meneruskan GET ke host allowlist (`api.deezer.com`, `lrclib.net`, `api.jamendo.com`, `rss.marketingtools.apple.com`), https saja, tanpa kredensial di URL, menolak redirect, batas 2 MB, timeout 8 dtk. `api/img.js` serupa untuk host gambar sampul dan hanya `image/*`.
