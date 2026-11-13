'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Check, LockKeyhole, Package, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import './checkout.css';

const money = (value: number) => `Rs.${value.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function Checkout() {
  const { items, subtotal, totalCount, hasFreeShipping, freeShippingThreshold, isReady } = useCart();
  const [step, setStep] = useState(1);
  const [complete, setComplete] = useState(false);
  const [discount, setDiscount] = useState('');
  const [discountMessage, setDiscountMessage] = useState('');
  const summarySlotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.classList.remove('page-loading');
    document.body.classList.add('drift-checkout-page');
    const updateSummaryHeight = () => {
      const header = document.querySelector('.drift-checkout-header');
      const announcement = document.querySelector('.drift-checkout-announcement');
      const height = (header?.getBoundingClientRect().height || 0) + (announcement?.getBoundingClientRect().height || 0);
      document.documentElement.style.setProperty('--checkout-header-height', `${height}px`);
    };
    updateSummaryHeight();
    window.addEventListener('resize', updateSummaryHeight);
    return () => {
      document.body.classList.remove('drift-checkout-page');
      window.removeEventListener('resize', updateSummaryHeight);
      document.documentElement.style.removeProperty('--checkout-header-height');
    };
  }, []);

  useLayoutEffect(() => {
    const slot = summarySlotRef.current;
    const summary = slot?.querySelector<HTMLElement>('.drift-checkout-summary');
    if (!slot || !summary) return;

    // A fixed panel does not move with document scrolling. Measure its grid
    // column only on layout changes, keeping the original two-column alignment.
    const alignSummary = () => {
      const { left, width } = slot.getBoundingClientRect();
      summary.style.setProperty('--checkout-summary-left', `${left}px`);
      summary.style.setProperty('--checkout-summary-width', `${width}px`);
    };
    alignSummary();
    const observer = new ResizeObserver(alignSummary);
    observer.observe(slot);
    window.addEventListener('resize', alignSummary);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', alignSummary);
    };
  }, [isReady, complete, items.length]);

  const goToStep = (next: number) => {
    setStep(next);
    window.requestAnimationFrame(() => document.getElementById('checkout-step-title')?.focus({ preventScroll: true }));
  };

  return <div className={"drift-checkout-page"}>
    <div className="drift-checkout-top">
    <div className={"drift-checkout-announcement"}>YOUR NEXT SIGNATURE SCENT STARTS HERE</div>
    <header className={"drift-checkout-header"}>
      <Link href="/" aria-label="DRIFT home"><Image src="/assets/drift_black.svg" alt="DRIFT" width={150} height={47} priority /></Link>
      <span><LockKeyhole size={15} /> Checkout</span>
    </header>
    </div>
    {!isReady ? <main className={"drift-checkout-empty"} aria-live="polite">Loading your cart…</main> : !items.length ? <main className={"drift-checkout-empty"}>
      <Package size={40} strokeWidth={1.2} /><h1>Your next scent is waiting.</h1><p>Add a fragrance to your cart to get started.</p><Link className={"drift-checkout-primary"} href="/collections/shop-all">Explore fragrances <ArrowRight size={18} /></Link>
    </main> : complete ? <main className={"drift-checkout-empty"}>
      <span className={"drift-checkout-successIcon"}><Check size={30} /></span><p className={"drift-checkout-eyebrow"}>CHECKOUT PREVIEW COMPLETE</p><h1>You’re ready to own your flow.</h1><p>Your demo checkout is complete. No order has been placed and no payment has been collected. Your cart is saved so you can keep exploring.</p><Link className={"drift-checkout-primary"} href="/collections/shop-all">Continue shopping <ArrowRight size={18} /></Link>
    </main> : <main className={"drift-checkout-layout"}>
      <section className={"drift-checkout-details"} aria-label="Checkout details">
        <Link className={"drift-checkout-back"} href="/collections/shop-all"><ArrowLeft size={16} /> Continue shopping</Link>
        <p className={"drift-checkout-eyebrow"}>MAKE IT YOURS</p>
        <h1>One step closer<br />to your signature.</h1>
        <ol className={"drift-checkout-steps"} aria-label="Checkout progress">
          <li aria-current={step === 1 ? 'step' : undefined}><span>{step > 1 ? <Check size={14} /> : '1'}</span>Delivery</li>
          <li aria-current={step === 2 ? 'step' : undefined}><span>2</span>Review</li>
        </ol>
        <div className={"drift-checkout-demoNote"}>Demo checkout · No payment will be collected.</div>
        <form className={"drift-checkout-form"} onSubmit={event => {
          event.preventDefault();
          if (step === 1) goToStep(2);
          else setComplete(true);
        }}>
          <div hidden={step !== 1}>
            <h2 id={step === 1 ? 'checkout-step-title' : undefined} tabIndex={-1}>Contact</h2>
            <label>Email address<input name="email" type="email" autoComplete="email" placeholder="you@example.com" required maxLength={254} /></label>
            <h2>Delivery address</h2>
            <div className={"drift-checkout-fields"}>
              <label>First name<input name="firstName" autoComplete="given-name" required maxLength={80} pattern=".*\S.*" /></label>
              <label>Last name<input name="lastName" autoComplete="family-name" required maxLength={80} pattern=".*\S.*" /></label>
            </div>
            <label>Country / region<select name="country" autoComplete="country-name" defaultValue="Pakistan"><option>Pakistan</option></select></label>
            <label>Address<input name="address" autoComplete="address-line1" placeholder="House number and street" required maxLength={200} pattern=".*\S.*" /></label>
            <label>Apartment, suite, etc. <span>(optional)</span><input name="apartment" autoComplete="address-line2" maxLength={120} /></label>
            <div className={"drift-checkout-fields"}>
              <label>City<input name="city" autoComplete="address-level2" required maxLength={80} pattern=".*\S.*" /></label>
              <label>Postal code <span>(optional)</span><input name="postalCode" autoComplete="postal-code" inputMode="numeric" maxLength={12} /></label>
            </div>
            <label>Phone number<input name="phone" type="tel" autoComplete="tel" placeholder="03XX XXXXXXX" required pattern="[+0-9() \-]{7,20}" title="Enter a phone number using 7 to 20 digits, spaces, +, or dashes." /></label>
            <p className={"drift-checkout-caption"}>Your details are used for this preview only and aren’t saved or sent.</p>
          </div>
          {step === 2 && <div className={"drift-checkout-review"}>
            <h2 id="checkout-step-title" tabIndex={-1}>Review your checkout</h2>
            <div className={"drift-checkout-method"}><Truck size={22} /><div><strong>Standard delivery</strong><p>{hasFreeShipping ? 'Free shipping unlocked for this cart.' : `Free shipping on orders of ${money(freeShippingThreshold)} or more. Shipping rates are not configured for this demo.`}</p></div></div>
            <div className={"drift-checkout-method"}><LockKeyhole size={22} /><div><strong>Payment</strong><p>This is a checkout preview. Payment methods and order processing will be available when the live store is connected.</p></div></div>
            <button className={"drift-checkout-edit"} type="button" onClick={() => goToStep(1)}><ArrowLeft size={15} /> Edit contact & delivery details</button>
          </div>}
          <button className={"drift-checkout-primary"} type="submit">{step === 1 ? 'Continue to review' : 'Complete demo checkout'} <ArrowRight size={18} /></button>
        </form>
        <p className={"drift-checkout-footerNote"}>DRIFT · Distinctive scents. Everyday confidence.</p>
      </section>
      <div className="drift-checkout-summarySlot" ref={summarySlotRef}>
      <aside className={"drift-checkout-summary"} aria-labelledby="summary-title">
        <div className={"drift-checkout-summaryInner"}>
          <div className={"drift-checkout-summaryHeading"}><h2 id="summary-title">Your selection</h2><span>{totalCount} {totalCount === 1 ? 'item' : 'items'}</span></div>
          <div className={"drift-checkout-items"} tabIndex={0} role="region" aria-label="Products in your order">{items.map(item => <article key={item.id} className={"drift-checkout-item"}>
            <div className={"drift-checkout-image"}><Image src={item.image} alt={item.title} fill sizes="80px" /><span>{item.quantity}</span></div>
            <div><h3>{item.title}</h3><p>Quantity {item.quantity}</p></div><strong>{money(item.price * item.quantity)}</strong>
          </article>)}</div>
          <div className="drift-checkout-summaryBottom">
          <form className={"drift-checkout-discount"} onSubmit={event => { event.preventDefault(); setDiscountMessage(discount.trim() ? 'Discount codes aren’t available in this demo.' : 'Enter a discount code.'); }}>
            <label className={"drift-checkout-srOnly"} htmlFor="checkout-discount">Discount code</label><input id="checkout-discount" placeholder="Discount code" value={discount} onChange={event => setDiscount(event.target.value)} /><button type="submit">Apply</button>
          </form>
          <p className={"drift-checkout-caption"} role="status">{discountMessage}</p>
          <dl className={"drift-checkout-totals"}><div><dt>Subtotal</dt><dd>{money(subtotal)}</dd></div><div><dt>Shipping</dt><dd>{hasFreeShipping ? 'FREE' : 'Not yet calculated'}</dd></div><div className={"drift-checkout-total"}><dt>{hasFreeShipping ? 'Total' : 'Estimated total'}</dt><dd><small>PKR</small> {money(subtotal)}</dd></div></dl>
          {!hasFreeShipping && <p className={"drift-checkout-caption"}>Estimated total excludes shipping. Add {money(freeShippingThreshold - subtotal)} more to unlock free shipping.</p>}
          </div>
        </div>
      </aside>
      </div>
    </main>}
  </div>;
}
