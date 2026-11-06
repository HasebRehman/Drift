'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ShoppingBag, X, ChevronRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export function Navbar({ onOpenSearch }: { onOpenSearch?: () => void }) {
  const { totalCount, openCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(prev => (prev === section ? null : section));
  };

  return (
    <>
      <header className="sticky top-[33px] z-40 w-full bg-white border-b border-neutral-200/80 transition-all">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-14 sm:h-16 flex items-center justify-between">
          {/* Left: Hamburger Menu Button */}
          <div className="flex items-center w-24">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="p-2 -ml-2 text-black hover:opacity-60 transition-opacity cursor-pointer"
              aria-label="Open navigation menu"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>

          {/* Center: Globe + TONE© Logo (Exact Image 2) */}
          <div className="flex-1 flex justify-center items-center text-center">
            <Link href="/" className="inline-flex items-center justify-center">
              <Image
                src="https://tone.shop/cdn/shop/files/TONE.svg?v=1740067973&width=500"
                alt="TONE"
                width={120}
                height={32}
                priority
                className="h-6 sm:h-7 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Right: Search & Shopping Bag Icons Only (Exact Image 2) */}
          <div className="flex items-center justify-end space-x-3 sm:space-x-5 w-24">
            <button
              type="button"
              onClick={onOpenSearch}
              className="p-1.5 text-black hover:opacity-60 transition-opacity cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-5 h-5 stroke-[1.8]" />
            </button>

            <button
              type="button"
              onClick={openCart}
              className="p-1.5 text-black hover:opacity-60 transition-opacity relative cursor-pointer"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Slide-out Navigation Drawer from Hamburger */}
      {menuOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-2xs transition-opacity duration-300"
            onClick={() => setMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-white shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-300">
            <div>
              {/* Header */}
              <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
                <Image
                  src="https://tone.shop/cdn/shop/files/TONE.svg?v=1740067973&width=500"
                  alt="TONE"
                  width={96}
                  height={26}
                  className="h-5 w-auto object-contain"
                />
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="p-1 rounded-full text-black hover:bg-neutral-100 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Items with Accordions */}
              <div className="p-6 space-y-4 text-xs font-bold uppercase tracking-wider text-black">
                {/* Shop Sets */}
                <div className="border-b border-neutral-100 pb-3">
                  <button
                    type="button"
                    onClick={() => toggleSection('sets')}
                    className="w-full flex items-center justify-between py-2 text-left hover:opacity-60 transition-opacity"
                  >
                    <span>Shop Sets</span>
                    <ChevronRight
                      className={`w-4 h-4 transition-transform duration-200 ${
                        expandedSection === 'sets' ? 'rotate-90' : ''
                      }`}
                    />
                  </button>
                  {expandedSection === 'sets' && (
                    <div className="pl-3 pt-2 space-y-2 text-neutral-600 font-medium normal-case">
                      <a href="#featured-sets" onClick={() => setMenuOpen(false)} className="block py-1 hover:text-black">
                        Build Your Own Deo Set
                      </a>
                      <a href="#featured-sets" onClick={() => setMenuOpen(false)} className="block py-1 hover:text-black">
                        Build Your Own Cologne Set
                      </a>
                      <a href="#featured-sets" onClick={() => setMenuOpen(false)} className="block py-1 hover:text-black">
                        Routines
                      </a>
                      <a href="#featured-sets" onClick={() => setMenuOpen(false)} className="block py-1 hover:text-black">
                        Duos
                      </a>
                      <a href="#featured-sets" onClick={() => setMenuOpen(false)} className="block py-1 hover:text-black">
                        Scent Discovery
                      </a>
                      <a href="#featured-sets" onClick={() => setMenuOpen(false)} className="block py-1 hover:text-black font-bold">
                        All Sets →
                      </a>
                    </div>
                  )}
                </div>

                {/* Shop By Product */}
                <div className="border-b border-neutral-100 pb-3">
                  <button
                    type="button"
                    onClick={() => toggleSection('product')}
                    className="w-full flex items-center justify-between py-2 text-left hover:opacity-60 transition-opacity"
                  >
                    <span>Shop By Product</span>
                    <ChevronRight
                      className={`w-4 h-4 transition-transform duration-200 ${
                        expandedSection === 'product' ? 'rotate-90' : ''
                      }`}
                    />
                  </button>
                  {expandedSection === 'product' && (
                    <div className="pl-3 pt-2 space-y-2 text-neutral-600 font-medium normal-case">
                      <a href="#featured-sets" onClick={() => setMenuOpen(false)} className="block py-1 hover:text-black">
                        TONE Fragrance
                      </a>
                      <a href="#deodorant" onClick={() => setMenuOpen(false)} className="block py-1 hover:text-black">
                        TONE Deodorant
                      </a>
                      <a href="#body-wash" onClick={() => setMenuOpen(false)} className="block py-1 hover:text-black">
                        TONE Body Wash
                      </a>
                      <a href="#body-wash" onClick={() => setMenuOpen(false)} className="block py-1 hover:text-black">
                        TONE Lotion
                      </a>
                      <a href="#featured-sets" onClick={() => setMenuOpen(false)} className="block py-1 hover:text-black">
                        TONE Lip Balm
                      </a>
                      <a href="#all-pills" onClick={() => setMenuOpen(false)} className="block py-1 hover:text-black font-bold">
                        Shop All Products →
                      </a>
                    </div>
                  )}
                </div>

                {/* Shop By Scent */}
                <div className="border-b border-neutral-100 pb-3">
                  <button
                    type="button"
                    onClick={() => toggleSection('scent')}
                    className="w-full flex items-center justify-between py-2 text-left hover:opacity-60 transition-opacity"
                  >
                    <span>Shop By Scent</span>
                    <ChevronRight
                      className={`w-4 h-4 transition-transform duration-200 ${
                        expandedSection === 'scent' ? 'rotate-90' : ''
                      }`}
                    />
                  </button>
                  {expandedSection === 'scent' && (
                    <div className="pl-3 pt-2 grid grid-cols-2 gap-2 text-neutral-600 font-medium normal-case">
                      {['Coconut', 'Fresh', 'Vanilla', 'Eucalyptus', 'Woodland', 'Island Breeze', 'Pine & Cypress', 'Citrus', 'Sunrise'].map(
                        s => (
                          <a
                            key={s}
                            href="#shop-by-scent"
                            onClick={() => setMenuOpen(false)}
                            className="block py-1 hover:text-black"
                          >
                            {s}
                          </a>
                        )
                      )}
                    </div>
                  )}
                </div>

                {/* Direct Links */}
                <a
                  href="#featured-sets"
                  onClick={() => setMenuOpen(false)}
                  className="block py-2 hover:opacity-60 transition-opacity"
                >
                  Best Sellers
                </a>
              </div>
            </div>

            {/* Bottom Support info */}
            <div className="p-6 border-t border-neutral-100 text-xs text-neutral-500 space-y-1">
              <p className="font-semibold text-black">TONE Inc.</p>
              <p>Free Shipping &amp; Free Lip Balm on Orders $49+</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
