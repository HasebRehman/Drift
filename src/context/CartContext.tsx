'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { ToneProduct } from '@/data/driftData';
import { SHOP_ALL } from '@/data/driftProducts';
import { parsePrice } from '@/lib/prices';

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  scent?: string;
  scentNotes?: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  volume?: string;
  quantity: number;
}

interface CartContextType {
  isReady: boolean;
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: ToneProduct, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalCount: number;
  subtotal: number;
  freeShippingThreshold: number;
  freeShippingProgress: number;
  hasFreeShipping: boolean;
}

const FREE_SHIPPING_THRESHOLD = 4900;

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem('tone_cart_items');
      if (saved) {
        const stored: CartItem[] = JSON.parse(saved);
        setItems(stored.map(item => {
          const product = SHOP_ALL.find(product => product.id === item.productId || product.id === item.id || product.title === item.title);
          return product ? { ...item, price: parsePrice(product.price), compareAtPrice: parsePrice(product.compare) || undefined } : item;
        }));
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem('tone_cart_items', JSON.stringify(items));
      } catch {
        // ignore
      }
    }
  }, [items, mounted]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen(prev => !prev), []);

  const addItem = useCallback((product: ToneProduct, quantity = 1) => {
    const cartItemId = `${product.id}`;

    setItems(prev => {
      const existing = prev.find(item => item.id === cartItemId);
      if (existing) {
        return prev.map(item =>
          item.id === cartItemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: cartItemId,
          productId: product.id,
          title: product.title,
          scent: product.scent,
          scentNotes: product.scentNotes,
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          image: product.image,
          volume: product.volume,
          quantity,
        },
      ];
    });

    setIsOpen(true);
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setItems(prev => prev.filter(i => i.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems(prev => prev.map(i => (i.id === itemId ? { ...i, quantity } : i)));
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const hasFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;

  const value = useMemo(() => ({
        isReady: mounted,
        items,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalCount,
        subtotal,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        freeShippingProgress,
        hasFreeShipping,
      }), [mounted, items, isOpen, openCart, closeCart, toggleCart, addItem, removeItem, updateQuantity, clearCart, totalCount, subtotal, freeShippingProgress, hasFreeShipping]);
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
