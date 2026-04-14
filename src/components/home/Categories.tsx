'use client';

import { useRef } from 'react';
import styled from 'styled-components';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import Link from 'next/link';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const CategoriesSection = styled.section`
  padding: 10rem 2rem;
  background-color: #0A0A0A; /* Deep dark gray */
  color: white;
  min-height: 100vh;
  position: relative;
  z-index: 1;
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 6rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }
`;

const Title = styled.h2`
  font-family: var(--font-playfair), serif;
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  font-weight: 400;
  margin: 0;
  line-height: 1.1;

  span {
    display: block;
    color: #D4AF37; /* Gold accent */
    font-style: italic;
  }
`;

const ViewAllLink = styled(Link)`
  font-family: var(--font-inter), sans-serif;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.3);
  transition: all 0.3s ease;

  &:hover {
    border-bottom-color: #D4AF37;
    color: #D4AF37;
  }
`;

const MasonryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1.5rem;
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const CategoryCard = styled.div<{ $mt?: string }>`
  position: relative;
  margin-top: ${props => props.$mt || '0'};
  overflow: hidden;
  border-radius: 4px;
  cursor: pointer;

  .image-wrapper {
    position: relative;
    width: 100%;
    aspect-ratio: 3/4;
    overflow: hidden;
    
    img {
      object-fit: cover;
      transition: transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
  }

  .overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%);
    z-index: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 2rem;
    opacity: 0.8;
    transition: opacity 0.4s ease;
  }

  h3 {
    font-family: var(--font-playfair), serif;
    font-size: 2rem;
    font-weight: 400;
    margin: 0 0 0.5rem 0;
    color: white;
    transform: translateY(10px);
    transition: transform 0.4s ease;
  }

  p {
    font-family: var(--font-inter), sans-serif;
    font-size: 0.875rem;
    color: rgba(255,255,255,0.7);
    margin: 0;
    transform: translateY(10px);
    opacity: 0;
    transition: all 0.4s ease;
  }

  &:hover {
    .image-wrapper img {
      transform: scale(1.05);
    }
    .overlay {
      opacity: 1;
    }
    h3 {
      transform: translateY(0);
    }
    p {
      transform: translateY(0);
      opacity: 1;
    }
  }

  /* Reset margin top for mobile to prevent weird gaps */
  @media (max-width: 768px) {
    margin-top: 0 !important;
    .image-wrapper {
      aspect-ratio: 4/5;
    }
  }
`;

const categories = [
  {
    title: 'Abstract Expression',
    desc: 'Bold strokes & deep emotions',
    src: '/images/home/abstract.webp',
    slug: 'abstract',
    mt: '0',
    speed: '60px' // Slowest, anchor
  },
  {
    title: 'Minimalist Focus',
    desc: 'Clean lines & subtle tones',
    src: '/images/home/minimalist.webp',
    slug: 'minimalist',
    mt: '4rem',
    speed: '-40px' 
  },
  {
    title: 'Cultural Heritage',
    desc: 'Intricate Moroccan geometry',
    src: '/images/home/cultural.webp',
    slug: 'cultural',
    mt: '8rem',
    speed: '-80px' 
  },
  {
    title: 'Nature & Landscapes',
    desc: 'Serene & vibrant natural scenes',
    src: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80',
    slug: 'nature',
    mt: '12rem',
    speed: '-120px'
  },
  {
    title: 'Photography',
    desc: 'Captured moments & perspectives',
    src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80',
    slug: 'photography',
    mt: '6rem',
    speed: '-60px'
  },
  {
    title: 'Modern Pop Art',
    desc: 'Vivid colors & contemporary culture',
    src: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&q=80',
    slug: 'pop-art',
    mt: '2rem',
    speed: '-20px'
  }
];

export default function Categories() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    // Reveal animation for header
    if (containerRef.current) {
      gsap.fromTo(containerRef.current.querySelectorAll('.header-reveal'), 
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
          }
        }
      );
    }

    // Parallax effect on cards
    // Only apply on non-touch devices for better performance/UX
    const isTouch = window.matchMedia('(hover: none)').matches;
    if (!isTouch && containerRef.current) {
      const cards = containerRef.current.querySelectorAll('.cat-card');
      cards.forEach((card, i) => {
        const speed = categories[i].speed;
        gsap.to(card, {
          y: speed,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        });
      });
    }

  }, { scope: containerRef });

  return (
    <CategoriesSection ref={containerRef} id="collections">
      <Container>
        <SectionHeader>
          <Title className="header-reveal">
            Curated <span>Collections</span>
          </Title>
          <div className="header-reveal">
            <ViewAllLink href="/products">
              View Entire Gallery
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </ViewAllLink>
          </div>
        </SectionHeader>

        <MasonryGrid>
          {categories.map((cat, i) => (
            <Link href={`/products?category=${cat.slug}`} key={cat.title} style={{ textDecoration: 'none' }}>
              <CategoryCard 
                $mt={cat.mt} 
                className="cat-card header-reveal"
              >
                <div className="image-wrapper">
                  <Image 
                    src={cat.src}
                    alt={cat.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="overlay">
                  <h3>{cat.title}</h3>
                  <p>{cat.desc}</p>
                </div>
              </CategoryCard>
            </Link>
          ))}
        </MasonryGrid>
      </Container>
    </CategoriesSection>
  );
}
