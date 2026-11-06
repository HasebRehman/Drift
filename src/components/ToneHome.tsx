'use client';

import React, { useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import type { ToneProduct } from '@/data/driftData';
import { TONE_MAIN_HTML } from './ToneMainContentHtml';
import { TONE_TOP_HTML, TONE_FOOTER_HTML } from './ToneChromeHtml';

const SCRIPTS = ['/js/tone-init.js', '/js/vendor.js', '/js/theme.js'];

function loadScript(src: string) {
  return new Promise<void>((resolve) => {
    if (document.querySelector(`script[data-tone="${src}"]`)) return resolve();
    const s = document.createElement('script');
    s.src = src;
    s.async = false;
    s.dataset.tone = src;
    s.onload = () => resolve();
    s.onerror = () => resolve();
    document.body.appendChild(s);
  });
}

const prices = (t: string) =>
  (t.replace(/,/g, '').match(/\$\s*[\d.]+/g) || []).map((x) => parseFloat(x.replace('$', '')));

/** Whole Tone homepage: Tone's original markup + Tone's own theme scripts. */
export function ToneHome() {
  const { addItem, openCart } = useCart();

  // Keep our cart (Tone's Shopify cart API doesn't exist here): intercept before theme.js sees the event.
  useEffect(() => {
    const onSubmit = (e: Event) => {
      const form = (e.target as HTMLElement)?.closest?.(
        'form[data-product-form], form.quick__form'
      ) as HTMLFormElement | null;
      if (!form) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      const card = form.closest('.product-grid-item') as HTMLElement | null;
      if (!card) return;
      const text = (s: string) => card.querySelector(s)?.textContent?.replace(/\s+/g, ' ').trim() || '';
      const btn = form.querySelector('[data-add-to-cart]')?.textContent || '';
      const p = prices(card.querySelector('.product-shop-toggle__atc-price-suffix')?.textContent || btn);
      const pid = (form.querySelector('input[name="product-id"]') as HTMLInputElement | null)?.value;
      const idv = (form.querySelector('input[name="id"]') as HTMLInputElement | null)?.value;
      const title = text('.product-grid-item__title');
      const sub = text('h3');
      const img = card.querySelector('img') as HTMLImageElement | null;
      const product: ToneProduct = {
        id: idv || pid || title,
        slug: pid || title,
        title: title + (sub ? ` - ${sub}` : ''),
        category: 'SETS',
        price: p[0] ?? 0,
        compareAtPrice: p[1],
        scent: sub || 'Signature',
        scentNotes: text('.product-cutline') || '',
        scentColor: '#000000',
        image: img?.currentSrc || img?.src || '',
        badge: text('.product-badge, .badge'),
      };
      addItem(product);
      openCart();
    };
    const onClick = (e: Event) => {
      const t = e.target as HTMLElement;
      if (t.closest?.('form[data-product-form] [data-add-to-cart], form.quick__form [data-add-to-cart]')) {
        onSubmit(e);
        return;
      }
      if (t.closest?.('[data-cart-drawer-toggle]')) {
        e.preventDefault();
        e.stopImmediatePropagation();
        openCart();
      }
    };
    window.addEventListener('submit', onSubmit, true);
    window.addEventListener('click', onClick, true);
    return () => {
      window.removeEventListener('submit', onSubmit, true);
      window.removeEventListener('click', onClick, true);
    };
  }, [addItem, openCart]);

  // Always use the hamburger header (compact nav) on every screen width, like the screenshots.
  useEffect(() => {
    const header = document.getElementById('SiteHeader');
    if (!header) return;
    const force = () => {
      if (!header.classList.contains('site-header--compress')) header.classList.add('site-header--compress');
    };
    force();
    const mo = new MutationObserver(force);
    mo.observe(header, { attributes: true, attributeFilter: ['class'] });
    return () => mo.disconnect();
  }, []);

  // Load Tone's real theme scripts once, then fire DOMContentLoaded so they initialise.
  useEffect(() => {
    const w = window as unknown as { __toneBooted?: boolean };
    if (w.__toneBooted) return;
    w.__toneBooted = true;
    (async () => {
      for (const src of SCRIPTS) await loadScript(src);
      document.dispatchEvent(new Event('DOMContentLoaded', { bubbles: true }));
      window.dispatchEvent(new Event('load'));
      document.documentElement.classList.remove('page-loading');
    })();
  }, []);

  // One container so header, <main> and footer are siblings (Tone's footer-reveal script relies on that).
  return (
    <div
      id="tone-root"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: TONE_TOP_HTML + TONE_MAIN_HTML + '</main>' + TONE_FOOTER_HTML }}
    />
  );
}
