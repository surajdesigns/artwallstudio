'use client';

import styled from 'styled-components';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { SlidersHorizontal, X, ChevronDown, Search, LayoutGrid, List } from 'lucide-react';
import ProductCard from './ProductCard';
import type { Category, Product, ProductFilters, SortOption } from '@/types';
import Link from 'next/link';
import { getProducts } from '@/lib/api';

// ─── Styled Components ───────────────────────────────────────────────────────

const PageWrap = styled.div`
  padding-top: var(--nav-height);
  min-height: 100vh;
`;

const PageHeader = styled.div`
  background: var(--off-black);
  padding: 60px 40px 40px;

  @media (max-width: 768px) { padding: 48px 20px 32px; }
`;

const Breadcrumb = styled.p`
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--mid-gray);
  margin-bottom: 16px;

  a { color: var(--mid-gray); transition: color 0.2s; &:hover { color: var(--gold); } }
  span { color: var(--light-gray); margin: 0 8px; }
`;

const PageTitle = styled.h1`
  font-family: var(--font-display);
  font-size: clamp(32px, 5vw, 60px);
  font-weight: 300;
  color: var(--off-white);
  em { font-style: italic; color: var(--gold-light); }
`;

const ProductCount = styled.p`
  font-size: 13px;
  color: var(--mid-gray);
  margin-top: 12px;
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 0;
  min-height: 80vh;

  @media (max-width: 1024px) { grid-template-columns: 1fr; }
`;

// ─── Sidebar ─────────────────────────────────────────────────────────────────

const Sidebar = styled.aside<{ $open: boolean }>`
  background: var(--cream);
  border-right: 1px solid rgba(0,0,0,0.06);
  padding: 32px 28px;
  position: sticky;
  top: var(--nav-height);
  height: calc(100vh - var(--nav-height));
  overflow-y: auto;

  @media (max-width: 1024px) {
    position: fixed;
    top: 0; left: 0; bottom: 0;
    width: 300px;
    z-index: 200;
    transform: ${({ $open }) => ($open ? 'translateX(0)' : 'translateX(-100%)')};
    transition: transform 0.4s var(--ease-out);
    box-shadow: var(--shadow-xl);
  }
`;

const SidebarOverlay = styled(motion.div)`
  position: fixed; inset: 0;
  background: rgba(10,10,8,0.5);
  z-index: 199;
  display: none;

  @media (max-width: 1024px) { display: block; }
`;

const FilterGroup = styled.div`
  margin-bottom: 32px;
  padding-bottom: 32px;
  border-bottom: 1px solid rgba(0,0,0,0.06);

  &:last-child { border-bottom: none; }
`;

const FilterTitle = styled.h3`
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--black);
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const FilterOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FilterOption = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 14px;
  color: var(--charcoal);
  transition: color 0.2s;

  &:hover { color: var(--black); }

  input[type="checkbox"] {
    width: 16px; height: 16px;
    accent-color: var(--gold);
    cursor: pointer;
  }
`;

const PriceRange = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const PriceInputRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

const PriceInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid rgba(0,0,0,0.12);
  border-radius: var(--radius-sm);
  font-size: 13px;
  background: var(--white);
  color: var(--black);
  outline: none;
  transition: border-color 0.2s;

  &:focus { border-color: var(--gold); }
`;

const RangeSlider = styled.input`
  width: 100%;
  accent-color: var(--gold);
`;

const ClearBtn = styled.button`
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--mid-gray);
  text-decoration: underline;
  transition: color 0.2s;

  &:hover { color: var(--error); }
`;

// ─── Main Content ─────────────────────────────────────────────────────────────

const MainContent = styled.div`
  padding: 32px 40px;

  @media (max-width: 768px) { padding: 24px 20px; }
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 32px;
  flex-wrap: wrap;
`;

const ToolbarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const MobileFilterBtn = styled.button`
  display: none;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: 1px solid rgba(0,0,0,0.12);
  border-radius: var(--radius-sm);
  font-size: 13px;
  color: var(--black);
  transition: border-color 0.2s;

  &:hover { border-color: var(--gold); }

  @media (max-width: 1024px) { display: flex; }
`;

const SearchBox = styled.div`
  position: relative;
  flex: 1;
  max-width: 320px;

  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--mid-gray);
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 12px 10px 36px;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: var(--radius-sm);
  font-size: 13px;
  background: var(--cream);
  outline: none;
  transition: border-color 0.2s;

  &:focus { border-color: var(--gold); }
`;

const ToolbarRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SortSelect = styled.select`
  padding: 10px 32px 10px 14px;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-family: var(--font-body);
  background: var(--cream);
  color: var(--black);
  outline: none;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%235a5a50' fill='none' stroke-width='1.5'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  transition: border-color 0.2s;

  &:focus { border-color: var(--gold); }
`;

const ViewToggle = styled.div`
  display: flex;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: var(--radius-sm);
  overflow: hidden;
`;

const ViewBtn = styled.button<{ $active: boolean }>`
  padding: 10px 12px;
  background: ${({ $active }) => ($active ? 'var(--black)' : 'transparent')};
  color: ${({ $active }) => ($active ? 'var(--off-white)' : 'var(--mid-gray)')};
  transition: all 0.2s;

  &:hover { background: ${({ $active }) => ($active ? 'var(--black)' : 'rgba(0,0,0,0.04)')}; }
`;

const ActiveFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
`;

const FilterTag = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  background: var(--off-black);
  color: var(--off-white);
  border-radius: var(--radius-full);
  font-size: 12px;

  button {
    color: var(--light-gray);
    display: flex;
    align-items: center;
    transition: color 0.2s;
    &:hover { color: var(--off-white); }
  }
`;

const ProductGrid = styled(motion.div)<{ $view: 'grid' | 'list' }>`
  display: grid;
  gap: ${({ $view }) => ($view === 'list' ? '16px' : '24px 20px')};
  grid-template-columns: ${({ $view }) =>
    $view === 'list'
      ? '1fr'
      : 'repeat(auto-fill, minmax(240px, 1fr))'};
`;

const EmptyState = styled.div`
  grid-column: 1/-1;
  text-align: center;
  padding: 80px 20px;
  color: var(--mid-gray);

  h3 {
    font-family: var(--font-display);
    font-size: 28px;
    font-weight: 400;
    margin-bottom: 12px;
    color: var(--charcoal);
  }
`;

const LoadMoreBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 300px;
  margin: 48px auto 0;
  padding: 15px 32px;
  border: 1px solid rgba(0,0,0,0.15);
  border-radius: 2px;
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition: all 0.25s;

  &:hover {
    border-color: var(--gold);
    color: var(--gold-dark);
  }
`;

// ─── Variation filter chips ────────────────────────────────────────────────

const VariationChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const VariationChip = styled.button<{ $active: boolean }>`
  padding: 6px 14px;
  border-radius: var(--radius-full);
  font-size: 12px;
  border: 1px solid ${({ $active }) => ($active ? 'var(--gold)' : 'rgba(0,0,0,0.12)')};
  background: ${({ $active }) => ($active ? 'var(--gold)' : 'transparent')};
  color: ${({ $active }) => ($active ? 'var(--black)' : 'var(--charcoal)')};
  transition: all 0.2s;

  &:hover {
    border-color: var(--gold);
  }
`;

const ColorDot = styled.button<{ $color: string; $active: boolean }>`
  width: 28px; height: 28px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  border: 2px solid ${({ $active }) => ($active ? 'var(--gold)' : 'transparent')};
  outline: 2px solid ${({ $active }) => ($active ? 'var(--gold)' : 'rgba(0,0,0,0.1)')};
  outline-offset: 2px;
  transition: all 0.2s;
  cursor: pointer;
`;

// ─── Component ────────────────────────────────────────────────────────────────

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Plus récents' },
  { value: 'price-asc', label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' },
  { value: 'popular', label: 'Popularité' },
  { value: 'rating', label: 'Mieux notés' },
];

const SIZES = ['30×40 cm', '50×70 cm', '60×80 cm', '70×100 cm', '100×140 cm', 'Sur mesure'];
const COLORS = [
  { name: 'Noir', hex: '#1a1a1a' },
  { name: 'Blanc', hex: '#f5f3ee' },
  { name: 'Or', hex: '#c9a84c' },
  { name: 'Bleu', hex: '#4a6fa5' },
  { name: 'Vert', hex: '#4caa70' },
  { name: 'Rouge', hex: '#c94c4c' },
];

const STYLES = ['Abstrait', 'Botanique', 'Géométrique', 'Minimaliste', 'Portrait', 'Paysage'];

interface Props { categories: Category[] }

export default function ProductsPageClient({ categories }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);

  // Filter state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sort, setSort] = useState<SortOption>((searchParams.get('sort') as SortOption) || 'newest');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [inStock, setInStock] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const filters: ProductFilters = {
        category: selectedCategory || undefined,
        minPrice: minPrice > 0 ? minPrice : undefined,
        maxPrice: maxPrice < 10000 ? maxPrice : undefined,
        search: search || undefined,
        sort,
        inStock: inStock || undefined,
        tags: selectedStyles.length > 0 ? selectedStyles : undefined,
      };
      const data = await getProducts(filters);
      setProducts(data);
    } catch {
      // fallback to demo
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, minPrice, maxPrice, search, sort, inStock, selectedStyles]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const toggleSize = (size: string) =>
    setSelectedSizes((prev) => prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]);

  const toggleColor = (color: string) =>
    setSelectedColors((prev) => prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]);

  const toggleStyle = (style: string) =>
    setSelectedStyles((prev) => prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]);

  const clearAllFilters = () => {
    setSelectedCategory('');
    setMinPrice(0);
    setMaxPrice(10000);
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedStyles([]);
    setSearch('');
    setInStock(false);
  };

  const activeFiltersCount = [
    selectedCategory, inStock, ...selectedSizes, ...selectedColors, ...selectedStyles,
    minPrice > 0, maxPrice < 10000,
  ].filter(Boolean).length;

  const displayProducts = products.length > 0 ? products : getDemoProducts();

  return (
    <PageWrap>
      <PageHeader>
        <Breadcrumb>
          <Link href="/">Accueil</Link>
          <span>/</span>
          Tous les produits
        </Breadcrumb>
        <PageTitle>
          {selectedCategory
            ? categories.find((c) => c.slug === selectedCategory)?.name || 'Produits'
            : <>Toute la <em>Collection</em></>}
        </PageTitle>
        <ProductCount>{displayProducts.length} produits</ProductCount>
      </PageHeader>

      <Layout>
        {/* Sidebar overlay (mobile) */}
        <AnimatePresence>
          {sidebarOpen && (
            <SidebarOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <Sidebar $open={sidebarOpen}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 400 }}>Filtres</h2>
            {activeFiltersCount > 0 && <ClearBtn onClick={clearAllFilters}>Tout effacer ({activeFiltersCount})</ClearBtn>}
          </div>

          {/* Category */}
          <FilterGroup>
            <FilterTitle>Catégorie</FilterTitle>
            <FilterOptions>
              <FilterOption>
                <input type="checkbox" checked={selectedCategory === ''} onChange={() => setSelectedCategory('')} />
                Tous les produits
              </FilterOption>
              {categories.map((cat) => (
                <FilterOption key={cat.id}>
                  <input
                    type="checkbox"
                    checked={selectedCategory === cat.slug}
                    onChange={() => setSelectedCategory(cat.slug)}
                  />
                  {cat.name}
                </FilterOption>
              ))}
            </FilterOptions>
          </FilterGroup>

          {/* Price */}
          <FilterGroup>
            <FilterTitle>Prix (MAD)</FilterTitle>
            <PriceRange>
              <PriceInputRow>
                <PriceInput
                  type="number"
                  placeholder="Min"
                  value={minPrice || ''}
                  onChange={(e) => setMinPrice(+e.target.value)}
                />
                <PriceInput
                  type="number"
                  placeholder="Max"
                  value={maxPrice === 10000 ? '' : maxPrice}
                  onChange={(e) => setMaxPrice(+e.target.value || 10000)}
                />
              </PriceInputRow>
              <RangeSlider
                type="range"
                min={0}
                max={10000}
                step={100}
                value={maxPrice}
                onChange={(e) => setMaxPrice(+e.target.value)}
              />
              <p style={{ fontSize: 12, color: 'var(--mid-gray)' }}>
                Jusqu&apos;à {maxPrice.toLocaleString('fr-MA')} MAD
              </p>
            </PriceRange>
          </FilterGroup>

          {/* Sizes / Variations */}
          <FilterGroup>
            <FilterTitle>Dimensions</FilterTitle>
            <VariationChips>
              {SIZES.map((size) => (
                <VariationChip
                  key={size}
                  $active={selectedSizes.includes(size)}
                  onClick={() => toggleSize(size)}
                >
                  {size}
                </VariationChip>
              ))}
            </VariationChips>
          </FilterGroup>

          {/* Colors */}
          <FilterGroup>
            <FilterTitle>Couleur Dominante</FilterTitle>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {COLORS.map((color) => (
                <ColorDot
                  key={color.name}
                  $color={color.hex}
                  $active={selectedColors.includes(color.name)}
                  onClick={() => toggleColor(color.name)}
                  title={color.name}
                />
              ))}
            </div>
          </FilterGroup>

          {/* Style */}
          <FilterGroup>
            <FilterTitle>Style Artistique</FilterTitle>
            <VariationChips>
              {STYLES.map((style) => (
                <VariationChip
                  key={style}
                  $active={selectedStyles.includes(style)}
                  onClick={() => toggleStyle(style)}
                >
                  {style}
                </VariationChip>
              ))}
            </VariationChips>
          </FilterGroup>

          {/* Stock */}
          <FilterGroup>
            <FilterTitle>Disponibilité</FilterTitle>
            <FilterOption>
              <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} />
              En stock uniquement
            </FilterOption>
          </FilterGroup>
        </Sidebar>

        {/* Main Content */}
        <MainContent>
          {/* Toolbar */}
          <Toolbar>
            <ToolbarLeft>
              <MobileFilterBtn onClick={() => setSidebarOpen(true)}>
                <SlidersHorizontal size={16} />
                Filtres {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </MobileFilterBtn>
              <SearchBox>
                <Search size={15} />
                <SearchInput
                  placeholder="Rechercher..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </SearchBox>
            </ToolbarLeft>
            <ToolbarRight>
              <SortSelect value={sort} onChange={(e) => setSort(e.target.value as SortOption)}>
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </SortSelect>
              <ViewToggle>
                <ViewBtn $active={view === 'grid'} onClick={() => setView('grid')}>
                  <LayoutGrid size={16} />
                </ViewBtn>
                <ViewBtn $active={view === 'list'} onClick={() => setView('list')}>
                  <List size={16} />
                </ViewBtn>
              </ViewToggle>
            </ToolbarRight>
          </Toolbar>

          {/* Active filter tags */}
          {activeFiltersCount > 0 && (
            <ActiveFilters>
              {selectedCategory && (
                <FilterTag>
                  {categories.find((c) => c.slug === selectedCategory)?.name}
                  <button onClick={() => setSelectedCategory('')}><X size={12} /></button>
                </FilterTag>
              )}
              {selectedSizes.map((s) => (
                <FilterTag key={s}>{s}<button onClick={() => toggleSize(s)}><X size={12} /></button></FilterTag>
              ))}
              {selectedColors.map((c) => (
                <FilterTag key={c}>{c}<button onClick={() => toggleColor(c)}><X size={12} /></button></FilterTag>
              ))}
              {selectedStyles.map((s) => (
                <FilterTag key={s}>{s}<button onClick={() => toggleStyle(s)}><X size={12} /></button></FilterTag>
              ))}
              {inStock && <FilterTag>En stock<button onClick={() => setInStock(false)}><X size={12} /></button></FilterTag>}
            </ActiveFilters>
          )}

          {/* Product grid */}
          <AnimatePresence mode="wait">
            <ProductGrid
              key={`${view}-${activeFiltersCount}-${sort}`}
              $view={view}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {loading
                ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
                : displayProducts.length === 0
                ? (
                  <EmptyState>
                    <h3>Aucun produit trouvé</h3>
                    <p>Essayez de modifier vos filtres</p>
                    <ClearBtn style={{ marginTop: 16 }} onClick={clearAllFilters}>
                      Réinitialiser les filtres
                    </ClearBtn>
                  </EmptyState>
                )
                : displayProducts.slice(0, page * 12).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              }
            </ProductGrid>
          </AnimatePresence>

          {!loading && displayProducts.length > page * 12 && (
            <LoadMoreBtn onClick={() => setPage((p) => p + 1)}>
              Charger plus
            </LoadMoreBtn>
          )}
        </MainContent>
      </Layout>
    </PageWrap>
  );
}

// ─── Skeleton card ─────────────────────────────────────────────────────────

const Skeleton = styled.div`
  background: linear-gradient(90deg, var(--off-white) 25%, var(--cream) 50%, var(--off-white) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-sm);

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

function SkeletonCard() {
  return (
    <div>
      <Skeleton style={{ aspectRatio: '3/4', marginBottom: 16 }} />
      <Skeleton style={{ height: 12, width: '40%', marginBottom: 8 }} />
      <Skeleton style={{ height: 18, width: '80%', marginBottom: 12 }} />
      <Skeleton style={{ height: 16, width: '30%' }} />
    </div>
  );
}

// ─── Demo data ─────────────────────────────────────────────────────────────

function getDemoProducts(): Product[] {
  const items = [
    { name: 'Harmonie Abstraite No.3', slug: 'harmonie-abstraite-3', price: 1890, category: 'tableaux', img: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80', featured: true, compare: null },
    { name: 'Forêt Tropicale Panoramique', slug: 'foret-tropicale', price: 2450, category: 'papier-peint', img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&q=80', featured: false, compare: 2900 },
    { name: 'Géométrie Dorée', slug: 'geometrie-doree', price: 980, category: 'tableaux', img: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=600&q=80', featured: true, compare: null },
    { name: 'Marbre Blanc Veiné', slug: 'marbre-blanc', price: 3200, category: 'papier-peint', img: 'https://images.unsplash.com/photo-1615873968403-89e068629265?w=600&q=80', featured: false, compare: null },
    { name: 'Portrait Minimaliste', slug: 'portrait-minimaliste', price: 1450, category: 'tableaux', img: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=600&q=80', featured: true, compare: 1800 },
    { name: 'Botanique Exotique', slug: 'botanique-exotique', price: 2100, category: 'papier-peint', img: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&q=80', featured: false, compare: 2600 },
    { name: 'Coucher de Soleil Doré', slug: 'coucher-soleil', price: 1750, category: 'tableaux', img: 'https://images.unsplash.com/photo-1504805572947-34fad45aed93?w=600&q=80', featured: true, compare: null },
    { name: 'Texture Béton Brut', slug: 'texture-beton', price: 890, category: 'papier-peint', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', featured: false, compare: null },
    { name: 'Aquarelle Indigo', slug: 'aquarelle-indigo', price: 1320, category: 'tableaux', img: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=600&q=80', featured: false, compare: null },
    { name: 'Jungle Tropicale', slug: 'jungle-tropicale', price: 2780, category: 'papier-peint', img: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=600&q=80', featured: true, compare: 3200 },
    { name: 'Mer du Nord', slug: 'mer-du-nord', price: 1650, category: 'tableaux', img: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600&q=80', featured: false, compare: null },
    { name: 'Damier Cuivré', slug: 'damier-cuivre', price: 740, category: 'papier-peint', img: 'https://images.unsplash.com/photo-1492138786289-d35ea832da43?w=600&q=80', featured: false, compare: null },
  ];

  return items.map((p, i) => ({
    id: `demo-${i}`,
    name: p.name,
    slug: p.slug,
    description: null,
    short_description: null,
    price: p.price,
    compare_at_price: p.compare || null,
    category_id: null,
    stock_quantity: 10,
    sku: null,
    weight: null,
    dimensions: null,
    tags: null,
    is_active: true,
    is_featured: p.featured,
    metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: `cat-${i}`, name: p.category === 'tableaux' ? 'Tableaux' : 'Papier Peint', slug: p.category, description: null, image_url: null, parent_id: null, sort_order: i, created_at: '' },
    images: [{ id: `img-${i}`, product_id: `demo-${i}`, url: p.img, alt: p.name, sort_order: 0, is_primary: true }],
  }));
}
