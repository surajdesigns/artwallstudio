import ProductsPageClient from '@/components/product/ProductsPageClient';
import { getCategories } from '@/lib/api-server';
import { Suspense } from 'react';

export const metadata = {
  title: 'Tous les Produits',
  description: 'Explorez notre collection complète de tableaux et papiers peints.',
};

export default async function ProductsPage() {
  const categories = await getCategories();
  return (
    <>
      <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--cream)' }} />}>
        <ProductsPageClient categories={categories} />
      </Suspense>
    </>
  );
}
