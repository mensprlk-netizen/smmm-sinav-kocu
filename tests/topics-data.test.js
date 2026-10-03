// Bütünleşme testi: gerçek index.json ve 14 gerçek konu dosyası konular ekranında render edilir.
import 'fake-indexeddb/auto';
import { test, before, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { IDBFactory } from 'fake-indexeddb';
import { setupDom } from './dom.js';
setupDom();
const db = await import('../app/js/db.js');
const data = await import('../app/js/data.js');
const topics = await import('../app/js/screens/topics.js');

const APP = fileURLToPath(new URL('../app/', import.meta.url));
const readJson = (rel) => JSON.parse(fs.readFileSync(APP + rel, 'utf8'));
const INDEX = readJson('data/index.json');
const KONULAR = INDEX.konular;
const TOPICS = Object.fromEntries(KONULAR.map(k => [k, readJson(`data/topics/maliyet/${k}.json`)]));
const QIDS = new Set(['2026-1-MAL', '2026-2-MAL'].flatMap(f => readJson(`data/questions/${f}.json`).map(q => q.id)));

let view, ctx;
const settle = async () => { for (let i = 0; i < 8; i++) await new Promise(r => setTimeout(r, 0)); };

before(async () => {
  data.reset();
  data.setFetch(async (url) => {
    const rel = String(url).replace(/^\.\//, '');
    let body;
    if (rel === 'data/index.json') body = INDEX;
    else {
      const m = /^data\/topics\/maliyet\/(.+)\.json$/.exec(rel);
      if (m && TOPICS[m[1]]) body = TOPICS[m[1]];
    }
    return body === undefined ? { ok: false } : { ok: true, json: async () => structuredClone(body) };
  });
  await db.open(new IDBFactory());
});
beforeEach(() => {
  document.body.innerHTML = '<div id="view"></div>';
  view = document.getElementById('view');
  ctx = { navigate: () => {}, db, data };
});
afterEach(() => { topics.destroy(); });

test('index.json 14 konu listeler ve her dosya diskte var', () => {
  assert.equal(KONULAR.length, 14);
  assert.equal(new Set(KONULAR).size, 14);
  for (const k of KONULAR) assert.equal(TOPICS[k].kod, k);
});

test('#/topics: liste 14 kart gösterir, index sırasıyla', async () => {
  await topics.render(view, {}, ctx); await settle();
  const cards = [...view.querySelectorAll('a.card')];
  assert.equal(cards.length, 14);
  assert.deepEqual(cards.map(a => a.getAttribute('href')), KONULAR.map(k => '#/topics/' + k));
});

KONULAR.forEach((kod, i) => {
  test(`#/topics/${kod}: gerçek içerik eksiksiz render edilir`, async () => {
    const t = TOPICS[kod];
    assert.equal(t.sira, i + 1, 'sira, index.json sırasıyla eşleşmeli');
    await assert.doesNotReject(topics.render(view, { kod }, ctx));
    await settle();

    const h1 = view.querySelector('h1');
    assert.ok(h1 && h1.textContent.includes(t.baslik), 'h1 başlığı içermeli');

    const gorselli = t.bolumler.filter(b => b.gorsel).length;
    assert.ok(gorselli >= 1, 'en az bir görsel');
    const visuals = [...view.querySelectorAll('.visual')];
    assert.equal(visuals.length, gorselli, 'her görsel için bir .visual');
    for (const v of visuals) {
      assert.ok(!v.textContent.includes('Görsel gösterilemiyor.'), 'görsel yedek metne düşmemeli');
      assert.ok(v.children.length > 0, '.visual boş olmamalı');
      assert.equal(v.querySelectorAll('script').length, 0, '.visual içinde script olmamalı');
    }
    for (const b of t.bolumler.filter(x => x.gorsel)) {
      const { tip, veri } = b.gorsel;
      if (tip === 'allocation-table') {
        for (const a of veri.adimlar) for (const [r, c] of a.hucreler) {
          assert.ok(r >= 0 && r < veri.satirlar.length, `hucreler satırı sınır dışı: ${r}`);
          assert.ok(c >= 0 && c < veri.satirlar[r].length, `hucreler sütunu sınır dışı: [${r}, ${c}]`);
        }
      }
      if (tip === 'flow') {
        const ids = new Set(veri.dugumler.map(d => d.id));
        for (const o of veri.oklar) assert.ok(ids.has(o.from) && ids.has(o.to), `ok düğümü yok: ${o.from} → ${o.to}`);
      }
    }

    const n = t.ornekler.length;
    assert.ok(n >= 1);
    assert.equal(view.querySelectorAll('.ink-wrap canvas').length, n, 'her örnek için çizim alanı');
    const goster = [...view.querySelectorAll('button')].filter(b => b.textContent === 'Çözümü göster');
    assert.equal(goster.length, n, 'her örnek için "Çözümü göster"');

    assert.ok(t.cikmisSorular.length >= 1, 'cikmisSorular boş olmamalı');
    for (const id of t.cikmisSorular) {
      assert.ok(QIDS.has(id), `${id} gerçek soru dosyalarında olmalı`);
      assert.ok(view.querySelector(`a[href="#/study/q/${id}"]`), `${id} bağlantısı olmalı`);
    }

    assert.ok(t.kartlar.length >= 3, 'en az 3 kart');
    assert.ok(view.textContent.includes(`Konu kartlarını ekle (${t.kartlar.length})`));
  });
});
