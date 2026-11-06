import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';

export const metadata: Metadata = {
  title: 'TONE | New Era of Personal Care - Deodorant, Lotion & Lip Balm',
  description:
    'TONE, founded by AMP creators Kai Cenat, Duke Dennis, Fanum, Agent, Davis, and Chris, offers personal care products crafted with natural ingredients and iconic scents.',
  icons: {
    icon: 'https://tone.shop/cdn/shop/files/Group_1000004713.png?v=1740066921&width=32',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="no-js no-touch page-loading" lang="en" suppressHydrationWarning>
      <head>
        {/* Preload Tone fonts */}
        <link
          rel="preload"
          as="font"
          href="https://tone.shop/cdn/fonts/instrument_sans/instrumentsans_n4.db86542ae5e1596dbdb28c279ae6c2086c4c5bfa.woff2"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          as="font"
          href="https://tone.shop/cdn/fonts/inter/inter_n9.5eeac4b640934cb12c98bb58e5b212c8a842a731.woff2"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          as="font"
          href="https://cdn.shopify.com/s/files/1/0902/2013/4697/files/T-Star_Pro_Medium_e36da3af-ccb5-4ce5-a82f-b12577ee4ffc.woff?v=1740082115"
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
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
