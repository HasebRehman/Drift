'use client';

import React, { useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import type { ToneProduct } from '@/data/driftData';
import { SHOP_ALL, type DriftProduct } from '@/data/driftProducts';
import { TONE_MAIN_HTML } from './ToneMainContentHtml';
import { TONE_TOP_HTML, TONE_FOOTER_HTML } from './ToneChromeHtml';
import { mountInstagramFeed } from '@/components/instagramFeed';
import { mountProductReviews } from '@/components/productReviews';
import { parsePrice } from '@/lib/prices';
import { withStoreSearch, mountStoreSearch } from './storeSearch';
import { withStoreAnnouncement, withStoreFooter, mountStoreChrome } from './storeChrome';
import { withHomeProductsCarousel, mountHomeProductsCarousel } from './homeProductsCarousel';
import { withNavigationDrawer, mountNavigationDrawer } from './navigationDrawer';

// Hero: replace Tone's single banner picture with a 3-image crossfading slideshow.
const HERO_IMAGES = [
  { src: '/assets/hero_img_1.jpg', alt: 'DRIFT fragrance lifestyle collection' },
  { src: '/assets/hero-img-2.jpg', alt: 'IT Girl and Baddie perfumed mists with berries, jasmine and vanilla' },
  { src: '/assets/hero_img_3.jpg', alt: 'Hero, Muse, Rebel and Ignite perfumed mists' },
];
const HERO_SLIDES =
  '<div class="drift-hero-slides" data-drift-hero>' +
  HERO_IMAGES.map(
    (slide, i) =>
      `<div class="drift-hero-slide${i === 0 ? ' is-active' : ''}"><img src="${slide.src}" alt="${slide.alt}" loading="eager" ${i === 0 ? 'fetchpriority="high"' : ''}></div>`
  ).join('') +
  '</div>';
function withHeroSlides(html: string) {
  html = html.replace('banner-image banner-image--zoom-out banner--no-animation card-scrolling-effect--rounded-large section-padding', 'banner-image banner--no-animation section-padding');
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
  { label: 'MEN', img: '/assets/category-men-v2.webp', href: '/collections/men' },
  { label: 'WOMEN', img: '/assets/category-women-v2.webp', href: '/collections/women' },
  { label: 'BUNDLES', img: '/assets/category-bundles-v2.webp', href: '/collections/bundles' },
  { label: 'SHOP ALL', img: '/assets/category-shop-all-v2.webp', href: '/collections/shop-all' },
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

// Product cards in the first split section: data + images from driftretail.com/collections/women
// (card markup/styling stays Tone's; only text, prices, images and links change).
const CDN = 'https://cdn.shopify.com/s/files/1/0739/6166/8743/files/';
const WOMEN_PRODUCTS: DriftProduct[] = [
  {
    id: '8949395259527',
    handle: 'baddie-too-rare-too-real',
    title: 'BADDIE — Too Rare, Too Real',
    price: 'Rs.1,399',
    compare: 'Rs.1,999',
    pct: 30,
    images: ['IT1.jpg?v=1793363872', 'IT2.jpg?v=1793363872', 'IT3.jpg?v=1793363871'],
  },
  {
    id: '8949397848199',
    handle: 'it-girl-in-my-element',
    title: 'IT GIRL — In My Element',
    price: 'Rs.1,399',
    compare: 'Rs.1,999',
    pct: 30,
    images: [
      'IT1_b941ee24-b4ce-4cae-84b6-aa55ab7973a0.jpg?v=1793364137',
      'IT2_b6b7c519-87c7-4668-be22-772b982e362d.jpg?v=1793364137',
      'IT3_c4635fea-9ee4-429b-82e9-07af7077cd49.jpg?v=1793364137',
    ],
  },
  {
    id: '8618891903111',
    handle: 'muse-attraction',
    title: 'MUSE — Grace',
    price: 'Rs.1,399',
    compare: 'Rs.1,999',
    pct: 30,
    images: ['p4_1.jpg?v=1785413472', 'P4_2.jpg?v=1785413472', 'p4_3.jpg?v=1785413472'],
  },
];
const imgUrl = (f: string) => `${CDN}${f}${f.includes('?') ? '&' : '?'}width=1000`;
function replaceBetween(s: string, a: string, b: string, neu: string, from = 0) {
  const i = s.indexOf(a, from);
  if (i < 0) return s;
  const j = s.indexOf(b, i + a.length);
  if (j < 0) return s;
  return s.slice(0, i) + neu + s.slice(j);
}
type CardCfg = {
  sectionId: string; // e.g. section_products_with_image_kqegbH
  marker: string; // start of each product card
  tplIndex: number; // which existing card to use as the template
  tailMarks: string[]; // how the LAST card ends (first one found is used)
  tplHandle: string; // template card's product handle path
  tplTitleText: string; // text inside the title <a> of the template
  tplAlt: string; // template main-image alt text
  tplAria: string; // template aria-label
  tplProductId: string; // template product id
  products: DriftProduct[];
  contentImage?: string; // replace the big feature image
  contentAlt?: string;
  contentHref?: string;
};

function buildProductCard(tpl: string, p: DriftProduct, cfg: CardCfg) {
  let c = tpl;
  const url = `/products/${p.handle}`;
  c = c.split(cfg.tplHandle).join(url);
  c = c.split(`aria-label="${cfg.tplAria}"`).join(`aria-label="${p.title}"`);
  c = c.split(cfg.tplAlt).join(p.title);
  // all of the product's photos: >1 photo -> hover slideshow, 1 photo -> no hover scrolling
  const imgs = p.images.map(imgUrl);
  // images: main + hover slides (one slide per extra photo)
  let k = 0;
  c = c.replace(/<img [^>]*>/g, (m) => {
    const idx = k++;
    if (idx >= imgs.length) return m;
    return `<img src="${imgs[idx]}" alt="${p.title}" width="1000" height="1000" loading="lazy" class="">`;
  });
  const slideTag = '<div class="product__media__slide" data-hover-slideshow-item>';
  if (imgs.length <= 1) {
    // single photo: drop the whole hover slideshow + progress bar
    const h0 = c.indexOf('<div class="product__media__hover');
    const h1 = h0 >= 0 ? c.indexOf('</a>', h0) : -1;
    if (h0 >= 0 && h1 >= 0) c = c.slice(0, h0) + c.slice(h1);
    // the main photo must not slide away on hover when there is no second photo to slide in
    c = c.split(' product__media__image--hover-slide').join('');
  } else {
    // remove surplus slides (keep imgs.length - 1)
    const slideStarts: number[] = [];
    for (let i = c.indexOf(slideTag); i >= 0; i = c.indexOf(slideTag, i + 1)) slideStarts.push(i);
    for (let n = slideStarts.length - 1; n >= imgs.length - 1; n--) {
      const s = slideStarts[n];
      const e = c.indexOf('</figure></div>', s) + '</figure></div>'.length;
      c = c.slice(0, s) + c.slice(e);
    }
  }
  // title line; drop subtitle + scent lines
  c = replaceBetween(c, ` ${cfg.tplTitleText}</a>`, '<!-- <div class="yotpo', ` ${p.title}</a>\n  `);
  c = replaceBetween(c, '<!-- FRESHWATER: product subtitle -->', '<!-- <p style="margin: 0 0 5px; font-size: 12px;">', '');
  // badge ("Save 30%") if the template has one
  if (c.includes('<span>Save ')) {
    c = p.pct > 0 ? replaceBetween(c, '<span>Save ', '</span>', `<span>Save ${p.pct}%`) : c;
  }
  // price inside the Add to Cart button
  c = replaceBetween(
    c,
    '<span class="product-shop-toggle__atc-sep" aria-hidden="true"> • </span>',
    '</span></span>',
    `<span class="product-shop-toggle__atc-sep" aria-hidden="true"> • </span>\n        ${p.price}\n` +
      (p.compare ? `<s class="product-shop-toggle__compare-price">${p.compare}</s>` : '')
  );
  c = c.replace(/(<input type="hidden" name="product-id" value=")\d+(")/, `$1${p.id}$2`);
  c = c.split(cfg.tplProductId).join(p.id);
  return c;
}

function withProducts(html: string, cfg: CardCfg) {
  const st = html.indexOf(`id="FeaturedCollection--template--24202507026729__${cfg.sectionId}"`);
  if (st < 0) return html;
  const end = html.indexOf('</section>', st);
  let sec = html.slice(st, end);
  if (cfg.contentHref) {
    sec = sec.replace(/(<a\b[^>]*class="featured-collection__content-link"[^>]*href=")[^"]*(")/, `$1${cfg.contentHref}$2`);
  }
  const starts: number[] = [];
  for (let i = sec.indexOf(cfg.marker); i >= 0; i = sec.indexOf(cfg.marker, i + 1)) starts.push(i);
  if (starts.length < cfg.tplIndex + 2) return html;
  const tpl = sec.slice(starts[cfg.tplIndex], starts[cfg.tplIndex + 1]);
  const lastStart = starts[starts.length - 1];
  let lastEnd = -1;
  for (const tm of cfg.tailMarks) {
    const t = sec.lastIndexOf(tm);
    if (t > lastStart) {
      lastEnd = t + tm.length;
      break;
    }
  }
  if (lastEnd < 0) return html;
  const cards = cfg.products.map((p) => buildProductCard(tpl, p, cfg)).join('');
  sec = sec.slice(0, starts[0]) + cards + sec.slice(lastEnd);
  if (cfg.contentImage) {
    const ci = sec.indexOf('featured-collection__content-image');
    const i0 = sec.indexOf('<img ', ci);
    const i1 = sec.indexOf('>', i0) + 1;
    if (ci >= 0 && i0 >= 0) {
      sec =
        sec.slice(0, i0) +
        `<img src="${cfg.contentImage}" alt="${esc(cfg.contentAlt || 'Drift')}" width="2000" height="2000" loading="eager" class="object-cover" style="opacity: 1 !important; visibility: visible !important;">` +
        sec.slice(i1);
    }
  }
  return html.slice(0, st) + sec + html.slice(end);
}

const MEN_PRODUCTS: DriftProduct[] = [
  {
    id: '8618882433159',
    handle: 'hero-confidence',
    title: 'HERO — Legacy',
    price: 'Rs.1,399',
    compare: 'Rs.1,999',
    pct: 30,
    images: ['p1_1.jpg?v=1785413541', 'p1_2.jpg?v=1785413541', 'p1_3.jpg?v=1785413541'],
  },
  {
    id: '8618895573127',
    handle: 'rebel-expression',
    title: 'REBEL — Freedom',
    price: 'Rs.1,399',
    compare: 'Rs.1,999',
    pct: 30,
    images: ['p2_1.jpg?v=1785413436', 'p2_2.jpg?v=1785413437', 'p2_3.jpg?v=1785413436'],
  },
  {
    id: '8618890133639',
    handle: 'ignite-energy',
    title: 'IGNITE — Momentum',
    price: 'Rs.1,399',
    compare: 'Rs.1,999',
    pct: 30,
    images: ['p3_1.jpg?v=1785413503', 'p3_2.jpg?v=1785413503', 'p3_3.jpg?v=1785413503'],
  },
];

const SPLIT_MARKER = '<div class="product-grid-item grid__item';
const SPLIT_TAIL = ['</form></div>\n</div>\n</div>'];

function withDriftProducts(html: string) {
  // "Featured Sets" carousel -> driftretail shop-all
  html = withProducts(html, {
    sectionId: 'section_collection_8QxVfk',
    marker: '<div class="product-grid-item carousel__item',
    tplIndex: 0,
    tailMarks: ['</a></div>\n</div>\n</div>', '</form></div>\n</div>\n</div>'],
    tplHandle: '/products/fresh-scent-layering-routine',
    tplTitleText: 'Scent Layering Routine',
    tplAlt: 'TONE_Fresh_Collection_1x1_1500.jpg',
    tplAria: 'Fresh Scent Layering Routine',
    tplProductId: '15384659493161',
    products: SHOP_ALL,
  });
  html = withProducts(html, {
    sectionId: 'section_products_with_image_kqegbH',
    marker: SPLIT_MARKER,
    tplIndex: 0,
    tailMarks: SPLIT_TAIL,
    tplHandle: '/products/island-breeze-body-wash',
    tplTitleText: 'Body Wash',
    tplAlt: 'TONE - Body Wash - Island Breeze',
    tplAria: 'Island Breeze Body Wash',
    tplProductId: '10096384508201',
    products: WOMEN_PRODUCTS,
    contentImage: '/assets/women-lifestyle-v2.webp',
    contentAlt: 'Woman holding a magenta DRIFT perfumed mist on a sunlit garden terrace',
    contentHref: '/collections/women',
  });
  return withProducts(html, {
    sectionId: 'section_products_with_image_ncxLcR',
    marker: SPLIT_MARKER,
    tplIndex: 1,
    tailMarks: SPLIT_TAIL,
    tplHandle: '/products/island-breeze-deodorant',
    tplTitleText: 'Deodorant',
    tplAlt: 'TONE - Deodorant - Island Breeze',
    tplAria: 'Island Breeze Deodorant',
    tplProductId: '10096388604201',
    products: MEN_PRODUCTS,
    contentImage: '/assets/men-lifestyle-v3.webp',
    contentAlt: 'Man holding a purple Ignite perfumed mist on an urban rooftop at dusk',
    contentHref: '/collections/men',
  });
}

// Side menu (drawer): replace Tone's menu items with our four category links.
const MENU_LINKS = [
  { label: 'MEN', href: '/collections/men' },
  { label: 'WOMEN', href: '/collections/women' },
  { label: 'BUNDLES', href: '/collections/bundles' },
  { label: 'SHOP ALL', href: '/collections/shop-all' },
];
function withSideMenu(html: string) {
  const open = '<ul class="mobile-nav mobile-nav--weight-light">';
  const a = html.indexOf(open);
  const b = html.indexOf('</ul><ul class="mobile-nav mobile-nav--bottom', a);
  if (a < 0 || b < 0) return html;
  const items = MENU_LINKS.map(
    (m) =>
      `<li class="mobile-menu__item mobile-menu__item--level-1">\n    <a href="${m.href}" class="mobile-navlink mobile-navlink--level-1">${m.label}</a>\n  </li>`
  ).join('');
  let out = html.slice(0, a + open.length) + items + html.slice(b);

  // remove the bottom block (Log in / Create account / Search)
  const botStart = out.indexOf('<ul class="mobile-nav mobile-nav--bottom');
  if (botStart >= 0) {
    const botEnd = out.indexOf('</ul>', botStart) + '</ul>'.length;
    out = out.slice(0, botStart) + out.slice(botEnd);
  }

  // drawer logo -> DRIFT logo (same as the header)
  out = out.replace('<a href="https://tone.shop/" class="drawer__logo">', '<a href="/" class="drawer__logo">');
  const logoA = out.indexOf('<a href="/" class="drawer__logo">');
  const logoA2 = logoA >= 0 ? logoA : out.indexOf('class="drawer__logo"');
  if (logoA2 >= 0) {
    const i0 = out.indexOf('<img ', logoA2);
    const i1 = out.indexOf('>', i0) + 1;
    out =
      out.slice(0, i0) +
      '<img src="/assets/drift_black.svg" alt="Drift logo" width="150" height="47" class="drawer__logo-image">' +
      out.slice(i1);
  }
  return out;
}
// Final header state baked into the server HTML (hamburger layout) so nothing flashes on page load.
const TOP_HTML = withNavigationDrawer(withStoreAnnouncement(withStoreSearch(withSideMenu(TONE_TOP_HTML)))).replace(
  'site-header site-header--fixed site-header--nav-left site-header--nav-light site-header--has-logo',
  'site-header site-header--fixed site-header--nav-left site-header--nav-light site-header--has-logo site-header--compress'
);

const HOME_BRAND_STORY =
  `<section class="shopify-section drift-brand-story" aria-labelledby="drift-brand-story-title">` +
  `<div class="drift-brand-story__inner">` +
  `<h2 id="drift-brand-story-title">OWN YOUR FLOW</h2>` +
  `<p>Drift is built for the dreamers, creators, and doers who choose progress over comfort. Every fragrance is designed to inspire confidence, self-expression, and momentum because success isn't about standing still. It's about owning every step of your journey.</p>` +
  `<a href="/pages/about">Learn more</a>` +
  `</div></section>`;

const HOME_INSTAGRAM =
  `<section id="drift-instagram" class="shopify-section drift-instagram" aria-labelledby="drift-instagram-title">
    <div class="drift-instagram__heading"><h2 id="drift-instagram-title">FOLLOW THE FLOW</h2>
    <p>Scents, stories, and everyday moments with DRIFT.</p>
    <a href="https://www.instagram.com/drift.retail/" target="_blank" rel="noopener noreferrer">@drift.retail</a></div>
    <div class="drift-instagram__slider">
    <div class="drift-instagram__controls" hidden><button type="button" data-instagram-prev aria-label="Previous Instagram posts"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m14 5-7 7 7 7"/></svg></button><button type="button" data-instagram-next aria-label="Next Instagram posts"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m10 5 7 7-7 7"/></svg></button></div>
    <div class="drift-instagram__carousel" role="region" aria-label="Latest Instagram posts" tabindex="0"></div>
    </div>
    <p class="drift-instagram__empty" role="status">Loading our latest Instagram moments...</p>
  </section>`;

// Two-line DRIFT campaign heading above the homepage shopping CTA.
const MAIN_HTML = withHomeProductsCarousel(withDriftProducts(withCategories(withHeroSlides(TONE_MAIN_HTML))))
  .replaceAll('href="/collections"', 'href="/collections/shop-all"')
  .replace(/<p\b[^>]*id="BannerHeading--heading_qgRVFb"[\s\S]*?<\/p>/, '<h1 class="drift-hero-heading">FIND YOUR SCENT<br />OWN YOUR FLOW</h1>')
  .replace('item--bottom-left text-left text-light', 'item--center text-center text-light')
  .replace('<span class="text-highlight__break">Shop by scent</span>', '<span class="text-highlight__break">Shop by category</span>')
  .replace('<div id="shopify-section-template--24202507026729__section_newsletter_YdgKe3"', HOME_BRAND_STORY + '<div id="shopify-section-template--24202507026729__section_newsletter_YdgKe3"');

// ---------------------------------------------------------------------------
// /collections/shop-all page: Tone collection-page structure + driftretail products,
// using the same product card as the home page "Featured Sets" carousel.
// ---------------------------------------------------------------------------
function collectionCards(html: string, products: DriftProduct[]): string {
  const st = html.indexOf('id="FeaturedCollection--template--24202507026729__section_collection_8QxVfk"');
  if (st < 0) return '';
  const end = html.indexOf('</section>', st);
  const sec = html.slice(st, end);
  const marker = '<div class="product-grid-item carousel__item';
  const first = sec.indexOf(marker);
  const second = sec.indexOf(marker, first + 1);
  if (first < 0 || second < 0) return '';
  const tpl = sec.slice(first, second);
  const cfg: CardCfg = {
    sectionId: 'section_collection_8QxVfk',
    marker,
    tplIndex: 0,
    tailMarks: [],
    tplHandle: '/products/fresh-scent-layering-routine',
    tplTitleText: 'Scent Layering Routine',
    tplAlt: 'TONE_Fresh_Collection_1x1_1500.jpg',
    tplAria: 'Fresh Scent Layering Routine',
    tplProductId: '15384659493161',
    products,
  };
  return products.map((p, i) =>
    buildProductCard(tpl, p, cfg)
      .replace('carousel__item one-quarter', 'grid__item one-quarter')
      .replace('grid-item--column-1', `grid-item--column-${(i % 4) + 1}`)
      .replace(/data-slide\s*/, '')
      .split('section_collection_8QxVfk').join('main-collection-shop-all')
  ).join('');
}

// Trust row under the product grid (same "icons row" component/design as the home page, white background).
const TRUST_ITEMS = [
  {
    title: 'FASTEST DELIVERY NATIONWIDE',
    svg: '<svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-delivery" viewBox="0 0 82 82"><path d="M27 30h40v12H27zM31 42h32v22H31zM47 30v34M47 30c-6-11-19-7-13 0M47 30c6-11 19-7 13 0"/><path d="M5 62h14l12 6h20a5 5 0 0 0 0-10H38"/></svg>',
  },
  {
    title: 'SECURE PAYMENTS',
    svg: '<svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-card" viewBox="0 0 82 82"><rect x="8" y="19" width="66" height="44" rx="5"/><path d="M8 34h66M19 50h18"/></svg>',
  },
  {
    title: 'DEDICATED CUSTOMER SUPPORT',
    svg: '<svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-support" viewBox="0 0 82 82"><circle cx="27" cy="42" r="9"/><path d="M8 72c0-12 8-19 19-19s19 7 19 19"/><path d="M44 12h26a4 4 0 0 1 4 4v22a4 4 0 0 1-4 4H59l-8 8v-8h-7a4 4 0 0 1-4-4V16a4 4 0 0 1 4-4z"/><path d="M53 27h1M60 27h1M67 27h1"/></svg>',
  },
];
function trustRow(): string {
  const id = 'IconsRow--shop-all-trust';
  const items = TRUST_ITEMS.map((t, i) => {
    const pos = i === 0 ? 'icons-row-item--first-on-row icons-row-item--odd icons-row-item--first' : i === 2 ? 'icons-row-item--last-on-row icons-row-item--odd icons-row-item--last' : 'icons-row-item--even icons-row-item--pre-last';
    return (
      `<div class="icons-row-item grid__item ${pos}"><div class="icons-row-item__wrapper">` +
      `<div class="icons-row-item__icon icon-stroke">${t.svg}</div>` +
      `<div class="icons-row-item__content"><h3 class="icons-row-item__title">${t.title}</h3></div>` +
      `</div></div>`
    );
  }).join('');
  return (
    `<div id="shopify-section-shop-all-trust" class="shopify-section">` +
    `<style>#${id}{--PT:40px;--PB:40px;--icon-size:40px;--icon-max-size:40px;--bg:#ffffff;background:#ffffff;--border:#333333;--text:#000000;--text-lighten:#333333}` +
    `@media screen and (max-width:767px){#${id}{--icon-max-size:40px}#${id} .icons-row-item__title{font-size:15px}}` +
    `#${id} .icons-row-item__title{font-size:18px;letter-spacing:.06em;line-height:1.3;margin:0}` +
    `#${id} .icons-row__slider{--adjust-heading:calc(var(--FONT-ADJUST-HEADING) * 1.0);--adjust-body:calc(var(--FONT-ADJUST-BODY) * 0.9)}</style>` +
    `<section id="${id}" class="section-padding icons-row icons-row--borders-vertical icons-row--borders-horizontal icons-row--spaced" data-section-id="shop-all-trust" data-section-type="icons-row">` +
    `<div class="wrapper"><div class="icons-row__wrapper text-center"><div class="icons-row__slider stacked--mobile text-center items--3" role="group">${items}</div></div></div>` +
    `</section></div>`
  );
}

function collectionMain(html: string, products: DriftProduct[], heroImage?: string, heroTitle: 'MEN' | 'WOMEN' | 'BUNDLES' | 'SHOP ALL' = 'MEN'): string {
  const id = 'ShopAllCollection';
  const heroDescriptions = {
    MEN: 'DRIFT Hero, Rebel and Ignite perfumed mists on dark stone with citrus and cedarwood',
    WOMEN: 'DRIFT IT Girl and Baddie perfumed mists with berries, jasmine and vanilla on rose stone',
    BUNDLES: 'DRIFT Hero, Rebel and Ignite trio alongside a Hero and Muse duo on warm stone plinths',
    'SHOP ALL': 'The full DRIFT fragrance collection with Hero, Muse, Rebel, Ignite, Baddie and IT Girl',
  };
  return (
    `<main id="MainContent" class="main-content" data-main>` +
    (heroImage ? `<div class="shopify-section drift-collection-hero" data-collection="${heroTitle}"><img src="${heroImage}" alt="${heroDescriptions[heroTitle]}" width="2172" height="724" loading="eager" fetchpriority="high"><h1 class="drift-collection-hero__title">${heroTitle}</h1></div>` : '') +
    `<div id="shopify-section-main-collection" class="shopify-section shopify-section--collection">` +
    `<style>` +
    `#${id}{padding-top:36px!important;--PT:36px;--grid:repeat(4,minmax(0,1fr));--grid-tablet:repeat(3,minmax(0,1fr));--grid-mobile:repeat(2,minmax(0,1fr))}` +
    `@media (max-width:767px){#${id}{padding-top:20px!important;--PT:20px}}` +
    `</style>` +
    `<section id="${id}" class="section-padding collection-section collection--filters-disabled collection--breadcrumbs-disabled collection collection-items collection-items--4">` +
    `<div class="wrapper--full-padded">` +
    `<div class="collection__wrapper"><div class="collection__products">` +
    `<div class="grid grid--mobile">${collectionCards(html, products)}</div>` +
    `</div></div>` +
    `</div></section></div>` +
    trustRow()
  );
}
// Runs while the HTML is parsed (before first paint): collection pages use Tone's collection template styles.
const COLLECTION_BODY_SCRIPT =
  '<script>document.body.className=document.body.className.replace("template-index","template-collection")</script>';
const SHOP_ALL_MAIN = collectionMain(TONE_MAIN_HTML, SHOP_ALL, '/assets/shop-all-fragrance-hero.webp', 'SHOP ALL');
const MEN_MAIN = collectionMain(TONE_MAIN_HTML, MEN_PRODUCTS, '/assets/men-fragrance-hero-v2.webp');
const WOMEN_MAIN = collectionMain(TONE_MAIN_HTML, WOMEN_PRODUCTS, '/assets/women-fragrance-hero.webp', 'WOMEN');
// Bundles = the combo products (Hero-Rebel-Ignite, Hero-Muse, ...), which have a single photo each.
const BUNDLES_MAIN = collectionMain(
  TONE_MAIN_HTML,
  SHOP_ALL.filter((p) => p.images.length === 1),
  '/assets/bundles-fragrance-hero.webp',
  'BUNDLES'
);


// ---------------------------------------------------------------------------
// /products/[handle]: Tone's single-product template (markup + classes copied from
// tone.shop product pages) filled with the DRIFT product's own data.
// ---------------------------------------------------------------------------
const PRODUCT_BODY_SCRIPT =
  '<script>document.body.className=document.body.className.replace("template-index","template-product")</script>';
const pImg = (f: string, w: number) => `${CDN}${f}${f.includes('?') ? '&' : '?'}width=${w}`;
const priceNum = (s: string) => parseFloat(s.replace(/rs\.?/i, '').replace(/[^\d.]/g, '')) || 0;
const fmtRs = (n: number) => 'Rs.' + Math.round(n).toLocaleString('en-US');
function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

const STAR_OFF = '<span class="jdgm-star jdgm--off"></span>'.repeat(5);

function productGallery(p: DriftProduct): string {
  const slides = p.images
    .map(
      (f, i) =>
        `<div id="FeaturedMedia-drift-${i}" class="product-single__media-slide${i === 0 ? ' is-selected' : ''}" data-product-slide data-id="${i}" data-aspectratio="1.0" data-media-id="drift-${i}" data-type="image" data-product-single-media-wrapper>` +
        `<div class="product-single__media product-single__media--image"><div class="product-single__media--image-height" style="padding-top: 100.0%;"></div>` +
        `<figure class="lazy-image lazy-image--cover"><img src="${pImg(f, 1400)}" alt="${esc(p.title)}" width="1400" height="1400" loading="${i === 0 ? 'eager' : 'lazy'}" class="img-object-cover" data-product-image data-image-id="${i}"></figure></div></div>`
    )
    .join('');
  const thumbs = p.images
    .map(
      (f, i) =>
        `<div class="product-single__thumbnail product-gallery-thumbnail${i === 0 ? ' active is-nav-selected is-selected' : ''}" data-id="${i}" data-thumbnail-id="drift-${i}" data-order="${i}">` +
        `<a href="#" class="product-single__thumbnail-link" aria-label="${esc(p.title)}"><figure class="lazy-image lazy-image--cover"><img src="${pImg(f, 178)}" alt="${esc(p.title)}" width="178" height="178" loading="eager" class="product-single__thumbnail-img img-object-cover"></figure></a></div>`
    )
    .join('');
  return (
    `<div class="product-single__gallery product-single__gallery--equal product-gallery-mobile-grid" id="ProductPhoto--drift" data-gallery="true" data-autoplay-video="false" data-product-single-media-group data-mobile-gallery-init="1">` +
    `<div class="product-gallery-mobile-grid-container">` +
    `<div class="product-single__media-slider product-gallery-viewer-mobile flickity-disabled-mobile" data-product-single-media-slider>${slides}</div>` +
    (p.images.length > 1
      ? `<div class="product-gallery-mobile-arrows"><button class="product-gallery-mobile-arrow product-gallery-mobile-arrow--prev" type="button" aria-label="Previous image"><svg width="9" height="14" viewBox="0 0 9 14" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M7.5 1 1.5 7l6 6"/></svg></button><button class="product-gallery-mobile-arrow product-gallery-mobile-arrow--next" type="button" aria-label="Next image"><svg width="9" height="14" viewBox="0 0 9 14" fill="none" stroke="currentColor" stroke-width="1.6"><path d="m1.5 1 6 6-6 6"/></svg></button></div>` +
        `<div class="product-single__thumbnails product-gallery-thumbnails-mobile flickity-disabled-mobile" id="ProductThumbs" data-product-single-media-thumbs>${thumbs}</div>`
      : '') +
    `</div></div>`
  );
}

function scentSelector(p: DriftProduct): string {
  const singles = SHOP_ALL.filter((x) => x.images.length > 1);
  if (!singles.some((x) => x.id === p.id)) return '';
  const items = singles
    .map((x) => {
      const label = x.title.split('—')[0].trim();
      return (
        `<div class="item${x.id === p.id ? ' active' : ''}"><a href="/products/${x.handle}">` +
        `<img class="product-selector-img" src="${pImg(x.images[0], 300)}" alt="${esc(x.title)}"><h5>${esc(label)}</h5></a></div>`
      );
    })
    .join('');
  return `<div class="product__block" style="--PBB:0px;"><div class="bundle-selector"><h4>Select Your Scent</h4><div class="bundle-selector-items rollerball">${items}</div></div></div>`;
}

function accordion(id: string, title: string, content: string, pbb: number): string {
  if (!content) return '';
  const cid = `ProductAccordion--${id}`;
  return (
    `<div class="product__block product__accordions" style="--PBB:${pbb}px;" id="Block--${id}"><div class="product__accordion">` +
    `<button class="product__accordion__title font-heading" aria-controls="${cid}" data-collapsible-trigger>${title}` +
    `<svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-toggle-plus" viewBox="0 0 192 192"><path d="M30 96h132M96 30v132" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>` +
    `<svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-toggle-minus" viewBox="0 0 192 192"><path d="M30 96h132" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg></button>` +
    `<div class="product__accordion__content" id="${cid}" data-collapsible-container><div class="product__accordion__inner rte" data-collapsible-content>${content}</div></div>` +
    `</div></div>`
  );
}

function productDetails(p: DriftProduct): string {
  const price = priceNum(p.price);
  const compare = priceNum(p.compare);
  const onSale = compare > price;
  const cartData = encodeURIComponent(
    JSON.stringify({
      id: p.id,
      handle: p.handle,
      title: p.title,
      price,
      compare: onSale ? compare : 0,
      image: pImg(p.images[0], 400),
      scent: p.title.split('—')[0].trim(),
      notes: p.title.split('—')[1]?.trim() || '',
    })
  );
  const priceHtml =
    `<div class="product__price" data-price-wrapper style="--adjust-body-desktop: calc(var(--FONT-ADJUST-BODY) * 0.85);"><span data-product-price class="product__price--regular" data-variant-id="${p.id}">${p.price}</span>` +
    `<s data-compare-price class="product__price--compare${onSale ? '' : ' hidden'}" data-variant-id="${p.id}">${onSale ? p.compare : ''}</s>` +
    `<span data-price-off class="product__price--off${onSale ? '' : ' hidden'}"><span data-price-off-type>Sale</span><em>•</em> Save <span data-price-off-amount>${onSale ? fmtRs(compare - price) : ''}</span></span></div>`;
  const atc = (fixed: boolean) =>
    `<div class="product__submit__item ${fixed ? 'product__submit__item--fixed ' : ''}product__submit__item--atc"><button type="submit" name="add" class="btn btn--black btn--solid btn--large btn--submit product__submit__add" data-add-to-cart><span data-add-to-cart-text>Add to Cart</span><em class="loader loader--line"><em class="loader-indeterminate"></em></em></button></div>`;
  return (
    `<div class="product-single__details" data-collapsible-single><div class="form__wrapper is-sticky" data-product-info>` +
    `<div class="product__block product__title-and-price"><h1 class="product__title" style="--adjust-heading: calc(var(--FONT-ADJUST-HEADING) * 0.8);">${esc(p.title)}</h1><a class="drift-product-rating" data-product-rating href="#shopify-section-product-reviews" hidden></a></div>` +
    `<div class="product__block product__price-and-badge" style="--PBB:20px;"><div class="product__price-wrapper">${priceHtml}</div></div>` +
    `<div class="product__block standard__app"><div class="shopify-block shopify-app-block"><div class="jdgm-widget jdgm-preview-badge jdgm-preview-badge--with-link jdgm--done-setup" style="display: none;"><div class="jdgm-prev-badge" data-average-rating="0.00" data-number-of-reviews="0"><span class="jdgm-prev-badge__stars" data-score="0.00" tabindex="0" aria-label="See all reviews" role="button">${STAR_OFF}</span><span class="jdgm-prev-badge__text">No reviews</span></div></div></div></div>` +
    `<div class="product__block product__description rte" style="--PBB:20px;">${p.description || ''}</div>` +
    `<div class="product__block" style="--PBB:0px;"><div class="product__price-wrapper freshwater">${priceHtml}</div></div>` +
    `<div class="product__block product__form__wrapper variant__labels--hide" style="--PBB:16px;" data-form-wrapper>` +
    `<form method="post" action="/cart/add" id="AddToCartForm--drift" accept-charset="UTF-8" class="product__form" enctype="multipart/form-data" data-product-form data-drift-product="${cartData}">` +
    `<input type="hidden" name="form_type" value="product"><input type="hidden" name="id" value="${p.id}" data-product-select><input type="hidden" name="quantity" value="1">` +
    `<div class="product__submit__holder product__submit__holder--notification"><div class="product__submit__buttons">${atc(false)}` +
    `<div class="addToCart__wrapper--fixed">${atc(true)}</div></div></div>` +
    `<div data-cart-errors-container role="alert" class="product__form__errors"></div>` +
    `<input type="hidden" name="product-id" value="${p.id}"></form></div>` +
    scentSelector(p) +
    accordion('details', 'DETAILS', p.formulation || '', 20) +
    accordion('how-to-use', 'HOW TO USE', p.howToUse || '', 40) +
    `</div></div>`
  );
}

function recentlyViewedSection(products: DriftProduct[], sectionId = 'recently-viewed', title = 'RECENTLY VIEWED'): string {
  if (!products.length) return '';
  return `<section class="shopify-section drift-recently-viewed" aria-labelledby="${sectionId}-heading">
    <style>
      .drift-recently-viewed { padding: 30px max(20px, 3.5vw) 66px; background: #fff; color: #000; }
      .drift-recently-viewed h2 { text-align: center; font-size: clamp(24px, 2.2vw, 36px); font-weight: 900; margin: 0 0 34px; }
      .drift-recently-viewed__grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 24px; }
      .drift-recently-viewed__grid > .product-grid-item { width: 100%; min-width: 0; margin: 0; padding: 0; opacity: 1; visibility: visible; transform: none; }
      @media (max-width: 767px) { .drift-recently-viewed__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px 12px; } }
    </style>
    <h2 id="${sectionId}-heading">${title}</h2>
    <div class="drift-recently-viewed__grid">${collectionCards(TONE_MAIN_HTML, products).split('main-collection-shop-all').join(sectionId)}</div>
  </section>`;
}

function randomRelatedProducts(excludeId: string): DriftProduct[] {
  const products = SHOP_ALL.filter((product) => product.id !== excludeId);
  for (let i = products.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [products[i], products[j]] = [products[j], products[i]];
  }
  return products.slice(0, 4);
}

const PRODUCT_ABOUT =
  `<div id="shopify-section-product-about" class="shopify-section text"><style>#Text--product-about { --PT: 100px; --PB: 20px; } #Text--heading-product-about.text__heading { --adjust-heading: calc(var(--FONT-ADJUST-HEADING) * 1.3); } #Text--text-product-about.text__content { --adjust-body: calc(var(--FONT-ADJUST-BODY) * 1.2); }</style><section id="Text--product-about" class="section-padding text-section text-dark" data-section-id="product-about" data-section-type="text">` +
  `<div class="wrapper--narrow text-center"><div class="text"><p id="Text--heading-product-about" class="text__heading h2"><span class="text-highlight__break">Fragrance By DRIFT</span></p>` +
  `<div id="Text--text-product-about" class="text__content"><p>DRIFT makes perfumed mists for everyday wear. Each scent stands on its own and is built to layer with the others.</p></div></div></div></section></div>`;

const PRODUCT_REVIEWS =
  `<section id="shopify-section-product-reviews" class="shopify-section"><style>#App--product-reviews { --PT: 60px; --PB: 60px; } #judgeme_product_reviews .jm-review-widget { display: block; padding: 48px 0; } #judgeme_product_reviews .jm-review-widget__header-and-body { display: flex; flex-direction: column; gap: 12px; } #judgeme_product_reviews .jm-review-widget__header { display: flex; flex-direction: column; gap: 24px; } #judgeme_product_reviews .jm-stack { display: flex; flex-direction: column; } #judgeme_product_reviews .jm-cluster { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-end; } #judgeme_product_reviews .jm-text { margin: 0; } #judgeme_product_reviews .jm-review-widget-minimal-header__title { font-size: 20px; font-weight: 400; } #judgeme_product_reviews .jm-no-reviews-state { display: flex; justify-content: center; max-width: 490px; margin: 0 auto; text-align: center; } #judgeme_product_reviews .jm-no-reviews-state > .jm-stack { align-items: center; gap: 16px; } #judgeme_product_reviews .jm-no-reviews-state__text { font-size: 16px; } #judgeme_product_reviews .jm-action-buttons { justify-content: center; align-items: flex-start; } #judgeme_product_reviews .jm-button { display: inline-flex; align-items: center; justify-content: center; padding: 8px 16px; font-size: 16px; line-height: 16px; color: #fff; background: #000; border: 0.8px solid #000; border-radius: 8px; cursor: pointer; font-family: inherit; } #judgeme_product_reviews .jm-review-widget__body { min-height: 24px; margin-top: 12px; } #judgeme_product_reviews .jm-review-widget-minimal-header__title { line-height: 27px; }</style><div class="section-padding" id="App--product-reviews"><div class="wrapper"><div class="shopify-block shopify-app-block"><div style="clear:both"></div>` +
  `<div id="judgeme_product_reviews" class="jdgm-widget jdgm-review-widget jdgm--done-setup-widget jdgm-review-widget--small jdgm-widget-revamp" style="max-width: 1200px; margin: 0 auto;">` +
  `<div class="jm-stack jm-stack--space-300 jm-review-widget jm-review-widget--minimal-header"><div class="jm-review-widget__header-and-body"><div class="jm-stack jm-stack--space-600 jm-review-widget__header jm-review-widget-minimal-header">` +
  `<div class="jm-cluster" style="--cluster-justify: space-between; --cluster-align: flex-end; --cluster-space: var(--jm-space-1000); --cluster-wrap: wrap;"><div class="jm-stack jm-stack--space-200"><p class="jm-text jm-review-widget-minimal-header__title" role="heading" aria-level="2" style="--text-size: var(--jm-heading-sm-size); --text-weight: var(--jm-heading-sm-weight-default);">Customer Reviews</p></div></div>` +
  `<div class="jm-center jm-center--center-text jm-center--intrinsic jm-no-reviews-state" style="--jm-center-max: var(--jm-measure);"><div class="jm-stack jm-stack--space-400"><p class="jm-text jm-no-reviews-state__text" style="--text-size: var(--jm-body-md-size); --text-weight: var(--jm-body-md-weight-default);">Be the first to write a review</p>` +
  `<div class="jm-cluster jm-action-buttons jm-no-reviews-state__action-buttons" style="--cluster-justify: flex-end; --cluster-align: flex-start; --cluster-space: var(--jm-space-400); --cluster-wrap: wrap;"><div class="jm-stack jm-stack--space-200"><button type="button" class="jm-button jm-button--primary jm-action-buttons__button">Write a review</button></div></div></div></div>` +
  `</div></div><div class="jm-review-widget__body"></div></div></div><div style="clear:both"></div></div></div></div></section>`;

const PRODUCT_STYLE =
  `<style>` +
  `#productTemplate--drift { --PT: 0px; --PB: 0px; }` +
  `.product__price-wrapper.freshwater * { font-family: Inter, sans-serif; font-size: 16px; } .product__price-wrapper.freshwater { margin-bottom: 5px; }` +
  `.bundle-selector { display: flex; flex-direction: column; align-items: flex-start; margin-top: 20px; margin-bottom: 20px; } .bundle-selector h4 { width: 100%; font-size: 14px; margin-bottom: 5px; } ` +
  `.bundle-selector-items { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 5px; width: 100%; } ` +
  `.bundle-selector .item { width: 100%; max-width: none; min-width: 0; margin: 0; box-sizing: border-box; padding: 5px; border-radius: 5px; text-align: center; font-size: 14px; text-decoration: none; } ` +
  `.bundle-selector-items.scent-collections, .bundle-selector-items.rollerball { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 5px; width: 100%; } ` +
  `.bundle-selector .item img.product-selector-img { display: block; max-width: 100%; margin-bottom: 8px; border: 2px solid #F7F7F7; border-radius: 5px; } ` +
  `.bundle-selector .item.active img.product-selector-img, .bundle-selector .item:hover img.product-selector-img { border: 2px solid #000; } ` +
  `.bundle-selector .item, .bundle-selector .item h5 { color: #000; font-size: 12px; line-height: 125%; text-decoration: none; text-transform: uppercase; } ` +
  `.bundle-selector .item.active h5, .bundle-selector .item:hover h5 { color: #000; font-weight: 900; text-decoration: underline; text-underline-offset: 3px; } ` +
  `@media (max-width: 768px) { .bundle-selector .item { margin: 0 auto; } .bundle-selector .item, .bundle-selector .item h5 { font-size: 11px; } } ` +
  `#shopify-section-product-main .wrapper {padding: 0;} #shopify-section-product-main .wrapper--full-padded {padding: 0;} ` +
  `#shopify-section-product-main .product__block.product__price-and-badge {display: none;} #shopify-section-product-main .product__title-and-price {margin-bottom: 0px;}` +
  `</style>`;

function productMain(p: DriftProduct): string {
  return (
    `<main id="MainContent" class="main-content" data-main>` +
    `<div id="shopify-section-product-main" class="shopify-section shopify-section--product">${PRODUCT_STYLE}` +
    `<section id="productTemplate--drift" class="section-padding product-single img-in" data-section-id="product-main" data-sticky-enabled="true" data-tall-layout="true">` +
    `<div class="wrapper--full-padded"><div class="product-single__wrapper product-single__wrapper--grid product-single__wrapper--large" data-product>` +
    productGallery(p) +
    productDetails(p) +
    `</div></div></section></div>` +
    PRODUCT_ABOUT +
    `<div data-recently-viewed></div>` +
    `<div data-related-products>${recentlyViewedSection(SHOP_ALL.filter((item) => item.id !== p.id).slice(0, 4), 'related-products', 'RELATED PRODUCTS')}</div>` +
    PRODUCT_REVIEWS
  );
}

const ABOUT_MAIN = `<main id="MainContent" class="main-content" data-main>
  <div class="shopify-section drift-about"><section class="drift-about__inner" aria-labelledby="about-title">
    <h1 id="about-title">ABOUT US</h1>
    <div class="drift-about__copy">
      <p>DRIFT started with a simple idea: <strong>great fragrance shouldn&rsquo;t come with an unreasonable price tag.</strong></p>
      <p>We create Perfumed Mists that bring together distinctive scents, thoughtful design, and quality you can experience every day.</p>
      <p>Each fragrance has its own personality, because we believe what you wear should reflect who you are.</p>
      <p>We&rsquo;re starting with fragrance, but our vision goes beyond it.</p>
      <p>This is DRIFT. And we&rsquo;re just getting started.</p>
    </div>
  </section></div>` + trustRow();

const SCRIPTS = ['/js/tone-init.js', '/js/vendor.js', '/js/theme.js'];
const FOOTER_HTML = withStoreFooter(TONE_FOOTER_HTML);

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
  (t.replace(/,/g, '').match(/(?:\$|Rs\.?)\s*[\d.]+/gi) || []).map(parsePrice);

/** Whole Tone homepage: Tone's original markup + Tone's own theme scripts. */
export function ToneHome({ page = 'home', children, product }: { page?: 'home' | 'shop-all' | 'men' | 'women' | 'bundles' | 'product' | 'about'; children?: React.ReactNode; product?: DriftProduct }) {
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
    if (section) return mountProductReviews(section, { ...product, image: pImg(product.images[0], 400) });
  }, [page, product]);

  useEffect(() => {
    if (page !== 'home') return;
    const section = document.getElementById('drift-instagram');
    if (section) return mountInstagramFeed(section);
  }, [page]);

  useEffect(() => {
    if (page !== 'product' || !product) return;
    const container = document.querySelector('[data-related-products]');
    if (container) {
      container.innerHTML = recentlyViewedSection(randomRelatedProducts(product.id), 'related-products', 'RELATED PRODUCTS');
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
          .filter((id) => SHOP_ALL.some((item) => item.id === id));
      }
    } catch { /* Browsing still works when storage is unavailable. */ }
    const previous = history.filter((id) => id !== product.id).slice(0, 4);
    const products = previous.map((id) => SHOP_ALL.find((item) => item.id === id)!);
    const container = document.querySelector('[data-recently-viewed]');
    if (container) container.innerHTML = recentlyViewedSection(products);
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

  // Collection page uses Tone's collection template styles.
  useEffect(() => {
    if (page === 'home') return;
    document.body.classList.replace('template-index', 'template-collection');
  }, [page]);

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
  // Content pages have a separate React main element. Keep their footer in
  // normal flow instead of the theme's sibling-dependent parallax reveal.
  if (children) return <div id="tone-root"><div dangerouslySetInnerHTML={{ __html: TOP_HTML }} />{children}<div dangerouslySetInnerHTML={{ __html: TONE_FOOTER_HTML.replace('data-parallax="footer"', '') }} /></div>;

  if (page === 'product' && product) {
    return (
      <div
        id="tone-root"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: PRODUCT_BODY_SCRIPT + TOP_HTML + productMain(product) + '</main>' + FOOTER_HTML }}
      />
    );
  }

  return (
    <div
      id="tone-root"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: (page === 'home' ? '' : COLLECTION_BODY_SCRIPT) + TOP_HTML + (page === 'about' ? ABOUT_MAIN : page === 'shop-all' ? SHOP_ALL_MAIN : page === 'men' ? MEN_MAIN : page === 'women' ? WOMEN_MAIN : page === 'bundles' ? BUNDLES_MAIN : MAIN_HTML + HOME_INSTAGRAM) + '</main>' + FOOTER_HTML }}
    />
  );
}
