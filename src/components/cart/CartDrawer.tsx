'use client';

import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/lib/store';

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(10, 10, 8, 0.6);
  backdrop-filter: blur(4px);
  z-index: 300;
`;

const Drawer = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 420px;
  max-width: 100vw;
  background: var(--off-white);
  z-index: 301;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-xl);
`;

const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28px 32px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);

  h2 {
    font-family: var(--font-display);
    font-size: 22px;
    font-weight: 500;
  }
`;

const CloseBtn = styled.button`
  color: var(--mid-gray);
  transition: color 0.2s;
  display: flex;
  align-items: center;

  &:hover {
    color: var(--black);
  }
`;

const CartItems = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px 32px;

  &::-webkit-scrollbar {
    width: 4px;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 16px;
  color: var(--mid-gray);

  svg {
    opacity: 0.3;
  }

  p {
    font-size: 15px;
  }
`;

const CartItemRow = styled.div`
  display: flex;
  gap: 16px;
  padding: 20px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);

  &:last-child {
    border-bottom: none;
  }
`;

const ItemImage = styled.div`
  width: 80px;
  height: 80px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  flex-shrink: 0;
  background: var(--cream);
  position: relative;
`;

const ItemInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ItemName = styled.p`
  font-size: 14px;
  font-weight: 400;
  color: var(--black);
  line-height: 1.3;
`;

const ItemVariant = styled.p`
  font-size: 12px;
  color: var(--mid-gray);
`;

const ItemPrice = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: var(--black);
  margin-top: auto;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
`;

const QtyBtn = styled.button`
  width: 24px;
  height: 24px;
  border: 1px solid var(--light-gray);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--mid-gray);
  transition: all 0.2s;

  &:hover {
    border-color: var(--black);
    color: var(--black);
  }
`;

const QtyValue = styled.span`
  font-size: 14px;
  min-width: 20px;
  text-align: center;
`;

const DeleteBtn = styled.button`
  color: var(--light-gray);
  display: flex;
  align-items: flex-start;
  transition: color 0.2s;

  &:hover {
    color: var(--error);
  }
`;

const DrawerFooter = styled.div`
  padding: 24px 32px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  background: var(--cream);
`;

const Subtotal = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;

  span:first-child {
    font-size: 13px;
    color: var(--mid-gray);
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  span:last-child {
    font-family: var(--font-display);
    font-size: 20px;
    font-weight: 500;
  }
`;

const ShippingNote = styled.p`
  font-size: 12px;
  color: var(--mid-gray);
  margin-bottom: 20px;
`;

const CheckoutBtn = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 16px;
  background: var(--black);
  color: var(--off-white);
  font-size: 13px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border-radius: var(--radius-sm);
  transition: background 0.2s;
  margin-bottom: 12px;

  &:hover {
    background: var(--gold-dark);
  }
`;

const ContinueBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 14px;
  color: var(--mid-gray);
  font-size: 13px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  transition: color 0.2s;

  &:hover {
    color: var(--black);
  }
`;

export default function CartDrawer() {
  const { isOpen, closeCart, items, removeItem, updateQuantity, subtotal } = useCartStore();
  const sub = subtotal();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <Drawer
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <DrawerHeader>
              <h2>Mon Panier</h2>
              <CloseBtn onClick={closeCart}>
                <X size={20} />
              </CloseBtn>
            </DrawerHeader>

            <CartItems>
              {items.length === 0 ? (
                <EmptyState>
                  <ShoppingBag size={48} />
                  <p>Votre panier est vide</p>
                </EmptyState>
              ) : (
                items.map((item) => (
                  <CartItemRow key={item.id}>
                    <ItemImage>
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </ItemImage>
                    <ItemInfo>
                      <ItemName>{item.name}</ItemName>
                      {item.variant && (
                        <ItemVariant>
                          {item.variant.name}: {item.variant.value}
                        </ItemVariant>
                      )}
                      <QuantityControl>
                        <QtyBtn onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                          <Minus size={10} />
                        </QtyBtn>
                        <QtyValue>{item.quantity}</QtyValue>
                        <QtyBtn onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          <Plus size={10} />
                        </QtyBtn>
                      </QuantityControl>
                      <ItemPrice>{(item.price * item.quantity).toFixed(2)} MAD</ItemPrice>
                    </ItemInfo>
                    <DeleteBtn onClick={() => removeItem(item.id)}>
                      <Trash2 size={16} />
                    </DeleteBtn>
                  </CartItemRow>
                ))
              )}
            </CartItems>

            {items.length > 0 && (
              <DrawerFooter>
                <Subtotal>
                  <span>Sous-total</span>
                  <span>{sub.toFixed(2)} MAD</span>
                </Subtotal>
                <ShippingNote>Livraison calculée à la commande</ShippingNote>
                <CheckoutBtn href="/checkout" onClick={closeCart}>
                  Commander maintenant
                </CheckoutBtn>
                <ContinueBtn onClick={closeCart}>Continuer mes achats</ContinueBtn>
              </DrawerFooter>
            )}
          </Drawer>
        </>
      )}
    </AnimatePresence>
  );
}
