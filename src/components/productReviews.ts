type Review = { name: string; title: string; body: string; rating: number; date: string };

export function isReview(value: unknown): value is Review {
  if (!value || typeof value !== 'object') return false;
  const r = value as Review;
  return typeof r.name === 'string' && r.name.trim().length > 0 && r.name.length <= 80 &&
    typeof r.title === 'string' && r.title.trim().length > 0 && r.title.length <= 120 &&
    typeof r.body === 'string' && r.body.trim().length > 0 && r.body.length <= 3000 &&
    Number.isInteger(r.rating) && r.rating >= 1 && r.rating <= 5 &&
    typeof r.date === 'string' && Number.isFinite(Date.parse(r.date));
}

/** Demo reviews are scoped to a product and stored on this browser only. */
export function mountProductReviews(section: HTMLElement, product: { id: string; title: string; image: string }) {
  const trigger = section.querySelector<HTMLButtonElement>('.jm-action-buttons__button');
  const list = section.querySelector<HTMLElement>('.jm-review-widget__body');
  const summary = section.querySelector<HTMLElement>('.jm-no-reviews-state__text');
  if (!trigger || !list || !summary) return;
  const key = `drift-product-reviews:${product.id}`;
  const productRating = document.querySelector<HTMLElement>('[data-product-rating]');
  let reviews: Review[] = [];
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(key) || '[]');
    if (Array.isArray(saved)) reviews = saved.filter(isReview).slice(0, 100);
  } catch { /* Leave the form usable when storage is unavailable. */ }

  let currentPage = 1;
  const pageSize = 5;
  const pagination = document.createElement('nav');
  pagination.className = 'drift-review-pagination';
  pagination.setAttribute('aria-label', 'Review pages');
  list.after(pagination);
  const pageStatus = document.createElement('span');
  pageStatus.className = 'drift-review-sr-only';
  pageStatus.setAttribute('role', 'status');
  pagination.after(pageStatus);

  const render = () => {
    const totalPages = Math.max(1, Math.ceil(reviews.length / pageSize));
    currentPage = Math.min(currentPage, totalPages);
    list.replaceChildren();
    if (productRating) {
      productRating.hidden = reviews.length === 0;
      productRating.replaceChildren();
      if (reviews.length) {
        const average = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
        productRating.setAttribute('aria-label', `${average.toFixed(1)} out of 5 stars, ${reviews.length} ${reviews.length === 1 ? 'review' : 'reviews'}. Read customer reviews`);
        const stars = document.createElement('span');
        stars.className = 'drift-product-rating-stars';
        stars.setAttribute('aria-hidden', 'true');
        stars.innerHTML = Array.from({ length: 5 }, (_, i) => {
          const fill = Math.round(Math.max(0, Math.min(1, average - i)) * 100);
          return `<svg viewBox="0 0 24 24"><defs><linearGradient id="drift-rating-${i}"><stop offset="${fill}%" stop-color="currentColor"/><stop offset="${fill}%" stop-color="white"/></linearGradient></defs><path fill="url(#drift-rating-${i})" d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.9L12 17.8l-6.2 3.3L7 14.2l-5-4.9 6.9-1Z"/></svg>`;
        }).join('');
        const count = document.createElement('span');
        count.textContent = `${reviews.length} ${reviews.length === 1 ? 'review' : 'reviews'}`;
        productRating.append(stars, count);
      }
    }
    summary.textContent = reviews.length
      ? `${(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)} out of 5 · ${reviews.length} ${reviews.length === 1 ? 'review' : 'reviews'}`
      : 'Be the first to write a review';
    for (const review of reviews.slice((currentPage - 1) * pageSize, currentPage * pageSize)) {
      const article = document.createElement('article');
      article.className = 'drift-review';
      const stars = document.createElement('div');
      stars.className = 'drift-review-rating';
      stars.setAttribute('role', 'img');
      stars.setAttribute('aria-label', `${review.rating} out of 5 stars`);
      stars.innerHTML = Array.from({ length: 5 }, (_, i) => `<svg viewBox="0 0 24 24" aria-hidden="true" class="${i < review.rating ? 'is-filled' : ''}"><path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.9L12 17.8l-6.2 3.3L7 14.2l-5-4.9 6.9-1Z"/></svg>`).join('');
      const author = document.createElement('div');
      author.className = 'drift-review-author';
      const avatar = document.createElement('span');
      avatar.className = 'drift-review-avatar';
      avatar.setAttribute('aria-hidden', 'true');
      avatar.textContent = Array.from(review.name.trim())[0].toLocaleUpperCase();
      const details = document.createElement('div');
      details.className = 'drift-review-author-details';
      const name = document.createElement('strong');
      name.className = 'drift-review-author-name';
      name.textContent = review.name;
      const date = document.createElement('time');
      date.dateTime = review.date;
      date.textContent = new Date(review.date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
      details.append(name, date);
      author.append(avatar, details);
      const content = document.createElement('p');
      content.className = 'drift-review-content';
      content.textContent = review.body;
      article.append(stars, author, content);
      list.append(article);
    }
    pagination.replaceChildren();
    pagination.hidden = totalPages <= 1;
    pageStatus.textContent = reviews.length ? `Review page ${currentPage} of ${totalPages}` : '';
    if (totalPages <= 1) return;
    const addButton = (page: number, label: string, direction?: 'previous' | 'next') => {
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-label', label);
      if (direction) {
        button.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${direction === 'previous' ? 'm14 6-6 6 6 6' : 'm10 6 6 6-6 6'}"/></svg>`;
        button.disabled = page < 1 || page > totalPages;
      } else {
        button.textContent = String(page);
        if (page === currentPage) button.setAttribute('aria-current', 'page');
      }
      button.addEventListener('click', () => {
        currentPage = page;
        render();
        pagination.querySelector<HTMLButtonElement>('[aria-current="page"]')?.focus({ preventScroll: true });
        list.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
      });
      pagination.append(button);
    };
    addButton(currentPage - 1, 'Previous review page', 'previous');
    const visiblePages = new Set([1, totalPages]);
    const start = Math.max(1, Math.min(currentPage - 1, totalPages - 3));
    for (let page = start; page <= Math.min(totalPages, start + 3); page++) visiblePages.add(page);
    let previousPage = 0;
    for (const page of [...visiblePages].sort((a, b) => a - b)) {
      if (page - previousPage > 1) {
        const ellipsis = document.createElement('span');
        ellipsis.textContent = '\u2026';
        ellipsis.setAttribute('aria-hidden', 'true');
        pagination.append(ellipsis);
      }
      addButton(page, `Review page ${page}`);
      previousPage = page;
    }
    addButton(currentPage + 1, 'Next review page', 'next');
  };
  render();
  const dialog = document.createElement('dialog');
  dialog.className = 'drift-review-dialog';
  dialog.setAttribute('aria-labelledby', 'drift-review-title');
  const star = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.9L12 17.8l-6.2 3.3L7 14.2l-5-4.9 6.9-1Z"/></svg>';
  dialog.innerHTML = `<button type="button" class="drift-review-close" aria-label="Close review form">&times;</button>
    <form class="drift-review-form" novalidate>
      <section data-review-step="1">
        <h2 id="drift-review-title" tabindex="-1">How would you rate this product?</h2>
        <p class="drift-review-intro">We would love it if you would share a bit about your experience.</p>
        <img class="drift-review-product-image" alt="">
        <p class="drift-review-product-name" data-review-product></p>
      </section>
      <div data-rating-panel>
        <p class="drift-review-product-name" data-review-product hidden></p>
        <fieldset><legend class="drift-review-sr-only">Your rating</legend><div class="drift-review-stars">${[1, 2, 3, 4, 5].map(n => `<label><input type="radio" name="rating" value="${n}" aria-label="${n} ${n === 1 ? 'star' : 'stars'}"><span>${star}</span></label>`).join('')}</div><div class="drift-review-scale"><span>Poor</span><span>Great</span></div></fieldset>
      </div>
      <section data-review-step="2" hidden>
        <label>Review content (Required)<textarea name="body" required maxlength="3000" rows="7" placeholder="Start writing here..."></textarea></label>
      </section>
      <section data-review-step="3" hidden>
        <h2 tabindex="-1">About you</h2><p class="drift-review-intro">Please tell us more about you.</p>
        <div class="drift-review-details">
          <label>Email address (Required)<input type="email" name="email" autocomplete="email" required maxlength="254" placeholder="Your email address"></label>
          <p class="drift-review-note">Your email is not displayed or saved in this demo.</p>
          <label>Display name (Required)<input name="name" autocomplete="name" required maxlength="80" placeholder="Display name"></label>
          <label class="drift-review-anonymous"><input type="checkbox" name="anonymous">Post review as anonymous</label>
        </div>
      </section>
      <div data-review-footer hidden>
        <p class="drift-review-note">Demo: your review is saved only in this browser.</p>
        <p data-review-error role="alert"></p>
        <div class="drift-review-actions"><button type="button" data-review-back>&larr; Back</button><button type="submit">Next</button></div>
      </div>
    </form>`;
  dialog.querySelectorAll('[data-review-product]').forEach(el => { el.textContent = product.title; });
  const image = dialog.querySelector<HTMLImageElement>('img')!;
  image.src = product.image;
  image.alt = product.title;
  document.body.append(dialog);
  const form = dialog.querySelector('form')!;
  const error = dialog.querySelector<HTMLElement>('[data-review-error]')!;
  const body = form.elements.namedItem('body') as HTMLTextAreaElement;
  const name = form.elements.namedItem('name') as HTMLInputElement;
  const email = form.elements.namedItem('email') as HTMLInputElement;
  const anonymous = form.elements.namedItem('anonymous') as HTMLInputElement;
  const status = document.createElement('p');
  status.setAttribute('role', 'status');
  list.before(status);
  let step = 1;
  let previousOverflow = '';
  let previousRootOverflow = '';
  let advanceTimer: ReturnType<typeof setTimeout> | undefined;
  let closeTimer: ReturnType<typeof setTimeout> | undefined;
  const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const showStep = (next: number) => {
    clearTimeout(advanceTimer);
    step = next;
    error.textContent = '';
    dialog.querySelectorAll<HTMLElement>('[data-review-step]').forEach(el => { el.hidden = Number(el.dataset.reviewStep) !== step; });
    dialog.querySelector<HTMLElement>('[data-rating-panel]')!.hidden = step === 3;
    dialog.querySelector<HTMLElement>('[data-rating-panel] [data-review-product]')!.hidden = step !== 2;
    dialog.querySelector<HTMLElement>('[data-review-footer]')!.hidden = step === 1;
    dialog.querySelector('button[type=submit]')!.textContent = step === 3 ? 'Submit review' : 'Next';
    dialog.setAttribute('aria-labelledby', step === 3 ? 'drift-review-about' : 'drift-review-title');
    const heading = dialog.querySelector<HTMLElement>('[data-review-step="3"] h2')!;
    heading.id = 'drift-review-about';
    // Keep a visible accessible title on the writing step.
    if (step === 2) dialog.setAttribute('aria-label', 'Write your review');
    else dialog.removeAttribute('aria-label');
    if (step === 2) dialog.removeAttribute('aria-labelledby');
    dialog.scrollTop = 0;
    if (!reducedMotion()) form.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 220, easing: 'ease-out' });
    if (step === 2) body.focus({ preventScroll: true });
    else if (step === 3) heading.focus({ preventScroll: true });
    else dialog.querySelector<HTMLElement>('#drift-review-title')!.focus({ preventScroll: true });
  };
  const updateStars = () => {
    const rating = Number(new FormData(form).get('rating'));
    dialog.querySelectorAll('.drift-review-stars label').forEach((el, i) => el.classList.toggle('is-selected', i < rating));
  };
  const open = () => {
    if (dialog.open) return;
    clearTimeout(closeTimer);
    closeTimer = undefined;
    status.textContent = '';
    previousOverflow = document.body.style.overflow;
    previousRootOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    dialog.classList.remove('is-closing');
    dialog.showModal();
    showStep(1);
  };
  const close = () => {
    clearTimeout(advanceTimer);
    if (!dialog.open || dialog.classList.contains('is-closing')) return;
    if (reducedMotion()) { dialog.close(); return; }
    const finishClose = () => {
      clearTimeout(closeTimer);
      closeTimer = undefined;
      dialog.removeEventListener('animationend', onExitEnd);
      if (dialog.open) dialog.close();
    };
    const onExitEnd = (event: AnimationEvent) => {
      if (event.target === dialog && event.animationName === 'drift-review-close') finishClose();
    };
    dialog.addEventListener('animationend', onExitEnd);
    dialog.classList.add('is-closing');
    // Fallback only if the browser does not deliver animationend.
    closeTimer = setTimeout(finishClose, 600);
  };
  const onClose = () => {
    document.body.style.overflow = previousOverflow;
    document.documentElement.style.overflow = previousRootOverflow;
    trigger.focus({ preventScroll: true });
  };
  const onRatingClick = (event: Event) => {
    if (!(event.target instanceof HTMLInputElement) || event.target.name !== 'rating') return;
    updateStars();
    if (step === 1) {
      clearTimeout(advanceTimer);
      advanceTimer = setTimeout(() => showStep(2), reducedMotion() ? 0 : 200);
    }
  };
  const submit = (event: SubmitEvent) => {
    event.preventDefault();
    if (step === 1) return;
    if (!body.value.trim()) { showStep(2); error.textContent = 'Please write your review.'; body.focus(); return; }
    if (step === 2) { showStep(3); return; }
    if (!email.validity.valid || !email.value.trim()) { error.textContent = 'Please enter a valid email address.'; email.focus(); return; }
    if (!anonymous.checked && !name.value.trim()) { error.textContent = 'Please enter your display name.'; name.focus(); return; }
    const data = new FormData(form);
    const review: Review = {
      name: anonymous.checked ? 'Anonymous' : name.value.trim(), title: 'Product review',
      body: body.value.trim(), rating: Number(data.get('rating')), date: new Date().toISOString(),
    };
    if (!isReview(review)) { error.textContent = 'Please check your rating and review details.'; return; }
    const next = [review, ...reviews].slice(0, 100);
    try { localStorage.setItem(key, JSON.stringify(next)); }
    catch { error.textContent = 'Your browser could not save the review. Please enable site storage and try again.'; return; }
    reviews = next;
    currentPage = 1;
    render();
    form.reset();
    name.disabled = false;
    updateStars();
    close();
    status.textContent = 'Thank you! Your review has been saved in this browser.';
  };
  trigger.addEventListener('click', open);
  dialog.addEventListener('close', onClose);
  dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
  dialog.querySelector('.drift-review-close')!.addEventListener('click', close);
  dialog.querySelector('[data-review-back]')!.addEventListener('click', () => showStep(step - 1));
  anonymous.addEventListener('change', () => { name.disabled = anonymous.checked; name.required = !anonymous.checked; });
  form.addEventListener('click', onRatingClick);
  form.addEventListener('change', event => {
    updateStars();
    // Arrow-key radio selection also advances without requiring a mouse click.
    if (event.target instanceof HTMLInputElement && event.target.name === 'rating') onRatingClick(event);
  });
  form.addEventListener('submit', submit);
  return () => {
    clearTimeout(advanceTimer);
    clearTimeout(closeTimer);
    if (dialog.open) {
      document.body.style.overflow = previousOverflow;
      document.documentElement.style.overflow = previousRootOverflow;
    }
    trigger.removeEventListener('click', open);
    dialog.remove();
    status.remove();
    pagination.remove();
    pageStatus.remove();
  };
}
