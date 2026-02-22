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

  // Step 3: render tags as pill badges (small, wrapped)
  function renderTagPills(tags) {
    if (!Array.isArray(tags) || tags.length === 0) return '';

    const shown = tags.slice(0, 6);

    return `
      <div class="flex flex-wrap gap-2 pt-1">
        ${shown.map(t => `
          <span class="text-[11px] px-2 py-[3px] rounded-full border border-lime-500/40 text-lime-300 bg-dark-900/40 leading-none">
            ${normalize(t)}
          </span>
        `).join('')}
      </div>
    `;
  }

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

      a.innerHTML = `
        <div class="flex gap-4 items-start">
          <div class="w-20 h-20 rounded-xl overflow-hidden border border-dark-700 bg-dark-900/40 flex-shrink-0">
            <img src="${thumb}" alt="" class="w-full h-full object-cover" loading="lazy" />
          </div>

          <div class="flex flex-col justify-start gap-1 min-w-0">
            <div class="text-[10px] tracking-wider text-lime-400 font-semibold leading-none">
              ${normalize(item.section).toUpperCase()}
            </div>

            <div class="text-[17px] font-bold text-neutral-100 leading-snug truncate">
              ${normalize(item.title)}
            </div>

            ${renderTagPills(item.tags)}
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