import { SHOP_ALL } from '@/data/driftProducts';

const categories = [['Men', 'men'], ['Women', 'women'], ['Bundles', 'bundles'], ['Shop All', 'shop-all']];
const escapeHtml = (text: string) => text.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]!));
const categoryHtml = `<p class="predictive-search__heading label-typography">Browse categories</p><div class="drift-search-categories">${categories.map(([title, handle]) => `<a href="/collections/${handle}">${title}</a>`).join('')}</div>`;

export function withStoreSearch(html: string) {
  return html.replace(/<predictive-search>([\s\S]*?)<\/predictive-search>/g, (_, contents: string) => {
    const start = contents.indexOf('<div id="searchResults-');
    if (start < 0) return '';
    const form = contents.slice(0, start).replace('data-search-form', 'data-drift-search-form').replace(/\srole="combobox"|\saria-(?:owns|controls|haspopup|autocomplete|expanded)="[^"]*"/g, '');
    return `<search-form data-drift-search>${form}<div class="drift-search-results" data-drift-search-results aria-live="polite" data-scroll-lock-scrollable>${categoryHtml}</div></form></search-form>`;
  });
}

export function mountStoreSearch() {
  const cleanups: (() => void)[] = [];
  document.querySelectorAll<HTMLElement>('[data-drift-search]').forEach(root => {
    const input = root.querySelector<HTMLInputElement>('input[name="q"]');
    const results = root.querySelector<HTMLElement>('[data-drift-search-results]');
    const form = root.querySelector('form');
    if (!input || !results || !form) return;
    const render = () => {
      const query = input.value.trim().toLowerCase();
      if (!query) { results.innerHTML = categoryHtml; return; }
      const matches = SHOP_ALL.filter(product => `${product.title} ${product.description || ''}`.replace(/<[^>]*>/g, ' ').toLowerCase().includes(query));
      results.innerHTML = `<p class="predictive-search__heading label-typography">Products (${matches.length})</p>` + (matches.length ? matches.map(product => {
        const image = product.images[0];
        const src = image.startsWith('/') || image.startsWith('https://') ? image : `https://cdn.shopify.com/s/files/1/0739/6166/8743/files/${image}${image.includes('?') ? '&' : '?'}width=160`;
        return `<a class="drift-search-product" href="/products/${escapeHtml(product.handle)}"><img src="${escapeHtml(src)}" alt="" width="64" height="64"><span>${escapeHtml(product.title)}</span><span>${escapeHtml(product.price)}</span></a>`;
      }).join('') : '<p>No products found. Try another scent or product name.</p>');
    };
    const submit = (event: Event) => { event.preventDefault(); render(); };
    input.addEventListener('input', render);
    form.addEventListener('submit', submit);
    cleanups.push(() => { input.removeEventListener('input', render); form.removeEventListener('submit', submit); });
  });
  return () => cleanups.forEach(cleanup => cleanup());
}
