import type { Metadata } from 'next';

import { ToneHome } from '@/components/ToneHome';
import { CartDrawer } from '@/components/CartDrawer';

export const metadata: Metadata = {
  title: 'Fragrance Bundles | DRIFT',
  description: 'Find your favorite DRIFT fragrance combinations in our perfumed mist bundles.',
};

export default function BundlesPage() {
  return (
    <>
      <ToneHome page="bundles" />
      <CartDrawer />
    </>
  );
}
