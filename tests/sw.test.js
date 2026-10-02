import { test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';

const SRC = fs.readFileSync(new URL('../app/sw.js', import.meta.url), 'utf8');
const ORIGIN = 'https://u.github.io';
const VERSION = 'abc123def456';
const CACHE = 'smmm-koc-' + VERSION;
const PRECACHE = ['./', './index.html', './js/app.js', './data/index.json'];

const abs = (u) => new URL(typeof u === 'string' ? u : u.url, ORIGIN + '/smmm/').href;
const at = (p) => ORIGIN + '/smmm/' + p;

function makeEnv({ network = async () => new Response('net', { status: 200 }), initialCaches = [] } = {}) {
  const store = new Map(); // ad -> Map(url -> Response)
  for (const n of initialCaches) store.set(n, new Map());
  const calls = { fetch: [], skipWaiting: 0, claim: 0, deleted: [] };
  const mkCache = (name) => ({
    async addAll() { throw new Error('addAll kullanılmamalı'); },
    async put(req, res) { store.get(name).set(abs(req), res); },
    async match(req, opts = {}) {
      const u = new URL(abs(req));
      for (const [k, v] of store.get(name)) {
        const ku = new URL(k);
        if (ku.origin + ku.pathname === u.origin + u.pathname && (opts.ignoreSearch || ku.search === u.search)) return v.clone();
      }
      return undefined;
    },
  });
  const handlers = {};
  const self = {
    addEventListener: (t, fn) => { handlers[t] = fn; },
    clients: { claim: async () => { calls.claim++; } },
    skipWaiting: () => { calls.skipWaiting++; },
  };
  const ctx = {
    self, Request, Response, URL, Promise,
    location: { origin: ORIGIN, href: ORIGIN + '/smmm/sw.js' },
    importScripts: () => { self.__VERSION = VERSION; self.__PRECACHE = PRECACHE; },
    caches: {
      async open(n) { if (!store.has(n)) store.set(n, new Map()); return mkCache(n); },
      async keys() { return [...store.keys()]; },
      async delete(n) { calls.deleted.push(n); return store.delete(n); },
    },
    fetch: async (req) => { calls.fetch.push(req); return network(req); },
  };
  vm.createContext(ctx);
  vm.runInContext(SRC, ctx);
  return { handlers, store, calls };
}

function fire(handlers, type, event = {}) {
  let promise; let responded = false;
  handlers[type]({ ...event, waitUntil: (x) => { promise = x; }, respondWith: (x) => { responded = true; promise = x; } });
  return { responded, promise };
}

const nav = (url) => Object.defineProperty(new Request(url), 'mode', { value: 'navigate' });
const offline = async () => { throw new TypeError('offline'); };

function withCached(opts = {}) {
  const env = makeEnv({ initialCaches: [CACHE], ...opts });
  env.store.get(CACHE).set(at('js/app.js'), new Response('cached-app'));
  env.store.get(CACHE).set(at('index.html'), new Response('cached-index'));
  return env;
}

test('install: her dosya cache:reload ile istenir, sürümlü önbelleğe yazılır, skipWaiting çağrılmaz', async () => {
  const env = makeEnv();
  await fire(env.handlers, 'install').promise;
  assert.equal(env.calls.fetch.length, PRECACHE.length);
  for (const r of env.calls.fetch) assert.equal(r.cache, 'reload');
  assert.equal(env.store.get(CACHE).size, PRECACHE.length);
  assert.equal(env.calls.skipWaiting, 0);
});

test('install: bir dosya ağ hatası verirse waitUntil reddedilir', async () => {
  let n = 0;
  const env = makeEnv({ network: async () => { if (++n === 2) throw new TypeError('offline'); return new Response('x'); } });
  await assert.rejects(fire(env.handlers, 'install').promise);
  assert.equal(env.store.has(CACHE), false);
});

test('install: ok olmayan yanıt waitUntil reddeder', async () => {
  let n = 0;
  const env = makeEnv({ network: async () => new Response('', { status: ++n === 3 ? 404 : 200 }) });
  await assert.rejects(fire(env.handlers, 'install').promise);
});

test('activate: yalnızca eski smmm-koc- önbelleği silinir, başka uygulamanınki kalır; claim çağrılır', async () => {
  const env = makeEnv({ initialCaches: ['smmm-koc-old', CACHE, 'other-app-v1'] });
  await fire(env.handlers, 'activate').promise;
  assert.deepEqual(env.calls.deleted, ['smmm-koc-old']);
  assert.equal(env.calls.claim, 1);
});

test('fetch: önbellekteki dosya ağa gitmeden döner; sorgu dizesi yok sayılır', async () => {
  const env = withCached();
  const r1 = fire(env.handlers, 'fetch', { request: new Request(at('js/app.js')) });
  assert.equal(await (await r1.promise).text(), 'cached-app');
  const r2 = fire(env.handlers, 'fetch', { request: new Request(at('js/app.js?v=3')) });
  assert.equal(await (await r2.promise).text(), 'cached-app');
  assert.equal(env.calls.fetch.length, 0);
});

test('fetch: kaçırma ağdan gelir ve başarılıysa saklanır', async () => {
  const env = withCached();
  const { promise } = fire(env.handlers, 'fetch', { request: new Request(at('data/x.json')) });
  assert.equal(await (await promise).text(), 'net');
  assert.equal(env.calls.fetch.length, 1);
  assert.ok(env.store.get(CACHE).has(at('data/x.json')));
});

test('fetch: ok olmayan ağ yanıtı döner ama saklanmaz', async () => {
  const env = withCached({ network: async () => new Response('yok', { status: 404 }) });
  const { promise } = fire(env.handlers, 'fetch', { request: new Request(at('data/y.json')) });
  assert.equal((await promise).status, 404);
  assert.equal(env.store.get(CACHE).has(at('data/y.json')), false);
});

test('fetch: çevrimdışı gezinme önbellekteki index.html döner', async () => {
  const env = withCached({ network: offline });
  const { promise } = fire(env.handlers, 'fetch', { request: nav(at('')) });
  assert.equal(await (await promise).text(), 'cached-index');
});

test('fetch: çevrimdışı gezinme dışı kaçırma 503 döner', async () => {
  const env = withCached({ network: offline });
  const { promise } = fire(env.handlers, 'fetch', { request: new Request(at('img/z.png')) });
  assert.equal((await promise).status, 503);
});

test('fetch: POST ve çapraz kaynak istekleri işlenmez', async () => {
  const env = withCached();
  const a = fire(env.handlers, 'fetch', { request: new Request(at('js/app.js'), { method: 'POST', body: 'x' }) });
  assert.equal(a.responded, false);
  const b = fire(env.handlers, 'fetch', { request: new Request('https://other.example/js/app.js') });
  assert.equal(b.responded, false);
});

test('message: yalnızca SKIP_WAITING skipWaiting çağırır', () => {
  const env = makeEnv();
  env.handlers.message({ data: { type: 'baska' } });
  env.handlers.message({ data: null });
  assert.equal(env.calls.skipWaiting, 0);
  env.handlers.message({ data: { type: 'SKIP_WAITING' } });
  assert.equal(env.calls.skipWaiting, 1);
});
