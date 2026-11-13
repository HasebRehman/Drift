import type { Metadata } from 'next';

import { ToneHome } from '@/components/ToneHome';
import { CartDrawer } from '@/components/CartDrawer';

export const metadata: Metadata = {
  title: 'Shop All Fragrances | DRIFT',
  description: 'Shop the full DRIFT collection of perfumed mists and fragrance bundles.',
};

export default function ShopAllPage() {
  return (
    <>
      <ToneHome page="shop-all" />
      <CartDrawer />
    </>
  );
}
