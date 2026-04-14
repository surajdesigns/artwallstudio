'use client';

import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User, ShoppingBag, Heart, Settings, LogOut, ChevronRight, Package } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import type { Order } from '@/types';
import toast from 'react-hot-toast';

const Page = styled.div`
  padding-top: var(--nav-height);
  min-height: 100vh;
  background: var(--cream);
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 40px;
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 40px;
  align-items: start;

  @media (max-width: 900px) { grid-template-columns: 1fr; }
  @media (max-width: 768px) { padding: 32px 20px; }
`;

const Sidebar = styled.div`
  background: var(--white);
  border-radius: var(--radius-sm);
  overflow: hidden;
  position: sticky;
  top: calc(var(--nav-height) + 20px);

  @media (max-width: 900px) { position: static; }
`;

const ProfileHeader = styled.div`
  background: var(--off-black);
  padding: 28px 24px;
  display: flex;
  align-items: center;
  gap: 14px;
`;

const Avatar = styled.div`
  width: 48px; height: 48px;
  border-radius: 50%;
  background: rgba(201,168,76,0.2);
  display: flex; align-items: center; justify-content: center;
  color: var(--gold);
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 400;
  flex-shrink: 0;
`;

const ProfileName = styled.div`
  p:first-child {
    font-size: 15px;
    font-weight: 500;
    color: var(--off-white);
  }
  p:last-child {
    font-size: 12px;
    color: var(--mid-gray);
    margin-top: 2px;
  }
`;

const NavItem = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 16px 24px;
  font-size: 14px;
  color: ${({ $active }) => ($active ? 'var(--black)' : 'var(--charcoal)')};
  background: ${({ $active }) => ($active ? 'rgba(201,168,76,0.08)' : 'transparent')};
  border-left: 3px solid ${({ $active }) => ($active ? 'var(--gold)' : 'transparent')};
  transition: all 0.2s;
  text-align: left;

  svg { color: ${({ $active }) => ($active ? 'var(--gold)' : 'var(--mid-gray)')}; }

  &:hover {
    background: rgba(0,0,0,0.03);
    color: var(--black);
  }
`;

const LogoutBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 16px 24px;
  font-size: 14px;
  color: var(--mid-gray);
  border-top: 1px solid rgba(0,0,0,0.06);
  transition: all 0.2s;

  &:hover { color: var(--error); background: rgba(201,76,76,0.04); }
`;

const Content = styled.div``;

const ContentCard = styled(motion.div)`
  background: var(--white);
  border-radius: var(--radius-sm);
  padding: 36px;

  @media (max-width: 480px) { padding: 24px 20px; }
`;

const CardTitle = styled.h2`
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 400;
  margin-bottom: 28px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(0,0,0,0.06);
  em { font-style: italic; color: var(--gold-dark); }
`;

// Orders
const OrderCard = styled.div`
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: var(--radius-sm);
  padding: 20px;
  margin-bottom: 16px;
  transition: border-color 0.2s;

  &:hover { border-color: rgba(201,168,76,0.4); }
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
`;

const OrderId = styled.p`
  font-size: 13px;
  color: var(--mid-gray);
  margin-bottom: 4px;
`;

const OrderDate = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: var(--black);
`;

const StatusBadge = styled.span<{ $status: string }>`
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: ${({ $status }) => {
    switch ($status) {
      case 'delivered': return 'rgba(76,170,112,0.12)';
      case 'shipped': return 'rgba(74,111,165,0.12)';
      case 'processing': return 'rgba(201,168,76,0.12)';
      case 'cancelled': return 'rgba(201,76,76,0.12)';
      default: return 'rgba(90,90,80,0.1)';
    }
  }};
  color: ${({ $status }) => {
    switch ($status) {
      case 'delivered': return '#4caa70';
      case 'shipped': return '#4a6fa5';
      case 'processing': return '#9a7a30';
      case 'cancelled': return '#c94c4c';
      default: return 'var(--mid-gray)';
    }
  }};
`;

const statusLabels: Record<string, string> = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  processing: 'En préparation',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
  refunded: 'Remboursée',
};

const OrderTotal = styled.p`
  font-size: 16px;
  font-weight: 500;
  color: var(--black);
`;

const OrderItems = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 4px;
`;

const OrderThumb = styled.div`
  position: relative;
  width: 56px; height: 56px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  flex-shrink: 0;
  background: var(--cream);
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: var(--mid-gray);

  svg { margin: 0 auto 16px; opacity: 0.3; }
  h3 { font-family: var(--font-display); font-size: 24px; font-weight: 400; margin-bottom: 8px; color: var(--charcoal); }
`;

const ShopBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  background: var(--black);
  color: var(--off-white);
  border-radius: 2px;
  font-size: 13px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-top: 20px;
  transition: background 0.2s;
  &:hover { background: var(--gold-dark); }
`;

// Settings form
const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  @media (max-width: 600px) { grid-template-columns: 1fr; }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--charcoal);
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 1px solid rgba(0,0,0,0.12);
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-family: var(--font-body);
  background: var(--cream);
  outline: none;
  transition: border-color 0.2s;
  &:focus { border-color: var(--gold); }
`;

const SaveBtn = styled.button`
  margin-top: 24px;
  padding: 14px 32px;
  background: var(--black);
  color: var(--off-white);
  font-size: 13px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border-radius: 2px;
  transition: background 0.2s;
  &:hover { background: var(--gold-dark); }
`;

// Wishlist grid
const WishGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 24px;
`;

const WishCard = styled.div`
  position: relative;
`;

const WishImage = styled.div`
  position: relative;
  aspect-ratio: 3/4;
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--cream);
  margin-bottom: 12px;
`;

const RemoveWish = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 32px; height: 32px;
  border-radius: 50%;
  background: rgba(250,248,243,0.9);
  display: flex; align-items: center; justify-content: center;
  color: var(--error);
  font-size: 16px;
  transition: background 0.2s;
  z-index: 1;
  &:hover { background: var(--white); }
`;

type Tab = 'orders' | 'wishlist' | 'settings';

const DEMO_ORDERS: Order[] = [
  {
    id: 'ORD-2024-001', user_id: '', status: 'delivered',
    total_amount: 4340, subtotal: 3990, shipping_amount: 150, tax_amount: 200, discount_amount: 0,
    currency: 'MAD', shipping_address: null, billing_address: null, notes: null, metadata: {},
    created_at: '2024-11-15T10:00:00Z', updated_at: '2024-11-20T14:00:00Z',
    items: [
      { id: 'i1', order_id: 'ORD-2024-001', product_id: null, variant_id: null, product_name: 'Harmonie Abstraite No.3', product_image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&q=60', quantity: 1, unit_price: 1890, total_price: 1890 },
      { id: 'i2', order_id: 'ORD-2024-001', product_id: null, variant_id: null, product_name: 'Forêt Tropicale Panoramique', product_image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=200&q=60', quantity: 1, unit_price: 2100, total_price: 2100 },
    ],
  },
  {
    id: 'ORD-2024-002', user_id: '', status: 'shipped',
    total_amount: 1180, subtotal: 980, shipping_amount: 150, tax_amount: 50, discount_amount: 0,
    currency: 'MAD', shipping_address: null, billing_address: null, notes: null, metadata: {},
    created_at: '2024-12-01T09:30:00Z', updated_at: '2024-12-03T11:00:00Z',
    items: [
      { id: 'i3', order_id: 'ORD-2024-002', product_id: null, variant_id: null, product_name: 'Géométrie Dorée', product_image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=200&q=60', quantity: 1, unit_price: 980, total_price: 980 },
    ],
  },
];

const DEMO_WISHLIST = [
  { id: 'w1', name: 'Portrait Minimaliste', slug: 'portrait-minimaliste', price: 1450, img: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=400&q=80' },
  { id: 'w2', name: 'Botanique Exotique', slug: 'botanique-exotique', price: 2100, img: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400&q=80' },
  { id: 'w3', name: 'Marbre Blanc Veiné', slug: 'marbre-blanc', price: 3200, img: 'https://images.unsplash.com/photo-1615873968403-89e068629265?w=400&q=80' },
];

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<Tab>('orders');
  const [orders, setOrders] = useState<Order[]>(DEMO_ORDERS);
  const [wishlist, setWishlist] = useState(DEMO_WISHLIST);
  const { profile, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    toast.success('Déconnexion réussie');
    router.push('/');
  };

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const tabs = [
    { id: 'orders' as Tab, label: 'Mes commandes', icon: ShoppingBag },
    { id: 'wishlist' as Tab, label: 'Favoris', icon: Heart },
    { id: 'settings' as Tab, label: 'Mon profil', icon: Settings },
  ];

  return (
    <Page>
      <Container>
        <Sidebar>
          <ProfileHeader>
            <Avatar>{initials}</Avatar>
            <ProfileName>
              <p>{profile?.full_name || 'Mon Compte'}</p>
              <p>{profile?.email || ''}</p>
            </ProfileName>
          </ProfileHeader>

          {tabs.map((t) => (
            <NavItem key={t.id} $active={activeTab === t.id} onClick={() => setActiveTab(t.id)}>
              <t.icon size={18} />
              {t.label}
            </NavItem>
          ))}

          <LogoutBtn onClick={handleSignOut}>
            <LogOut size={18} />
            Déconnexion
          </LogoutBtn>
        </Sidebar>

        <Content>
          <AnimatePresence mode="wait">
            <ContentCard
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'orders' && (
                <>
                  <CardTitle>Mes <em>Commandes</em></CardTitle>
                  {orders.length === 0 ? (
                    <EmptyState>
                      <Package size={48} />
                      <h3>Aucune commande</h3>
                      <p>Vous n&apos;avez pas encore passé de commande</p>
                      <ShopBtn href="/products">Découvrir la boutique</ShopBtn>
                    </EmptyState>
                  ) : (
                    orders.map((order) => (
                      <OrderCard key={order.id}>
                        <OrderHeader>
                          <div>
                            <OrderId>#{order.id}</OrderId>
                            <OrderDate>
                              {new Date(order.created_at).toLocaleDateString('fr-FR', {
                                day: 'numeric', month: 'long', year: 'numeric'
                              })}
                            </OrderDate>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <StatusBadge $status={order.status}>
                              {statusLabels[order.status]}
                            </StatusBadge>
                            <OrderTotal>{order.total_amount.toFixed(2)} MAD</OrderTotal>
                          </div>
                        </OrderHeader>
                        <OrderItems>
                          {order.items?.map((item) => (
                            <OrderThumb key={item.id}>
                              {item.product_image && (
                                <Image src={item.product_image} alt={item.product_name} fill style={{ objectFit: 'cover' }} />
                              )}
                            </OrderThumb>
                          ))}
                        </OrderItems>
                        <p style={{ fontSize: 13, color: 'var(--mid-gray)', marginTop: 12 }}>
                          {order.items?.map((i) => i.product_name).join(', ')}
                        </p>
                      </OrderCard>
                    ))
                  )}
                </>
              )}

              {activeTab === 'wishlist' && (
                <>
                  <CardTitle>Mes <em>Favoris</em></CardTitle>
                  {wishlist.length === 0 ? (
                    <EmptyState>
                      <Heart size={48} />
                      <h3>Aucun favori</h3>
                      <p>Ajoutez des œuvres à vos favoris</p>
                      <ShopBtn href="/products">Explorer la boutique</ShopBtn>
                    </EmptyState>
                  ) : (
                    <WishGrid>
                      {wishlist.map((item) => (
                        <WishCard key={item.id}>
                          <WishImage>
                            <Link href={`/products/${item.slug}`}>
                              <Image src={item.img} alt={item.name} fill style={{ objectFit: 'cover' }} />
                            </Link>
                            <RemoveWish onClick={() => setWishlist((w) => w.filter((i) => i.id !== item.id))}>
                              ×
                            </RemoveWish>
                          </WishImage>
                          <Link href={`/products/${item.slug}`}>
                            <p style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 4 }}>{item.name}</p>
                            <p style={{ fontSize: 14, fontWeight: 500 }}>{item.price.toFixed(2)} MAD</p>
                          </Link>
                        </WishCard>
                      ))}
                    </WishGrid>
                  )}
                </>
              )}

              {activeTab === 'settings' && (
                <>
                  <CardTitle>Mon <em>Profil</em></CardTitle>
                  <FormGrid>
                    <FormGroup>
                      <Label>Prénom</Label>
                      <Input defaultValue={profile?.full_name?.split(' ')[0] || ''} />
                    </FormGroup>
                    <FormGroup>
                      <Label>Nom</Label>
                      <Input defaultValue={profile?.full_name?.split(' ').slice(1).join(' ') || ''} />
                    </FormGroup>
                    <FormGroup style={{ gridColumn: '1/-1' }}>
                      <Label>Email</Label>
                      <Input type="email" defaultValue={profile?.email || ''} disabled style={{ opacity: 0.6 }} />
                    </FormGroup>
                    <FormGroup>
                      <Label>Téléphone</Label>
                      <Input type="tel" placeholder="+212 6XX XXX XXX" />
                    </FormGroup>
                    <FormGroup>
                      <Label>Date de naissance</Label>
                      <Input type="date" />
                    </FormGroup>
                  </FormGrid>

                  <div style={{ marginTop: 32, paddingTop: 32, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 400, marginBottom: 20 }}>
                      Changer le mot de passe
                    </h3>
                    <FormGrid>
                      <FormGroup style={{ gridColumn: '1/-1' }}>
                        <Label>Mot de passe actuel</Label>
                        <Input type="password" placeholder="••••••••" />
                      </FormGroup>
                      <FormGroup>
                        <Label>Nouveau mot de passe</Label>
                        <Input type="password" placeholder="••••••••" />
                      </FormGroup>
                      <FormGroup>
                        <Label>Confirmer</Label>
                        <Input type="password" placeholder="••••••••" />
                      </FormGroup>
                    </FormGrid>
                  </div>

                  <SaveBtn onClick={() => toast.success('Profil mis à jour !')}>
                    Sauvegarder
                  </SaveBtn>
                </>
              )}
            </ContentCard>
          </AnimatePresence>
        </Content>
      </Container>
    </Page>
  );
}
