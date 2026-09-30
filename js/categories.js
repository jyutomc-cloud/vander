/* Vander — definisi kategori Jelajahi: {label, hue, recipe} */
export const CATEGORIES=[
  {key:'indonesia', label:'Indonesia',          hue:6,   recipe:{type:'appleChart'}},
  {key:'pop',       label:'Pop',                hue:330, recipe:{type:'dzGenre',name:'Pop'}},
  {key:'kpop',      label:'K-Pop',              hue:280, recipe:{type:'dzPlaylist',q:'k-pop'}},
  {key:'alternatif',label:'Alternatif',         hue:210, recipe:{type:'dzGenre',name:'Alternative'}},
  {key:'rock',      label:'Rock',               hue:355, recipe:{type:'dzGenre',name:'Rock'}},
  {key:'rnb',       label:'R&B',                hue:262, recipe:{type:'dzGenre',name:'R&B'}},
  {key:'hiphop',    label:'Hip-Hop/Rap',        hue:38,  recipe:{type:'dzGenre',name:'Rap/Hip Hop'}},
  {key:'dance',     label:'Dance & Elektronik', hue:185, recipe:{type:'audiusGenre',genre:'Electronic'}},
  {key:'jazz',      label:'Jazz',               hue:44,  recipe:{type:'dzGenre',name:'Jazz'}},
  {key:'klasik',    label:'Klasik',             hue:222, recipe:{type:'dzGenre',name:'Classical'}},
  {key:'lofi',      label:'Lo-Fi',              hue:150, recipe:{type:'audiusGenre',genre:'Lo-Fi'}},
  {key:'reggae',    label:'Reggae',             hue:108, recipe:{type:'dzGenre',name:'Reggae'}},
  {key:'latin',     label:'Latin',              hue:18,  recipe:{type:'dzGenre',name:'Latin Music'}},
  {key:'peringkat', label:'Peringkat',          hue:48,  recipe:{type:'charts'}},
  {key:'radio',     label:'Radio',              hue:168, recipe:{type:'radio'}},
];
export const MOODS=[
  {q:'chill indonesia', label:'Santai',  hue:200},
  {q:'focus',           label:'Fokus',   hue:258},
  {q:'semangat workout',label:'Semangat',hue:28},
  {q:'galau',           label:'Galau',   hue:232},
  {q:'malam night',     label:'Malam',   hue:284},
];
