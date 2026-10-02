// app/js/ui.js
export function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (k === 'class') el.className = v;
    else if (k === 'html') el.innerHTML = v;
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'dataset') Object.assign(el.dataset, v);
    else if (v !== null && v !== undefined && v !== false) el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of children.flat()) {
    if (c === null || c === undefined || c === false) continue;
    el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return el;
}

export function toast(msg, ms = 2500) {
  const t = h('div', { class: 'toast', role: 'status' }, msg);
  document.body.append(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, ms);
}

export function sheet({ title, content, full = false }) {
  const backdrop = h('div', { class: 'sheet-backdrop' });
  const box = h('div', { class: 'sheet' + (full ? ' sheet-full' : ''), role: 'dialog', 'aria-label': title },
    h('div', { class: 'sheet-head' }, h('strong', {}, title), h('button', { class: 'btn-icon', 'aria-label': 'Kapat', onClick: close }, '✕')),
    h('div', { class: 'sheet-body' }, content));
  function close() { backdrop.remove(); box.remove(); }
  backdrop.addEventListener('click', close);
  document.body.append(backdrop, box);
  requestAnimationFrame(() => box.classList.add('open'));
  return { close, el: box };
}

export function confirm(msg, { ok = 'Evet', cancel = 'Vazgeç' } = {}) {
  return new Promise((resolve) => {
    const s = sheet({
      title: 'Onay',
      content: h('div', {}, h('p', {}, msg),
        h('div', { class: 'row' },
          h('button', { class: 'btn', onClick: () => { s.close(); resolve(false); } }, cancel),
          h('button', { class: 'btn btn-primary', onClick: () => { s.close(); resolve(true); } }, ok)))
    });
  });
}

export function fmtSure(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(s / 60), r = s % 60;
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
}
