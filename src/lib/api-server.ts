import { createSupabaseServerClient } from './supabase-server';
import type { Product, ProductFilters } from '@/types';

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      images:product_images(*),
      variants:product_variants(*)
    `)
    .eq('is_active', true);

  if (filters.category) {
    query = query.eq('categories.slug', filters.category);
  }

  if (filters.minPrice !== undefined) {
    query = query.gte('price', filters.minPrice);
  }

  if (filters.maxPrice !== undefined) {
    query = query.lte('price', filters.maxPrice);
  }

  if (filters.inStock) {
    query = query.gt('stock_quantity', 0);
  }

  if (filters.search) {
    query = query.ilike('name', `%${filters.search}%`);
  }

  if (filters.tags && filters.tags.length > 0) {
    query = query.overlaps('tags', filters.tags);
  }

  switch (filters.sort) {
    case 'price-asc':
      query = query.order('price', { ascending: true });
      break;
    case 'price-desc':
      query = query.order('price', { ascending: false });
      break;
    case 'newest':
    default:
      query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data as Product[]) || [];
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('products')
    .select(`*, images:product_images(*), category:categories(*)`)
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(8);

  if (error) throw error;
  return (data as Product[]) || [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      images:product_images(*),
      variants:product_variants(*),
      reviews:reviews(*, profile:profiles(full_name, avatar_url))
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) return null;
  return data as Product;
}

export async function getRelatedProducts(
  productId: string,
  categoryId: string,
  limit = 4
): Promise<Product[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('products')
    .select(`*, images:product_images(*), category:categories(*)`)
    .eq('is_active', true)
    .eq('category_id', categoryId)
    .neq('id', productId)
    .limit(limit);

  if (error) throw error;
  return (data as Product[]) || [];
}

export async function getCategories() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order');

  if (error) throw error;
  return data || [];
}

export async function searchProducts(query: string): Promise<Product[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('products')
    .select(`*, images:product_images(*), category:categories(*)`)
    .eq('is_active', true)
    .or(`name.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`)
    .limit(20);

  if (error) throw error;
  return (data as Product[]) || [];
}

export async function toggleWishlist(userId: string, productId: string) {
  const supabase = await createSupabaseServerClient();
  const { data: existing } = await supabase
    .from('wishlists')
    .select('id')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .single();

  if (existing) {
    await supabase.from('wishlists').delete().eq('id', existing.id);
    return false;
  } else {
    await supabase.from('wishlists').insert({ user_id: userId, product_id: productId });
    return true;
  }
}

export async function getWishlist(userId: string): Promise<Product[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('wishlists')
    .select(`product:products(*, images:product_images(*))`)
    .eq('user_id', userId);

  if (error) throw error;
  return (data as any)?.map((w: any) => w.product as Product) || [];
}

export async function createOrder(orderData: {
  userId: string;
  items: Array<{ productId: string; variantId?: string; quantity: number; unitPrice: number; productName: string; productImage: string }>;
  subtotal: number;
  shippingAmount: number;
  taxAmount: number;
  shippingAddress: object;
}) {
  const supabase = await createSupabaseServerClient();
  const total = orderData.subtotal + orderData.shippingAmount + orderData.taxAmount;

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: orderData.userId,
      subtotal: orderData.subtotal,
      shipping_amount: orderData.shippingAmount,
      tax_amount: orderData.taxAmount,
      total_amount: total,
      shipping_address: orderData.shippingAddress,
    })
    .select()
    .single();

  if (orderError) throw orderError;

  const orderItems = orderData.items.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    variant_id: item.variantId || null,
    product_name: item.productName,
    product_image: item.productImage,
    quantity: item.quantity,
    unit_price: item.unitPrice,
    total_price: item.unitPrice * item.quantity,
  }));

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
  if (itemsError) throw itemsError;

  return order;
}
