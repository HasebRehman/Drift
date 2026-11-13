# Storefront performance work

The existing design, product photography, password gate, and cart behavior are preserved.

## Measured build sizes

| Measurement | Before | After | Reduction |
| --- | ---: | ---: | ---: |
| All generated production JavaScript chunks, uncompressed | 1,495,895 bytes | 700,388 bytes | 53% |
| Same chunks, gzip estimate | 287,389 bytes | 214,345 bytes | 25% |
| Three original hero JPGs vs. their 1920px WebP variants | 3,429,964 bytes | 1,031,022 bytes | 70% |

These are build/asset measurements, not Lighthouse scores or claims about every visitor's network speed. Actual hero downloads depend on viewport size and device pixel ratio. Only the first slide loads immediately; later slides load when needed.

## Changes

- HTML templates and product-card construction now run on the server. They are no longer shipped as executable client template code or rebuilt when the cart changes.
- Internal storefront links use Next client navigation. Pointer/keyboard intent prefetches the destination, while modified clicks and new-tab links retain normal browser behavior. Prefetching is skipped for data-saving/slow connections.
- Theme scripts load once. Widget instances mount for each route and unload before the old content is removed. The duplicate Shopify header controller is disabled because the custom header, sidebar, and search already handle it.
- Search focus/scroll locks are cleaned up during route changes.
- Responsive WebP hero variants and product-card `srcset` reduce image downloads. Images decode asynchronously; the slideshow pauses when hidden/offscreen and respects reduced motion.
- Instagram code/embeds wait until the section approaches the viewport. Offscreen horizontal embeds wait until their cards approach the visible carousel.
- Existing font files are served from `public/fonts`, with the same families and swap behavior.
- Cart actions are stable callbacks, and geometry measurements batch reads before style writes.
- Removed the legacy mobile-only rule that hid the whole homepage hero, and allowed small-screen product buttons to wrap their price lines without clipping.
- Password-protected pages/assets remain `no-store`; access behavior is retained rather than weakening it for persistent caching.

## Validation

- Production build and TypeScript checks passed; all 28 generated pages built.
- Password/security tests passed, including expiry and wrong-password handling.
- Production browser checks covered Home, Men, Women, Bundles, Shop All, About, product pages, checkout, back navigation, menu, search-result navigation, reviews, cart totals, and recently viewed products.
- Internal navigation retained the same document and left no disconnected theme instances.
- Mobile overflow/menu checks passed. Instagram made no embed requests at the top of the homepage and mounted when its section approached.
- Access lasts 24 hours from password entry, across tabs and browser restarts; navigation does not renew the deadline.

The third-party Instagram embeds and the legacy theme stylesheet are still present to preserve the existing content/design; their cost has not been claimed as removed.
