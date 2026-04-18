'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styled, { css } from 'styled-components';
import { ShoppingBag, Heart, Search, Menu, X, User, ChevronDown } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import SearchPalette from '@/components/ui/SearchPalette';

const Nav = styled.nav<{ $scrolled: boolean }>`
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  height: var(--nav-height);
  display: flex;
  align-items: center;
  padding: 0 40px;
  transition: all 0.4s var(--ease-out);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  ${({ $scrolled }) =>
    $scrolled
      ? css`
          background: rgba(10, 10, 8, 0.85); 
          box-shadow: 0 1px 0 rgba(201, 168, 76, 0.15);
        `
      : css`
          background: rgba(10, 10, 8, 0.4);
          box-shadow: none;
        `}
  @media (max-width: 768px) { padding: 0 20px; }
`;

const NavInner = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  width: 100%; max-width: 1400px; margin: 0 auto;
`;

const Logo = styled(Link)`
  font-family: var(--font-display); font-size: 22px; font-weight: 500;
  color: var(--off-white); letter-spacing: 0.08em; text-transform: uppercase;
  span { color: var(--gold); }
`;

const NavLinks = styled.div`
  display: flex; align-items: center; gap: 36px;
  @media (max-width: 1024px) { display: none; }
`;

const NavLink = styled(Link)`
  font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--light-gray); transition: color 0.2s; position: relative;
  &::after {
    content: ''; position: absolute; bottom: -4px; left: 0; right: 0;
    height: 1px; background: var(--gold); transform: scaleX(0);
    transition: transform 0.3s var(--ease-out); transform-origin: right;
  }
  &:hover { color: var(--off-white); &::after { transform: scaleX(1); transform-origin: left; } }
`;

const MegaWrap = styled.div`
  position: relative;
  &:hover > div { opacity: 1; pointer-events: all; transform: translateX(-50%) translateY(0); }
`;

const MegaTrigger = styled.button`
  font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--light-gray); display: flex; align-items: center; gap: 5px; transition: color 0.2s;
  &:hover { color: var(--off-white); }
`;

const MegaMenu = styled.div`
  position: absolute; top: calc(100% + 16px); left: 50%;
  transform: translateX(-50%) translateY(8px);
  background: var(--off-black); border: 1px solid rgba(201,168,76,0.15);
  border-radius: var(--radius-sm); padding: 20px;
  min-width: 300px; display: grid; grid-template-columns: 1fr 1fr; gap: 6px;
  opacity: 0; pointer-events: none; transition: all 0.25s var(--ease-out);
  box-shadow: var(--shadow-xl);
`;

const MegaItem = styled(Link)`
  padding: 9px 12px; border-radius: var(--radius-sm);
  color: var(--light-gray); font-size: 13px; transition: all 0.2s;
  &:hover { background: rgba(255,255,255,0.05); color: var(--off-white); }
`;

const Actions = styled.div`
  display: flex; align-items: center; gap: 2px;
`;

const IconBtn = styled.button`
  display: flex; align-items: center; justify-content: center;
  width: 40px; height: 40px; border-radius: 50%;
  color: var(--light-gray); transition: color 0.2s, background 0.2s; position: relative;
  &:hover { color: var(--off-white); background: rgba(255,255,255,0.06); }
`;

const Badge = styled.span`
  position: absolute; top: 4px; right: 4px;
  width: 16px; height: 16px; border-radius: 50%;
  background: var(--gold); color: var(--black);
  font-size: 9px; font-weight: 600;
  display: flex; align-items: center; justify-content: center;
`;

const SearchHint = styled.button`
  display: flex; align-items: center; gap: 8px;
  padding: 6px 12px; border: 1px solid rgba(255,255,255,0.1);
  border-radius: var(--radius-full); color: var(--mid-gray);
  font-size: 12px; cursor: pointer; transition: all 0.2s; margin-right: 6px;
  &:hover { border-color: rgba(201,168,76,0.4); color: var(--light-gray); }
  kbd { font-size: 10px; padding: 1px 5px; background: rgba(255,255,255,0.08); border-radius: 3px; }
  @media (max-width: 1024px) { display: none; }
`;

const MobileBtn = styled.button`
  display: none; color: var(--light-gray);
  width: 40px; height: 40px; align-items: center; justify-content: center;
  @media (max-width: 1024px) { display: flex; }
`;

const MobileMenu = styled(motion.div)`
  position: fixed; inset: 0; background: var(--off-black); z-index: 200;
  display: flex; flex-direction: column; overflow-y: auto;
`;

const MobileTop = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  padding: 24px; border-bottom: 1px solid rgba(255,255,255,0.06);
`;

const MobileLinks = styled.div`
  padding: 32px 24px; flex: 1;
`;

const MobileLink = styled(Link)`
  font-family: var(--font-display); font-size: 28px; font-weight: 300;
  font-style: italic; color: var(--off-white); display: block;
  margin-bottom: 20px; transition: color 0.2s;
  &:hover { color: var(--gold-light); }
`;

const MobileSub = styled(Link)`
  font-size: 13px; color: var(--mid-gray); display: block;
  padding: 7px 0 7px 14px; border-left: 1px solid rgba(255,255,255,0.08);
  margin-bottom: 3px; transition: all 0.2s;
  &:hover { color: var(--off-white); border-color: var(--gold); }
`;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { itemCount, toggleCart } = useCartStore();
  const count = itemCount();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(true); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const cats = [
    { slug: 'tableaux', label: "Tableaux d'Art" },
    { slug: 'papier-peint', label: 'Papiers Peints' },
    { slug: 'abstraits', label: 'Art Abstrait' },
    { slug: 'nature-botanique', label: 'Nature & Botanique' },
    { slug: 'geometrique', label: 'Géométrique' },
    { slug: 'portrait', label: 'Portraits' },
  ];

  return (
    <>
      <Nav $scrolled={scrolled}>
        <NavInner>
          <Logo href="/">Art<span>Wall</span> Studio</Logo>

          <NavLinks>
            <NavLink href="/">Accueil</NavLink>
            <MegaWrap>
              <MegaTrigger>Collections <ChevronDown size={11} /></MegaTrigger>
              <MegaMenu>
                {cats.map((c) => <MegaItem key={c.slug} href={`/products?category=${c.slug}`}>{c.label}</MegaItem>)}
              </MegaMenu>
            </MegaWrap>
            <NavLink href="/products?featured=true">Nouveautés</NavLink>
            <NavLink href="/products?sale=true">Promotions</NavLink>
          </NavLinks>

          <Actions>
            <SearchHint onClick={() => setSearchOpen(true)}>
              <Search size={13} /> Rechercher <kbd>⌘K</kbd>
            </SearchHint>
            <IconBtn onClick={() => setSearchOpen(true)} aria-label="Search"><Search size={19} /></IconBtn>
            <IconBtn as={Link} href="/wishlist" aria-label="Wishlist"><Heart size={19} /></IconBtn>
            <IconBtn as={Link} href="/account" aria-label="Account"><User size={19} /></IconBtn>
            <IconBtn onClick={toggleCart} aria-label="Cart">
              <ShoppingBag size={19} />
              {count > 0 && <Badge>{count}</Badge>}
            </IconBtn>
            <MobileBtn onClick={() => setMobileOpen(true)}><Menu size={22} /></MobileBtn>
          </Actions>
        </NavInner>
      </Nav>

      <AnimatePresence>
        {mobileOpen && (
          <MobileMenu
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.22,1,0.36,1] }}
          >
            <MobileTop>
              <Logo href="/" onClick={() => setMobileOpen(false)}>Art<span>Wall</span> Studio</Logo>
              <IconBtn onClick={() => setMobileOpen(false)}><X size={22} color="var(--light-gray)" /></IconBtn>
            </MobileTop>
            <MobileLinks>
              {[{ href: '/', label: 'Accueil' }, { href: '/products', label: 'Tous les Produits' }].map((item, i) => (
                <motion.div key={item.href} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                  <MobileLink href={item.href} onClick={() => setMobileOpen(false)}>{item.label}</MobileLink>
                </motion.div>
              ))}
              <div style={{ marginTop: 8, marginBottom: 24 }}>
                {cats.map((c) => <MobileSub key={c.slug} href={`/products?category=${c.slug}`} onClick={() => setMobileOpen(false)}>{c.label}</MobileSub>)}
              </div>
              <MobileLink href="/account" onClick={() => setMobileOpen(false)}>Mon Compte</MobileLink>
              <MobileLink href="/wishlist" onClick={() => setMobileOpen(false)}>Favoris</MobileLink>
            </MobileLinks>
          </MobileMenu>
        )}
      </AnimatePresence>

      <SearchPalette isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
