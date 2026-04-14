// ─────────────────────────────────────────
// Database Types
// ─────────────────────────────────────────

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'customer' | 'admin';
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  parent_id: string | null;
  sort_order: number;
  created_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt: string | null;
  sort_order: number;
  is_primary: boolean;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  value: string;
  price_modifier: number;
  stock_quantity: number;
  sku: string | null;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  price: number;
  compare_at_price: number | null;
  category_id: string | null;
  stock_quantity: number;
  sku: string | null;
  weight: number | null;
  dimensions: {
    width: number;
    height: number;
    depth?: number;
    unit: 'cm' | 'mm' | 'inch';
  } | null;
  tags: string[] | null;
  is_active: boolean;
  is_featured: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  // Joined
  category?: Category;
  images?: ProductImage[];
  variants?: ProductVariant[];
  reviews?: Review[];
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title: string | null;
  body: string | null;
  is_approved: boolean;
  created_at: string;
  profile?: Profile;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product?: Product;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  variant_id: string | null;
  product_name: string;
  product_image: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Order {
  id: string;
  user_id: string | null;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  total_amount: number;
  subtotal: number;
  shipping_amount: number;
  tax_amount: number;
  discount_amount: number;
  currency: string;
  shipping_address: Address | null;
  billing_address: Address | null;
  notes: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface Address {
  first_name: string;
  last_name: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state?: string;
  zip: string;
  country: string;
  phone?: string;
}

// ─────────────────────────────────────────
// Cart Types
// ─────────────────────────────────────────

export interface CartItem {
  id: string; // product_id or variant_id
  productId: string;
  variantId?: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variant?: {
    name: string;
    value: string;
  };
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

// ─────────────────────────────────────────
// Filter & Sort Types
// ─────────────────────────────────────────

export type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'popular' | 'rating';

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  sort?: SortOption;
  search?: string;
  inStock?: boolean;
}
