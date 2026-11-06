'use client';

import React, { useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import type { ToneProduct } from '@/data/driftData';
import { TONE_MAIN_HTML } from './ToneMainContentHtml';
import { TONE_TOP_HTML, TONE_FOOTER_HTML } from './ToneChromeHtml';

// Hero: replace Tone's single banner picture with a 3-image crossfading slideshow.
const HERO_IMAGES = ['/assets/hero_img_1.jpg', '/assets/hero-img-2.jpg', '/assets/hero_img_3.jpg'];
const HERO_SLIDES =
  '<div class="drift-hero-slides" data-drift-hero>' +
  HERO_IMAGES.map(
    (src, i) =>
      `<div class="drift-hero-slide${i === 0 ? ' is-active' : ''}"><img src="${src}" alt="Drift hero ${i + 1}" loading="eager" ${i === 0 ? 'fetchpriority="high"' : ''}></div>`
  ).join('') +
  '</div>';
function withHeroSlides(html: string) {
  const inner = html.indexOf('data-banner-image>');
  if (inner < 0) return html;
  const start = html.indexOf('<style data-shopify>', inner);
  const endTag = '</picture>';
  const end = html.indexOf(endTag, start);
  if (start < 0 || end < 0) return html;
  return html.slice(0, start) + HERO_SLIDES + html.slice(end + endTag.length);
}
// "Shop by category" grid: our own images, labels and links (in DOM order).
const CATEGORIES = [
  { label: 'MEN', img: '/assets/men.webp', href: '/collections/men' },
  { label: 'WOMEN', img: '/assets/women.webp', href: '/collections/women' },
  { label: 'BUNDLES', img: '/assets/bundles.webp', href: '/collections/bundles' },
  { label: 'SHOP ALL', img: '/assets/shopall.webp', href: '/collections/shop-all' },
];
function withCategories(html: string) {
  const start = html.indexOf('<section id="sectionMosaicGrid');
  const end = html.indexOf('</section>', start);
  if (start < 0 || end < 0) return html;
  let sec = html.slice(start, end);
  let from = 0;
  for (const c of CATEGORIES) {
    // image
    const i0 = sec.indexOf('<img ', from);
    if (i0 < 0) break;
    const i1 = sec.indexOf('>', i0) + 1;
    sec = sec.slice(0, i0) + `<img src="${c.img}" alt="${c.label}" loading="lazy" class="">` + sec.slice(i1);
    // heading text
    const h0 = sec.indexOf('class="mosaic__item__heading h2"', i0);
    const t0 = sec.indexOf('>', h0) + 1;
    const t1 = sec.indexOf('</h3>', t0);
    sec = sec.slice(0, t0) + c.label + sec.slice(t1);
    // link
    const a0 = sec.indexOf('<a href="', t1);
    const a1 = sec.indexOf('"', a0 + 9);
    sec = sec.slice(0, a0 + 9) + c.href + sec.slice(a1);
    from = a1;
  }
  return html.slice(0, start) + sec + html.slice(end);
}

// Centre the hero headline + button (Tone's default is bottom-left).
const MAIN_HTML = withCategories(withHeroSlides(TONE_MAIN_HTML))
  .replace('item--bottom-left text-left text-light', 'item--center text-center text-light')
  .replace('<span class="text-highlight__break">Shop by scent</span>', '<span class="text-highlight__break">Shop by category</span>');

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

  // Hero slideshow: one image at a time, smooth crossfade every few seconds.
  useEffect(() => {
    const slides = Array.from(document.querySelectorAll<HTMLElement>('[data-drift-hero] .drift-hero-slide'));
    if (slides.length < 2) return;
    let current = 0;
    const id = window.setInterval(() => {
      slides[current].classList.remove('is-active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('is-active');
    }, 5000);
    return () => window.clearInterval(id);
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
      dangerouslySetInnerHTML={{ __html: TONE_TOP_HTML + MAIN_HTML + '</main>' + TONE_FOOTER_HTML }}
    />
  );
}
