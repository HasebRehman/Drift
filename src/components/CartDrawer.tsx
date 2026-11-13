'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { X, Plus, Minus, Trash2, ChevronLeft, ChevronRight, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { SHOP_ALL } from '@/data/driftProducts';
import { parsePrice } from '@/lib/prices';
import { useRouter } from 'next/navigation';

export function CartDrawer() {
  const router = useRouter();
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    addItem,
    subtotal,
    freeShippingThreshold,
    hasFreeShipping,
  } = useCart();

  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    panelRef.current?.focus({ preventScroll: true });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); closeCart(); }
      if (event.key !== 'Tab') return;
      const controls = panelRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled), [tabindex="0"]');
      if (!controls?.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === panelRef.current)) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === panelRef.current)) {
        event.preventDefault(); first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.documentElement.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
      previousFocus?.focus({ preventScroll: true });
    };
    // The context recreates closeCart on item changes; keep focus/scroll locked
    // for the full opening rather than resetting when quantities change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const recommendationTrack = useRef<HTMLDivElement>(null);
  const [recommendationIndex, setRecommendationIndex] = useState(0);
  const [discount, setDiscount] = useState('');
  const [message, setMessage] = useState('');
  const recommendations = SHOP_ALL.filter(product => !items.some(item => item.productId === product.id));
  const scrollRecommendation = (direction: number) => {
    const track = recommendationTrack.current;
    if (!track) return;
    const current = Math.round(track.scrollLeft / track.clientWidth);
    const next = Math.max(0, Math.min(recommendations.length - 1, current + direction));
    track.scrollTo({ left: next * track.clientWidth, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };
  const money = (amount: number) => `Rs.${amount.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const imageUrl = (file: string) => `https://cdn.shopify.com/s/files/1/0739/6166/8743/files/${file}${file.includes('?') ? '&' : '?'}width=300`;
  const leftToSpend = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className={`drift-cart-drawer fixed inset-0 overflow-hidden${isOpen ? ' is-open' : ''}`} inert={!isOpen} aria-hidden={!isOpen}>
      <div className="drift-cart-backdrop fixed inset-0 bg-black/50" onClick={closeCart} />
      <div className="drift-cart-position">
        <div ref={panelRef} role="dialog" aria-modal="true" aria-label="Shopping cart" tabIndex={-1} className="drift-cart-panel drift-cart-design">
          <header className="drift-cart-heading"><h2>Cart</h2><button onClick={closeCart} aria-label="Close cart"><X size={23} strokeWidth={1.7} /></button></header>
          <div className="drift-cart-scroll">
            <section className="drift-cart-rewards" aria-label="Cart rewards">
              <p role="status">{hasFreeShipping ? 'You unlocked free shipping!' : `${money(leftToSpend)} away from free shipping`}</p>
              <div className="drift-cart-reward-track">
                <div className="drift-cart-reward-fill" style={{ width: `${Math.min(100, subtotal / freeShippingThreshold * 100)}%` }} />
                <span className="drift-cart-reward-point" style={{ left: '100%' }}><Truck size={20} /><span>Free Shipping</span></span>
              </div>
            </section>
            {recommendations.length > 0 && <section className="drift-cart-recommendations" aria-label="Product recommendations">
              <h3>Complete Your Routine</h3>
              <div className="drift-cart-recommendation-slider">
                <button aria-label="Previous recommendation" disabled={recommendationIndex === 0} onClick={() => scrollRecommendation(-1)}><ChevronLeft size={21} /></button>
                <div ref={recommendationTrack} className="drift-cart-recommendation-track" onScroll={event => { const track = event.currentTarget; setRecommendationIndex(Math.round(track.scrollLeft / track.clientWidth)); }}>
                {recommendations.map(recommendation => <div key={recommendation.id} className="drift-cart-recommendation" aria-label={recommendation.title}>
                  <div className="drift-cart-recommendation-image"><Image src={imageUrl(recommendation.images[0])} alt={recommendation.title} fill sizes="112px" /></div>
                  <div><h4>{recommendation.title}</h4><p>{recommendation.price}</p><button className="drift-cart-add" onClick={() => addItem({ id: recommendation.id, slug: recommendation.handle, title: recommendation.title, price: parsePrice(recommendation.price), image: imageUrl(recommendation.images[0]), category: '', scent: '', scentNotes: '', scentColor: '' })}>Add</button></div>
                </div>)}
                </div>
                <button aria-label="Next recommendation" disabled={recommendationIndex >= recommendations.length - 1} onClick={() => scrollRecommendation(1)}><ChevronRight size={21} /></button>
              </div>
            </section>}
            <div className="drift-cart-products" aria-label="Cart items">
              {items.length === 0 ? <p className="drift-cart-empty">Your cart is currently empty.</p> : items.map(item => <article key={item.id} className="drift-cart-item drift-cart-product">
                <div className="drift-cart-product-image"><Image src={item.image} alt={item.title} fill sizes="110px" /></div>
                <div className="drift-cart-product-info">
                  <h3>{item.title}</h3><p>{money(item.price * item.quantity)}</p>
                  <div className="drift-cart-quantity"><button aria-label={`Decrease ${item.title} quantity`} onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={12} /></button><span aria-label="Quantity">{item.quantity}</span><button aria-label={`Increase ${item.title} quantity`} onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={12} /></button></div>
                </div>
                <button className="drift-cart-remove" aria-label={`Remove ${item.title}`} onClick={() => removeItem(item.id)}><Trash2 size={19} /></button>
              </article>)}
            </div>
          </div>
          <footer className="drift-cart-checkout">
            <form onSubmit={event => { event.preventDefault(); setMessage(discount.trim() ? 'Discount codes will be available when checkout is connected.' : 'Please enter a discount code.'); }}>
              <input aria-label="Discount code" placeholder="Discount code" value={discount} onChange={event => setDiscount(event.target.value)} /><button type="submit">Apply</button>
            </form>
            {message && <p className="drift-cart-message" role="status">{message}</p>}
            <button className="drift-cart-checkout-button" disabled={!items.length} onClick={() => { closeCart(); router.push('/checkout'); }}>Checkout &bull; {money(subtotal)}</button>
          </footer>
        </div>
      </div>
    </div>
  );
}
