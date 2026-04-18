'use client';

import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { useState } from 'react';
import { useCartStore, useWishlistStore } from '@/lib/store';
import type { Product } from '@/types';
import toast from 'react-hot-toast';

const Card = styled(motion.article)<{ $dark?: boolean }>`
  position: relative;
`;

const ImageWrapper = styled.div`
  position: relative;
  aspect-ratio: 3/4;
  overflow: hidden;
  border-radius: var(--radius-sm);
  background: var(--off-white);
  margin-bottom: 16px;

  img { transition: transform 0.6s var(--ease-out); }
  &:hover img { transform: scale(1.06); }
`;

const Badge = styled.div<{ $type?: 'sale' | 'new' | 'featured' }>`
  position: absolute; top: 12px; left: 12px; z-index: 2;
  padding: 4px 10px; border-radius: 2px;
  font-size: 10px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase;
  background: ${({ $type }) =>
    $type === 'sale' ? 'var(--error)' : $type === 'featured' ? 'var(--gold)' : 'var(--black)'};
  color: var(--white);
`;

const Overlay = styled.div`
  position: absolute; inset: 0; z-index: 1;
  display: flex; align-items: center; justify-content: center; gap: 10px;
  opacity: 0; transition: opacity 0.3s, background 0.3s;
  background: rgba(10,10,8,0);
  ${ImageWrapper}:hover & { opacity: 1; background: rgba(10,10,8,0.3); }
`;

const OverlayBtn = styled.button`
  width: 40px; height: 40px; border-radius: 50%;
  background: rgba(250,248,243,0.95);
  display: flex; align-items: center; justify-content: center;
  color: var(--black); transform: translateY(10px);
  transition: transform 0.3s var(--ease-out), background 0.2s;
  ${ImageWrapper}:hover & { transform: translateY(0); }
  &:nth-child(2) { transition-delay: 0.05s; }
  &:nth-child(3) { transition-delay: 0.1s; }
  &:hover { background: var(--black); color: var(--off-white); }
`;

const WishBtn = styled(OverlayBtn)<{ $active: boolean }>`
  svg {
    fill: ${({ $active }) => ($active ? 'var(--error)' : 'none')};
    stroke: ${({ $active }) => ($active ? 'var(--error)' : 'currentColor')};
  }
`;

const Category = styled.p`
  font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--mid-gray); margin-bottom: 6px;
`;

const ProductName = styled(Link)<{ $dark?: boolean }>`
  font-family: var(--font-display); font-size: 18px; font-weight: 400;
  color: ${({ $dark }) => ($dark ? 'var(--off-white)' : 'var(--black)')};
  line-height: 1.25; display: block; margin-bottom: 10px;
  transition: color 0.2s;
  &:hover { color: var(--gold); }
`;

const PriceRow = styled.div`
  display: flex; align-items: baseline; gap: 10px;
`;

const Price = styled.span<{ $dark?: boolean }>`
  font-size: 16px; font-weight: 500;
  color: ${({ $dark }) => ($dark ? 'var(--off-white)' : 'var(--black)')};
`;

const OldPrice = styled.span`
  font-size: 13px; color: var(--mid-gray); text-decoration: line-through;
`;

interface ProductCardProps {
  product: Product;
  dark?: boolean;
}

export default function ProductCard({ product, dark }: ProductCardProps) {
  const [adding, setAdding] = useState(false);
  const { addItem } = useCartStore();
  const { toggle, isWishlisted } = useWishlistStore();
  const wishlisted = isWishlisted(product.id);

  const primaryImage =
    product.images?.find((img) => img.is_primary)?.url ||
    product.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    setAdding(true);
    addItem({ id: product.id, productId: product.id, name: product.name, image: primaryImage, price: product.price, quantity: 1 });
    toast.success('Ajouté au panier');
    setTimeout(() => setAdding(false), 500);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggle(product.id);
    toast.success(wishlisted ? 'Retiré des favoris' : 'Ajouté aux favoris');
  };

  const discount = product.compare_at_price
    ? Math.round((1 - product.price / product.compare_at_price) * 100)
    : null;

  return (
    <Card
      $dark={dark}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <ImageWrapper>
        <Link href={`/products/${product.slug}`} tabIndex={-1} style={{ position: 'absolute', inset: 0 }}>
          <Image src={primaryImage} alt={product.name} fill style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw" />
        </Link>
        {discount && <Badge $type="sale">-{discount}%</Badge>}
        {product.is_featured && !discount && <Badge $type="featured">Nouveau</Badge>}
        <Overlay>
          <WishBtn $active={wishlisted} onClick={handleWishlist} title="Favoris">
            <Heart size={16} />
          </WishBtn>
          <OverlayBtn onClick={handleAddToCart} disabled={adding} title="Panier">
            <ShoppingBag size={16} />
          </OverlayBtn>
          <OverlayBtn as={Link} href={`/products/${product.slug}`} title="Voir">
            <Eye size={16} />
          </OverlayBtn>
        </Overlay>
      </ImageWrapper>
      {product.category && <Category>{product.category.name}</Category>}
      <ProductName href={`/products/${product.slug}`} $dark={dark}>{product.name}</ProductName>
      <PriceRow>
        <Price $dark={dark}>{product.price.toFixed(2)} MAD</Price>
        {product.compare_at_price && <OldPrice>{product.compare_at_price.toFixed(2)} MAD</OldPrice>}
      </PriceRow>
    </Card>
  );
}
