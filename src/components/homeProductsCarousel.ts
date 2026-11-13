const sectionId = 'FeaturedCollection--template--24202507026729__section_collection_8QxVfk';
const shopAllId = 'listCollections--template--24202507026729__section_list_butttons_7J39DK';

export function withHomeProductsCarousel(html: string) {
  const id = html.indexOf(`id="${sectionId}"`);
  const start = id < 0 ? -1 : html.lastIndexOf('<section', id);
  const end = html.indexOf('</section>', start);
  if (start >= 0 && end >= 0) {
    const section = html.slice(start, end)
      .replace('featured-collection__container carousel__container', 'featured-collection__container carousel__container drift-products-carousel')
      .replace('class="carousel carousel--mobile"', 'class="carousel carousel--mobile drift-products-track"')
      .replace(/\sdata-slider(?:-id="[^"]*")?(?=\s|>)/g, '')
      .replace('role="group"', 'role="region" aria-label="Featured products" tabindex="0"');
    const arrow = (direction: 'prev' | 'next') => `<button class="drift-products-arrow drift-products-arrow--${direction}" type="button" data-products-${direction} aria-label="${direction === 'prev' ? 'Previous' : 'Next'} products"${direction === 'prev' ? ' hidden' : ''}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${direction === 'prev' ? 'm14 5-7 7 7 7' : 'm10 5 7 7-7 7'}"/></svg></button>`;
    // Controls are siblings of the scrolling track, so they never scroll away.
    const close = section.lastIndexOf('</div>');
    const containerClose = section.lastIndexOf('</div>', close - 1);
    html = html.slice(0, start) + section.slice(0, containerClose) + arrow('prev') + arrow('next') + section.slice(containerClose) + html.slice(end);
  }
  const buttonStart = html.indexOf(`<section id="${shopAllId}"`);
  const buttonEnd = html.indexOf('</section>', buttonStart);
  if (buttonStart >= 0 && buttonEnd >= 0) {
    html = html.slice(0, buttonStart) + `<section id="${shopAllId}" class="drift-home-shop-all"><a href="/collections/shop-all">SHOP ALL</a></section>` + html.slice(buttonEnd + '</section>'.length);
  }
  return html;
}

export function mountHomeProductsCarousel() {
  const carousel = document.querySelector<HTMLElement>('.drift-products-carousel');
  const track = carousel?.querySelector<HTMLElement>('.drift-products-track');
  const previous = carousel?.querySelector<HTMLButtonElement>('[data-products-prev]');
  const next = carousel?.querySelector<HTMLButtonElement>('[data-products-next]');
  if (!carousel || !track || !previous || !next) return;
  let active = true;
  const update = () => {
    if (!active) return;
    const max = track.scrollWidth - track.clientWidth;
    previous.hidden = track.scrollLeft <= 2;
    next.hidden = max <= 2 || track.scrollLeft >= max - 2;
    const image = track.querySelector<HTMLElement>('.product-grid-item__image');
    if (image) carousel.style.setProperty('--products-arrow-top', `${image.getBoundingClientRect().height / 2}px`);
  };
  const move = (direction: number) => track.scrollBy({ left: direction * track.clientWidth, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  const back = () => move(-1);
  const forward = () => move(1);
  const observer = new ResizeObserver(update);
  observer.observe(track);
  const first = track.firstElementChild;
  if (first) observer.observe(first);
  previous.addEventListener('click', back);
  next.addEventListener('click', forward);
  track.addEventListener('scroll', update, { passive: true });
  update();
  void document.fonts.ready.then(update);
  return () => {
    active = false;
    observer.disconnect();
    previous.removeEventListener('click', back);
    next.removeEventListener('click', forward);
    track.removeEventListener('scroll', update);
  };
}
