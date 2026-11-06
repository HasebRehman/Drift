
/* inline script 5 */
(function(){try{

    if (window.MSInputMethodContext && document.documentMode) {
      var scripts = document.getElementsByTagName('script')[0];
      var polyfill = document.createElement("script");
      polyfill.defer = true;
      polyfill.src = "//tone.shop/cdn/shop/t/24/assets/ie11.js?v=164037955086922138091744116696";

      scripts.parentNode.insertBefore(polyfill, scripts);

      document.documentElement.classList.add('ie11');
    } else {
      document.documentElement.className = document.documentElement.className.replace('no-js', 'js');
    }

    let root = '/';
    if (root[root.length - 1] !== '/') {
      root = `${root}/`;
    }

    window.theme = {
      routes: {
        root: root,
        cart_url: "\/cart",
        cart_add_url: "\/cart\/add",
        cart_change_url: "\/cart\/change",
        shop_url: "https:\/\/tone.shop",
        searchUrl: '/search',
        predictiveSearchUrl: '/search/suggest',
        product_recommendations_url: "\/recommendations\/products"
      },
      assets: {
        photoswipe: '//tone.shop/cdn/shop/t/24/assets/photoswipe.js?v=162613001030112971491744116697',
        smoothscroll: '//tone.shop/cdn/shop/t/24/assets/smoothscroll.js?v=37906625415260927261744116698',
        no_image: "//tone.shop/cdn/shopifycloud/storefront/assets/no-image-2048-a2addb12_1024x.gif",
        swatches: '//tone.shop/cdn/shop/t/24/assets/swatches.json?v=111194292723928854391746603438',
        base: "//tone.shop/cdn/shop/t/24/assets/"
      },
      strings: {
        add_to_cart: "Add to Cart",
        cart_acceptance_error: "You must accept our terms and conditions.",
        cart_empty: "Your cart is currently empty.",
        cart_price: "Price",
        cart_quantity: "Quantity",
        cart_items_one: "{{ count }} item",
        cart_items_many: "{{ count }} items",
        cart_title: "Cart",
        cart_total: "Total",
        continue_shopping: "Continue Shopping",
        free: "Free",
        limit_error: "Sorry, looks like we don\u0026#39;t have enough of this product.",
        preorder: "Pre-Order",
        remove: "Remove",
        sale_badge_text: "Sale",
        saving_badge: "Save {{ discount }}",
        saving_up_to_badge: "Save up to {{ discount }}",
        sold_out: "Sold Out",
        subscription: "Subscription",
        unavailable: "Unavailable",
        unit_price_label: "Unit price",
        unit_price_separator: "per",
        zero_qty_error: "Quantity must be greater than 0.",
        delete_confirm: "Are you sure you wish to delete this address?",
        newsletter_product_availability: "Notify Me When It’s Available"
      },
      icons: {
        plus: '<svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-toggle-plus" viewBox="0 0 192 192"><path d="M30 96h132M96 30v132" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        minus: '<svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-toggle-minus" viewBox="0 0 192 192"><path d="M30 96h132" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        close: '<svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-close" viewBox="0 0 192 192"><path d="M150 42 42 150M150 150 42 42" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>'
      },
      settings: {
        animationsEnabled: false,
        cartType: "drawer",
        enableAcceptTerms: false,
        enableInfinityScroll: false,
        enablePaymentButton: true,
        gridImageSize: "contain",
        gridImageAspectRatio: 1.3,
        mobileMenuBehaviour: "link",
        productGridHover: "slideshow",
        savingBadgeType: "money",
        showSaleBadge: false,
        showSoldBadge: true,
        showSavingBadge: true,
        quickBuy: "quick_buy",
        suggestArticles: false,
        suggestCollections: true,
        suggestProducts: true,
        suggestPages: false,
        suggestionsResultsLimit: 10,
        currency_code_enable: false,
        hideInventoryCount: true,
        colorSwatchesType: "theme",
        atcButtonShowPrice: false,
      },
      sizes: {
        mobile: 480,
        small: 768,
        large: 1024,
        widescreen: 1440
      },
      moneyFormat: "${{amount}}",
      moneyWithCurrencyFormat: "${{amount}} USD",
      subtotal: 0,
      current_iso_code: "USD",
      info: {
        name: 'Palo Alto'
      },
      version: '6.0.1'
    };
    window.PaloAlto = window.PaloAlto || {};
    window.slate = window.slate || {};
    window.isHeaderTransparent = false;
    window.stickyHeaderHeight = 60;
    window.lastWindowWidth = window.innerWidth || document.documentElement.clientWidth;
  
}catch(e){console.warn('tone-init',e)}}).call(window);

/* inline script 9 */
(function(){try{
window.Shopify = window.Shopify || {}; var Shopify = window.Shopify;
Shopify.shop = "tone-body.myshopify.com";
Shopify.locale = "en";
Shopify.currency = {"active":"USD","rate":"1.0"};
Shopify.country = "US";
Shopify.theme = {"name":"TONE (Live)","id":176217981225,"schema_name":"Palo Alto","schema_version":"6.0.1","theme_store_id":null,"role":"main"};
Shopify.theme.handle = "null";
Shopify.theme.style = {"id":null,"handle":null};
Shopify.cdnHost = "tone.shop/cdn";
Shopify.routes = Shopify.routes || {};
Shopify.routes.root = "/";
Shopify.shopJsCdnBaseUrl = "https://cdn.shopify.com/shopifycloud/shop-js";
Shopify.SignInWithShop = Shopify.SignInWithShop || {};
Shopify.SignInWithShop.User = Shopify.SignInWithShop.User || {};
Shopify.SignInWithShop.User.recognized = false;
}catch(e){console.warn('tone-init',e)}}).call(window);

/* inline script 41 */
(function(){try{

    function openExternalLinksInNewTab() {
        document.querySelectorAll('a[href]').forEach(link => {
            const url = new URL(link.href, window.location.origin);
            if (url.origin !== window.location.origin) {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
            }
        });
    }

    // run once when DOM is ready
    document.addEventListener('DOMContentLoaded', openExternalLinksInNewTab);
  
}catch(e){console.warn('tone-init',e)}}).call(window);

/* inline script 42 */
(function(){try{

  (function () {
    function closeGridShopToggle(root) {
      if (!root || !root.classList.contains('is-expanded')) return;
      var trigger = root.querySelector('.product-shop-toggle__trigger');
      var panel = root.querySelector('.product-shop-toggle__panel');
      root.classList.remove('is-expanded');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
      if (panel) panel.setAttribute('aria-hidden', 'true');
    }

    function closeAllGridShopToggles() {
      document.querySelectorAll('[data-grid-shop-toggle].is-expanded').forEach(function (root) {
        closeGridShopToggle(root);
      });
    }

    function openGridShopToggle(root) {
      var trigger = root.querySelector('.product-shop-toggle__trigger');
      var panel = root.querySelector('.product-shop-toggle__panel');
      root.classList.add('is-expanded');
      if (trigger) trigger.setAttribute('aria-expanded', 'true');
      if (panel) panel.setAttribute('aria-hidden', 'false');
    }

    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('[data-grid-shop-toggle] .product-shop-toggle__trigger');
      if (trigger) {
        var root = trigger.closest('[data-grid-shop-toggle]');
        if (!root) return;
        e.stopPropagation();
        if (root.classList.contains('is-expanded')) {
          closeGridShopToggle(root);
        } else {
          closeAllGridShopToggles();
          openGridShopToggle(root);
        }
        return;
      }

      if (!e.target.closest('[data-grid-shop-toggle]')) {
        closeAllGridShopToggles();
      }
    });

    function initGridShopToggleAria() {
      if (!document.documentElement.classList.contains('js')) return;
      document.querySelectorAll('[data-grid-shop-toggle] .product-shop-toggle__panel').forEach(function (panel) {
        panel.setAttribute('aria-hidden', 'true');
      });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initGridShopToggleAria);
    } else {
      initGridShopToggleAria();
    }
  })();

}catch(e){console.warn('tone-init',e)}}).call(window);
