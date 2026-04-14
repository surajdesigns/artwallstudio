'use client';

import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { Palette, Award, Truck, Headphones, Sparkles } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

// ─── Brand Strip ─────────────────────────────────────────────────────────────

const Strip = styled.div`
  background: var(--off-black);
  border-top: 1px solid rgba(201,168,76,0.15);
  border-bottom: 1px solid rgba(201,168,76,0.15);
  padding: 16px 0;
  overflow: hidden;
`;

const scroll = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

const ScrollTrack = styled.div`
  display: flex;
  gap: 64px;
  white-space: nowrap;
  animation: ${scroll} 20s linear infinite;
  width: max-content;
`;

const ScrollItem = styled.span`
  font-size: 11px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--mid-gray);
  display: flex;
  align-items: center;
  gap: 12px;

  &::before {
    content: '✦';
    color: var(--gold);
    font-size: 8px;
  }
`;

export function BrandStrip() {
  const items = [
    'Livraison Maroc & International',
    'Paiement Sécurisé',
    'Authenticité Garantie',
    '30 Jours Satisfait ou Remboursé',
    '500+ Œuvres Disponibles',
    'Service Client Expert',
  ];

  return (
    <Strip>
      <ScrollTrack>
        {[...items, ...items].map((item, i) => (
          <ScrollItem key={i}>{item}</ScrollItem>
        ))}
      </ScrollTrack>
    </Strip>
  );
}

// ─── Why Us ──────────────────────────────────────────────────────────────────

const WhySection = styled.section`
  padding: 100px 40px;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 768px) { padding: 60px 20px; }
`;

const WhyHeader = styled.div`
  text-align: center;
  margin-bottom: 64px;
`;

const WhyEyebrow = styled.p`
  font-size: 11px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 16px;
`;

const WhyTitle = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(32px, 4vw, 52px);
  font-weight: 400;
  color: var(--black);
  em { font-style: italic; color: var(--gold-dark); }
`;

const WhyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;

  @media (max-width: 1024px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 480px) { grid-template-columns: 1fr; }
`;

const WhyCard = styled(motion.div)`
  text-align: center;
  padding: 40px 24px;
  border-radius: var(--radius-sm);
  transition: box-shadow 0.3s;

  &:hover {
    box-shadow: var(--shadow-md);
    background: var(--white);
  }
`;

const IconCircle = styled.div`
  width: 64px; height: 64px;
  border-radius: 50%;
  background: rgba(201,168,76,0.1);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 20px;
  color: var(--gold);
  transition: background 0.3s;

  ${WhyCard}:hover & {
    background: var(--gold);
    color: var(--black);
  }
`;

const WhyCardTitle = styled.h3`
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 400;
  margin-bottom: 10px;
`;

const WhyCardText = styled.p`
  font-size: 14px;
  line-height: 1.7;
  color: var(--mid-gray);
`;

const WHY_ITEMS = [
  { icon: Palette, title: 'Art Authentique', text: 'Chaque œuvre est vérifiée et certifiée par nos experts en art contemporain.' },
  { icon: Award, title: 'Qualité Premium', text: 'Matériaux de haute gamme pour une durabilité et une beauté exceptionnelles.' },
  { icon: Truck, title: 'Livraison Soignée', text: 'Emballage sur mesure et livraison assurée à domicile partout au Maroc.' },
  { icon: Headphones, title: 'Conseil Personnalisé', text: 'Notre équipe de décorateurs vous guide dans vos choix artistiques.' },
];

export function WhyUs() {
  return (
    <WhySection>
      <WhyHeader>
        <WhyEyebrow>Pourquoi nous choisir</WhyEyebrow>
        <WhyTitle>L&apos;Art de <em>Bien</em> Décorer</WhyTitle>
      </WhyHeader>
      <WhyGrid>
        {WHY_ITEMS.map((item, i) => (
          <WhyCard
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <IconCircle><item.icon size={26} /></IconCircle>
            <WhyCardTitle>{item.title}</WhyCardTitle>
            <WhyCardText>{item.text}</WhyCardText>
          </WhyCard>
        ))}
      </WhyGrid>
    </WhySection>
  );
}

// ─── Newsletter ───────────────────────────────────────────────────────────────

const NewsSection = styled.section`
  background: var(--off-black);
  padding: 100px 40px;

  @media (max-width: 768px) { padding: 60px 20px; }
`;

const NewsInner = styled.div`
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
`;

const NewsEyebrow = styled.p`
  font-size: 11px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 16px;
`;

const NewsTitle = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(28px, 4vw, 44px);
  font-weight: 400;
  color: var(--off-white);
  margin-bottom: 16px;
  em { font-style: italic; color: var(--gold-light); }
`;

const NewsSubtitle = styled.p`
  font-size: 15px;
  color: var(--mid-gray);
  line-height: 1.7;
  margin-bottom: 36px;
`;

const NewsForm = styled.div`
  display: flex;
  gap: 0;
  max-width: 440px;
  margin: 0 auto;
  border: 1px solid rgba(201,168,76,0.3);
  border-radius: 2px;
  overflow: hidden;
`;

const NewsInput = styled.input`
  flex: 1;
  padding: 16px 20px;
  background: rgba(255,255,255,0.05);
  color: var(--off-white);
  font-size: 14px;
  font-family: var(--font-body);
  border: none;
  outline: none;

  &::placeholder { color: var(--mid-gray); }
`;

const NewsBtn = styled.button`
  padding: 16px 24px;
  background: var(--gold);
  color: var(--black);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  white-space: nowrap;
  transition: background 0.25s;

  &:hover { background: var(--gold-light); }
`;

const Perks = styled.div`
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-top: 24px;
  flex-wrap: wrap;
`;

const Perk = styled.p`
  font-size: 12px;
  color: var(--mid-gray);
  display: flex;
  align-items: center;
  gap: 6px;

  &::before { content: '✓'; color: var(--gold); }
`;

export function Newsletter() {
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    if (!email) return;
    toast.success('Merci ! Vous êtes maintenant abonné(e) 🎨');
    setEmail('');
  };

  return (
    <NewsSection>
      <NewsInner>
        <NewsEyebrow>Newsletter</NewsEyebrow>
        <NewsTitle>Restez <em>Inspiré(e)</em></NewsTitle>
        <NewsSubtitle>
          Recevez en exclusivité nos nouvelles collections, conseils déco et offres privilèges.
        </NewsSubtitle>
        <NewsForm>
          <NewsInput
            type="email"
            placeholder="votre@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <NewsBtn onClick={handleSubmit}>S&apos;abonner</NewsBtn>
        </NewsForm>
        <Perks>
          <Perk>-10% sur votre 1ère commande</Perk>
          <Perk>Accès prioritaire</Perk>
          <Perk>Sans spam</Perk>
        </Perks>
      </NewsInner>
    </NewsSection>
  );
}
