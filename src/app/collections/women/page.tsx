import type { Metadata } from 'next';

import { ToneHome } from '@/components/ToneHome';
import { CartDrawer } from '@/components/CartDrawer';

export const metadata: Metadata = {
  title: 'Women | DRIFT',
  description: 'Discover DRIFT perfumed mists for her, including Baddie, IT Girl and Muse.',
};

export default function WomenPage() {
  return (
    <>
      <ToneHome page="women" />
      <CartDrawer />
    </>
  );
}
