'use client';

import { ToneHome } from '@/components/ToneHome';
import { CartDrawer } from '@/components/CartDrawer';

export default function ShopAllPage() {
  return (
    <>
      <ToneHome page="shop-all" />
      <CartDrawer />
    </>
  );
}
