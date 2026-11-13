import type { Metadata } from 'next';

import { ToneHome } from '@/components/ToneHome';
import { CartDrawer } from '@/components/CartDrawer';

export const metadata: Metadata = {
  title: 'Men | DRIFT',
  description: 'Explore DRIFT perfumed mists for him, including Hero, Rebel and Ignite.',
};

export default function MenPage() {
  return (
    <>
      <ToneHome page="men" />
      <CartDrawer />
    </>
  );
}
