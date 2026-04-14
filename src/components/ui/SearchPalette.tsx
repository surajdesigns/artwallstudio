'use client';

import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ArrowRight, X, Clock, TrendingUp } from 'lucide-react';
import { searchProducts } from '@/lib/api';
import type { Product } from '@/types';
import { useRouter } from 'next/navigation';

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(10,10,8,0.7);
  backdrop-filter: blur(8px);
  z-index: 400;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 80px;
`;

const Palette = styled(motion.div)`
  width: 100%;
  max-width: 640px;
  background: var(--white);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-xl);
  overflow: hidden;
  max-height: 70vh;
  display: flex;
  flex-direction: column;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(0,0,0,0.08);
`;

const SearchIcon = styled.div`
  color: var(--mid-gray);
  flex-shrink: 0;
`;

const Input = styled.input`
  flex: 1;
  font-size: 16px;
  font-family: var(--font-body);
  color: var(--black);
  background: transparent;
  border: none;
  outline: none;

  &::placeholder { color: var(--light-gray); }
`;

const ClearBtn = styled.button`
  color: var(--mid-gray);
  display: flex;
  align-items: center;
  transition: color 0.2s;
  &:hover { color: var(--black); }
`;

const ResultsArea = styled.div`
  overflow-y: auto;
  flex: 1;
`;

const Section = styled.div`
  padding: 12px 0;
`;

const SectionLabel = styled.p`
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--light-gray);
  padding: 6px 20px;
`;

const ResultItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 20px;
  transition: background 0.15s;
  cursor: pointer;

  &:hover, &:focus { background: rgba(201,168,76,0.06); outline: none; }
`;

const ResultThumb = styled.div`
  width: 44px; height: 44px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  flex-shrink: 0;
  background: var(--cream);
  position: relative;
`;

const ResultInfo = styled.div`
  flex: 1;
  p:first-child { font-size: 14px; color: var(--black); font-weight: 400; }
  p:last-child { font-size: 12px; color: var(--mid-gray); margin-top: 2px; }
`;

const ResultPrice = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: var(--black);
  white-space: nowrap;
`;

const QuickLinkItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  font-size: 14px;
  color: var(--charcoal);
  transition: background 0.15s;

  &:hover { background: rgba(0,0,0,0.03); }
  svg { color: var(--mid-gray); }
`;

const Footer = styled.div`
  padding: 10px 20px;
  border-top: 1px solid rgba(0,0,0,0.06);
  display: flex;
  gap: 16px;
`;

const Shortcut = styled.span`
  font-size: 11px;
  color: var(--mid-gray);
  display: flex;
  align-items: center;
  gap: 6px;

  kbd {
    padding: 2px 6px;
    background: rgba(0,0,0,0.06);
    border-radius: 3px;
    font-family: monospace;
    font-size: 11px;
    color: var(--charcoal);
  }
`;

const EmptyState = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: var(--mid-gray);
  font-size: 14px;
`;

const QUICK_LINKS = [
  { label: 'Tous les Tableaux', href: '/products?category=tableaux', icon: TrendingUp },
  { label: 'Papiers Peints', href: '/products?category=papier-peint', icon: TrendingUp },
  { label: 'Nouveautés', href: '/products?featured=true', icon: TrendingUp },
  { label: 'Promotions', href: '/products?sale=true', icon: TrendingUp },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchPalette({ isOpen, onClose }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Search with debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchProducts(query);
        setResults(data.slice(0, 6));
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (!isOpen) {
          // This would need to be called from parent
        }
      }
      if (e.key === 'Escape') onClose();
      if (e.key === 'Enter' && query && results.length > 0) {
        router.push(`/products/${results[0].slug}`);
        onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose, query, results, router]);

  const primaryImage = (p: Product) =>
    p.images?.find((i) => i.is_primary)?.url || p.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&q=60';

  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <Palette
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <SearchBar>
              <SearchIcon><Search size={18} /></SearchIcon>
              <Input
                ref={inputRef}
                placeholder="Rechercher tableaux, papier peint..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <ClearBtn onClick={() => setQuery('')}>
                  <X size={16} />
                </ClearBtn>
              )}
            </SearchBar>

            <ResultsArea>
              {!query && (
                <Section>
                  <SectionLabel>Accès rapide</SectionLabel>
                  {QUICK_LINKS.map((link) => (
                    <QuickLinkItem key={link.href} href={link.href} onClick={onClose}>
                      <ArrowRight size={14} />
                      {link.label}
                    </QuickLinkItem>
                  ))}
                </Section>
              )}

              {query && loading && (
                <EmptyState>Recherche en cours...</EmptyState>
              )}

              {query && !loading && results.length === 0 && (
                <EmptyState>
                  Aucun résultat pour &quot;{query}&quot;
                </EmptyState>
              )}

              {query && results.length > 0 && (
                <Section>
                  <SectionLabel>{results.length} résultat{results.length > 1 ? 's' : ''}</SectionLabel>
                  {results.map((product) => (
                    <ResultItem
                      key={product.id}
                      href={`/products/${product.slug}`}
                      onClick={onClose}
                    >
                      <ResultThumb>
                        <Image
                          src={primaryImage(product)}
                          alt={product.name}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </ResultThumb>
                      <ResultInfo>
                        <p>{product.name}</p>
                        <p>{product.category?.name}</p>
                      </ResultInfo>
                      <ResultPrice>{product.price.toFixed(2)} MAD</ResultPrice>
                    </ResultItem>
                  ))}
                  <QuickLinkItem href={`/products?search=${encodeURIComponent(query)}`} onClick={onClose}>
                    <Search size={14} />
                    Voir tous les résultats pour &quot;{query}&quot;
                  </QuickLinkItem>
                </Section>
              )}
            </ResultsArea>

            <Footer>
              <Shortcut><kbd>↵</kbd> Sélectionner</Shortcut>
              <Shortcut><kbd>↑</kbd><kbd>↓</kbd> Naviguer</Shortcut>
              <Shortcut><kbd>Esc</kbd> Fermer</Shortcut>
            </Footer>
          </Palette>
        </Overlay>
      )}
    </AnimatePresence>
  );
}
