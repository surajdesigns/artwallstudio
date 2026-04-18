import { getProductBySlug, getRelatedProducts } from '@/lib/api-server';
import ProductDetailClient from '@/components/product/ProductDetailClient';
import { notFound } from 'next/navigation';


interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: 'Produit introuvable' };
  return {
    title: product.name,
    description: product.short_description || product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = product.category_id
    ? await getRelatedProducts(product.id, product.category_id)
    : [];

  return (
    <>
      <ProductDetailClient product={product} related={related} />

    </>
  );
}
