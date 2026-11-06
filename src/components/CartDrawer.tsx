'use client';

import React from 'react';
import Image from 'next/image';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    totalCount,
    subtotal,
    freeShippingThreshold,
    freeShippingProgress,
    hasFreeShipping,
  } = useCart();

  if (!isOpen) return null;

  const leftToSpend = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-2xs transition-opacity duration-300"
        onClick={closeCart}
      />

      {/* Slide-over */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-250">
          <div>
            {/* Top Banner */}
            <div className="bg-black text-white text-[11px] font-medium text-center py-2 px-4 uppercase tracking-wider">
              Free Shipping &amp; Free Lip Balm on Orders $49+
            </div>

            {/* Header */}
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
              <h3 className="font-bold text-base text-black flex items-center">
                Cart
                <span className="text-xs text-neutral-400 font-normal ml-2">
                  {totalCount} items
                </span>
              </h3>

              <button
                type="button"
                onClick={closeCart}
                className="p-1 rounded-full text-black hover:opacity-60 transition-opacity"
                aria-label="Close Cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress */}
            <div className="px-5 py-3 border-b border-neutral-100 bg-neutral-50/50">
              <div className="text-xs text-neutral-700 mb-1.5 font-medium">
                {hasFreeShipping ? (
                  <span className="text-emerald-700 font-semibold">
                    FREE shipping will be applied at checkout
                  </span>
                ) : (
                  <span>
                    <strong className="text-black font-bold">${leftToSpend}</strong> from Free Shipping
                  </span>
                )}
              </div>
              <div className="w-full bg-neutral-200 h-1 rounded-full overflow-hidden">
                <div
                  className="bg-black h-full rounded-full transition-all duration-300"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>

            {/* Items List */}
            <div className="p-5 max-h-[calc(100vh-280px)] overflow-y-auto divide-y divide-neutral-100">
              {items.length === 0 ? (
                <div className="py-16 text-center text-xs text-neutral-500">
                  Your cart is currently empty.
                </div>
              ) : (
                items.map(item => (
                  <div key={item.id} className="py-4 flex space-x-3.5">
                    <div className="relative w-16 h-20 bg-neutral-100 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-xs text-black leading-snug">
                            {item.title}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-neutral-400 hover:text-black p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {item.scent && (
                          <div className="text-[11px] text-neutral-500 mt-0.5">
                            {item.scent} {item.scentNotes && `• ${item.scentNotes}`}
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between items-center mt-3">
                        <div className="flex items-center border border-neutral-200 rounded-full px-2 py-0.5">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-0.5 text-neutral-500 hover:text-black"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-semibold">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-0.5 text-neutral-500 hover:text-black"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-bold text-black font-mono">
                            ${item.price * item.quantity}
                          </span>
                          {item.compareAtPrice && (
                            <span className="line-through text-neutral-400 text-[10px] ml-1">
                              ${item.compareAtPrice * item.quantity}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer Checkout */}
          {items.length > 0 && (
            <div className="p-5 border-t border-neutral-100 bg-white space-y-3">
              <div className="flex justify-between items-center text-xs text-neutral-500">
                <span>Subtotal</span>
                <span className="font-bold text-black font-mono text-sm">
                  ${subtotal}
                </span>
              </div>

              <button
                type="button"
                onClick={() => alert(`Checking out for $${subtotal}`)}
                className="w-full bg-black text-white hover:bg-neutral-800 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Checkout • ${subtotal}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
