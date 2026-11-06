'use client';

import React from 'react';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-white text-black pt-12 pb-12 border-t border-neutral-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Giant TONE Wordmark across Footer */}
        <div className="mb-12 border-b border-neutral-200 pb-12 text-center flex justify-center">
          <Image
            src="https://tone.shop/cdn/shop/files/logo.svg"
            alt="TONE"
            width={1200}
            height={200}
            className="w-full max-w-4xl h-auto object-contain"
          />
        </div>

        {/* 3 Columns Navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 py-4 text-xs">
          {/* Socials */}
          <div>
            <h4 className="font-bold uppercase tracking-wider mb-4 text-black">
              Socials
            </h4>
            <ul className="space-y-2.5 text-neutral-600 font-medium">
              <li>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-black transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-black transition-colors">
                  YouTube
                </a>
              </li>
              <li>
                <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="hover:text-black transition-colors">
                  TikTok
                </a>
              </li>
              <li>
                <a href="https://x.com" target="_blank" rel="noreferrer" className="hover:text-black transition-colors">
                  X
                </a>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold uppercase tracking-wider mb-4 text-black">
              Links
            </h4>
            <ul className="space-y-2.5 text-neutral-600 font-medium">
              <li>
                <a href="#search" className="hover:text-black transition-colors">
                  Search
                </a>
              </li>
              <li>
                <a href="#help" className="hover:text-black transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-black transition-colors">
                  Terms &amp; Conditions
                </a>
              </li>
              <li>
                <a href="#shipping" className="hover:text-black transition-colors">
                  Shipping &amp; Returns
                </a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-black transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-bold uppercase tracking-wider mb-4 text-black">
              Shop
            </h4>
            <ul className="space-y-2.5 text-neutral-600 font-medium">
              <li>
                <a href="#body-wash" className="hover:text-black transition-colors">
                  Shop By Category
                </a>
              </li>
              <li>
                <a href="#shop-by-scent" className="hover:text-black transition-colors">
                  Shop By Scent
                </a>
              </li>
              <li>
                <a href="#featured-sets" className="hover:text-black transition-colors">
                  Shop New
                </a>
              </li>
              <li>
                <a href="#stores" className="hover:text-black transition-colors">
                  Find In Stores
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-black transition-colors">
                  Reviews
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-black transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#scents" className="hover:text-black transition-colors">
                  Scent Glossary
                </a>
              </li>
              <li>
                <a href="#blog" className="hover:text-black transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-12 mt-8 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-400 gap-2">
          <div>
            &copy; {new Date().getFullYear()}, TONE. Powered by Shopify.
          </div>
        </div>
      </div>
    </footer>
  );
}
