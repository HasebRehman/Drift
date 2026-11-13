type ThemeBridge = { mount: (root: Element) => void; unmount: (containers: Element[]) => void };
declare global { interface Window { driftTheme?: ThemeBridge; __driftThemeReady?: Promise<void> } }

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[data-tone="${src}"]`);
    if (existing?.dataset.loaded) { resolve(); return; }
    const script = existing || document.createElement('script');
    script.addEventListener('load', () => { script.dataset.loaded = 'true'; resolve(); }, { once: true });
    script.addEventListener('error', () => { script.remove(); reject(new Error('Theme asset failed: ' + src)); }, { once: true });
    if (!existing) { script.src = src; script.async = false; script.dataset.tone = src; document.body.appendChild(script); }
  });
}

export function readyTheme() {
  return window.__driftThemeReady ||= (async () => {
    for (const src of ['/js/tone-init.js', '/js/vendor.js', '/js/theme.js']) await loadScript(src);
    document.dispatchEvent(new Event('DOMContentLoaded', { bubbles: true }));
    window.dispatchEvent(new Event('load'));
    document.documentElement.classList.remove('page-loading');
  })().catch(error => {
    window.__driftThemeReady = undefined;
    document.documentElement.classList.remove('page-loading');
    console.warn(error);
  });
}
