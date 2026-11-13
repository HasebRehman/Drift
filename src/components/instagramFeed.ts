import { INSTAGRAM_DEMO_POSTS, INSTAGRAM_FEED_MODE } from '@/data/instagram';

type Post = { id: string; caption: string; type: string; url: string; thumbnail?: string; permalink: string };

function safeUrl(value: string, instagram = false) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && (!instagram || ['www.instagram.com', 'instagram.com'].includes(url.hostname)) ? url.href : null;
  } catch { return null; }
}

export function mountInstagramFeed(section: HTMLElement) {
  const track = section.querySelector<HTMLElement>('.drift-instagram__carousel')!;
  const status = section.querySelector<HTMLElement>('[role="status"]')!;
  const controls = section.querySelector<HTMLElement>('.drift-instagram__controls')!;
  const prev = section.querySelector<HTMLButtonElement>('[data-instagram-prev]')!;
  const next = section.querySelector<HTMLButtonElement>('[data-instagram-next]')!;
  const controller = new AbortController();
  let ids = '';
  const update = () => {
    prev.disabled = track.scrollLeft < 2;
    next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
  };
  const move = (direction: number) => track.scrollBy({ left: direction * track.clientWidth, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  const previous = () => move(-1);
  const following = () => move(1);
  prev.addEventListener('click', previous);
  next.addEventListener('click', following);
  track.addEventListener('scroll', update);
  const observer = new ResizeObserver(update);
  observer.observe(track);
  const refresh = async () => {
    try {
      const response = await fetch('/api/instagram', { signal: controller.signal, cache: 'no-store' });
      if (!response.ok) throw new Error('Feed unavailable');
      const data = await response.json();
      if (!Array.isArray(data.posts) || !data.posts.length) throw new Error('No posts');
      const posts = (data.posts as Post[]).slice(0, 10).filter(p => safeUrl(p.url) && safeUrl(p.permalink, true));
      if (!posts.length) throw new Error('No usable posts');
      const signature = posts.map(p => p.id + p.url).join('|');
      if (signature !== ids) {
        const cards = posts.map((post) => {
          const card = document.createElement('article'); card.className = 'drift-instagram__card';
          if (post.type === 'VIDEO') {
            const video = document.createElement('video'); video.src = post.url; video.controls = true; video.playsInline = true; video.preload = 'none';
            if (post.thumbnail && safeUrl(post.thumbnail)) video.poster = post.thumbnail;
            video.setAttribute('aria-label', post.caption || 'DRIFT Instagram video'); card.append(video);
          } else {
            const image = document.createElement('img'); image.src = post.url; image.alt = post.caption || 'DRIFT on Instagram'; image.loading = 'lazy'; card.append(image);
          }
          const link = document.createElement('a'); link.href = post.permalink; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = 'View on Instagram'; card.append(link);
          return card;
        });
        track.replaceChildren(...cards); ids = signature;
      }
      status.hidden = true; controls.hidden = false; update();
    } catch {
      if (!controller.signal.aborted && !track.children.length) status.textContent = 'Explore our latest posts and videos on Instagram.';
    }
  };
  let timer: number | undefined;
  if (INSTAGRAM_FEED_MODE === 'curated') {
    const cards = INSTAGRAM_DEMO_POSTS.slice(0, 10).map((url, index) => {
      const card = document.createElement('article');
      card.className = 'drift-instagram__card drift-instagram__card--embed';
      const viewport = document.createElement('div');
      viewport.className = 'drift-instagram__media-window';
      if (url.includes('/reel/')) viewport.classList.add('drift-instagram__media-window--reel');
      const iframe = document.createElement('iframe');
      iframe.src = `${url}embed/`;
      iframe.title = `DRIFT Instagram ${url.includes('/reel/') ? 'Reel' : 'post'} ${index + 1}`;
      iframe.loading = 'lazy';
      iframe.allow = 'autoplay; encrypted-media; fullscreen; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.setAttribute('scrolling', 'no');
      viewport.append(iframe);
      card.append(viewport);
      return card;
    });
    track.replaceChildren(...cards);
    status.hidden = true;
    controls.hidden = false;
    update();
  } else {
    void refresh();
    timer = window.setInterval(() => { if (!document.hidden) void refresh(); }, 300000);
  }
  return () => { controller.abort(); clearInterval(timer); observer.disconnect(); prev.removeEventListener('click', previous); next.removeEventListener('click', following); track.removeEventListener('scroll', update); };
}
