'use client';
import React, { useEffect, useLayoutEffect } from 'react';
import { useCart } from '@/context/CartContext';
import type { ToneProduct } from '@/data/driftData';
import type { DriftProduct } from '@/data/driftProducts';
import { parsePrice } from '@/lib/prices';
import { mountStoreSearch } from './storeSearch';
import { mountStoreChrome } from './storeChrome';
import { mountHomeProductsCarousel } from './homeProductsCarousel';
import { mountNavigationDrawer } from './navigationDrawer';
import { readyTheme } from './themeRuntime';
type Card = { id: string; html: string };
type Props = { page: 'home' | 'shop-all' | 'men' | 'women' | 'bundles' | 'product' | 'about'; product?: DriftProduct; productImage?: string; cards?: Card[]; children: React.ReactNode };
function shuffleCards(cards: Card[]) {
  for (let i = cards.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [cards[i], cards[j]] = [cards[j], cards[i]]; }
  return cards;
}
function recommendations(cards: Card[], id = 'recently-viewed', title = 'RECENTLY VIEWED') {
  if (!cards.length) return '';
  return '<section class="shopify-section drift-recently-viewed" aria-labelledby="'+id+'-heading"><h2 id="'+id+'-heading">'+title+'</h2><div class="drift-recently-viewed__grid">'+cards.map(card => card.html.split('main-collection-shop-all').join(id)).join('')+'</div></section>';
}
const prices = (t: string) =>
  (t.replace(/,/g, '').match(/(?:\$|Rs\.?)\s*[\d.]+/gi) || []).map(parsePrice);

export function StorefrontRuntime({ page, product, productImage, cards = [], children }: Props) {
  const { addItem, openCart } = useCart();

  useEffect(() => mountStoreChrome(), [page, product, children]);
  useEffect(() => mountNavigationDrawer(), [page, product]);

  useEffect(() => {
    if (page === 'home') return mountHomeProductsCarousel();
  }, [page]);

  useEffect(() => {
    if (page !== 'home') return;
    const hero = document.getElementById('SectionBannerImage--template--24202507026729__section_banner_image_nMkEWC');
    if (!hero) return;
    const updateHeight = () => {
      // A compacting sticky header must not resize/re-crop the hero mid-scroll.
      if (window.scrollY > 1 && hero.style.getPropertyValue('--drift-hero-top')) return;
      const top = Math.max(0, hero.getBoundingClientRect().top + window.scrollY);
      hero.style.setProperty('--drift-hero-top', `${top}px`);
    };
    updateHeight();
    const header = document.getElementById('SiteHeader');
    const observer = new ResizeObserver(updateHeight);
    if (header) observer.observe(header);
    window.addEventListener('resize', updateHeight);
    window.addEventListener('load', updateHeight);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateHeight);
      window.removeEventListener('load', updateHeight);
    };
  }, [page]);

  useEffect(() => {
    if (page !== 'product' || !product) return;
    const section = document.getElementById('shopify-section-product-reviews');
    if (!section) return;
    let active = true;
    let cleanup: (() => void) | undefined;
    void import('./productReviews').then(({ mountProductReviews }) => {
      if (active) cleanup = mountProductReviews(section, { ...product, image: productImage! });
    });
    return () => { active = false; cleanup?.(); };
  }, [page, product]);

  useEffect(() => {
    if (page !== 'home') return;
    const section = document.getElementById('drift-instagram');
    if (!section) return;
    let active = true;
    let cleanup: (() => void) | undefined;
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      void import('./instagramFeed').then(({ mountInstagramFeed }) => {
        if (active) cleanup = mountInstagramFeed(section);
      });
    }, { rootMargin: '600px 0px' });
    observer.observe(section);
    return () => { active = false; observer.disconnect(); cleanup?.(); };
  }, [page]);

  useEffect(() => {
    if (page !== 'product' || !product) return;
    const container = document.querySelector('[data-related-products]');
    if (container) {
      container.innerHTML = recommendations(shuffleCards(cards.filter(card => card.id !== product.id)).slice(0, 4), 'related-products', 'RELATED PRODUCTS');
    }
  }, [page, product]);

  useEffect(() => {
    if (page !== 'product' || !product) return;
    const key = 'drift-recently-viewed';
    let history: string[] = [];
    try {
      const saved: unknown = JSON.parse(window.localStorage.getItem(key) || '[]');
      if (Array.isArray(saved)) {
        history = [...new Set(saved.filter((id): id is string => typeof id === 'string'))]
          .filter((id) => cards.some((item) => item.id === id));
      }
    } catch { /* Browsing still works when storage is unavailable. */ }
    const previous = history.filter((id) => id !== product.id).slice(0, 4);
    const products = previous.map((id) => cards.find((item) => item.id === id)!);
    const container = document.querySelector('[data-recently-viewed]');
    if (container) container.innerHTML = recommendations(products);
    try {
      window.localStorage.setItem(key, JSON.stringify([product.id, ...previous]));
    } catch { /* Storage can be disabled in the browser. */ }
  }, [page, product]);


  useEffect(() => mountStoreSearch(), [page]);

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
      if (!card) {
        const raw = form.getAttribute('data-drift-product');
        if (raw) {
          const d = JSON.parse(decodeURIComponent(raw));
          addItem({
            id: d.id,
            slug: d.handle,
            title: d.title,
            category: 'Fragrance',
            price: d.price,
            compareAtPrice: d.compare || undefined,
            scent: d.scent,
            scentNotes: d.notes,
            scentColor: '#000000',
            image: d.image,
          } as ToneProduct);
          openCart();
        }
        return;
      }
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
      // Product page mobile gallery arrows: scroll the photo slider one slide.
      const arrow = t.closest?.('.product-gallery-mobile-arrow') as HTMLElement | null;
      if (arrow) {
        e.preventDefault();
        e.stopImmediatePropagation();
        const slider = document.querySelector<HTMLElement>('[data-product-single-media-slider]');
        if (slider) {
          const dir = arrow.classList.contains('product-gallery-mobile-arrow--next') ? 1 : -1;
          slider.scrollBy({ left: dir * slider.clientWidth, behavior: 'smooth' });
        }
        return;
      }
      // Product page accordions (DETAILS / HOW TO USE): single-open, like Tone's.
      const accTrig = t.closest?.('.product__accordion__title') as HTMLElement | null;
      if (accTrig) {
        e.preventDefault();
        e.stopImmediatePropagation();
        const box = document.getElementById(accTrig.getAttribute('aria-controls') || '');
        if (!box) return;
        const open = !box.classList.contains('is-expanded');
        document.querySelectorAll<HTMLElement>('.product__accordion__title').forEach((other) => {
          const ob = document.getElementById(other.getAttribute('aria-controls') || '');
          if (ob && ob !== box) {
            ob.classList.remove('is-expanded');
            ob.style.height = '0px';
            other.classList.remove('is-expanded');
            other.setAttribute('aria-expanded', 'false');
          }
        });
        box.classList.toggle('is-expanded', open);
        box.style.height = open ? box.scrollHeight + 'px' : '0px';
        accTrig.classList.toggle('is-expanded', open);
        accTrig.setAttribute('aria-expanded', String(open));
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

  // Reset body styling on every client-side route change, including back home.
  useEffect(() => {
    document.body.classList.toggle('template-index', page === 'home');
    document.body.classList.toggle('template-collection', page !== 'home' && page !== 'product');
    document.body.classList.toggle('template-product', page === 'product');
  }, [page]);

  // Hero slideshow: one image at a time, smooth crossfade every few seconds.
  useEffect(() => {
    const slides = Array.from(document.querySelectorAll<HTMLElement>('[data-drift-hero] .drift-hero-slide'));
    if (slides.length < 2) return;
    let current = 0;
    let active = true;
    let visible = true;
    let loading = false;
    const prepare = async (slide: HTMLElement) => {
      const image = slide.querySelector('img')!;
      if (image.dataset.src) {
        image.srcset = image.dataset.srcset || '';
        image.src = image.dataset.src;
        delete image.dataset.src; delete image.dataset.srcset;
      }
      try { await image.decode(); } catch { /* Keep the current image if a slide fails. */ }
      return image.naturalWidth > 0;
    };
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; });
    observer.observe(slides[0].parentElement!);
    const preload = window.setTimeout(() => { if (visible && !document.hidden) void prepare(slides[1]); }, 1500);
    const id = window.setInterval(() => {
      if (!visible || document.hidden || loading || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const next = (current + 1) % slides.length;
      loading = true;
      void prepare(slides[next]).then(ready => {
        if (active && ready) {
          slides[current].classList.remove('is-active');
          current = next;
          slides[current].classList.add('is-active');
        }
        loading = false;
      });
    }, 5000);
    return () => { active = false; observer.disconnect(); window.clearInterval(id); window.clearTimeout(preload); };
  }, []);

  // Reuse downloaded scripts, but mount/unmount widgets for each route.
  useLayoutEffect(() => {
    const root = document.getElementById('tone-root');
    if (!root) return;
    const containers = Array.from(root.querySelectorAll('[data-section-type]'));
    let disposed = false;
    void readyTheme().then(() => {
      if (disposed || !root.isConnected) return;
      window.driftTheme?.mount(root);
      document.dispatchEvent(new Event('theme:resize'));
    });
    return () => {
      disposed = true;
      root.querySelectorAll('search-popdown:has(details[open])').forEach(search => {
        const popdown = search as HTMLElement & { close?: () => void; onClose?: () => void };
        popdown.close?.();
        popdown.onClose?.();
      });
      window.driftTheme?.unmount(containers);
    };
  }, []);

  return children;
}
