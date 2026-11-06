'use client';

import React from 'react';

export function AnnouncementBar() {
  const items = [
    { text: 'Free Shipping & Free Lip Balm on Orders $49+', hasDetails: true },
    { text: 'Free Cologne on Orders $69+', hasDetails: false },
    { text: 'Free Shipping & Free Lip Balm on Orders $49+', hasDetails: true },
    { text: 'Free Cologne on Orders $69+', hasDetails: false },
    { text: 'Free Shipping & Free Lip Balm on Orders $49+', hasDetails: true },
    { text: 'Free Cologne on Orders $69+', hasDetails: false },
    { text: 'Free Shipping & Free Lip Balm on Orders $49+', hasDetails: true },
    { text: 'Free Cologne on Orders $69+', hasDetails: false },
  ];

  return (
    <div className="bg-black text-white text-[11px] uppercase tracking-wider font-medium py-2.5 overflow-hidden sticky top-0 z-50 select-none">
      <div className="flex w-max animate-marquee space-x-12 whitespace-nowrap">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center space-x-2">
            <span>{item.text}</span>
            {item.hasDetails && (
              <a
                href="#featured-sets"
                className="underline underline-offset-2 text-white/90 hover:text-white transition-opacity ml-1 capitalize text-[11px] font-normal"
              >
                Details
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
