'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Check } from 'lucide-react';
import { TONE_BODY_WASH_PRODUCTS, ToneProduct } from '@/data/driftData';
import { useCart } from '@/context/CartContext';

export function HydratingBodyWashSection() {
  const { addItem } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  const handleAddToCart = (product: ToneProduct) => {
    addItem(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  return (
    <section id="body-wash" className="py-12 sm:py-16 bg-[#FAFAFA] border-t border-neutral-200/60">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="mb-6 sm:mb-8 text-left">
          <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400 block mb-1">
            New arrivals
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-black">
            Hydrating Body Wash
          </h2>
        </div>

        {/* Split Grid: 1 Big Image on Left + 2 Products on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Big Lifestyle Photo */}
          <div className="lg:col-span-6 relative rounded-2xl overflow-hidden min-h-[380px] sm:min-h-[480px] bg-neutral-100">
            <Image
              src="/assets/p1-u.webp"
              alt="Hydrating Body Wash Island Breeze"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </div>

          {/* Right: 2 Products */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {TONE_BODY_WASH_PRODUCTS.map(product => {
              const isAdded = addedId === product.id;

              return (
                <div
                  key={product.id}
                  className="group flex flex-col justify-between bg-white rounded-2xl overflow-hidden p-3 border border-neutral-200/60 transition-all duration-200 hover:shadow-md"
                >
                  <div>
                    <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#F5F5F5] mb-3">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 25vw"
                        className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                      />

                      <div className="absolute bottom-2.5 right-2.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/95 backdrop-blur-xs text-neutral-800 shadow-xs border border-black/5">
                          <span
                            className="w-2 h-2 rounded-full mr-1.5 shrink-0"
                            style={{ backgroundColor: product.scentColor }}
                          />
                          {product.scent}
                        </span>
                      </div>
                    </div>

                    <div className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1">
                      {product.category}
                    </div>

                    <h3 className="font-bold text-sm text-neutral-900 leading-snug mb-1">
                      {product.scent} • ${product.price}
                    </h3>

                    <p className="text-xs text-neutral-500 line-clamp-1 mb-3">
                      {product.scentNotes}
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      className={`w-full py-2.5 px-4 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-150 flex items-center justify-center cursor-pointer ${
                        isAdded
                          ? 'bg-emerald-700 text-white'
                          : 'bg-black text-white hover:bg-neutral-800'
                      }`}
                    >
                      {isAdded ? (
                        <span className="flex items-center">
                          <Check className="w-3.5 h-3.5 mr-1.5" /> Added
                        </span>
                      ) : (
                        <span>Add to Cart • ${product.price}</span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
