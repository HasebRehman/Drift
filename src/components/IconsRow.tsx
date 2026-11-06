'use client';

import React from 'react';
import { Sparkles, Leaf, Layers } from 'lucide-react';
import { TONE_ICONS } from '@/data/driftData';

const ICONS = [Sparkles, Leaf, Layers];

export function IconsRow() {
  return (
    <section className="border-y border-neutral-200 bg-white py-12 sm:py-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-neutral-200">
          {TONE_ICONS.map((item, idx) => {
            const Icon = ICONS[idx];
            return (
              <div
                key={item.title}
                className="flex flex-col items-center text-center p-6 sm:p-8"
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-black mb-4">
                  <Icon className="w-6 h-6 stroke-[1.5]" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-black mb-2 font-sans">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 max-w-xs font-normal leading-relaxed">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
