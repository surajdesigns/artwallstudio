'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { Instagram, Facebook, Mail, MapPin, Phone } from 'lucide-react';

const FooterWrap = styled.footer`
  background: var(--off-black);
  padding: 80px 40px 40px;

  @media (max-width: 768px) { padding: 60px 20px 32px; }
`;

const FooterGrid = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 60px;
  padding-bottom: 60px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  margin-bottom: 40px;

  @media (max-width: 1024px) { grid-template-columns: 1fr 1fr; gap: 40px; }
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`;

const Brand = styled.div``;

const Logo = styled(Link)`
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 500;
  color: var(--off-white);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  display: block;
  margin-bottom: 20px;
  span { color: var(--gold); }
`;

const TagLine = styled.p`
  font-size: 14px;
  line-height: 1.8;
  color: var(--mid-gray);
  max-width: 280px;
  margin-bottom: 28px;
`;

const SocialRow = styled.div`
  display: flex;
  gap: 14px;
`;

const SocialBtn = styled.a`
  width: 38px; height: 38px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.1);
  display: flex; align-items: center; justify-content: center;
  color: var(--mid-gray);
  transition: all 0.2s;

  &:hover {
    border-color: var(--gold);
    color: var(--gold);
  }
`;

const FooterCol = styled.div``;

const ColTitle = styled.h3`
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--off-white);
  margin-bottom: 20px;
`;

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FooterLink = styled(Link)`
  font-size: 14px;
  color: var(--mid-gray);
  transition: color 0.2s;

  &:hover { color: var(--gold-light); }
`;

const ContactItem = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-start;
  margin-bottom: 14px;
  color: var(--mid-gray);
  font-size: 14px;

  svg { flex-shrink: 0; margin-top: 2px; color: var(--gold); }
`;

const BottomRow = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
`;

const Copyright = styled.p`
  font-size: 12px;
  color: var(--mid-gray);
`;

const LegalLinks = styled.div`
  display: flex;
  gap: 24px;
`;

const LegalLink = styled(Link)`
  font-size: 12px;
  color: var(--mid-gray);
  transition: color 0.2s;

  &:hover { color: var(--light-gray); }
`;

export default function Footer() {
  return (
    <FooterWrap>
      <FooterGrid>
        <Brand>
          <Logo href="/">Art<span>Wall</span> Studio</Logo>
          <TagLine>
            Votre destination pour des tableaux d&apos;art et des papiers peints 
            d&apos;exception qui transforment vos espaces.
          </TagLine>
          <SocialRow>
            <SocialBtn href="#" target="_blank"><Instagram size={16} /></SocialBtn>
            <SocialBtn href="#" target="_blank"><Facebook size={16} /></SocialBtn>
          </SocialRow>
        </Brand>

        <FooterCol>
          <ColTitle>Collections</ColTitle>
          <FooterLinks>
            <FooterLink href="/products?category=tableaux">Tableaux</FooterLink>
            <FooterLink href="/products?category=papier-peint">Papiers Peints</FooterLink>
            <FooterLink href="/products?category=abstraits">Art Abstrait</FooterLink>
            <FooterLink href="/products?category=nature-botanique">Botanique</FooterLink>
            <FooterLink href="/products?category=geometrique">Géométrique</FooterLink>
            <FooterLink href="/products?featured=true">Nouveautés</FooterLink>
          </FooterLinks>
        </FooterCol>

        <FooterCol>
          <ColTitle>Information</ColTitle>
          <FooterLinks>
            <FooterLink href="/about">À propos</FooterLink>
            <FooterLink href="/artists">Nos Artistes</FooterLink>
            <FooterLink href="/shipping">Livraison</FooterLink>
            <FooterLink href="/returns">Retours</FooterLink>
            <FooterLink href="/faq">FAQ</FooterLink>
            <FooterLink href="/contact">Contact</FooterLink>
          </FooterLinks>
        </FooterCol>

        <FooterCol>
          <ColTitle>Contact</ColTitle>
          <ContactItem>
            <MapPin size={16} />
            <span>Boulevard Mohammed V, Casablanca 20000, Maroc</span>
          </ContactItem>
          <ContactItem>
            <Mail size={16} />
            <span>contact@artwallstudio.ma</span>
          </ContactItem>
          <ContactItem>
            <Phone size={16} />
            <span>+212 522 XX XX XX</span>
          </ContactItem>
        </FooterCol>
      </FooterGrid>

      <BottomRow>
        <Copyright>
          © {new Date().getFullYear()} ArtWall Studio. Tous droits réservés.
        </Copyright>
        <LegalLinks>
          <LegalLink href="/privacy">Confidentialité</LegalLink>
          <LegalLink href="/terms">CGV</LegalLink>
          <LegalLink href="/cookies">Cookies</LegalLink>
        </LegalLinks>
      </BottomRow>
    </FooterWrap>
  );
}
