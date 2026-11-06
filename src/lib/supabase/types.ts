export interface Scent {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  color_accent: string;
  color_bg: string;
  top_notes: string[];
  heart_notes: string[];
  base_notes: string[];
  intensity: number;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  price: number;
  compare_at_price?: number;
  category_slug: string;
  scent_slug?: string;
  scent_name?: string;
  rating: number;
  review_count: number;
  in_stock: boolean;
  is_featured?: boolean;
  is_bestseller?: boolean;
  badge?: string;
  images: string[];
  volume: string;
}

export interface Bundle {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  price: number;
  compare_at_price: number;
  savings_badge: string;
  included_items: string[];
  images: string[];
  rating: number;
  review_count: number;
}

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  scentName?: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  quantity: number;
  volume?: string;
}

export interface Database {
  public: {
    Tables: {
      scents: {
        Row: Scent;
        Insert: Omit<Scent, 'id'>;
        Update: Partial<Omit<Scent, 'id'>>;
      };
      products: {
        Row: Product;
        Insert: Omit<Product, 'id'>;
        Update: Partial<Omit<Product, 'id'>>;
      };
      bundles: {
        Row: Bundle;
        Insert: Omit<Bundle, 'id'>;
        Update: Partial<Omit<Bundle, 'id'>>;
      };
    };
  };
}
