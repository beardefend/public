(function () {
  const $ = (sel) => document.querySelector(sel);
  const input = $('#global-search');
  const panel = $('#search-panel');
  const list = $('#search-results');
  const count = $('#search-count');
  const clearBtn = $('#search-clear');

  if (!input || !panel || !list || !count || !clearBtn) return;

  let fuse = null;
  let indexLoaded = false;
  let docs = [];

  // function openPanel() { panel.style.display = 'block'; }
  // function closePanel() { panel.style.display = 'none'; }
  function openPanel() {
  panel.style.display = 'block';
  panel.setAttribute('aria-hidden', 'false');

  // lock the background scroll
  document.body.style.overflow = 'hidden';

  // ensure results scroll INSIDE the panel
  list.style.maxHeight = 'min(60vh, 520px)';
  list.style.overflowY = 'auto';
  list.style.webkitOverflowScrolling = 'touch';
  }

  function closePanel() {
    panel.style.display = 'none';
    panel.setAttribute('aria-hidden', 'true');

    // unlock scroll
    document.body.style.overflow = '';
  }

  function normalize(str){ return (str || '').toString(); }

  function render(results) {
    list.innerHTML = '';
    count.textContent = results.length.toString();

    if (!results.length) {
      list.innerHTML = '<div class="text-neutral-400 text-sm">No results.</div>';
      return;
    }

    const frag = document.createDocumentFragment();
    results.slice(0, 30).forEach(r => {
      const item = r.item || r;
      const a = document.createElement('a');
      a.href = item.permalink;
      // a.className = 'block rounded-2xl border border-dark-700 bg-dark-800/40 hover:bg-dark-800/70 transition p-4';
      a.className = 'block w-full max-w-full overflow-hidden rounded-2xl border border-dark-700 bg-dark-800/40 hover:bg-dark-800/70 transition p-4';
      const thumb = item.thumbnail || '';
      const tagText = Array.isArray(item.tags) ? item.tags.join(', ') : (item.tags || '');
      a.innerHTML = `
        <div class="flex gap-4">
          <div class="w-20 h-14 rounded-xl overflow-hidden border border-dark-700 bg-dark-900/40 flex-shrink-0">
            <img src="${thumb}" alt="" class="w-full h-full object-cover" loading="lazy" />
          </div>
          <div class="min-w-0">
            <div class="text-xs text-lime-400 font-semibold">${normalize(item.section).toUpperCase()}</div>
            <div class="text-lg font-bold text-neutral-100 truncate">${normalize(item.title)}</div>
            // <div class="text-sm text-neutral-300 line-clamp-2">${normalize(item.description || item.summary)}</div>
            <div class="text-sm text-neutral-300 line-clamp-2">${normalize(tagText)}</div>
            </div>
        </div>
      `;
      frag.appendChild(a);
    });
    list.appendChild(frag);
  }

  async function loadIndex() {
    if (indexLoaded) return;
    indexLoaded = true;
    // const res = await fetch('/search-index.json', { cache: 'force-cache' });
    const indexUrl = window.__SEARCH_INDEX_URL || '/search-index.json';
    const res = await fetch(indexUrl, { cache: 'no-store' });
    docs = await res.json();

    fuse = new Fuse(docs, {
      includeScore: true,
      threshold: 0.35,
      ignoreLocation: true,
      keys: [
        { name: 'title', weight: 0.60 },
        { name: 'tags', weight: 0.40 },
        // { name: 'description', weight: 0.10 },
        // { name: 'body', weight: 0.10 }
      ]
    });
  }

  let last = '';
  async function onInput() {
    const q = input.value.trim();
    clearBtn.style.display = q ? 'inline-flex' : 'none';
    if (q === last) return;
    last = q;
    openPanel();

    if (!q) { render([]); return; }
    await loadIndex();
    const results = fuse.search(q);
    render(results);
  }

  input.addEventListener('focus', async () => { openPanel(); if (!indexLoaded) await loadIndex(); });
  input.addEventListener('input', onInput);
  clearBtn.addEventListener('click', () => { input.value=''; last=''; clearBtn.style.display='none'; render([]); input.focus(); });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePanel();
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); input.focus(); openPanel(); }
  });

  document.addEventListener('click', (e) => {
    if (!panel.contains(e.target) && e.target !== input) closePanel();
  });
})();
