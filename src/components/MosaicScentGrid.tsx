'use client';

import React from 'react';
import Image from 'next/image';
import { TONE_MOSAIC_SCENTS } from '@/data/driftData';

export function MosaicScentGrid() {
  return (
    <section id="shop-by-scent" className="py-12 sm:py-16 bg-[#FAFAFA]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mb-8 sm:mb-10 text-left">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-black">
            Shop by scent
          </h2>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {TONE_MOSAIC_SCENTS.map(scent => (
            <div
              key={scent.id}
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-neutral-900 flex flex-col justify-end p-6 cursor-pointer shadow-xs hover:shadow-md transition-all"
            >
              {/* Image */}
              <div className="absolute inset-0">
                <Image
                  src={scent.image}
                  alt={scent.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Content */}
              <div className="relative z-10 flex flex-col items-start">
                <h3 className="text-2xl font-bold tracking-tight text-white mb-3">
                  {scent.name}
                </h3>
                <span className="inline-flex items-center justify-center bg-white text-black hover:bg-neutral-100 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors">
                  Shop now
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
