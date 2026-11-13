export function withNavigationDrawer(html: string) {
  return html
    .replace('class="drawer drawer--left drawer--nav cv-h"', 'class="drift-nav-panel drawer--nav" aria-hidden="true" inert')
    .replace(/aria-controls="nav-drawer" data-drawer-toggle/g, 'aria-controls="nav-drawer" aria-expanded="false" data-drift-nav-toggle')
    .replace('role="navigation" data-drawer', 'role="dialog" aria-modal="true" aria-label="Navigation menu"');
}

export function mountNavigationDrawer() {
  const drawer = document.getElementById('nav-drawer');
  if (!drawer) return;
  const parent = drawer.parentNode!;
  const sibling = drawer.nextSibling;
  const overlay = document.createElement('div');
  overlay.className = 'drift-nav-backdrop';
  overlay.setAttribute('aria-hidden', 'true');
  // Keep the fixed drawer outside the header's animated stacking context.
  document.body.append(overlay, drawer);
  let isOpen = false;
  let trigger: HTMLElement | null = null;
  let previousOverflow = '';
  let locked = false;
  let unlockTimer: number | undefined;
  const unlock = () => {
    window.clearTimeout(unlockTimer);
    if (!locked) return;
    document.documentElement.style.overflow = previousOverflow;
    document.documentElement.classList.remove('drift-nav-open');
    locked = false;
  };
  const focusables = () => Array.from(drawer.querySelectorAll<HTMLElement>('a[href], button, [tabindex="0"]')).filter(el => el.getClientRects().length > 0);
  const setOpen = (open: boolean) => {
    if (open === isOpen) return;
    isOpen = open;
    drawer.classList.toggle('is-open', open);
    overlay.classList.toggle('is-open', open);
    drawer.inert = !open;
    drawer.setAttribute('aria-hidden', String(!open));
    document.querySelectorAll('[data-drift-nav-toggle]').forEach(button => button.setAttribute('aria-expanded', String(open)));
    if (open) {
      window.clearTimeout(unlockTimer);
      if (!locked) previousOverflow = document.documentElement.style.overflow;
      locked = true;
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.classList.add('drift-nav-open');
      drawer.querySelector<HTMLElement>('.drawer__close-button')?.focus({ preventScroll: true });
    } else {
      // Restore the normal scrollbar only after the full-width backdrop fades.
      unlockTimer = window.setTimeout(unlock, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 360);
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    }
  };
  const click = (event: MouseEvent) => {
    const target = event.target instanceof Element ? event.target : null;
    const button = target?.closest<HTMLElement>('[data-drift-nav-toggle]');
    if (button) {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (!drawer.contains(button)) trigger = button;
      setOpen(!isOpen);
    } else if (target === overlay) {
      event.preventDefault();
      event.stopImmediatePropagation();
      setOpen(false);
    } else if (isOpen && target?.closest('a[href]') && drawer.contains(target)) {
      setOpen(false);
    }
  };
  const keydown = (event: KeyboardEvent) => {
    if (!isOpen) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopImmediatePropagation();
      setOpen(false);
    } else if (event.key === 'Tab') {
      const items = focusables();
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && (document.activeElement === first || !drawer.contains(document.activeElement))) {
        event.preventDefault(); last?.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !drawer.contains(document.activeElement))) {
        event.preventDefault(); first?.focus();
      }
    }
  };
  const pagehide = () => { setOpen(false); unlock(); };
  document.addEventListener('click', click, true);
  document.addEventListener('keydown', keydown, true);
  window.addEventListener('pagehide', pagehide);
  return () => {
    setOpen(false);
    unlock();
    document.removeEventListener('click', click, true);
    document.removeEventListener('keydown', keydown, true);
    window.removeEventListener('pagehide', pagehide);
    overlay.remove();
    parent.insertBefore(drawer, sibling?.parentNode === parent ? sibling : null);
  };
}
