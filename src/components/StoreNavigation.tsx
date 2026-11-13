'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/** Upgrade the server-rendered storefront links without hydrating every card. */
export function StoreNavigation() {
  const router = useRouter();
  useEffect(() => {
    const prefetched = new Set<string>();
    const route = (target: EventTarget | null) => {
      const link = target instanceof Element ? target.closest<HTMLAnchorElement>('a[href]') : null;
      if (!link || link.target && link.target !== '_self' || link.hasAttribute('download')) return;
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin || url.hash || !/^\/(?:$|collections\/(?:men|women|bundles|shop-all)$|products\/[^/]+$|pages\/about$|checkout$)/.test(url.pathname)) return;
      return url.pathname + url.search;
    };
    const prefetch = (event: Event) => {
      const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
      if (connection?.saveData || connection?.effectiveType?.includes('2g')) return;
      const href = route(event.target);
      if (!href || prefetched.has(href) || href === location.pathname + location.search) return;
      prefetched.add(href);
      router.prefetch(href);
    };
    const click = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const href = route(event.target);
      if (!href) return;
      event.preventDefault();
      if (href !== location.pathname + location.search) router.push(href);
    };
    document.addEventListener('click', click);
    document.addEventListener('pointerover', prefetch, { passive: true });
    document.addEventListener('focusin', prefetch);
    return () => {
      document.removeEventListener('click', click);
      document.removeEventListener('pointerover', prefetch);
      document.removeEventListener('focusin', prefetch);
    };
  }, [router]);
  return null;
}
