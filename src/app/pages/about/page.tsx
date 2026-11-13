import type { Metadata } from 'next';
import { ToneHome } from '@/components/ToneHome';
import { CartDrawer } from '@/components/CartDrawer';

export const metadata: Metadata = {
  title: 'About Us | DRIFT',
  description: 'Discover DRIFT: distinctive perfumed mists, thoughtful design, and quality you can experience every day.',
};

export default function AboutPage() {
  return (
    <>
      <ToneHome page="about" />
      <CartDrawer />
    </>
  );
}
