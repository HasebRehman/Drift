import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { StoreNavigation } from '@/components/StoreNavigation';

export const metadata: Metadata = {
  title: 'DRIFT | Own Your Flow — Perfumed Mists',
  description:
    'Discover DRIFT perfumed mists for him and her. Distinctive scents, thoughtful design, and fragrance for every day.',
  icons: {
    icon: '/assets/drift_black.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="js no-touch page-loading" lang="en" suppressHydrationWarning>
      <head>
        {/* Preload Tone fonts */}
        <link
          rel="preload"
          as="font"
          href="/fonts/instrumentsans_n4.db86542ae5e1596dbdb28c279ae6c2086c4c5bfa.woff2"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          as="font"
          href="/fonts/inter_n9.5eeac4b640934cb12c98bb58e5b212c8a842a731.woff2"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          as="font"
          href="/fonts/t-star-pro-medium.woff"
          type="font/woff"
          crossOrigin="anonymous"
        />
        {/* Tone Authentic Theme & Inline Stylesheets */}
        <link rel="stylesheet" href="/css/tone-inline.css" />
        <link rel="stylesheet" href="/css/tone-theme.css" />
        <link rel="stylesheet" href="/css/tone-after-theme.css" />
        <link rel="stylesheet" href="/css/judgeme.css" />
        <link rel="stylesheet" href="/css/font.css" />
      </head>
      <body suppressHydrationWarning
        id="tone-new-era-of-personal-care-deodorant-lotion-amp-lip-balm"
        className="template-index palette--light no-outline"
      >
        <CartProvider><StoreNavigation />{children}</CartProvider>
      </body>
    </html>
  );
}
