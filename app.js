// Feed rendering + pagination
const PAGE_SIZE = 9;
let POSTS = [];
let page = 0;

async function loadPosts() {
  try {
    const res = await fetch('posts.json', {cache:'no-store'});
    const data = await res.json();
    POSTS = (data.posts || []).sort((a,b)=> new Date(b.date) - new Date(a.date));
    renderNext();
  } catch (e) {
    console.error(e);
    document.getElementById('feed').innerHTML = '<p class="excerpt">Could not load posts.</p>';
  }
}

function postCard(p){
  const tags = (p.tags||[]).slice(0,4).map(t=>`<span class="tagpill">#${t}</span>`).join('');
  const img = p.image ? `<img class="thumb" src="${p.image}" alt="">` : `<div class="thumb"></div>`;
  const title = p.url ? `<a href="${p.url}" target="_blank" rel="noopener">${p.title}</a>` : p.title;
  const date = new Date(p.date).toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'});
  return `<article class="card item">
    ${img}
    <div class="meta">
      <div class="kicker">${date}</div>
      <h3 class="title">${title}</h3>
      ${p.excerpt ? `<p class="excerpt">${p.excerpt}</p>`:''}
      <div class="tags">${tags}</div>
    </div>
  </article>`;
}

function renderNext(){
  const start = page*PAGE_SIZE;
  const slice = POSTS.slice(start, start+PAGE_SIZE);
  const feed = document.getElementById('feed');
  feed.insertAdjacentHTML('beforeend', slice.map(postCard).join(''));
  page++;
  if (page*PAGE_SIZE >= POSTS.length) document.getElementById('loadMore').style.display = 'none';
}

document.getElementById('loadMore').addEventListener('click', renderNext);
loadPosts();

// PWA install
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e)=>{
  e.preventDefault();
  deferredPrompt = e;
  const btn = document.getElementById('installBtn');
  btn.style.display = 'inline-block';
  btn.onclick = async ()=>{
    deferredPrompt.prompt();
    deferredPrompt = null;
    btn.style.display = 'none';
  };
});
