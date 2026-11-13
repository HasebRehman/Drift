export function withNavigationDrawer(html: string) {
  return html
    // Our fixed header/menu/search own this UI; the old header controller
    // expects a Shopify drawer inside it and cannot survive route changes.
    .replace('data-section-type="header"', 'data-section-type="drift-header"')
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
  let closing = false;
  let closeTimer: number | undefined;
  let closeVersion = 0;
  const unlock = () => {
    if (!locked) return;
    document.documentElement.style.overflow = previousOverflow;
    document.documentElement.classList.remove('drift-nav-open');
    locked = false;
  };
  const finishClose = (restoreFocus = true) => {
    if (isOpen) return;
    window.clearTimeout(closeTimer);
    closing = false;
    drawer.classList.remove('is-active');
    overlay.classList.remove('is-active');
    unlock();
    if (restoreFocus && trigger?.isConnected) trigger.focus({ preventScroll: true });
  };
  const focusables = () => Array.from(drawer.querySelectorAll<HTMLElement>('a[href], button, [tabindex="0"]')).filter(el => el.getClientRects().length > 0);
  const setOpen = (open: boolean) => {
    if (open === isOpen) return;
    isOpen = open;
    const version = ++closeVersion;
    window.clearTimeout(closeTimer);
    if (open) {
      document.querySelectorAll('search-popdown:has(details[open])').forEach(search => {
        (search as HTMLElement & { close?: () => void }).close?.();
      });
      closing = false;
      drawer.classList.add('is-active');
      overlay.classList.add('is-active');
    }
    drawer.classList.toggle('is-open', open);
    overlay.classList.toggle('is-open', open);
    drawer.inert = !open;
    drawer.setAttribute('aria-hidden', String(!open));
    document.querySelectorAll('[data-drift-nav-toggle]').forEach(button => button.setAttribute('aria-expanded', String(open)));
    if (open) {
      if (!locked) previousOverflow = document.documentElement.style.overflow;
      locked = true;
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.classList.add('drift-nav-open');
      drawer.querySelector<HTMLElement>('.drawer__close-button')?.focus({ preventScroll: true });
    } else {
      closing = true;
      // Focus the header only after the drawer has left the screen. Moving
      // focus during the slide can trigger expensive header/search layout work.
      if (drawer.contains(document.activeElement)) (document.activeElement as HTMLElement)?.blur();
      const finish = () => { if (version === closeVersion && closing) finishClose(); };
      // Read active transitions instead of assuming they started when clicked.
      // This also handles reversing an opening animation and reduced motion.
      const animations = drawer.getAnimations().filter(animation =>
        animation instanceof CSSTransition && animation.transitionProperty === 'transform');
      if (!animations.length) finish();
      else {
        void Promise.all(animations.map(animation => animation.finished)).then(finish, () => {
          // A reopen invalidates this close; a cancelled close still finishes.
          finish();
        });
        // Safety net for removed nodes/background tabs that miss transitionend.
        const duration = Math.max(...animations.map(animation => Number(animation.effect?.getComputedTiming().endTime) || 0));
        closeTimer = window.setTimeout(finish, duration + 150);
      }
    }
  };
  const click = (event: MouseEvent) => {
    const target = event.target instanceof Element ? event.target : null;
    const button = target?.closest<HTMLElement>('[data-drift-nav-toggle]');
    if (button) {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (!drawer.contains(button)) trigger = button;
      if (drawer.contains(button)) setOpen(false);
      else setOpen(!isOpen);
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
  const transitionEnd = (event: TransitionEvent) => {
    if (event.target === drawer && event.propertyName === 'transform' && closing) finishClose();
  };
  const visibility = () => { if (document.hidden && closing) finishClose(false); };
  const pagehide = () => { setOpen(false); finishClose(false); };
  document.addEventListener('click', click, true);
  document.addEventListener('keydown', keydown, true);
  drawer.addEventListener('transitionend', transitionEnd);
  document.addEventListener('visibilitychange', visibility);
  window.addEventListener('pagehide', pagehide);
  return () => {
    setOpen(false);
    finishClose(false);
    document.removeEventListener('click', click, true);
    document.removeEventListener('keydown', keydown, true);
    drawer.removeEventListener('transitionend', transitionEnd);
    document.removeEventListener('visibilitychange', visibility);
    window.removeEventListener('pagehide', pagehide);
    overlay.remove();
    parent.insertBefore(drawer, sibling?.parentNode === parent ? sibling : null);
  };
}
