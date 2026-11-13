'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ToneHome } from './ToneHome';
import { CartDrawer } from './CartDrawer';
import { useCart } from '@/context/CartContext';
import { SHOP_ALL, type DriftProduct } from '@/data/driftProducts';
import { ToneProduct } from '@/data/driftData';

const imageUrl = (image: string) =>
  `https://cdn.shopify.com/s/files/1/0739/6166/8743/files/${image}${image.includes('?') ? '&' : '?'}width=1400`;

const amount = (value: string) => Number(value.replace(/[^\d.]/g, ''));

export function ProductPage({ product }: { product: DriftProduct }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [openAccordion, setOpenAccordion] = useState<string | null>('details');
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const relatedSliderRef = useRef<HTMLDivElement>(null);
  const { addItem, openCart } = useCart();

  const title = product.title.replace(/â€”/g, '—');
  const scentName = title.split('—')[0]?.trim() || title;
  const scentSubtitle = title.split('—')[1]?.trim() || 'Signature Scent';

  // Scent list for the bundle-selector
  const scentOptions = SHOP_ALL.filter(p => p.images && p.images.length > 1).slice(0, 6);

  // Related products (exclude current)
  const relatedProducts = SHOP_ALL.filter(p => p.id !== product.id);

  // Set template-product class on body for Tone's theme styles
  useEffect(() => {
    document.body.classList.remove('template-index', 'template-collection');
    document.body.classList.add('template-product');
    return () => {
      document.body.classList.remove('template-product');
    };
  }, []);

  const handleAddToCart = () => {
    const toneProd: ToneProduct = {
      id: product.id,
      slug: product.handle,
      title,
      category: 'Fragrance',
      price: amount(product.price),
      compareAtPrice: product.compare ? amount(product.compare) : undefined,
      image: imageUrl(product.images[0]),
      scent: scentName,
      scentNotes: scentSubtitle,
      scentColor: '#000000',
    };
    addItem(toneProd, 1);
    openCart();
  };

  const toggleAccordion = (name: string) => {
    setOpenAccordion(prev => (prev === name ? null : name));
  };

  const checkRelatedScroll = () => {
    if (!relatedSliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = relatedSliderRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scrollRelated = (direction: 'left' | 'right') => {
    if (!relatedSliderRef.current) return;
    const offset = relatedSliderRef.current.clientWidth * 0.75;
    relatedSliderRef.current.scrollBy({
      left: direction === 'right' ? offset : -offset,
      behavior: 'smooth',
    });
  };

  return (
    <ToneHome>
      <main id="MainContent" className="main-content" data-main>
        {/* Tone Product Single Section */}
        <div id="shopify-section-product-template" className="shopify-section">
          <style dangerouslySetInnerHTML={{ __html: `
            #productTemplate--main {
              --PT: 24px;
              --PB: 60px;
            }
            .bundle-selector {
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              margin-top: 24px;
              margin-bottom: 24px;
            }
            .bundle-selector h4 {
              width: 100%;
              font-size: 13px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.08em;
              margin-bottom: 10px;
              color: #000;
            }
            .bundle-selector-items {
              display: grid;
              grid-template-columns: repeat(3, minmax(0, 1fr));
              gap: 8px;
              width: 100%;
            }
            @media (min-width: 640px) {
              .bundle-selector-items {
                grid-template-columns: repeat(6, minmax(0, 1fr));
              }
            }
            .bundle-selector .item {
              width: 100%;
              margin: 0;
              box-sizing: border-box;
              padding: 4px;
              border-radius: 4px;
              text-align: center;
              text-decoration: none;
            }
            .bundle-selector .item img.product-selector-img {
              display: block;
              width: 100%;
              aspect-ratio: 1;
              object-fit: cover;
              margin-bottom: 6px;
              border: 1.5px solid #ebebeb;
              border-radius: 4px;
              transition: border-color 0.2s ease;
            }
            .bundle-selector .item.active img.product-selector-img,
            .bundle-selector .item:hover img.product-selector-img {
              border-color: #000;
            }
            .bundle-selector .item h5 {
              color: #000;
              font-size: 11px;
              line-height: 1.2;
              text-decoration: none;
              text-transform: uppercase;
              margin: 0;
              font-weight: 600;
              letter-spacing: 0.04em;
            }
            .bundle-selector .item.active h5 {
              font-weight: 900;
              text-decoration: underline;
              text-underline-offset: 3px;
            }
            .product-single__wrapper {
              display: grid;
              grid-template-columns: 1fr;
              gap: 32px;
            }
            @media (min-width: 1024px) {
              .product-single__wrapper {
                grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
                gap: 56px;
                align-items: start;
              }
              .product-single__details {
                position: sticky;
                top: 100px;
              }
            }
            .pdp-main-gallery-frame {
              position: relative;
              width: 100%;
              aspect-ratio: 1;
              background-color: #f7f7f7;
              overflow: hidden;
              border-radius: 4px;
            }
            .pdp-main-gallery-frame img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              object-position: center;
              transition: opacity 0.3s ease;
            }
            .pdp-thumbs-row {
              display: flex;
              gap: 10px;
              margin-top: 12px;
              overflow-x: auto;
              scrollbar-width: none;
            }
            .pdp-thumbs-row::-webkit-scrollbar {
              display: none;
            }
            .pdp-thumb-btn {
              width: 82px;
              height: 82px;
              flex-shrink: 0;
              border: 1.5px solid transparent;
              border-radius: 4px;
              overflow: hidden;
              background: #f7f7f7;
              cursor: pointer;
              padding: 0;
              transition: border-color 0.2s ease, opacity 0.2s ease;
            }
            .pdp-thumb-btn.is-active {
              border-color: #000;
            }
            .pdp-thumb-btn:not(.is-active) {
              opacity: 0.65;
            }
            .pdp-thumb-btn:hover {
              opacity: 1;
            }
            .pdp-thumb-btn img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              display: block;
            }
            .fresh-price-bulk {
              margin-top: 16px;
              margin-bottom: 20px;
              padding: 12px 14px;
              background: #fbfbfb;
              border: 1px solid #eeeeee;
              border-radius: 4px;
            }
            .fresh-price-bulk .fresh-price-bulk-header {
              font-style: italic;
              font-size: 14px;
              margin: 0;
              font-weight: 500;
              color: #222;
            }
            .fresh-price-bulk .fresh-price-bulk-details {
              font-size: 13px;
              margin-top: 4px;
              margin-bottom: 0;
              font-weight: 700;
              color: #000;
            }
          `}} />

          {/* Breadcrumb */}
          <div className="wrapper--full-padded" style={{ paddingTop: '16px', paddingBottom: '8px' }}>
            <nav className="text-xs uppercase tracking-wider text-neutral-400 flex items-center gap-2">
              <Link href="/" className="hover:text-black transition-colors">Home</Link>
              <span>/</span>
              <Link href="/collections/shop-all" className="hover:text-black transition-colors">Shop All</Link>
              <span>/</span>
              <span className="text-black font-semibold truncate">{title}</span>
            </nav>
          </div>

          <section id="productTemplate--main" className="section-padding product-single" data-section-type="product">
            <div className="wrapper--full-padded">
              <div className="product-single__wrapper product-single__wrapper--grid product-single__wrapper--large">
                
                {/* Left: Product Media Gallery */}
                <div className="product-single__gallery">
                  {/* Main Product Image Frame */}
                  <div className="pdp-main-gallery-frame">
                    <img
                      src={imageUrl(product.images[selectedImage] || product.images[0])}
                      alt={`${title} - Photo ${selectedImage + 1}`}
                      fetchPriority="high"
                    />
                    {product.pct > 0 && (
                      <div className="absolute top-3 left-3 bg-black text-white text-[11px] font-black uppercase px-2.5 py-1 tracking-wider z-10">
                        SAVE {product.pct}%
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Row */}
                  {product.images.length > 1 && (
                    <div className="pdp-thumbs-row">
                      {product.images.map((img, idx) => (
                        <button
                          key={img}
                          type="button"
                          onClick={() => setSelectedImage(idx)}
                          className={`pdp-thumb-btn ${selectedImage === idx ? 'is-active' : ''}`}
                          aria-label={`View image ${idx + 1}`}
                        >
                          <img src={imageUrl(img)} alt="" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right: Product Single Details */}
                <div className="product-single__details" data-collapsible-single>
                  <div className="form__wrapper" data-product-info>
                    
                    {/* Title */}
                    <div className="product__block product__title-and-price">
                      <h1
                        className="product__title"
                        style={{
                          fontSize: 'clamp(28px, 3.2vw, 42px)',
                          fontWeight: 900,
                          lineHeight: 1.08,
                          letterSpacing: '-0.02em',
                          textTransform: 'uppercase',
                          marginBottom: '10px',
                        }}
                      >
                        {title}
                      </h1>
                    </div>

                    {/* Judge.me Star Review Badge */}
                    <div className="product__block standard__app" style={{ marginBottom: '14px' }}>
                      <div className="jdgm-widget jdgm-preview-badge" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="jdgm-prev-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <span className="jdgm-prev-badge__stars" style={{ color: '#000', fontSize: '15px', letterSpacing: '2px' }}>
                            ★★★★★
                          </span>
                          <span className="jdgm-prev-badge__text" style={{ fontSize: '13px', fontWeight: 600, color: '#333' }}>
                            56 reviews
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Price & Compare Price & Save Badge */}
                    <div className="product__block product__price-and-badge" style={{ marginBottom: '18px' }}>
                      <div className="product__price-wrapper">
                        <div className="product__price" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span
                            data-product-price
                            className="product__price--regular"
                            style={{ fontSize: '24px', fontWeight: 800, color: '#000' }}
                          >
                            {product.price}
                          </span>
                          {product.compare && (
                            <s
                              data-compare-price
                              className="product__price--compare"
                              style={{ fontSize: '18px', color: '#888' }}
                            >
                              {product.compare}
                            </s>
                          )}
                          {product.pct > 0 && (
                            <span
                              data-price-off
                              className="product__price--off"
                              style={{
                                backgroundColor: '#000',
                                color: '#fff',
                                fontWeight: 700,
                                fontSize: '11px',
                                textTransform: 'uppercase',
                                padding: '4px 8px',
                                borderRadius: '2px',
                                letterSpacing: '0.05em',
                              }}
                            >
                              SAVE {product.pct}%
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: '12px', color: '#666', marginTop: '6px', margin: 0 }}>
                          Shipping calculated at checkout.
                        </p>
                      </div>
                    </div>

                    {/* Description Paragraphs (Tone Storytelling format) */}
                    <div className="product__block product__description rte" style={{ fontSize: '15px', lineHeight: 1.6, color: '#222', marginBottom: '20px' }}>
                      <p style={{ marginBottom: '10px' }}>
                        The quiet way to wear <strong>{scentName}</strong>.
                      </p>
                      <p style={{ marginBottom: '10px' }}>
                        DRIFT Extrait de Parfum is crafted with premium fragrance oils rather than harsh alcohol fillers, so it warms with your skin instead of dissipating into the air, creating a long-lasting signature scent that stays with you all day.
                      </p>
                      <p style={{ margin: 0 }}>
                        Best worn daily on pulse points, or layered with other DRIFT products to amplify your presence.
                      </p>
                    </div>

                    {/* Tone Fresh Price Bulk Promo */}
                    <div className="fresh-price-bulk">
                      <p className="fresh-price-bulk-header">Add scents and watch the price drop!</p>
                      <p className="fresh-price-bulk-details">
                        Buy 2: Rs.1,299 each | Buy 3: Rs.1,199 each | Buy 4+: Rs.1,099 each
                      </p>
                    </div>

                    {/* Tone Scent Selector (bundle-selector) */}
                    {scentOptions.length > 0 && (
                      <div className="bundle-selector">
                        <h4>Select Your Scent</h4>
                        <div className="bundle-selector-items">
                          {scentOptions.map((opt) => {
                            const isCurrent = opt.id === product.id;
                            const optName = opt.title.split('—')[0]?.trim() || opt.title;
                            return (
                              <div key={opt.id} className={`item ${isCurrent ? 'active' : ''}`}>
                                <Link href={`/products/${opt.handle}`}>
                                  <img
                                    className="product-selector-img"
                                    src={imageUrl(opt.images[0])}
                                    alt={opt.title}
                                  />
                                  <h5>{optName}</h5>
                                </Link>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Add to Cart Button Block */}
                    <div className="product__block product__form__wrapper" style={{ marginBottom: '28px' }}>
                      <div className="product__submit__holder">
                        <div className="product__submit__buttons">
                          <button
                            type="button"
                            onClick={handleAddToCart}
                            className="product__submit__add btn btn--solid btn--primary btn--large"
                            style={{
                              width: '100%',
                              backgroundColor: '#000000',
                              color: '#ffffff',
                              padding: '16px 24px',
                              fontSize: '13px',
                              fontWeight: 800,
                              textTransform: 'uppercase',
                              letterSpacing: '0.12em',
                              borderRadius: '3px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'background-color 0.2s ease',
                              border: 'none',
                            }}
                          >
                            <span>ADD TO CART • {product.price}</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Tone Collapsible Accordions */}
                    <div className="product__block product__accordions">
                      
                      {/* Accordion 1: DETAILS */}
                      <div className="product__accordion" style={{ borderTop: '1px solid #e5e5e5' }}>
                        <button
                          type="button"
                          onClick={() => toggleAccordion('details')}
                          className="product__accordion__title font-heading"
                          aria-expanded={openAccordion === 'details'}
                          style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '18px 0',
                            fontSize: '13px',
                            fontWeight: 700,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#000',
                          }}
                        >
                          <span>DETAILS</span>
                          <span style={{ fontSize: '18px', fontWeight: 400 }}>
                            {openAccordion === 'details' ? '−' : '+'}
                          </span>
                        </button>
                        {openAccordion === 'details' && (
                          <div className="product__accordion__content" style={{ paddingBottom: '20px', fontSize: '14px', lineHeight: 1.6, color: '#333' }}>
                            <p style={{ marginBottom: '8px' }}>
                              <strong>What It Is:</strong> A luxury Extrait de Parfum crafted for all-day skin-activated scent projection.
                            </p>
                            <p style={{ marginBottom: '8px' }}>
                              <strong>Who It&apos;s For:</strong> Anyone seeking an unforgettable, high-impact signature fragrance.
                            </p>
                            <p style={{ marginBottom: '8px' }}>
                              <strong>Fragrance Family:</strong> {scentSubtitle}
                            </p>
                            <p style={{ marginBottom: '8px' }}>
                              <strong>Scent Notes:</strong> Spiced woods, crisp citrus, rich amber, and velvety musks.
                            </p>
                            <p style={{ margin: 0 }}>
                              <strong>Ingredients:</strong> Caprylic/Capric Triglyceride, Fragrance (Parfum), Sunflower Seed Oil, Vitamin E (Tocopherol). Free from parabens, phthalates, and harsh chemicals.
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Accordion 2: HOW TO USE */}
                      <div className="product__accordion" style={{ borderTop: '1px solid #e5e5e5' }}>
                        <button
                          type="button"
                          onClick={() => toggleAccordion('how-to-use')}
                          className="product__accordion__title font-heading"
                          aria-expanded={openAccordion === 'how-to-use'}
                          style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '18px 0',
                            fontSize: '13px',
                            fontWeight: 700,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#000',
                          }}
                        >
                          <span>HOW TO USE</span>
                          <span style={{ fontSize: '18px', fontWeight: 400 }}>
                            {openAccordion === 'how-to-use' ? '−' : '+'}
                          </span>
                        </button>
                        {openAccordion === 'how-to-use' && (
                          <div className="product__accordion__content" style={{ paddingBottom: '20px', fontSize: '14px', lineHeight: 1.6, color: '#333' }}>
                            <ul style={{ paddingLeft: '20px', margin: 0 }}>
                              <li style={{ marginBottom: '6px' }}>Apply directly to warm pulse points (wrists, neck, collarbone, and behind the ears).</li>
                              <li style={{ marginBottom: '6px' }}>Let absorb naturally into the skin without rubbing to preserve the top notes.</li>
                              <li>Layer with other DRIFT fragrances to design your own custom scent profile.</li>
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Accordion 3: SHIPPING & RETURNS */}
                      <div className="product__accordion" style={{ borderTop: '1px solid #e5e5e5', borderBottom: '1px solid #e5e5e5' }}>
                        <button
                          type="button"
                          onClick={() => toggleAccordion('shipping')}
                          className="product__accordion__title font-heading"
                          aria-expanded={openAccordion === 'shipping'}
                          style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '18px 0',
                            fontSize: '13px',
                            fontWeight: 700,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#000',
                          }}
                        >
                          <span>SHIPPING &amp; RETURNS</span>
                          <span style={{ fontSize: '18px', fontWeight: 400 }}>
                            {openAccordion === 'shipping' ? '−' : '+'}
                          </span>
                        </button>
                        {openAccordion === 'shipping' && (
                          <div className="product__accordion__content" style={{ paddingBottom: '20px', fontSize: '14px', lineHeight: 1.6, color: '#333' }}>
                            <p style={{ marginBottom: '8px' }}>
                              <strong>Fast Nationwide Delivery:</strong> Dispatched within 24 hours. Delivery takes 2-4 business days across Pakistan.
                            </p>
                            <p style={{ marginBottom: '8px' }}>
                              <strong>Cash on Delivery (COD):</strong> Pay in cash at your doorstep upon receiving your package.
                            </p>
                            <p style={{ margin: 0 }}>
                              <strong>Hassle-Free Returns:</strong> 7-day exchange or refund policy for unopened items.
                            </p>
                          </div>
                        )}
                      </div>

                    </div>

                  </div>
                </div>

              </div>
            </div>
          </section>
        </div>

        {/* Section 2: Trust Row (Same 3 pillars as Tone) */}
        <section className="section-padding icons-row icons-row--borders-vertical icons-row--borders-horizontal icons-row--spaced" style={{ backgroundColor: '#ffffff', borderTop: '1px solid #eeeeee', borderBottom: '1px solid #eeeeee', padding: '40px 0' }}>
          <div className="wrapper">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-[1200px] mx-auto px-4">
              <div className="flex flex-col items-center">
                <div style={{ width: '40px', height: '40px', marginBottom: '14px' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-full h-full text-black">
                    <rect x="1" y="3" width="15" height="13" />
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
                  FASTEST DELIVERY NATIONWIDE
                </h3>
              </div>

              <div className="flex flex-col items-center">
                <div style={{ width: '40px', height: '40px', marginBottom: '14px' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-full h-full text-black">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
                  100% ORIGINAL FRAGRANCE
                </h3>
              </div>

              <div className="flex flex-col items-center">
                <div style={{ width: '40px', height: '40px', marginBottom: '14px' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-full h-full text-black">
                    <rect x="2" y="6" width="20" height="12" rx="2" />
                    <circle cx="12" cy="12" r="2" />
                    <path d="M6 12h.01M18 12h.01" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
                  CASH ON DELIVERY AVAILABLE
                </h3>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Heading Section ("ELEVATE YOUR DAILY RITUAL") */}
        <section className="section-padding text-section text-dark text-center" style={{ paddingTop: '60px', paddingBottom: '20px' }}>
          <div className="max-w-[700px] mx-auto px-4">
            <h2 style={{ fontSize: 'clamp(28px, 3.2vw, 40px)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', margin: 0, color: '#000' }}>
              PERSONAL CARE BY DRIFT
            </h2>
            <p style={{ fontSize: '15px', color: '#555', marginTop: '10px', lineHeight: 1.6 }}>
              DRIFT is a fragrance-led personal care brand crafting skin-activated scents designed for effortless everyday wear.
            </p>
          </div>
        </section>

        {/* Section 4: Related Products Carousel (Exact Tone Featured Collection carousel with floating arrow) */}
        <section className="section-padding featured-collection featured-collection--carousel" style={{ paddingTop: '20px', paddingBottom: '70px' }}>
          <div className="wrapper--full-padded max-w-[1440px] mx-auto px-4 sm:px-8">
            <div className="section__header mb-6">
              <h2 className="section__heading h2 font-black uppercase tracking-tight text-2xl sm:text-3xl text-black">
                YOU MAY ALSO LIKE
              </h2>
            </div>

            <div className="relative group/carousel">
              {/* Left Arrow Button */}
              {canScrollLeft && (
                <button
                  type="button"
                  onClick={() => scrollRelated('left')}
                  className="absolute left-2 sm:left-4 top-[38%] -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-black flex items-center justify-center shadow-[0_2px_12px_rgba(0,0,0,0.22)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border border-neutral-100"
                  aria-label="Previous products"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
              )}

              {/* Right Arrow Button */}
              {canScrollRight && (
                <button
                  type="button"
                  onClick={() => scrollRelated('right')}
                  className="absolute right-2 sm:right-4 top-[38%] -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-black flex items-center justify-center shadow-[0_2px_12px_rgba(0,0,0,0.22)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border border-neutral-100"
                  aria-label="Next products"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              )}

              {/* Scrollable Products */}
              <div
                ref={relatedSliderRef}
                onScroll={checkRelatedScroll}
                className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-4 items-stretch"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {relatedProducts.slice(0, 8).map((rel) => {
                  const relTitle = rel.title.replace(/â€”/g, '—');
                  return (
                    <div
                      key={rel.id}
                      className="w-[280px] sm:w-[320px] lg:w-[325px] shrink-0 flex flex-col justify-between group select-none"
                    >
                      <div>
                        <Link href={`/products/${rel.handle}`} className="block">
                          <div className="relative aspect-square w-full bg-[#f2f2f2] overflow-hidden mb-3.5 rounded-[4px]">
                            <img
                              src={imageUrl(rel.images[0])}
                              alt={relTitle}
                              className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300"
                            />
                            {rel.pct > 0 && (
                              <div className="absolute top-2.5 left-2.5 z-10 bg-black text-white text-[11px] font-black uppercase px-2 py-0.5 tracking-wider">
                                SAVE {rel.pct}%
                              </div>
                            )}
                          </div>
                          <h3 className="text-[13px] sm:text-sm font-bold uppercase tracking-tight text-black leading-tight line-clamp-2">
                            {relTitle}
                          </h3>
                        </Link>
                      </div>

                      <div className="pt-4">
                        <Link
                          href={`/products/${rel.handle}`}
                          className="w-full bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider py-3 px-4 transition-colors flex items-center justify-center cursor-pointer shadow-xs"
                        >
                          <span>ADD TO CART • {rel.price}</span>
                          {rel.compare && (
                            <span className="line-through text-neutral-400 ml-1.5 font-normal">
                              {rel.compare}
                            </span>
                          )}
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Judge.me Customer Reviews Section */}
        <section className="section-padding" style={{ borderTop: '1px solid #eeeeee', paddingTop: '60px', paddingBottom: '80px', backgroundColor: '#fcfcfc' }}>
          <div className="max-w-[1000px] mx-auto px-4 text-center">
            <h2 style={{ fontSize: 'clamp(24px, 2.8vw, 32px)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: '8px', color: '#000' }}>
              CUSTOMER REVIEWS
            </h2>
            <div className="flex items-center justify-center gap-2 mb-8">
              <span style={{ color: '#000', fontSize: '18px', letterSpacing: '3px' }}>★★★★★</span>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#111' }}>4.9 out of 5 based on 56 reviews</span>
            </div>

            {/* Verified Review Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '4px', border: '1px solid #eaeaea', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                <div style={{ color: '#000', fontSize: '14px', marginBottom: '8px' }}>★★★★★</div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', margin: '0 0 6px 0', color: '#000' }}>
                  Incredible longevity
                </h4>
                <p style={{ fontSize: '13px', lineHeight: 1.5, color: '#444', margin: '0 0 12px 0' }}>
                  &ldquo;I was skeptical at first, but this scent lasts all through my 10-hour workday. Warm, confident, and never overpowering.&rdquo;
                </p>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#888' }}>— Hamza K. (Verified Buyer)</span>
              </div>

              <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '4px', border: '1px solid #eaeaea', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                <div style={{ color: '#000', fontSize: '14px', marginBottom: '8px' }}>★★★★★</div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', margin: '0 0 6px 0', color: '#000' }}>
                  Compliments everywhere
                </h4>
                <p style={{ fontSize: '13px', lineHeight: 1.5, color: '#444', margin: '0 0 12px 0' }}>
                  &ldquo;Every time I wear this, someone asks me what fragrance I have on. Premium quality and feels great on the skin.&rdquo;
                </p>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#888' }}>— Bilal M. (Verified Buyer)</span>
              </div>

              <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '4px', border: '1px solid #eaeaea', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                <div style={{ color: '#000', fontSize: '14px', marginBottom: '8px' }}>★★★★★</div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', margin: '0 0 6px 0', color: '#000' }}>
                  Perfect daily wear
                </h4>
                <p style={{ fontSize: '13px', lineHeight: 1.5, color: '#444', margin: '0 0 12px 0' }}>
                  &ldquo;The packaging is sleek, the scent profile is rich, and it layers amazingly with my other fragrances. 10/10 recommend!&rdquo;
                </p>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#888' }}>— Sarah A. (Verified Buyer)</span>
              </div>
            </div>
          </div>
        </section>

      </main>
      <CartDrawer />
    </ToneHome>
  );
}
