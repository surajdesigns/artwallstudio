'use client';

import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check, ChevronRight, Lock, Truck, CreditCard, Package } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import toast from 'react-hot-toast';

const Page = styled.div`
  padding-top: var(--nav-height);
  min-height: 100vh;
  background: var(--cream);
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr 420px;
  min-height: calc(100vh - var(--nav-height));
  @media (max-width: 1024px) { grid-template-columns: 1fr; }
`;

const Left = styled.div`
  padding: 60px 60px 60px 40px;
  border-right: 1px solid rgba(0,0,0,0.07);
  @media (max-width: 1024px) { border-right: none; border-bottom: 1px solid rgba(0,0,0,0.07); }
  @media (max-width: 768px) { padding: 40px 20px; }
`;

const Right = styled.div`
  background: var(--off-white);
  padding: 60px 40px;
  @media (max-width: 768px) { padding: 40px 20px; }
`;

const BrandLink = styled(Link)`
  font-family: var(--font-display); font-size: 20px; font-weight: 500;
  color: var(--black); letter-spacing: 0.08em; text-transform: uppercase;
  display: block; margin-bottom: 40px;
  span { color: var(--gold); }
`;

const StepBar = styled.div`
  display: flex; align-items: center; margin-bottom: 48px; overflow-x: auto;
`;

const StepItem = styled.div<{ status: string }>`
  display: flex; align-items: center; gap: 10px; flex-shrink: 0;
`;

const Dot = styled.div<{ status: string }>`
  width: 28px; height: 28px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 600;
  background: ${({ status }) => status === 'done' ? 'var(--success)' : status === 'active' ? 'var(--black)' : 'transparent'};
  color: ${({ status }) => status === 'pending' ? 'var(--light-gray)' : 'var(--white)'};
  border: 2px solid ${({ status }) => status === 'done' ? 'var(--success)' : status === 'active' ? 'var(--black)' : 'rgba(0,0,0,0.15)'};
`;

const StepLbl = styled.span<{ status: string }>`
  font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase;
  color: ${({ status }) => status === 'active' ? 'var(--black)' : status === 'done' ? 'var(--success)' : 'var(--light-gray)'};
  font-weight: ${({ status }) => status === 'active' ? 500 : 400};
`;

const Line = styled.div<{ done: boolean }>`
  width: 48px; height: 1px;
  background: ${({ done }) => done ? 'var(--success)' : 'rgba(0,0,0,0.12)'};
  margin: 0 12px; flex-shrink: 0;
`;

const SectionH = styled.h2`
  font-family: var(--font-display); font-size: 24px; font-weight: 400; margin-bottom: 8px;
`;

const SectionP = styled.p`
  font-size: 13px; color: var(--mid-gray); margin-bottom: 28px;
`;

const Grid2 = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
  @media (max-width: 480px) { grid-template-columns: 1fr; }
`;

const Full = styled.div` grid-column: 1/-1; `;

const FG = styled.div` display: flex; flex-direction: column; gap: 6px; `;

const Lbl = styled.label`
  font-size: 12px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; color: var(--charcoal);
`;

const Inp = styled.input`
  padding: 13px 16px; border: 1px solid rgba(0,0,0,0.12); border-radius: var(--radius-sm);
  font-size: 15px; font-family: var(--font-body); background: var(--white); color: var(--black);
  outline: none; transition: border-color 0.2s, box-shadow 0.2s;
  &:focus { border-color: var(--gold); box-shadow: 0 0 0 3px rgba(201,168,76,0.1); }
  &::placeholder { color: var(--light-gray); }
`;

const Sel = styled.select`
  padding: 13px 16px; border: 1px solid rgba(0,0,0,0.12); border-radius: var(--radius-sm);
  font-size: 15px; font-family: var(--font-body); background: var(--white); color: var(--black);
  outline: none; cursor: pointer; appearance: none;
  &:focus { border-color: var(--gold); outline: none; }
`;

const ShipOpt = styled.div<{ $sel: boolean }>`
  display: flex; align-items: center; gap: 16px; padding: 16px 18px;
  border: 1px solid ${({ $sel }) => ($sel ? 'var(--black)' : 'rgba(0,0,0,0.12)')};
  border-radius: var(--radius-sm); cursor: pointer; margin-bottom: 10px;
  background: ${({ $sel }) => ($sel ? 'rgba(0,0,0,0.02)' : 'var(--white)')};
  transition: all 0.2s; &:hover { border-color: var(--black); }
`;

const Radio = styled.div<{ $sel: boolean }>`
  width: 18px; height: 18px; border-radius: 50%; flex-shrink: 0;
  border: 2px solid ${({ $sel }) => ($sel ? 'var(--black)' : 'rgba(0,0,0,0.2)')};
  display: flex; align-items: center; justify-content: center;
  &::after { content: ''; width: 8px; height: 8px; border-radius: 50%; background: var(--black); display: ${({ $sel }) => ($sel ? 'block' : 'none')}; }
`;

const PayOpt = styled.div<{ $sel: boolean }>`
  display: flex; align-items: center; gap: 14px; padding: 14px 16px;
  border: 1px solid ${({ $sel }) => ($sel ? 'var(--gold)' : 'rgba(0,0,0,0.1)')};
  border-radius: var(--radius-sm); cursor: pointer; margin-bottom: 10px;
  background: ${({ $sel }) => ($sel ? 'rgba(201,168,76,0.04)' : 'var(--white)')};
  transition: all 0.2s; &:hover { border-color: var(--gold); }
`;

const NavRow = styled.div`
  display: flex; gap: 12px; margin-top: 32px;
`;

const BackBtn = styled.button`
  padding: 15px 24px; border: 1px solid rgba(0,0,0,0.15); border-radius: 2px;
  font-size: 13px; color: var(--charcoal); letter-spacing: 0.08em; text-transform: uppercase;
  transition: all 0.2s; &:hover { border-color: var(--black); }
`;

const NextBtn = styled(motion.button)`
  flex: 1; padding: 16px; background: var(--black); color: var(--off-white);
  border-radius: 2px; font-size: 13px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  transition: background 0.25s; &:hover { background: var(--gold-dark); }
`;

const SumTitle = styled.h3`
  font-family: var(--font-display); font-size: 20px; font-weight: 400;
  margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid rgba(0,0,0,0.08);
`;

const SumItem = styled.div`
  display: flex; gap: 14px; margin-bottom: 16px;
`;

const SumThumb = styled.div`
  width: 64px; height: 64px; border-radius: var(--radius-sm); overflow: hidden;
  background: var(--cream); position: relative; flex-shrink: 0;
`;

const SumRow = styled.div`
  display: flex; justify-content: space-between; margin-bottom: 10px;
  font-size: 14px; color: var(--charcoal);
  &.total { font-size: 18px; font-weight: 600; color: var(--black); }
`;

const Hr = styled.div`
  height: 1px; background: rgba(0,0,0,0.08); margin: 20px 0;
`;

const SuccWrap = styled(motion.div)`
  min-height: calc(100vh - var(--nav-height));
  display: flex; align-items: center; justify-content: center; padding: 40px 20px;
  background: var(--cream);
`;

const SuccCard = styled.div`
  max-width: 520px; width: 100%; text-align: center;
  padding: 60px 40px; background: var(--white);
  border-radius: var(--radius-sm); box-shadow: var(--shadow-lg);
`;

const SHIPPING_OPTS = [
  { id: 'standard', label: 'Livraison Standard', desc: '5-7 jours ouvres', price: 150 },
  { id: 'express', label: 'Livraison Express', desc: '2-3 jours ouvres', price: 290 },
  { id: 'premium', label: 'Livraison Premium', desc: 'Le lendemain', price: 490 },
];

const PAY_OPTS = [
  { id: 'card', label: 'Carte Bancaire', desc: 'Visa, Mastercard, Amex' },
  { id: 'transfer', label: 'Virement Bancaire', desc: 'Delai 2-3 jours' },
  { id: 'cod', label: 'Paiement a la Livraison', desc: 'Maroc uniquement' },
];

type Step = 'info' | 'shipping' | 'payment';

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCartStore();
  const sub = subtotal();
  const [step, setStep] = useState<Step>('info');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shipping, setShipping] = useState('standard');
  const [payment, setPayment] = useState('card');
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', address: '', city: '', zip: '', country: 'MA' });

  const selShip = SHIPPING_OPTS.find((o) => o.id === shipping)!;
  const demoItems = items.length > 0 ? items : [
    { id: 'd1', productId: 'd1', name: 'Harmonie Abstraite No.3', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&q=60', price: 1890, quantity: 1 },
    { id: 'd2', productId: 'd2', name: 'Geometrie Doree', image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=200&q=60', price: 980, quantity: 1 },
  ];
  const displaySub = items.length > 0 ? sub : 2870;
  const displayTotal = displaySub + selShip.price + displaySub * 0.2;

  const stepStat = (s: Step) => {
    const o = ['info', 'shipping', 'payment'];
    const cur = o.indexOf(step), tar = o.indexOf(s);
    return tar < cur ? 'done' : tar === cur ? 'active' : 'pending';
  };

  const handleNext = async () => {
    if (step === 'info') {
      if (!form.firstName || !form.email || !form.address) { toast.error('Remplissez tous les champs obligatoires'); return; }
      setStep('shipping');
    } else if (step === 'shipping') {
      setStep('payment');
    } else {
      setLoading(true);
      await new Promise(r => setTimeout(r, 2000));
      setLoading(false);
      setSuccess(true);
      clearCart();
    }
  };

  if (success) return (
    <Page>
      <SuccWrap initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <SuccCard>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(76,170,112,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px', color: 'var(--success)' }}>
            <Check size={36} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 400, marginBottom: 12 }}>Commande Confirmee !</h2>
          <p style={{ color: 'var(--mid-gray)', marginBottom: 8 }}>Merci pour votre confiance. Vous recevrez un email de confirmation.</p>
          <p style={{ fontSize: 13, color: 'var(--mid-gray)', marginBottom: 36 }}>Commande n AWS-{Date.now().toString().slice(-6)}</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/account" style={{ padding: '14px 28px', background: 'var(--black)', color: 'var(--off-white)', borderRadius: 2, fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Mes Commandes</Link>
            <Link href="/products" style={{ padding: '14px 28px', border: '1px solid rgba(0,0,0,0.15)', color: 'var(--charcoal)', borderRadius: 2, fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Continuer</Link>
          </div>
        </SuccCard>
      </SuccWrap>
    </Page>
  );

  return (
    <Page>
      <Layout>
        <Left>
          <BrandLink href="/">Art<span>Wall</span> Studio</BrandLink>

          <StepBar>
            {(['info', 'shipping', 'payment'] as Step[]).map((s, i, arr) => (
              <StepItem key={s} status={stepStat(s)}>
                <Dot status={stepStat(s)}>{stepStat(s) === 'done' ? <Check size={13} /> : i + 1}</Dot>
                <StepLbl status={stepStat(s)}>{s === 'info' ? 'Coordonnees' : s === 'shipping' ? 'Livraison' : 'Paiement'}</StepLbl>
                {i < arr.length - 1 && <Line done={stepStat(s) === 'done'} />}
              </StepItem>
            ))}
          </StepBar>

          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              {step === 'info' && (
                <>
                  <SectionH>Informations de contact</SectionH>
                  <SectionP>Nous vous enverrons la confirmation a cette adresse</SectionP>
                  <Grid2>
                    <FG><Lbl>Prenom *</Lbl><Inp placeholder="Mohammed" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} /></FG>
                    <FG><Lbl>Nom *</Lbl><Inp placeholder="Alami" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} /></FG>
                    <Full><FG><Lbl>Email *</Lbl><Inp type="email" placeholder="votre@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></FG></Full>
                    <Full><FG><Lbl>Telephone</Lbl><Inp placeholder="+212 6XX XXX XXX" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></FG></Full>
                    <Full><FG><Lbl>Adresse *</Lbl><Inp placeholder="123 Rue Mohammed V" value={form.address} onChange={e => setForm({...form, address: e.target.value})} /></FG></Full>
                    <FG><Lbl>Ville</Lbl><Inp placeholder="Casablanca" value={form.city} onChange={e => setForm({...form, city: e.target.value})} /></FG>
                    <FG><Lbl>Code postal</Lbl><Inp placeholder="20000" value={form.zip} onChange={e => setForm({...form, zip: e.target.value})} /></FG>
                    <Full><FG><Lbl>Pays</Lbl>
                      <Sel value={form.country} onChange={e => setForm({...form, country: e.target.value})}>
                        <option value="MA">Maroc</option><option value="FR">France</option>
                        <option value="BE">Belgique</option><option value="CH">Suisse</option>
                        <option value="DZ">Algerie</option><option value="TN">Tunisie</option>
                      </Sel>
                    </FG></Full>
                  </Grid2>
                </>
              )}

              {step === 'shipping' && (
                <>
                  <SectionH>Mode de livraison</SectionH>
                  <SectionP>Choisissez la methode adaptee a vos besoins</SectionP>
                  {SHIPPING_OPTS.map(opt => (
                    <ShipOpt key={opt.id} $sel={shipping === opt.id} onClick={() => setShipping(opt.id)}>
                      <Radio $sel={shipping === opt.id} />
                      <Truck size={18} style={{ color: 'var(--mid-gray)', flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 14, fontWeight: 500 }}>{opt.label}</p>
                        <p style={{ fontSize: 12, color: 'var(--mid-gray)', marginTop: 3 }}>{opt.desc}</p>
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 500 }}>{opt.price} MAD</span>
                    </ShipOpt>
                  ))}
                  <div style={{ marginTop: 20, padding: 14, background: 'rgba(201,168,76,0.06)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(201,168,76,0.2)', fontSize: 13, color: 'var(--gold-dark)' }}>
                    Livraison gratuite pour toute commande superieure a 2 000 MAD
                  </div>
                </>
              )}

              {step === 'payment' && (
                <>
                  <SectionH>Mode de paiement</SectionH>
                  <SectionP>Toutes les transactions sont chiffrees et securisees</SectionP>
                  {PAY_OPTS.map(opt => (
                    <PayOpt key={opt.id} $sel={payment === opt.id} onClick={() => setPayment(opt.id)}>
                      <Radio $sel={payment === opt.id} />
                      <CreditCard size={18} style={{ color: 'var(--mid-gray)', flexShrink: 0 }} />
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 500 }}>{opt.label}</p>
                        <p style={{ fontSize: 12, color: 'var(--mid-gray)', marginTop: 3 }}>{opt.desc}</p>
                      </div>
                    </PayOpt>
                  ))}
                  {payment === 'card' && (
                    <Grid2 style={{ marginTop: 16 }}>
                      <Full><FG><Lbl>Numero de carte</Lbl><Inp placeholder="1234 5678 9012 3456" /></FG></Full>
                      <FG><Lbl>Expiration</Lbl><Inp placeholder="MM / AA" /></FG>
                      <FG><Lbl>CVV</Lbl><Inp placeholder="123" /></FG>
                      <Full><FG><Lbl>Nom sur la carte</Lbl><Inp placeholder="MOHAMMED ALAMI" /></FG></Full>
                    </Grid2>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>

          <NavRow>
            {step !== 'info' && <BackBtn onClick={() => setStep(step === 'payment' ? 'shipping' : 'info')}>Retour</BackBtn>}
            <NextBtn onClick={handleNext} disabled={loading} whileTap={{ scale: 0.99 }}>
              {loading ? 'Traitement...' : step === 'payment' ? 'Confirmer la commande' : step === 'shipping' ? 'Continuer vers le paiement' : 'Continuer vers la livraison'}
              {!loading && <ChevronRight size={16} />}
            </NextBtn>
          </NavRow>
        </Left>

        <Right>
          <SumTitle>Votre commande</SumTitle>
          {demoItems.map(item => (
            <SumItem key={item.id}>
              <SumThumb><Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} /></SumThumb>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, color: 'var(--black)', lineHeight: 1.3 }}>{item.name}</p>
                <p style={{ fontSize: 12, color: 'var(--mid-gray)', marginTop: 4 }}>Qte: {item.quantity}</p>
              </div>
              <span style={{ fontSize: 14, fontWeight: 500 }}>{(item.price * item.quantity).toFixed(2)} MAD</span>
            </SumItem>
          ))}
          <Hr />
          <SumRow><span>Sous-total</span><span>{displaySub.toFixed(2)} MAD</span></SumRow>
          <SumRow><span>Livraison</span><span>{selShip.price} MAD</span></SumRow>
          <SumRow><span>TVA (20%)</span><span>{(displaySub * 0.2).toFixed(2)} MAD</span></SumRow>
          <Hr />
          <SumRow className="total"><span>Total</span><span>{displayTotal.toFixed(2)} MAD</span></SumRow>
          {displaySub < 2000 && (
            <p style={{ fontSize: 12, color: 'var(--gold-dark)', textAlign: 'center', marginTop: 10 }}>
              Encore {(2000 - displaySub).toFixed(0)} MAD pour la livraison offerte
            </p>
          )}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 12, color: 'var(--mid-gray)', marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            <Lock size={12} /> Paiement 100% securise et chiffre SSL
          </div>
        </Right>
      </Layout>
    </Page>
  );
}
