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
  w.HTMLCanvasElement.prototype.getContext = () => null;
  w.HTMLElement.prototype.setPointerCapture = () => {};
  w.HTMLElement.prototype.releasePointerCapture = () => {};
  return w;
}
