'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Search, Package, Truck, CheckCircle, Clock, MapPin } from 'lucide-react';
import Link from 'next/link';

const Page = styled.div`
  padding-top: var(--nav-height);
  min-height: 100vh;
  background: var(--cream);
`;

const Header = styled.div`
  background: var(--off-black);
  padding: 80px 40px 60px;
  text-align: center;
  @media (max-width: 768px) { padding: 60px 20px 40px; }
`;

const Title = styled.h1`
  font-family: var(--font-display);
  font-size: clamp(36px, 5vw, 60px);
  font-weight: 400;
  color: var(--off-white);
  margin-bottom: 12px;
  em { font-style: italic; color: var(--gold-light); }
`;

const Sub = styled.p`
  font-size: 14px;
  color: var(--mid-gray);
  margin-bottom: 40px;
`;

const SearchForm = styled.div`
  display: flex;
  max-width: 500px;
  margin: 0 auto;
  gap: 0;
  border: 1px solid rgba(201,168,76,0.3);
  border-radius: 2px;
  overflow: hidden;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 16px 20px;
  background: rgba(255,255,255,0.06);
  color: var(--off-white);
  font-size: 15px;
  font-family: var(--font-body);
  border: none;
  outline: none;
  &::placeholder { color: var(--mid-gray); }
`;

const SearchBtn = styled.button`
  padding: 16px 24px;
  background: var(--gold);
  color: var(--black);
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s;
  &:hover { background: var(--gold-light); }
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 60px 40px;
  @media (max-width: 768px) { padding: 40px 20px; }
`;

const OrderCard = styled(motion.div)`
  background: var(--white);
  border-radius: var(--radius-sm);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  margin-bottom: 32px;
`;

const OrderHeader = styled.div`
  background: var(--off-black);
  padding: 24px 28px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 16px;
`;

const OrderNum = styled.div`
  p:first-child {
    font-size: 11px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--mid-gray);
    margin-bottom: 6px;
  }
  p:last-child {
    font-family: var(--font-display);
    font-size: 22px;
    font-weight: 400;
    color: var(--off-white);
  }
`;

const OrderMeta = styled.div`
  text-align: right;
  p:first-child { font-size: 13px; color: var(--mid-gray); margin-bottom: 4px; }
  p:last-child { font-size: 16px; font-weight: 500; color: var(--gold-light); }
`;

const TrackingTimeline = styled.div`
  padding: 36px 28px;
`;

const TimelineTitle = styled.h3`
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 400;
  margin-bottom: 32px;
`;

const Timeline = styled.div`
  position: relative;
  &::before {
    content: '';
    position: absolute;
    left: 18px;
    top: 8px;
    bottom: 8px;
    width: 2px;
    background: rgba(0,0,0,0.08);
  }
`;

const TimelineItem = styled.div<{ $done: boolean; $active: boolean }>`
  display: flex;
  gap: 20px;
  align-items: flex-start;
  margin-bottom: 28px;
  position: relative;

  &:last-child { margin-bottom: 0; }
`;

const TimelineDot = styled.div<{ $done: boolean; $active: boolean }>`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $done, $active }) =>
    $done ? 'var(--success)' : $active ? 'var(--gold)' : 'var(--off-white)'};
  border: 2px solid ${({ $done, $active }) =>
    $done ? 'var(--success)' : $active ? 'var(--gold)' : 'rgba(0,0,0,0.12)'};
  color: ${({ $done, $active }) =>
    $done || $active ? 'var(--white)' : 'var(--light-gray)'};
  position: relative;
  z-index: 1;
  transition: all 0.3s;

  ${({ $active }) => $active && `
    box-shadow: 0 0 0 6px rgba(201,168,76,0.15);
    animation: pulse 2s ease infinite;
    @keyframes pulse {
      0%, 100% { box-shadow: 0 0 0 6px rgba(201,168,76,0.15); }
      50% { box-shadow: 0 0 0 12px rgba(201,168,76,0.05); }
    }
  `}
`;

const TimelineContent = styled.div<{ $active: boolean }>`
  flex: 1;
  padding-top: 6px;
  opacity: ${({ $active }) => ($active ? 1 : 0.6)};
`;

const TimelineLabel = styled.p`
  font-size: 15px;
  font-weight: 500;
  color: var(--black);
  margin-bottom: 4px;
`;

const TimelineDesc = styled.p`
  font-size: 13px;
  color: var(--mid-gray);
  line-height: 1.6;
`;

const TimelineDate = styled.p`
  font-size: 12px;
  color: var(--light-gray);
  margin-top: 4px;
`;

const MapPreview = styled.div`
  margin: 0 28px 28px;
  background: var(--off-white);
  border-radius: var(--radius-sm);
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid rgba(0,0,0,0.06);
`;

const MapIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(201,168,76,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gold);
  flex-shrink: 0;
`;

const MapInfo = styled.div`
  flex: 1;
  p:first-child { font-size: 14px; font-weight: 500; color: var(--black); margin-bottom: 4px; }
  p:last-child { font-size: 12px; color: var(--mid-gray); }
`;

const ItemsSection = styled.div`
  padding: 0 28px 28px;
  border-top: 1px solid rgba(0,0,0,0.06);
  padding-top: 24px;
`;

const ItemRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 12px;
  padding: 12px;
  background: var(--off-white);
  border-radius: var(--radius-sm);
`;

const ItemImg = styled.div`
  width: 48px;
  height: 48px;
  border-radius: var(--radius-sm);
  background: var(--light-gray);
  flex-shrink: 0;
`;

const EmptyTracking = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: var(--mid-gray);
  svg { margin: 0 auto 20px; display: block; opacity: 0.3; }
  h3 { font-family: var(--font-display); font-size: 28px; font-weight: 400; margin-bottom: 8px; color: var(--charcoal); }
`;

const DEMO_TRACKING = {
  id: 'AWS-847291',
  date: '12 Decembre 2024',
  total: '4 340 MAD',
  status: 'shipped',
  carrier: 'Amana Express',
  trackingNum: 'AM847291MA',
  estimatedDelivery: '15 Decembre 2024',
  destination: 'Casablanca, Maroc',
  items: [
    { name: 'Harmonie Abstraite No.3', qty: 1, price: '1 890 MAD' },
    { name: 'Foret Tropicale Panoramique', qty: 1, price: '2 100 MAD' },
  ],
  timeline: [
    { icon: CheckCircle, label: 'Commande confirmee', desc: 'Votre commande a ete recue et validee', date: '12 Dec 2024, 10:32', done: true, active: false },
    { icon: Package, label: 'En preparation', desc: 'Votre commande est en cours de conditionnement', date: '13 Dec 2024, 09:15', done: true, active: false },
    { icon: Truck, label: 'Expedition', desc: 'Colis pris en charge par Amana Express - Ref: AM847291MA', date: '13 Dec 2024, 16:48', done: true, active: true },
    { icon: MapPin, label: 'En transit', desc: 'Colis en route vers Casablanca', date: 'Prevu 14-15 Dec 2024', done: false, active: false },
    { icon: CheckCircle, label: 'Livre', desc: 'Livraison estimee le 15 Decembre', date: 'Prevu 15 Dec 2024', done: false, active: false },
  ],
};

export default function TrackPage() {
  const [query, setQuery] = useState('');
  const [tracking, setTracking] = useState<typeof DEMO_TRACKING | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) return;
    setSearched(true);
    // Demo: show tracking for any query
    if (query.toUpperCase().includes('AWS') || query.length > 4) {
      setTracking({ ...DEMO_TRACKING, id: query.toUpperCase() });
    } else {
      setTracking(null);
    }
  };

  return (
    <Page>
      <Header>
        <Title>Suivre ma <em>Commande</em></Title>
        <Sub>Entrez votre numero de commande pour suivre votre livraison en temps reel</Sub>
        <SearchForm>
          <SearchInput
            placeholder="Ex: AWS-847291 ou votre email"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <SearchBtn onClick={handleSearch}>
            <Search size={15} />
            Suivre
          </SearchBtn>
        </SearchForm>
      </Header>

      <Container>
        {!searched && !tracking && (
          <EmptyTracking>
            <Truck size={64} />
            <h3>Suivi en temps reel</h3>
            <p style={{ maxWidth: 380, margin: '0 auto 24px' }}>
              Entrez votre numero de commande AWS-XXXXXX
              ou votre adresse email pour consulter le statut de votre livraison.
            </p>
            <p style={{ fontSize: 13 }}>
              Vous avez un compte ?{' '}
              <Link href="/account" style={{ color: 'var(--gold-dark)' }}>
                Consultez vos commandes
              </Link>
            </p>
          </EmptyTracking>
        )}

        {searched && !tracking && (
          <EmptyTracking>
            <Package size={64} />
            <h3>Commande introuvable</h3>
            <p>Aucune commande trouvee pour &quot;{query}&quot;.<br />Verifiez le numero ou essayez avec votre email.</p>
          </EmptyTracking>
        )}

        {tracking && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <OrderCard>
              <OrderHeader>
                <OrderNum>
                  <p>Commande</p>
                  <p>{tracking.id}</p>
                </OrderNum>
                <OrderMeta>
                  <p>Passe le {tracking.date}</p>
                  <p>{tracking.total}</p>
                </OrderMeta>
              </OrderHeader>

              <TrackingTimeline>
                <TimelineTitle>Suivi de livraison</TimelineTitle>
                <Timeline>
                  {tracking.timeline.map((step, i) => (
                    <TimelineItem key={i} $done={step.done} $active={step.active}>
                      <TimelineDot $done={step.done} $active={step.active}>
                        <step.icon size={16} />
                      </TimelineDot>
                      <TimelineContent $active={step.done || step.active}>
                        <TimelineLabel>{step.label}</TimelineLabel>
                        <TimelineDesc>{step.desc}</TimelineDesc>
                        <TimelineDate>{step.date}</TimelineDate>
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              </TrackingTimeline>

              <MapPreview>
                <MapIcon><MapPin size={22} /></MapIcon>
                <MapInfo>
                  <p>Destination: {tracking.destination}</p>
                  <p>Transporteur: {tracking.carrier} · Ref: {tracking.trackingNum} · Livraison estimee le {tracking.estimatedDelivery}</p>
                </MapInfo>
              </MapPreview>

              <ItemsSection>
                <p style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--mid-gray)', marginBottom: 14 }}>
                  Articles commandes ({tracking.items.length})
                </p>
                {tracking.items.map((item, i) => (
                  <ItemRow key={i}>
                    <ItemImg />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 14, fontWeight: 400, color: 'var(--black)' }}>{item.name}</p>
                      <p style={{ fontSize: 12, color: 'var(--mid-gray)', marginTop: 3 }}>Quantite: {item.qty}</p>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--black)' }}>{item.price}</span>
                  </ItemRow>
                ))}
              </ItemsSection>
            </OrderCard>

            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 13, color: 'var(--mid-gray)', marginBottom: 16 }}>
                Un probleme avec votre commande ?
              </p>
              <Link
                href="/contact"
                style={{ fontSize: 13, color: 'var(--gold-dark)', textDecoration: 'underline' }}
              >
                Contacter le service client
              </Link>
            </div>
          </motion.div>
        )}
      </Container>

    </Page>
  );
}
