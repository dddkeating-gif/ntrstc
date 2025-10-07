// Phone-friendly admin using localStorage; export as posts.json
const form = document.getElementById('postForm');
const draftsEl = document.getElementById('drafts');
const EXPORT_KEY = 'ntrstc_drafts';

function readDrafts(){ try { return JSON.parse(localStorage.getItem(EXPORT_KEY))||[] } catch { return [] }}
function writeDrafts(arr){ localStorage.setItem(EXPORT_KEY, JSON.stringify(arr)) }
function renderDrafts(){
  const list = readDrafts().sort((a,b)=> new Date(b.date)-new Date(a.date));
  draftsEl.innerHTML = list.map(p=>`<article class="card item">
    ${p.image?`<img class="thumb" src="${p.image}" alt="">`:'<div class="thumb"></div>'}
    <div class="meta">
      <div class="kicker">${new Date(p.date).toLocaleString()}</div>
      <h3 class="title">${p.title}</h3>
      <p class="excerpt">${p.excerpt||''}</p>
      <div class="tags">${(p.tags||[]).map(t=>`<span class="tagpill">#${t}</span>`).join('')}</div>
    </div>
  </article>`).join('');
}
renderDrafts();

form.addEventListener('submit', (e)=>{
  e.preventDefault();
  const fd = new FormData(form);
  const post = {
    id: crypto.randomUUID(),
    title: fd.get('title').trim(),
    url: (fd.get('url')||'').trim(),
    excerpt: (fd.get('excerpt')||'').trim(),
    tags: (fd.get('tags')||'').split(',').map(s=>s.trim()).filter(Boolean),
    image: (fd.get('image')||'').trim(),
    date: fd.get('date') ? new Date(fd.get('date')).toISOString() : new Date().toISOString()
  };
  const drafts = readDrafts();
  drafts.unshift(post);
  writeDrafts(drafts);
  form.reset();
  renderDrafts();
});

document.getElementById('exportBtn').addEventListener('click', ()=>{
  // Merge server posts.json (if any) with drafts, preferring newest by id
  fetch('posts.json').then(r=>r.json()).catch(()=>({posts:[]})).then(base=>{
    const merged = [...(base.posts||[])];
    const byId = new Map(merged.map(p=>[p.id,p]));
    for(const d of readDrafts()){
      byId.set(d.id, d);
    }
    const out = { posts: Array.from(byId.values()).sort((a,b)=> new Date(b.date)-new Date(a.date)) };
    const blob = new Blob([JSON.stringify(out,null,2)], {type:'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'posts.json';
    a.click();
    URL.revokeObjectURL(a.href);
  });
});

document.getElementById('clearBtn').addEventListener('click', ()=>{
  if(confirm('Clear local drafts on this device?')){
    localStorage.removeItem(EXPORT_KEY);
    renderDrafts();
  }
});
