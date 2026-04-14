import { Suspense } from 'react';
export const dynamic = 'force-dynamic';

import SmoothScroll from '@/components/home/SmoothScroll';
import Hero from '@/components/home/Hero';
import BrandStrip from '@/components/layout/BrandStrip';
import Categories from '@/components/home/Categories';
import FeaturedProducts from '@/components/product/FeaturedProducts';
import Visualizer from '@/components/home/Visualizer';
import Testimonials from '@/components/home/Testimonials';
import WhyUs from '@/components/layout/WhyUs';
import Newsletter from '@/components/layout/Newsletter';

export default function HomePage() {
  return (
    <SmoothScroll>
      <Hero />
      <BrandStrip />
      <Categories />
      <Suspense fallback={null}>
        <FeaturedProducts />
      </Suspense>
      <Visualizer />
      <Testimonials />
      <WhyUs />
      <Newsletter />

    </SmoothScroll>
  );
}
