'use client';

import { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const TestimonialsSection = styled.section`
  padding: 8rem 2rem;
  background-color: #0A0A0A;
  color: white;
  min-height: 80vh;
  display: flex;
  align-items: center;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  position: relative;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 5rem;
  
  h2 {
    font-family: var(--font-playfair), serif;
    font-size: clamp(2rem, 4vw, 3.5rem);
    font-weight: 400;
    margin: 0;
    
    span {
      color: #D4AF37;
      font-style: italic;
    }
  }
`;

const TestimonialCarousel = styled.div`
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  min-height: 300px;
`;

const Track = styled.div`
  display: flex;
  width: 100%;
`;

const Slide = styled.div<{ $isActive: boolean }>`
  min-width: 100%;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  opacity: ${props => props.$isActive ? 1 : 0};
  transform: ${props => props.$isActive ? 'scale(1)' : 'scale(0.9)'};
  transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: ${props => props.$isActive ? 'relative' : 'absolute'};
  top: 0;
  left: 0;
`;

const StarRating = styled.div`
  color: #D4AF37;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  letter-spacing: 2px;
`;

const Quote = styled.p`
  font-family: var(--font-playfair), serif;
  font-size: clamp(1.25rem, 2vw, 1.75rem);
  font-style: italic;
  font-weight: 300;
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto 2rem auto;
  color: rgba(255, 255, 255, 0.9);
`;

const Author = styled.div`
  font-family: var(--font-inter), sans-serif;
  
  h4 {
    font-size: 1.125rem;
    font-weight: 500;
    margin: 0 0 0.25rem 0;
    letter-spacing: 0.05em;
  }
  
  span {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.5);
    font-weight: 300;
  }
`;

const Controls = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 3rem;
`;

const Dot = styled.button<{ $active: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  background-color: ${props => props.$active ? '#D4AF37' : 'rgba(255,255,255,0.2)'};
  cursor: pointer;
  transition: background-color 0.3s ease;
  padding: 0;

  &:hover {
    background-color: ${props => props.$active ? '#D4AF37' : 'rgba(255,255,255,0.5)'};
  }
`;

const reviews = [
  {
    id: 1,
    text: "La qualité de l'impression est exceptionnelle. Ma toile 'Abstract expression' est devenue la pièce maîtresse de mon salon à Casablanca. L'effet galerie est vraiment au rendez-vous.",
    author: "Karim B.",
    location: "Casablanca, Maroc",
    stars: "★★★★★"
  },
  {
    id: 2,
    text: "I was looking for something unique for my riad in Marrakech. The Cultural Heritage collection provided the perfect blend of modern aesthetic and traditional geometry. Flawless service.",
    author: "Sarah L.",
    location: "Marrakech, Maroc",
    stars: "★★★★★"
  },
  {
    id: 3,
    text: "Le service client est irréprochable et la livraison à Rabat a été très rapide. L'œuvre est encore plus impressionnante en vrai que sur le site. Les finitions dorées sont magnifiques.",
    author: "Omar T.",
    location: "Rabat, Maroc",
    stars: "★★★★★"
  },
  {
    id: 4,
    text: "Une expérience premium de bout en bout. L'outil de visualisation m'a beaucoup aidé à choisir la bonne taille pour mon appartement. Très satisfait de mon achat.",
    author: "Youssef M.",
    location: "Tanger, Maroc",
    stars: "★★★★★"
  }
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % reviews.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  useGSAP(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current.querySelectorAll('.stagger-reveal'),
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
          }
        }
      );
    }
  }, { scope: containerRef });

  return (
    <TestimonialsSection ref={containerRef}>
      <Container>
        <SectionHeader className="stagger-reveal">
          <h2>Voices of <span>Our Clients</span></h2>
        </SectionHeader>

        <TestimonialCarousel className="stagger-reveal">
          <Track>
            {reviews.map((review, index) => (
              <Slide key={review.id} $isActive={index === activeIndex}>
                <StarRating>{review.stars}</StarRating>
                <Quote>"{review.text}"</Quote>
                <Author>
                  <h4>{review.author}</h4>
                  <span>{review.location}</span>
                </Author>
              </Slide>
            ))}
          </Track>
        </TestimonialCarousel>

        <Controls className="stagger-reveal">
          {reviews.map((_, index) => (
            <Dot 
              key={index} 
              $active={index === activeIndex} 
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </Controls>
      </Container>
    </TestimonialsSection>
  );
}
