'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Search, X } from 'lucide-react';
import { TONE_FEATURED_SETS, TONE_BODY_WASH_PRODUCTS, TONE_DEO_PRODUCTS, ToneProduct } from '@/data/driftData';
import { useCart } from '@/context/CartContext';

const ALL_PRODUCTS: ToneProduct[] = [
  ...TONE_FEATURED_SETS,
  ...TONE_BODY_WASH_PRODUCTS,
  ...TONE_DEO_PRODUCTS,
];

export function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const { addItem } = useCart();

  if (!isOpen) return null;

  const results = query.trim()
    ? ALL_PRODUCTS.filter(
        p =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.scent.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.scentNotes.toLowerCase().includes(query.toLowerCase())
      )
    : ALL_PRODUCTS.slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-2xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative min-h-screen flex items-start justify-center p-4 sm:p-6 pt-16 sm:pt-24">
        <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
            <div className="flex items-center space-x-3 flex-1">
              <Search className="w-5 h-5 text-neutral-400 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search products, scents..."
                autoFocus
                className="w-full text-sm text-neutral-900 placeholder-neutral-400 focus:outline-hidden"
              />
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-neutral-400 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 pt-3 pb-4">
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
              Popular:
            </span>
            {['Fresh', 'Coconut', 'Vanilla', 'Body Wash', 'Deodorant', 'Sets'].map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => setQuery(tag)}
                className="px-2.5 py-0.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-[11px] text-neutral-700 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="mt-2 divide-y divide-neutral-100 max-h-96 overflow-y-auto">
            {results.map(prod => (
              <div
                key={prod.id}
                className="py-3 flex items-center justify-between hover:bg-neutral-50 p-2 rounded-xl transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="relative w-12 h-14 rounded-lg bg-neutral-100 overflow-hidden shrink-0">
                    <Image
                      src={prod.image}
                      alt={prod.title}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-neutral-900">
                      {prod.title}
                    </div>
                    <div className="text-[11px] text-neutral-500">
                      {prod.scent} • {prod.category}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-xs font-bold text-neutral-900 font-mono">
                    ${prod.price}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      addItem(prod);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-full bg-black text-white text-[11px] font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
