'use client';

import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail('');
  };

  return (
    <section id="newsletter" className="py-16 sm:py-20 bg-[#FAFAFA] border-t border-neutral-200/60 text-center">
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-neutral-900 mb-2">
          SIGN UP &amp; TAP IN
        </h2>
        <p className="text-xs sm:text-sm text-neutral-500 mb-6">
          Get exclusive content, access and deals.
        </p>

        {submitted ? (
          <div className="inline-flex items-center space-x-2 bg-black text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider">
            <Check className="w-4 h-4" />
            <span>Thank you for subscribing!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full sm:flex-1 px-5 py-3 rounded-full bg-white border border-neutral-300 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-hidden focus:ring-1 focus:ring-black"
            />
            <button
              type="submit"
              className="w-full sm:w-auto bg-black text-white hover:bg-neutral-800 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-colors shrink-0 cursor-pointer"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
