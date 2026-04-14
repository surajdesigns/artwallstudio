'use client';

import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const revealUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Hero = styled.section`
  position: relative;
  height: 100vh;
  min-height: 700px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow: hidden;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const HeroLeft = styled.div`
  background: var(--off-black);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 120px 80px 80px;
  position: relative;
  z-index: 1;

  @media (max-width: 1200px) { padding: 120px 48px 80px; }
  @media (max-width: 900px)  { padding: 120px 32px 60px; }
`;

const Eyebrow = styled(motion.p)`
  font-size: 11px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 28px;
  animation: ${revealUp} 0.8s var(--ease-out) 0.1s both;
`;

const HeroTitle = styled(motion.h1)`
  font-family: var(--font-display);
  font-size: clamp(52px, 6vw, 88px);
  font-weight: 300;
  line-height: 1.05;
  color: var(--off-white);
  margin-bottom: 32px;

  em {
    font-style: italic;
    color: var(--gold-light);
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 15px;
  line-height: 1.8;
  color: var(--light-gray);
  max-width: 400px;
  margin-bottom: 52px;
`;

const HeroActions = styled(motion.div)`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

const PrimaryBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 16px 36px;
  background: var(--gold);
  color: var(--black);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  border-radius: 2px;
  transition: background 0.25s, transform 0.2s;

  &:hover {
    background: var(--gold-light);
    transform: translateY(-1px);
  }
`;

const SecondaryBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 15px 36px;
  border: 1px solid rgba(201, 168, 76, 0.4);
  color: var(--off-white);
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  border-radius: 2px;
  transition: border-color 0.25s, color 0.25s;

  &:hover {
    border-color: var(--gold);
    color: var(--gold-light);
  }
`;

const StatRow = styled(motion.div)`
  display: flex;
  gap: 40px;
  margin-top: 60px;
  padding-top: 40px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);

  @media (max-width: 480px) { gap: 24px; }
`;

const Stat = styled.div`
  strong {
    display: block;
    font-family: var(--font-display);
    font-size: 28px;
    font-weight: 300;
    color: var(--off-white);
    letter-spacing: -0.02em;
  }
  span {
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--mid-gray);
  }
`;

const HeroRight = styled.div`
  position: relative;
  overflow: hidden;

  @media (max-width: 900px) {
    position: absolute;
    inset: 0;
    opacity: 0.15;
  }
`;

const HeroImageGrid = styled.div`
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 4px;
`;

const GridImage = styled.div`
  position: relative;
  overflow: hidden;

  img {
    transition: transform 8s linear;
  }

  &:hover img {
    transform: scale(1.05);
  }
`;

const HeroOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    var(--off-black) 0%,
    transparent 30%
  );
  pointer-events: none;
  z-index: 1;
`;

const ScrollIndicator = styled(motion.div)`
  position: absolute;
  bottom: 40px;
  left: 80px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--mid-gray);
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;

  @media (max-width: 1200px) { left: 48px; }
  @media (max-width: 900px)  { left: 32px; }

  &::before {
    content: '';
    width: 40px;
    height: 1px;
    background: var(--mid-gray);
  }
`;

const heroImages = [
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80',
  'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=600&q=80',
  'https://images.unsplash.com/photo-1615873968403-89e068629265?w=600&q=80',
  'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&q=80',
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export default function HeroSection() {
  return (
    <Hero>
      <HeroLeft>
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <Eyebrow variants={itemVariants}>Collection 2025 — Art & Décoration</Eyebrow>
          <HeroTitle variants={itemVariants}>
            L&apos;Art qui <em>Transforme</em> vos Espaces
          </HeroTitle>
          <HeroSubtitle variants={itemVariants}>
            Des tableaux d&apos;exception et des papiers peints de luxe
            pour sublimer chaque mur de votre intérieur.
          </HeroSubtitle>
          <HeroActions variants={itemVariants}>
            <PrimaryBtn href="/products?category=tableaux">
              Explorer les Tableaux
            </PrimaryBtn>
            <SecondaryBtn href="/products?category=papier-peint">
              Papiers Peints
            </SecondaryBtn>
          </HeroActions>
          <StatRow variants={itemVariants}>
            <Stat>
              <strong>500+</strong>
              <span>Œuvres</span>
            </Stat>
            <Stat>
              <strong>50+</strong>
              <span>Artistes</span>
            </Stat>
            <Stat>
              <strong>98%</strong>
              <span>Satisfaits</span>
            </Stat>
          </StatRow>
        </motion.div>

        <ScrollIndicator
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          Défiler
        </ScrollIndicator>
      </HeroLeft>

      <HeroRight>
        <HeroOverlay />
        <HeroImageGrid>
          {heroImages.map((src, i) => (
            <GridImage key={i}>
              <Image src={src} alt={`Art ${i + 1}`} fill style={{ objectFit: 'cover' }} />
            </GridImage>
          ))}
        </HeroImageGrid>
      </HeroRight>
    </Hero>
  );
}
