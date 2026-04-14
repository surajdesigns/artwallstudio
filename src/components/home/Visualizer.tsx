'use client';

import { useRef, useState } from 'react';
import styled from 'styled-components';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const VisualizerSection = styled.section`
  padding: 8rem 2rem;
  background-color: #050505;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
`;

const TextContent = styled.div`
  text-align: center;
  max-width: 700px;
  margin-bottom: 4rem;
  z-index: 2;

  h2 {
    font-family: var(--font-playfair), serif;
    font-size: clamp(2rem, 4vw, 3.5rem);
    font-weight: 400;
    margin-bottom: 1rem;
    
    span {
      color: #D4AF37;
      font-style: italic;
    }
  }

  p {
    font-family: var(--font-inter), sans-serif;
    color: rgba(255, 255, 255, 0.7);
    font-size: 1.125rem;
    font-weight: 300;
    line-height: 1.6;
  }
`;

const SliderContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 1200px;
  aspect-ratio: 16/9;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 30px 60px rgba(0,0,0,0.5);
  
  @media (max-width: 768px) {
    aspect-ratio: 4/5; /* Taller on mobile for better view */
  }
`;

const ImageLayer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  user-select: none;
  
  img {
    object-fit: cover;
  }
`;

const AfterLayer = styled(ImageLayer)<{ $clipPercent: number }>`
  z-index: 1;
  /* Clip the right side of the after image */
  clip-path: polygon(0 0, ${props => props.$clipPercent}% 0, ${props => props.$clipPercent}% 100%, 0 100%);
`;

const SliderHandle = styled.div<{ $leftPercent: number }>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: ${props => props.$leftPercent}%;
  width: 2px;
  background-color: #D4AF37;
  z-index: 2;
  transform: translateX(-50%);
  cursor: ew-resize;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 48px;
    height: 48px;
    background-color: #D4AF37;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='15 18 9 12 15 6'%3E%3C/polyline%3E%3C/svg%3E"),
                      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='9 18 15 12 9 6'%3E%3C/polyline%3E%3C/svg%3E");
    background-position: calc(50% - 4px) center, calc(50% + 4px) center;
    background-repeat: no-repeat;
    background-size: 16px;
  }
`;

const InvisibleSlider = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  z-index: 3;
  cursor: ew-resize;
  margin: 0;
`;

const Badge = styled.div<{ $position: 'left' | 'right' }>`
  position: absolute;
  top: 2rem;
  ${props => props.$position === 'left' ? 'left: 2rem;' : 'right: 2rem;'}
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(4px);
  padding: 0.5rem 1.5rem;
  border-radius: 30px;
  font-family: var(--font-inter);
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  z-index: 1;
  
  @media (max-width: 480px) {
    top: 1rem;
    ${props => props.$position === 'left' ? 'left: 1rem;' : 'right: 1rem;'}
    font-size: 0.75rem;
  }
`;

export default function Visualizer() {
  const [sliderPos, setSliderPos] = useState(50);
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Parallax effect for the entire slider container
    gsap.fromTo(containerRef.current, 
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        }
      }
    );
  }, { scope: sectionRef });

  return (
    <VisualizerSection ref={sectionRef}>
      <TextContent>
        <h2>Experience <span>The Impact</span></h2>
        <p>
          See how the right piece transforms a plain room into an extraordinary space. 
          Drag the slider to visualize the ArtWall Studio difference.
        </p>
      </TextContent>

      <SliderContainer ref={containerRef}>
        <ImageLayer>
          <Image 
            src="/images/home/visualizer-before.webp" 
            alt="Room before art" 
            fill 
            sizes="(max-width: 1200px) 100vw, 1200px"
            priority
          />
          <Badge $position="right">Before</Badge>
        </ImageLayer>
        
        <AfterLayer $clipPercent={sliderPos}>
          <Image 
            src="/images/home/visualizer-after.webp" 
            alt="Room after art" 
            fill 
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
          <Badge $position="left">After</Badge>
        </AfterLayer>

        <SliderHandle $leftPercent={sliderPos} />

        <InvisibleSlider 
          type="range" 
          min="0" 
          max="100" 
          value={sliderPos} 
          onChange={(e) => setSliderPos(Number(e.target.value))}
          aria-label="Image comparison slider"
        />
      </SliderContainer>
    </VisualizerSection>
  );
}
