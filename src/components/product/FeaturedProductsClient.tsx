'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useState } from 'react';
import ProductCard from './ProductCard';
import type { Product } from '@/types';
import Link from 'next/link';

const Section = styled.section`
  background: var(--off-black);
  padding: 100px 40px;
  overflow: hidden;

  @media (max-width: 768px) { padding: 60px 20px; }
`;

const Inner = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 56px;
  flex-wrap: wrap;
  gap: 24px;
`;

const Title = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(32px, 4vw, 52px);
  font-weight: 400;
  color: var(--off-white);
  em { font-style: italic; color: var(--gold-light); }
`;

const TabRow = styled.div`
  display: flex;
  gap: 4px;
  background: rgba(255,255,255,0.05);
  padding: 4px;
  border-radius: 4px;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 8px 20px;
  border-radius: 2px;
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ $active }) => ($active ? 'var(--black)' : 'var(--light-gray)')};
  background: ${({ $active }) => ($active ? 'var(--gold)' : 'transparent')};
  transition: all 0.25s;

  &:hover {
    color: ${({ $active }) => ($active ? 'var(--black)' : 'var(--off-white)')};
  }
`;

const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px 20px;

  @media (max-width: 1200px) { grid-template-columns: repeat(3, 1fr); }
  @media (max-width: 900px)  { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 480px)  { grid-template-columns: 1fr; }
`;

const ViewAllRow = styled.div`
  margin-top: 56px;
  display: flex;
  justify-content: center;
`;

const ViewAllBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 15px 48px;
  border: 1px solid rgba(201, 168, 76, 0.4);
  color: var(--off-white);
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  border-radius: 2px;
  transition: border-color 0.25s, background 0.25s;

  &:hover {
    border-color: var(--gold);
    background: rgba(201, 168, 76, 0.08);
  }
`;

// Override card styles inside dark section
const DarkCardWrapper = styled.div`
  [data-card-name] {
    color: var(--off-white);
  }
`;

const tabs = ['Tous', 'Tableaux', 'Papier Peint', 'Nouveautés'];

interface Props { products: Product[] }

export default function FeaturedProductsClient({ products }: Props) {
  const [activeTab, setActiveTab] = useState('Tous');

  const filtered = products.filter((p) => {
    if (activeTab === 'Tous') return true;
    if (activeTab === 'Tableaux') return p.category?.slug === 'tableaux';
    if (activeTab === 'Papier Peint') return p.category?.slug === 'papier-peint';
    if (activeTab === 'Nouveautés') return p.is_featured;
    return true;
  });

  // If no real data, show demo cards
  const displayProducts = filtered.length > 0 ? filtered : getDemoProducts();

  return (
    <Section>
      <Inner>
        <Header>
          <Title>
            Nos <em>Sélections</em><br />du Moment
          </Title>
          <TabRow>
            {tabs.map((tab) => (
              <Tab
                key={tab}
                $active={activeTab === tab}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </Tab>
            ))}
          </TabRow>
        </Header>

        <Grid
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {displayProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} dark />
          ))}
        </Grid>

        <ViewAllRow>
          <ViewAllBtn href="/products">
            Voir toute la collection
          </ViewAllBtn>
        </ViewAllRow>
      </Inner>
    </Section>
  );
}

function getDemoProducts(): Product[] {
  const base = [
    { name: 'Harmonie Abstraite No.3', slug: 'harmonie-abstraite-3', price: 1890, category: { name: 'Tableaux', slug: 'tableaux' }, img: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80', featured: true },
    { name: 'Forêt Tropicale Panoramique', slug: 'foret-tropicale', price: 2450, compare_at_price: 2900, category: { name: 'Papier Peint', slug: 'papier-peint' }, img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&q=80', featured: false },
    { name: 'Géométrie Dorée', slug: 'geometrie-doree', price: 980, category: { name: 'Tableaux', slug: 'tableaux' }, img: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=600&q=80', featured: true },
    { name: 'Marbre Blanc Veiné', slug: 'marbre-blanc', price: 3200, category: { name: 'Papier Peint', slug: 'papier-peint' }, img: 'https://images.unsplash.com/photo-1615873968403-89e068629265?w=600&q=80', featured: false },
    { name: 'Portrait Minimaliste', slug: 'portrait-minimaliste', price: 1450, category: { name: 'Tableaux', slug: 'tableaux' }, img: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=600&q=80', featured: true },
    { name: 'Botanique Exotique', slug: 'botanique-exotique', price: 2100, compare_at_price: 2600, category: { name: 'Papier Peint', slug: 'papier-peint' }, img: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&q=80', featured: false },
    { name: 'Coucher de Soleil Doré', slug: 'coucher-soleil', price: 1750, category: { name: 'Tableaux', slug: 'tableaux' }, img: 'https://images.unsplash.com/photo-1504805572947-34fad45aed93?w=600&q=80', featured: true },
    { name: 'Texture Béton Brut', slug: 'texture-beton', price: 890, category: { name: 'Papier Peint', slug: 'papier-peint' }, img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', featured: false },
  ];

  return base.map((p, i) => ({
    id: `demo-${i}`,
    name: p.name,
    slug: p.slug,
    description: null,
    short_description: null,
    price: p.price,
    compare_at_price: p.compare_at_price || null,
    category_id: null,
    stock_quantity: 10,
    sku: null,
    weight: null,
    dimensions: null,
    tags: null,
    is_active: true,
    is_featured: p.featured,
    metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: `cat-${i}`, name: p.category.name, slug: p.category.slug, description: null, image_url: null, parent_id: null, sort_order: i, created_at: '' },
    images: [{ id: `img-${i}`, product_id: `demo-${i}`, url: p.img, alt: p.name, sort_order: 0, is_primary: true }],
  }));
}
