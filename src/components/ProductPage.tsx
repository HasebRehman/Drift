'use client';

import { ToneHome } from './ToneHome';
import { CartDrawer } from './CartDrawer';
import type { DriftProduct } from '@/data/driftProducts';

/** Single product page: Tone's product template filled with the DRIFT product (see productMain in ToneHome). */
export function ProductPage({ product }: { product: DriftProduct }) {
  return (
    <>
      <ToneHome page="product" product={product} />
      <CartDrawer />
    </>
  );
}
