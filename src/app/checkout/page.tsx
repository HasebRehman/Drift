import type { Metadata } from 'next';
import { Checkout } from '@/components/Checkout';

export const metadata: Metadata = {
  title: 'Checkout | DRIFT',
  description: 'Complete your DRIFT fragrance selection.',
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return <Checkout />;
}
