'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { useRecommendations, useRecentlyViewed } from '@/hooks/useRecommendations';
import type { Product } from '@/types';

const Section = styled.section`
  padding: 80px 40px;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 768px) { padding: 60px 20px; }
`;

const Header = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 16px;
  margin-bottom: 40px;
`;

const TitleBlock = styled.div``;

const Eyebrow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 8px;
`;

const Title = styled.h2`
  font-family: var(--font-display);
  font-size: 32px;
  font-weight: 400;
  color: var(--black);
  em { font-style: italic; color: var(--gold-dark); }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 24px 20px;
`;

const SkeletonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 24px 20px;
`;

const Skeleton = styled(motion.div)`
  border-radius: var(--radius-sm);
  background: linear-gradient(90deg, var(--off-white) 25%, var(--cream) 50%, var(--off-white) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

interface Props {
  currentProductId?: string;
  title?: string;
  subtitle?: string;
  demoProducts?: Product[];
}

export default function RecommendationsSection({
  currentProductId,
  title = 'Pour Vous',
  subtitle = 'Sélectionné selon vos préférences',
  demoProducts,
}: Props) {
  const { recommendations, loading } = useRecommendations(currentProductId, 6);
  const display = recommendations.length > 0 ? recommendations : (demoProducts || []);

  if (!loading && display.length === 0) return null;

  return (
    <Section>
      <Header>
        <TitleBlock>
          <Eyebrow>
            <Sparkles size={14} />
            Recommandé
          </Eyebrow>
          <Title>
            <em>{title}</em>
          </Title>
          <p style={{ fontSize: 13, color: 'var(--mid-gray)', marginTop: 6 }}>{subtitle}</p>
        </TitleBlock>
      </Header>

      {loading ? (
        <SkeletonGrid>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <Skeleton style={{ aspectRatio: '3/4', marginBottom: 12 }} />
              <Skeleton style={{ height: 12, width: '50%', marginBottom: 8 }} />
              <Skeleton style={{ height: 16, width: '80%', marginBottom: 10 }} />
              <Skeleton style={{ height: 14, width: '30%' }} />
            </div>
          ))}
        </SkeletonGrid>
      ) : (
        <Grid>
          {display.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Grid>
      )}
    </Section>
  );
}
