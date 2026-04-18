'use client';

import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Heart, ZoomIn, Star, Truck, Shield, RotateCcw, Share2 } from 'lucide-react';
import { useCartStore, useWishlistStore } from '@/lib/store';
import type { Product, ProductVariant } from '@/types';
import ProductCard from './ProductCard';
import toast from 'react-hot-toast';

// ─── Styled ──────────────────────────────────────────────────────────────────

const Page = styled.div`
  padding-top: var(--nav-height);
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 60px 40px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: start;

  @media (max-width: 1024px) { grid-template-columns: 1fr; gap: 40px; }
  @media (max-width: 768px) { padding: 32px 20px; }
`;

// Image Gallery
const Gallery = styled.div`
  position: sticky;
  top: calc(var(--nav-height) + 24px);

  @media (max-width: 1024px) { position: static; }
`;

const MainImageWrapper = styled.div`
  position: relative;
  aspect-ratio: 4/5;
  overflow: hidden;
  border-radius: var(--radius-sm);
  background: var(--off-white);
  cursor: zoom-in;
  margin-bottom: 16px;
`;

const ZoomOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(10,10,8,0.95);
  z-index: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: zoom-out;
`;

const ZoomedImage = styled.div`
  position: relative;
  width: 80vmin;
  height: 80vmin;
  max-width: 800px;
  max-height: 800px;
`;

const ZoomHint = styled.div`
  position: absolute;
  bottom: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(10,10,8,0.6);
  color: var(--off-white);
  padding: 6px 12px;
  border-radius: var(--radius-full);
  font-size: 11px;
  letter-spacing: 0.08em;
  pointer-events: none;
`;

const Thumbnails = styled.div`
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 4px;

  &::-webkit-scrollbar { height: 3px; }
`;

const Thumb = styled.div<{ $active: boolean }>`
  position: relative;
  width: 72px;
  height: 72px;
  flex-shrink: 0;
  border-radius: var(--radius-sm);
  overflow: hidden;
  cursor: pointer;
  border: 2px solid ${({ $active }) => ($active ? 'var(--gold)' : 'transparent')};
  transition: border-color 0.2s;
  background: var(--off-white);
`;

// Product Info
const Info = styled.div``;

const Breadcrumb = styled.p`
  font-size: 12px;
  letter-spacing: 0.08em;
  color: var(--mid-gray);
  margin-bottom: 20px;
  a { transition: color 0.2s; &:hover { color: var(--gold-dark); } }
  span { margin: 0 8px; }
`;

const ProductTitle = styled.h1`
  font-family: var(--font-display);
  font-size: clamp(28px, 4vw, 44px);
  font-weight: 400;
  color: var(--black);
  line-height: 1.1;
  margin-bottom: 16px;
`;

const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const Stars = styled.div`
  display: flex;
  gap: 3px;
  color: var(--gold);
`;

const RatingText = styled.p`
  font-size: 13px;
  color: var(--mid-gray);
`;

const PriceBlock = styled.div`
  display: flex;
  align-items: baseline;
  gap: 14px;
  margin-bottom: 28px;
  padding-bottom: 28px;
  border-bottom: 1px solid rgba(0,0,0,0.08);
`;

const MainPrice = styled.span`
  font-family: var(--font-display);
  font-size: 32px;
  font-weight: 400;
  color: var(--black);
`;

const OldPrice = styled.span`
  font-size: 18px;
  color: var(--light-gray);
  text-decoration: line-through;
`;

const DiscountBadge = styled.span`
  padding: 4px 10px;
  background: var(--error);
  color: var(--white);
  border-radius: 2px;
  font-size: 12px;
  font-weight: 500;
`;

const ShortDesc = styled.p`
  font-size: 15px;
  line-height: 1.8;
  color: var(--charcoal);
  margin-bottom: 32px;
`;

const VariantSection = styled.div`
  margin-bottom: 28px;
`;

const VariantLabel = styled.p`
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.06em;
  color: var(--black);
  margin-bottom: 12px;

  span {
    font-weight: 400;
    color: var(--mid-gray);
    margin-left: 8px;
  }
`;

const VariantGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const VariantBtn = styled.button<{ $active: boolean; $disabled?: boolean }>`
  padding: 8px 18px;
  border-radius: 2px;
  font-size: 13px;
  border: 1px solid ${({ $active }) => ($active ? 'var(--black)' : 'rgba(0,0,0,0.15)')};
  background: ${({ $active }) => ($active ? 'var(--black)' : 'transparent')};
  color: ${({ $active }) => ($active ? 'var(--off-white)' : 'var(--charcoal)')};
  opacity: ${({ $disabled }) => ($disabled ? 0.4 : 1)};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.2s;
  text-decoration: ${({ $disabled }) => ($disabled ? 'line-through' : 'none')};

  &:hover:not(:disabled) {
    border-color: var(--black);
    background: ${({ $active }) => ($active ? 'var(--black)' : 'rgba(0,0,0,0.04)')};
  }
`;

const ColorSwatch = styled.button<{ $color: string; $active: boolean }>`
  width: 36px; height: 36px; border-radius: 50%;
  background: ${({ $color }) => $color};
  border: 3px solid ${({ $active }) => ($active ? 'var(--black)' : 'transparent')};
  outline: 1px solid rgba(0,0,0,0.15);
  outline-offset: 2px;
  transition: all 0.2s;
  cursor: pointer;
`;

const QtyRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
`;

const QtyControl = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid rgba(0,0,0,0.15);
  border-radius: 2px;
`;

const QtyBtn = styled.button`
  width: 44px; height: 48px;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; color: var(--charcoal);
  transition: background 0.2s;

  &:hover { background: rgba(0,0,0,0.04); }
`;

const QtyNum = styled.span`
  width: 48px; text-align: center;
  font-size: 16px; color: var(--black);
`;

const StockInfo = styled.p<{ $low?: boolean }>`
  font-size: 13px;
  color: ${({ $low }) => ($low ? 'var(--error)' : 'var(--success)')};
`;

const AddToCartBtn = styled.button<{ $loading?: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 18px 36px;
  background: var(--black);
  color: var(--off-white);
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  border-radius: 2px;
  transition: background 0.25s, transform 0.15s;

  &:hover { background: var(--gold-dark); }
  &:active { transform: scale(0.99); }
`;

const WishlistBtn = styled.button<{ $active: boolean }>`
  width: 56px; height: 56px;
  display: flex; align-items: center; justify-content: center;
  border: 1px solid rgba(0,0,0,0.15);
  border-radius: 2px;
  color: ${({ $active }) => ($active ? 'var(--error)' : 'var(--mid-gray)')};
  transition: all 0.2s;

  svg {
    fill: ${({ $active }) => ($active ? 'var(--error)' : 'none')};
    transition: fill 0.2s;
  }

  &:hover {
    border-color: var(--error);
    color: var(--error);
  }
`;

const ActionRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
`;

const Guarantees = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding: 24px;
  background: var(--off-white);
  border-radius: var(--radius-sm);
  margin-bottom: 32px;
`;

const GuaranteeItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;

  svg { color: var(--gold); }

  strong {
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--black);
  }

  span {
    font-size: 11px;
    color: var(--mid-gray);
    line-height: 1.4;
  }
`;

// Tabs
const TabNav = styled.div`
  display: flex;
  border-bottom: 1px solid rgba(0,0,0,0.1);
  margin-bottom: 28px;
  overflow-x: auto;
`;

const TabBtn = styled.button<{ $active: boolean }>`
  padding: 14px 24px;
  font-size: 13px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ $active }) => ($active ? 'var(--black)' : 'var(--mid-gray)')};
  border-bottom: 2px solid ${({ $active }) => ($active ? 'var(--gold)' : 'transparent')};
  white-space: nowrap;
  transition: color 0.2s;

  &:hover { color: var(--black); }
`;

const TabContent = styled.div`
  font-size: 15px;
  line-height: 1.8;
  color: var(--charcoal);

  h4 {
    font-family: var(--font-display);
    font-size: 20px;
    font-weight: 400;
    margin-bottom: 12px;
    margin-top: 24px;
    &:first-child { margin-top: 0; }
  }

  ul { padding-left: 20px; li { margin-bottom: 6px; } }
`;

const DimGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
`;

const DimItem = styled.div`
  padding: 14px 16px;
  background: var(--off-white);
  border-radius: var(--radius-sm);

  span:first-child {
    display: block;
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--mid-gray);
    margin-bottom: 4px;
  }
  span:last-child {
    font-size: 15px;
    font-weight: 500;
    color: var(--black);
  }
`;

const ReviewCard = styled.div`
  padding: 20px;
  background: var(--off-white);
  border-radius: var(--radius-sm);
  margin-bottom: 16px;
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
`;

const ReviewAuthor = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: var(--black);
`;

const ReviewDate = styled.p`
  font-size: 12px;
  color: var(--mid-gray);
`;

const ReviewText = styled.p`
  font-size: 14px;
  line-height: 1.7;
  color: var(--charcoal);
`;

// Related
const RelatedSection = styled.section`
  background: var(--cream);
  padding: 80px 40px;

  @media (max-width: 768px) { padding: 60px 20px; }
`;

const RelatedInner = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-family: var(--font-display);
  font-size: 36px;
  font-weight: 400;
  margin-bottom: 40px;
  em { font-style: italic; color: var(--gold-dark); }
`;

const RelatedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px 20px;

  @media (max-width: 1200px) { grid-template-columns: repeat(3, 1fr); }
  @media (max-width: 800px) { grid-template-columns: repeat(2, 1fr); }
`;

// ─── Demo data ────────────────────────────────────────────────────────────────

function getDemoProduct(): Product {
  return {
    id: 'demo-1',
    name: 'Harmonie Abstraite No.3',
    slug: 'harmonie-abstraite-3',
    description: 'Une œuvre d\'art abstraite captivante qui marie les tons chauds et les textures riches pour créer une pièce maîtresse unique. Peinte à la main par notre artiste en résidence, cette toile apportera une touche d\'élégance contemporaine à n\'importe quelle pièce.',
    short_description: 'Toile abstraite originale, peinte à la main. Idéale pour les salons et espaces de travail modernes.',
    price: 1890,
    compare_at_price: 2200,
    category_id: 'cat-1',
    stock_quantity: 5,
    sku: 'AW-TAB-001',
    weight: 2.5,
    dimensions: { width: 80, height: 100, depth: 3, unit: 'cm' },
    tags: ['abstrait', 'moderne', 'toile', 'unique'],
    is_active: true,
    is_featured: true,
    metadata: { artist: 'Marie Leblanc', technique: 'Acrylique sur toile', year: 2024 },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: 'cat-1', name: 'Tableaux', slug: 'tableaux', description: null, image_url: null, parent_id: null, sort_order: 1, created_at: '' },
    images: [
      { id: 'img-1', product_id: 'demo-1', url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=900&q=80', alt: 'Vue principale', sort_order: 0, is_primary: true },
      { id: 'img-2', product_id: 'demo-1', url: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=900&q=80', alt: 'Vue détail', sort_order: 1, is_primary: false },
      { id: 'img-3', product_id: 'demo-1', url: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=900&q=80', alt: 'Vue ambiance', sort_order: 2, is_primary: false },
      { id: 'img-4', product_id: 'demo-1', url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=900&q=80', alt: 'Vue côté', sort_order: 3, is_primary: false },
    ],
    variants: [
      { id: 'v1', product_id: 'demo-1', name: 'Taille', value: '60×80 cm', price_modifier: -400, stock_quantity: 8, sku: 'AW-TAB-001-S' },
      { id: 'v2', product_id: 'demo-1', name: 'Taille', value: '80×100 cm', price_modifier: 0, stock_quantity: 5, sku: 'AW-TAB-001-M' },
      { id: 'v3', product_id: 'demo-1', name: 'Taille', value: '100×140 cm', price_modifier: 600, stock_quantity: 2, sku: 'AW-TAB-001-L' },
      { id: 'v4', product_id: 'demo-1', name: 'Taille', value: 'Sur mesure', price_modifier: 1200, stock_quantity: 99, sku: 'AW-TAB-001-XL' },
    ],
    reviews: [
      { id: 'r1', product_id: 'demo-1', user_id: 'u1', rating: 5, title: 'Magnifique !', body: 'Cette toile a complètement transformé notre salon. Les couleurs sont encore plus belles en vrai.', is_approved: true, created_at: '2024-10-15T10:00:00Z', profile: { id: 'u1', email: '', full_name: 'Amina B.', avatar_url: null, role: 'customer', created_at: '' } },
      { id: 'r2', product_id: 'demo-1', user_id: 'u2', rating: 5, title: 'Parfait pour mon bureau', body: 'Qualité exceptionnelle, emballage très soigné. Je recommande vivement.', is_approved: true, created_at: '2024-11-02T14:30:00Z', profile: { id: 'u2', email: '', full_name: 'Youssef M.', avatar_url: null, role: 'customer', created_at: '' } },
    ],
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  product: Product;
  related: Product[];
}

export default function ProductDetailClient({ product: rawProduct, related }: Props) {
  const product = rawProduct.id === 'server' ? getDemoProduct() : rawProduct;
  const images = product.images && product.images.length > 0 ? product.images : getDemoProduct().images!;
  const variants = product.variants || getDemoProduct().variants || [];

  const [activeImage, setActiveImage] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    variants.length > 0 ? variants[0] : null
  );

  const { addItem } = useCartStore();
  const { toggle, isWishlisted } = useWishlistStore();
  const wishlisted = isWishlisted(product.id);

  const finalPrice = product.price + (selectedVariant?.price_modifier || 0);
  const discount = product.compare_at_price
    ? Math.round((1 - finalPrice / product.compare_at_price) * 100)
    : null;

  const handleAddToCart = () => {
    addItem({
      id: selectedVariant ? `${product.id}-${selectedVariant.id}` : product.id,
      productId: product.id,
      variantId: selectedVariant?.id,
      name: product.name,
      image: images[0]?.url || '',
      price: finalPrice,
      quantity,
      variant: selectedVariant ? { name: selectedVariant.name, value: selectedVariant.value } : undefined,
    });
    toast.success('Ajouté au panier');
  };

  const avgRating = product.reviews && product.reviews.length > 0
    ? Math.round(product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length)
    : 5;

  const demoRelated = related.length > 0 ? related : getDemoProduct().images!.map((img, i) => ({
    ...getDemoProduct(),
    id: `rel-${i}`,
    slug: `related-${i}`,
    name: ['Portrait Minimaliste', 'Géométrie Dorée', 'Mer du Nord', 'Aquarelle Indigo'][i] || 'Tableau',
    price: [1450, 980, 1650, 1320][i] || 1200,
    images: [{ ...img, id: `rimg-${i}` }],
  }));

  return (
    <Page>
      <Container>
        {/* Gallery */}
        <Gallery>
          <MainImageWrapper onClick={() => setZoomed(true)}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ position: 'absolute', inset: 0 }}
              >
                <Image
                  src={images[activeImage]?.url || ''}
                  alt={images[activeImage]?.alt || product.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                />
              </motion.div>
            </AnimatePresence>
            <ZoomHint>
              <ZoomIn size={12} />
              Zoom
            </ZoomHint>
          </MainImageWrapper>

          <Thumbnails>
            {images.map((img, i) => (
              <Thumb
                key={img.id}
                $active={i === activeImage}
                onClick={() => setActiveImage(i)}
              >
                <Image src={img.url} alt={img.alt || ''} fill style={{ objectFit: 'cover' }} />
              </Thumb>
            ))}
          </Thumbnails>
        </Gallery>

        {/* Info */}
        <Info>
          <Breadcrumb>
            <Link href="/">Accueil</Link>
            <span>/</span>
            <Link href="/products">Produits</Link>
            {product.category && (
              <>
                <span>/</span>
                <Link href={`/products?category=${product.category.slug}`}>
                  {product.category.name}
                </Link>
              </>
            )}
          </Breadcrumb>

          <ProductTitle>{product.name}</ProductTitle>

          <RatingRow>
            <Stars>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} fill={i < avgRating ? 'currentColor' : 'none'} />
              ))}
            </Stars>
            <RatingText>
              {product.reviews?.length || 2} avis · {product.sku || 'AW-001'}
            </RatingText>
          </RatingRow>

          <PriceBlock>
            <MainPrice>{finalPrice.toFixed(2)} MAD</MainPrice>
            {product.compare_at_price && (
              <OldPrice>{product.compare_at_price.toFixed(2)} MAD</OldPrice>
            )}
            {discount && <DiscountBadge>-{discount}%</DiscountBadge>}
          </PriceBlock>

          {product.short_description && (
            <ShortDesc>{product.short_description}</ShortDesc>
          )}

          {/* Size variants */}
          {variants.length > 0 && (
            <VariantSection>
              <VariantLabel>
                Format
                <span>{selectedVariant?.value}</span>
              </VariantLabel>
              <VariantGrid>
                {variants.map((v) => (
                  <VariantBtn
                    key={v.id}
                    $active={selectedVariant?.id === v.id}
                    $disabled={v.stock_quantity === 0}
                    onClick={() => v.stock_quantity > 0 && setSelectedVariant(v)}
                  >
                    {v.value}
                    {v.price_modifier !== 0 && (
                      <span style={{ fontSize: 11, marginLeft: 6, opacity: 0.7 }}>
                        {v.price_modifier > 0 ? '+' : ''}{v.price_modifier} MAD
                      </span>
                    )}
                  </VariantBtn>
                ))}
              </VariantGrid>
            </VariantSection>
          )}

          {/* Quantity + Stock */}
          <QtyRow>
            <QtyControl>
              <QtyBtn onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</QtyBtn>
              <QtyNum>{quantity}</QtyNum>
              <QtyBtn onClick={() => setQuantity((q) => q + 1)}>+</QtyBtn>
            </QtyControl>
            <StockInfo $low={product.stock_quantity < 5}>
              {product.stock_quantity > 10
                ? '✓ En stock'
                : product.stock_quantity > 0
                ? `⚠ Plus que ${product.stock_quantity} en stock`
                : '✗ Rupture de stock'}
            </StockInfo>
          </QtyRow>

          {/* Actions */}
          <ActionRow>
            <AddToCartBtn onClick={handleAddToCart}>
              <ShoppingBag size={18} />
              Ajouter au Panier
            </AddToCartBtn>
            <WishlistBtn $active={wishlisted} onClick={() => toggle(product.id)}>
              <Heart size={20} />
            </WishlistBtn>
            <WishlistBtn $active={false} onClick={() => toast.success('Lien copié !')}>
              <Share2 size={20} />
            </WishlistBtn>
          </ActionRow>

          {/* Guarantees */}
          <Guarantees>
            <GuaranteeItem>
              <Truck size={20} />
              <strong>Livraison</strong>
              <span>5–7 jours ouvrés</span>
            </GuaranteeItem>
            <GuaranteeItem>
              <Shield size={20} />
              <strong>Garantie</strong>
              <span>Authenticité certifiée</span>
            </GuaranteeItem>
            <GuaranteeItem>
              <RotateCcw size={20} />
              <strong>Retours</strong>
              <span>30 jours offerts</span>
            </GuaranteeItem>
          </Guarantees>

          {/* Tabs */}
          <TabNav>
            {['description', 'dimensions', 'entretien', 'avis'].map((tab) => (
              <TabBtn
                key={tab}
                $active={activeTab === tab}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'avis' ? `Avis (${product.reviews?.length || 2})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </TabBtn>
            ))}
          </TabNav>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <TabContent>
                {activeTab === 'description' && (
                  <>
                    <p>{product.description || getDemoProduct().description}</p>
                    {(product.metadata as Record<string, unknown>)?.artist && (
                      <>
                        <h4>À propos de l&apos;artiste</h4>
                        <p>
                          Œuvre de <strong>{String((product.metadata as Record<string, unknown>).artist)}</strong>, artiste contemporain reconnu pour son travail mêlant techniques traditionnelles et sensibilités modernes.
                        </p>
                      </>
                    )}
                    {product.tags && (
                      <div style={{ marginTop: 20, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {product.tags.map((tag) => (
                          <span key={tag} style={{ padding: '4px 12px', background: 'var(--off-white)', borderRadius: 'var(--radius-full)', fontSize: 12, color: 'var(--mid-gray)' }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {activeTab === 'dimensions' && (
                  <DimGrid>
                    {product.dimensions && (
                      <>
                        <DimItem><span>Largeur</span><span>{product.dimensions.width} {product.dimensions.unit}</span></DimItem>
                        <DimItem><span>Hauteur</span><span>{product.dimensions.height} {product.dimensions.unit}</span></DimItem>
                        {product.dimensions.depth && <DimItem><span>Profondeur</span><span>{product.dimensions.depth} {product.dimensions.unit}</span></DimItem>}
                      </>
                    )}
                    {product.weight && <DimItem><span>Poids</span><span>{product.weight} kg</span></DimItem>}
                    <DimItem><span>Référence</span><span>{product.sku || 'AW-001'}</span></DimItem>
                    <DimItem><span>Format sélectionné</span><span>{selectedVariant?.value || '80×100 cm'}</span></DimItem>
                  </DimGrid>
                )}

                {activeTab === 'entretien' && (
                  <>
                    <h4>Conseils d&apos;entretien</h4>
                    <ul>
                      <li>Éviter l&apos;exposition directe aux rayons UV prolongée</li>
                      <li>Nettoyer délicatement avec un chiffon sec et non abrasif</li>
                      <li>Maintenir une hygrométrie stable (40–60%)</li>
                      <li>Accrocher horizontalement avec des crochets adaptés au poids</li>
                      <li>Éviter les zones humides (salles de bain, cuisines)</li>
                    </ul>
                    <h4>Emballage</h4>
                    <p>Chaque œuvre est soigneusement emballée dans du papier de soie acide-free et protégée par une caisse en bois sur mesure pour un transport en toute sécurité.</p>
                  </>
                )}

                {activeTab === 'avis' && (
                  <>
                    {(product.reviews || getDemoProduct().reviews || []).map((review) => (
                      <ReviewCard key={review.id}>
                        <ReviewHeader>
                          <div>
                            <ReviewAuthor>{review.profile?.full_name || 'Client'}</ReviewAuthor>
                            <Stars style={{ marginTop: 4 }}>
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} size={12} fill={i < review.rating ? 'currentColor' : 'none'} />
                              ))}
                            </Stars>
                          </div>
                          <ReviewDate>
                            {new Date(review.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                          </ReviewDate>
                        </ReviewHeader>
                        {review.title && <p style={{ fontWeight: 500, marginBottom: 6, fontSize: 14 }}>{review.title}</p>}
                        <ReviewText>{review.body}</ReviewText>
                      </ReviewCard>
                    ))}
                  </>
                )}
              </TabContent>
            </motion.div>
          </AnimatePresence>
        </Info>
      </Container>

      {/* Related Products */}
      <RelatedSection>
        <RelatedInner>
          <SectionTitle>Vous aimerez aussi <em>ces œuvres</em></SectionTitle>
          <RelatedGrid>
            {demoRelated.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p as Product} />
            ))}
          </RelatedGrid>
        </RelatedInner>
      </RelatedSection>

      {/* Image Zoom Modal */}
      <AnimatePresence>
        {zoomed && (
          <ZoomOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomed(false)}
          >
            <ZoomedImage>
              <Image
                src={images[activeImage]?.url || ''}
                alt={product.name}
                fill
                style={{ objectFit: 'contain' }}
              />
            </ZoomedImage>
          </ZoomOverlay>
        )}
      </AnimatePresence>
    </Page>
  );
}
