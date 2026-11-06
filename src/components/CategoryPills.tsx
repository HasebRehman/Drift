'use client';

import React, { useState } from 'react';
import { TONE_PILLS } from '@/data/driftData';

export function CategoryPills() {
  const [active, setActive] = useState('SHOP ALL');

  return (
    <section id="all-pills" className="py-10 bg-white border-t border-neutral-100">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar gap-2.5 pb-2">
          {TONE_PILLS.map(pill => {
            const isActive = active === pill;
            return (
              <button
                key={pill}
                type="button"
                onClick={() => setActive(pill)}
                className={`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-black text-white shadow-xs'
                    : 'bg-[#F2F2F2] text-neutral-800 hover:bg-neutral-200'
                }`}
              >
                {pill}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
