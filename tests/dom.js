import { JSDOM } from 'jsdom';
export function setupDom() {
  const dom = new JSDOM('<!doctype html><html><body><div id="view"></div></body></html>', { pretendToBeVisual: true });
  const w = dom.window;
  for (const k of ['window', 'document', 'Node', 'HTMLElement', 'Element', 'MouseEvent', 'Event', 'CustomEvent', 'requestAnimationFrame', 'getComputedStyle', 'navigator', 'location']) {
    try { globalThis[k] = w[k]; } catch {}
  }
  if (!w.PointerEvent) {
    w.PointerEvent = class PointerEvent extends w.MouseEvent {
      constructor(type, init = {}) { super(type, init); this.pointerType = init.pointerType ?? 'mouse'; this.pressure = init.pressure ?? 0.5; this.pointerId = init.pointerId ?? 1; }
    };
  }
  globalThis.PointerEvent = w.PointerEvent;
  w.scrollBy = () => {};
  w.HTMLCanvasElement.prototype.getContext = function () {
    if (this.__ctx) return this.__ctx;
    const calls = [];
    const ctx = { calls, canvas: this, globalCompositeOperation: 'source-over', strokeStyle: '', fillStyle: '', lineWidth: 1, lineCap: 'butt', lineJoin: 'miter' };
    for (const n of ['save', 'restore', 'beginPath', 'moveTo', 'lineTo', 'arc', 'fill', 'clearRect']) ctx[n] = (...a) => { calls.push([n, ...a]); };
    ctx.stroke = () => { calls.push(['stroke', ctx.globalCompositeOperation]); };
    return (this.__ctx = ctx);
  };
  w.HTMLElement.prototype.setPointerCapture = () => {};
  w.HTMLElement.prototype.releasePointerCapture = () => {};
  return w;
}
