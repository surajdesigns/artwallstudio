'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const Section = styled.section`
  padding: 100px 40px;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 768px) { padding: 60px 20px; }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 56px;
  gap: 24px;
  flex-wrap: wrap;
`;

const SectionTitle = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(32px, 4vw, 52px);
  font-weight: 400;
  line-height: 1.1;
  color: var(--black);

  em { font-style: italic; color: var(--gold-dark); }
`;

const ViewAll = styled(Link)`
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--mid-gray);
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  transition: color 0.2s;

  &::after { content: '→'; transition: transform 0.2s; }
  &:hover { color: var(--black); &::after { transform: translateX(4px); } }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  grid-template-rows: 320px 320px;
  gap: 16px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
  }
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const CategoryCard = styled(motion.div)<{ $span?: boolean }>`
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-sm);
  grid-row: ${({ $span }) => ($span ? 'span 2' : 'auto')};
  cursor: pointer;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to top,
      rgba(10, 10, 8, 0.75) 0%,
      rgba(10, 10, 8, 0.15) 50%,
      transparent 100%
    );
    transition: opacity 0.3s;
  }

  img {
    transition: transform 0.7s var(--ease-out);
  }

  &:hover img {
    transform: scale(1.07);
  }

  @media (max-width: 1024px) {
    grid-row: auto;
  }
`;

const CardContent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 28px 24px;
  z-index: 1;
`;

const CardLabel = styled.p`
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(250, 248, 243, 0.6);
  margin-bottom: 8px;
`;

const CardTitle = styled.h3`
  font-family: var(--font-display);
  font-size: 26px;
  font-weight: 400;
  color: var(--off-white);
  line-height: 1.15;
  margin-bottom: 16px;
`;

const CardBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--gold-light);
  transition: gap 0.2s;

  &::after { content: '→'; }
  &:hover { gap: 10px; }
`;

const categories = [
  {
    slug: 'tableaux',
    label: 'Collection Principale',
    title: 'Tableaux d\'Art',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=900&q=80',
    span: true,
  },
  {
    slug: 'papier-peint',
    label: 'Revêtement Mural',
    title: 'Papiers Peints',
    image: 'https://images.unsplash.com/photo-1615873968403-89e068629265?w=600&q=80',
    span: false,
  },
  {
    slug: 'abstraits',
    label: 'Style',
    title: 'Art Abstrait',
    image: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=600&q=80',
    span: false,
  },
  {
    slug: 'nature-botanique',
    label: 'Thème',
    title: 'Nature & Botanique',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&q=80',
    span: false,
  },
  {
    slug: 'geometrique',
    label: 'Style',
    title: 'Géométrique',
    image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=600&q=80',
    span: false,
  },
];

export default function CategoryGrid() {
  return (
    <Section>
      <SectionHeader>
        <SectionTitle>
          Explorez nos<br /><em>Collections</em>
        </SectionTitle>
        <ViewAll href="/products">Tout voir</ViewAll>
      </SectionHeader>

      <Grid>
        {categories.map((cat, i) => (
          <CategoryCard
            key={cat.slug}
            $span={cat.span}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image src={cat.image} alt={cat.title} fill style={{ objectFit: 'cover' }} />
            <CardContent>
              <CardLabel>{cat.label}</CardLabel>
              <CardTitle>{cat.title}</CardTitle>
              <CardBtn href={`/products?category=${cat.slug}`}>
                Découvrir
              </CardBtn>
            </CardContent>
          </CategoryCard>
        ))}
      </Grid>
    </Section>
  );
}
