'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ToneProduct } from '@/data/driftData';

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

const FREE_SHIPPING_THRESHOLD = 49;

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
        setItems(JSON.parse(saved));
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

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen(prev => !prev);

  const addItem = (product: ToneProduct, quantity = 1) => {
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
  };

  const removeItem = (itemId: string) => {
    setItems(prev => prev.filter(i => i.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems(prev => prev.map(i => (i.id === itemId ? { ...i, quantity } : i)));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const hasFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;

  return (
    <CartContext.Provider
      value={{
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
      }}
    >
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
