/** Keep these effects independent of the legacy theme's one-time section boot. */
export function withStoreAnnouncement(html: string) {
  const start = html.indexOf('<div class="announcement font-body"');
  if (start < 0) return html;
  let depth = 0;
  let end = start;
  for (const tag of html.slice(start).matchAll(/<\/?div\b[^>]*>/g)) {
    depth += tag[0].startsWith('</') ? -1 : 1;
    if (depth === 0) { end = start + tag.index! + tag[0].length; break; }
  }
  const messages = '<span>Discover Your Signature Scent with DRIFT <a href="/collections/shop-all">Shop Mists</a></span><span>Perfumed Mists for Him &amp; Her</span>';
  const group = messages.repeat(3);
  const announcement = `<div class="announcement font-body drift-announcement" data-announcement><div class="drift-announcement__track"><div class="drift-announcement__group">${group}</div><div class="drift-announcement__group" aria-hidden="true" inert>${group}</div></div></div>`;
  return (html.slice(0, start) + announcement + html.slice(end)).replace('data-section-type="announcement-bar"', 'data-section-type="drift-announcement"');
}

export function withStoreFooter(html: string) {
  return html.replace('data-parallax="footer"', 'data-drift-footer-reveal');
}

export function mountStoreChrome() {
  const root = document.getElementById('tone-root');
  const footer = root?.querySelector<HTMLElement>('[data-drift-footer-reveal]');
  const footerSection = footer?.closest<HTMLElement>('.section-footer');
  const main = root?.querySelector<HTMLElement>('[data-main]');
  const track = root?.querySelector<HTMLElement>('.drift-announcement__track');
  const group = track?.querySelector<HTMLElement>('.drift-announcement__group');
  const announcement = root?.querySelector<HTMLElement>('.announcement-bar-static');
  const header = root?.querySelector<HTMLElement>('#SiteHeader');
  let active = true;
  const measure = () => {
    if (!active) return;
    // Read all geometry before writing styles to avoid repeated forced layouts.
    const announcementHeight = announcement?.getBoundingClientRect().height;
    const headerHeight = header?.getBoundingClientRect().height;
    const groupWidth = group?.getBoundingClientRect().width;
    const footerHeight = footer?.offsetHeight;
    const set = (element: HTMLElement, name: string, value: string) => {
      if (element.style.getPropertyValue(name) !== value) element.style.setProperty(name, value);
    };
    if (root && announcement && header) {
      set(root, '--drift-announcement-height', `${announcementHeight}px`);
      set(root, '--drift-header-height', `${headerHeight}px`);
    }
    if (track && groupWidth) set(track, '--drift-marquee-duration', `${groupWidth / 60}s`);
    if (footer && footerSection && main) {
      set(footerSection, '--drift-footer-height', `${footerHeight}px`);
      footerSection.classList.add('drift-footer-reveal');
      main.classList.add('drift-footer-cover');
    }
  };
  const observer = new ResizeObserver(measure);
  if (footer) observer.observe(footer);
  if (group) observer.observe(group);
  if (announcement) observer.observe(announcement);
  if (header) observer.observe(header);
  measure();
  void document.fonts.ready.then(measure);
  window.addEventListener('pageshow', measure);
  return () => {
    active = false;
    observer.disconnect();
    window.removeEventListener('pageshow', measure);
    main?.classList.remove('drift-footer-cover');
    footerSection?.classList.remove('drift-footer-reveal');
  };
}
