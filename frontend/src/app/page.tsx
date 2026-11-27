import React from 'react';
import Hero from '@/components/home/Hero';
import CategoryBar from '@/components/home/CategoryBar';
import FeaturedPortfolio from '@/components/home/FeaturedPortfolio';
import PackagesBanner from '@/components/home/PackagesBanner';
import Testimonials from '@/components/home/Testimonials';
import InstagramStrip from '@/components/home/InstagramStrip';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* 1. Hero fullscreen dark luxury */}
      <Hero />

      {/* 2. Floating Category Bar */}
      <CategoryBar />

      {/* 3. Featured Portfolio (Light contrast section with 5 vertical cards) */}
      <FeaturedPortfolio />

      {/* 4. Packages Banner (Dark luxury card with 3 packages) */}
      <PackagesBanner />

      {/* 5. Client Testimonials (Light elegant review cards) */}
      <Testimonials />

      {/* 6. Instagram Feed Strip */}
      <InstagramStrip />
    </div>
  );
}
