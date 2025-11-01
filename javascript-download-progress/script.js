'use strict';

(function () {
  const $ = (sel) => document.querySelector(sel);
  const downloadBtn = $('#download-button'),
    pct = $('#pct'),
    bar = $('#bar'),
    meta = $('#meta');

  function humanBytes(n) {
    const u = ['B', 'KB', 'MB', 'GB', 'TB'];
    let i = 0,
      v = n;
    while (v >= 1024 && i < u.length - 1) {
      v /= 1024;
      i++;
    }
    return `${v.toFixed(v >= 10 ? 0 : 1)} ${u[i]}`;
  }

  function humanTime(sec) {
    if (!isFinite(sec) || sec < 0) return '—';
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = Math.floor(sec % 60);
    return [h, m, s]
      .map((v, i) => (i === 0 ? v : String(v).padStart(2, '0')))
      .join(':');
  }

  async function downloadFile(url, suggestedName) {
    pct.textContent = '0%';
    bar.classList.remove('indeterminate');
    bar.style.width = '0%';
    meta.textContent = 'Connessione…';

    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    
    const total = Number(res.headers.get('Content-Length')) || 0;
    const disposition = res.headers.get('Content-Disposition') || '';
    const nameFromHeader = /filename\*?=(?:UTF-8''|")?([^\";]+)/i
      .exec(disposition)?.[1]
      ?.replace(/["']/g, '');
    const filename =
      suggestedName ||
      nameFromHeader ||
      new URL(url).pathname.split('/').pop() ||
      'download';

    const reader = res.body.getReader();
    const chunks = [];
    let received = 0;
    let t0 = performance.now(),
      lastUpdate = t0;

    if (!total) {
      bar.classList.add('indeterminate');
      pct.textContent = '—';
    }

    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      received += value.byteLength;

      const now = performance.now();
      if (now - lastUpdate > 100) {
        lastUpdate = now;
        if (total) {
          const ratio = received / total;
          bar.style.width = `${(ratio * 100).toFixed(2)}%`;
          pct.textContent = `${Math.floor(ratio * 100)}%`;
          const elapsed = (now - t0) / 1000;
          const speed = received / elapsed; // B/s
          const eta = (total - received) / (speed || 1);
          meta.textContent = `${humanBytes(received)} / ${humanBytes(
            total
          )} • ${humanBytes(speed)}/s • ETA ${humanTime(eta)}`;
        } else {
          meta.textContent = `${humanBytes(
            received
          )} scaricati… (dimensione totale sconosciuta)`;
        }
      }
    }

    
    bar.classList.remove('indeterminate');
    bar.style.width = '100%';
    pct.textContent = '100%';
    meta.textContent = `Completato: ${humanBytes(received)} • Salvataggio…`;

    const blob = new Blob(chunks);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(a.href);
    a.remove();

    meta.textContent = `Fatto! Salvato come “${filename}” (${humanBytes(
      received
    )}).`;
  }

  downloadBtn.addEventListener('click', async () => {
    const url = downloadBtn.dataset.url;
    downloadBtn.disabled = true;
    try {
      await downloadFile(url, url);
    } catch (err) {
      console.error(err);
      meta.textContent = `Errore: ${err.message}`;
    } finally {
      downloadBtn.disabled = false;
    }
  });
})();
