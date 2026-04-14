'use client';

import { ReactNode, useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    // Initialize Lenis with optimal settings for a gallery feel
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Expo ease out
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    // Integrated requestAnimationFrame loop
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    
    // Start RAF
    requestAnimationFrame(raf);

    // Clean up on component unmount
    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
