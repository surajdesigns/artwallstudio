'use client';

import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, X, ArrowLeft, Heart } from 'lucide-react';
import { useWishlistStore, useCartStore } from '@/lib/store';
import toast from 'react-hot-toast';

const Page = styled.div`
  padding-top: var(--nav-height);
  min-height: 100vh;
  background: var(--cream);
`;

const Header = styled.div`
  background: var(--off-black);
  padding: 60px 40px 40px;
  @media (max-width: 768px) { padding: 48px 20px 32px; }
`;

const BackLink = styled(Link)`
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--mid-gray); margin-bottom: 20px; transition: color 0.2s;
  &:hover { color: var(--gold-light); }
`;

const PageTitle = styled.h1`
  font-family: var(--font-display); font-size: clamp(36px, 5vw, 60px);
  font-weight: 400; color: var(--off-white);
  em { font-style: italic; color: var(--gold-light); }
`;

const PageSub = styled.p`
  font-size: 14px; color: var(--mid-gray); margin-top: 10px;
`;

const Container = styled.div`
  max-width: 1400px; margin: 0 auto;
  padding: 60px 40px;
  @media (max-width: 768px) { padding: 40px 20px; }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 32px 24px;
`;

const Card = styled(motion.div)`
  background: var(--white);
  border-radius: var(--radius-sm);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: box-shadow 0.3s;
  &:hover { box-shadow: var(--shadow-md); }
`;

const ImageWrapper = styled.div`
  position: relative; aspect-ratio: 4/5; overflow: hidden;
  background: var(--off-white);
  img { transition: transform 0.6s var(--ease-out); }
  &:hover img { transform: scale(1.05); }
`;

const RemoveBtn = styled.button`
  position: absolute; top: 12px; right: 12px; z-index: 1;
  width: 32px; height: 32px; border-radius: 50%;
  background: rgba(250,248,243,0.9);
  display: flex; align-items: center; justify-content: center;
  color: var(--mid-gray); transition: all 0.2s;
  &:hover { background: var(--white); color: var(--error); }
`;

const CardBody = styled.div`
  padding: 16px 18px 20px;
`;

const Category = styled.p`
  font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--mid-gray); margin-bottom: 6px;
`;

const ProductName = styled(Link)`
  font-family: var(--font-display); font-size: 17px; font-weight: 400;
  color: var(--black); display: block; margin-bottom: 10px; line-height: 1.2;
  transition: color 0.2s; &:hover { color: var(--gold-dark); }
`;

const PriceRow = styled.div`
  display: flex; align-items: baseline; gap: 10px; margin-bottom: 14px;
`;

const Price = styled.span`
  font-size: 16px; font-weight: 500; color: var(--black);
`;

const OldPrice = styled.span`
  font-size: 13px; color: var(--light-gray); text-decoration: line-through;
`;

const AddBtn = styled.button`
  display: flex; align-items: center; justify-content: center; gap: 8px;
  width: 100%; padding: 13px;
  background: var(--black); color: var(--off-white);
  font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase;
  border-radius: 2px; transition: background 0.2s;
  &:hover { background: var(--gold-dark); }
`;

const EmptyState = styled.div`
  text-align: center; padding: 100px 20px;
  svg { margin: 0 auto 24px; display: block; opacity: 0.25; }
  h2 { font-family: var(--font-display); font-size: 40px; font-weight: 400; margin-bottom: 12px; }
  h2 em { font-style: italic; color: var(--gold-dark); }
  p { color: var(--mid-gray); font-size: 15px; margin-bottom: 36px; }
`;

const ShopBtn = styled(Link)`
  display: inline-flex; align-items: center; gap: 10px;
  padding: 16px 40px; background: var(--black); color: var(--off-white);
  border-radius: 2px; font-size: 13px; letter-spacing: 0.12em; text-transform: uppercase;
  transition: background 0.2s; &:hover { background: var(--gold-dark); }
`;

const DEMO = [
  { id: 'w1', name: 'Portrait Minimaliste', slug: 'portrait-minimaliste', price: 1450, compare: null, category: 'Tableaux', img: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=600&q=80' },
  { id: 'w2', name: 'Botanique Exotique', slug: 'botanique-exotique', price: 2100, compare: 2600, category: 'Papier Peint', img: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&q=80' },
  { id: 'w3', name: 'Marbre Blanc', slug: 'marbre-blanc', price: 3200, compare: null, category: 'Papier Peint', img: 'https://images.unsplash.com/photo-1615873968403-89e068629265?w=600&q=80' },
  { id: 'w4', name: 'Geometrie Doree', slug: 'geometrie-doree', price: 980, compare: null, category: 'Tableaux', img: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=600&q=80' },
];

export default function WishlistPage() {
  const { toggle } = useWishlistStore();
  const { addItem } = useCartStore();

  const handleAddToCart = (item: typeof DEMO[0]) => {
    addItem({ id: item.id, productId: item.id, name: item.name, image: item.img, price: item.price, quantity: 1 });
    toast.success('Ajoute au panier');
  };

  return (
    <Page>
      <Header>
        <BackLink href="/products"><ArrowLeft size={14} />Continuer mes achats</BackLink>
        <PageTitle>Mes <em>Favoris</em></PageTitle>
        <PageSub>{DEMO.length} oeuvres sauvegardees</PageSub>
      </Header>

      <Container>
        {DEMO.length === 0 ? (
          <EmptyState>
            <Heart size={64} />
            <h2>Aucun <em>Favori</em></h2>
            <p>Vous n avez pas encore ajoute d oeuvres a vos favoris.</p>
            <ShopBtn href="/products">Explorer la boutique</ShopBtn>
          </EmptyState>
        ) : (
          <Grid>
            <AnimatePresence>
              {DEMO.map((item, i) => (
                <Card
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                >
                  <ImageWrapper>
                    <Link href={"/products/" + item.slug}>
                      <Image src={item.img} alt={item.name} fill style={{ objectFit: 'cover' }} />
                    </Link>
                    <RemoveBtn onClick={() => { toggle(item.id); toast.success('Retire des favoris'); }}>
                      <X size={14} />
                    </RemoveBtn>
                  </ImageWrapper>
                  <CardBody>
                    <Category>{item.category}</Category>
                    <ProductName href={"/products/" + item.slug}>{item.name}</ProductName>
                    <PriceRow>
                      <Price>{item.price.toFixed(2)} MAD</Price>
                      {item.compare && <OldPrice>{item.compare.toFixed(2)} MAD</OldPrice>}
                    </PriceRow>
                    <AddBtn onClick={() => handleAddToCart(item)}>
                      <ShoppingBag size={15} />
                      Ajouter au panier
                    </AddBtn>
                  </CardBody>
                </Card>
              ))}
            </AnimatePresence>
          </Grid>
        )}
      </Container>

    </Page>
  );
}
