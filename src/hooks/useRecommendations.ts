'use client';

import { useState, useEffect } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import type { Product } from '@/types';

interface BrowseEvent {
  productId: string;
  categoryId: string | null;
  tags: string[] | null;
  timestamp: number;
}

// Track browsing history in localStorage
const HISTORY_KEY = 'artwall-browse-history';
const MAX_HISTORY = 20;

export function trackProductView(product: Product) {
  if (typeof window === 'undefined') return;
  const history: BrowseEvent[] = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  const event: BrowseEvent = {
    productId: product.id,
    categoryId: product.category_id,
    tags: product.tags,
    timestamp: Date.now(),
  };
  const updated = [event, ...history.filter((e) => e.productId !== product.id)].slice(0, MAX_HISTORY);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

export function getBrowseHistory(): BrowseEvent[] {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
}

// Score-based recommendation engine
function scoreProduct(product: Product, history: BrowseEvent[]): number {
  let score = 0;
  const recentHistory = history.slice(0, 10);

  for (const event of recentHistory) {
    const recency = 1 - (Date.now() - event.timestamp) / (7 * 24 * 60 * 60 * 1000);
    const recencyFactor = Math.max(0, recency);

    // Same category boost
    if (product.category_id && event.categoryId === product.category_id) {
      score += 3 * recencyFactor;
    }

    // Tag overlap boost
    if (product.tags && event.tags) {
      const overlap = product.tags.filter((t) => event.tags!.includes(t)).length;
      score += overlap * 1.5 * recencyFactor;
    }
  }

  // Featured products get a small boost
  if (product.is_featured) score += 0.5;

  return score;
}

export function useRecommendations(currentProductId?: string, limit = 6) {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecommendations = async () => {
      const supabase = getSupabaseBrowserClient();
      setLoading(true);
      const history = getBrowseHistory();
      try {
        // Get candidate products
        const { data: products } = await supabase
          .from('products')
          .select(`*, images:product_images(*), category:categories(*)`)
          .eq('is_active', true)
          .neq('id', currentProductId || '')
          .limit(50);

        if (products && products.length > 0) {
          const scored = (products as Product[])
            .map((p) => ({ product: p, score: scoreProduct(p, history) }))
            .sort((a, b) => b.score - a.score)
            .slice(0, limit)
            .map((s) => s.product);

          setRecommendations(scored);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [currentProductId, limit]);

  return { recommendations, loading };
}

// Recently viewed hook
export function useRecentlyViewed(limit = 4) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const history = getBrowseHistory();
    const ids = history.slice(0, limit).map((e) => e.productId);

    if (ids.length === 0) return;

    const supabase = getSupabaseBrowserClient();

    supabase
      .from('products')
      .select(`*, images:product_images(*), category:categories(*)`)
      .in('id', ids)
      .then(({ data }: { data: any }) => {
        if (data) {
          // Preserve history order
          const ordered = ids
            .map((id) => data.find((p: Product) => p.id === id))
            .filter(Boolean) as Product[];
          setProducts(ordered);
        }
      });
  }, [limit]);

  return products;
}
