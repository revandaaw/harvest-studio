'use client';

import React from 'react';
import InstagramIcon from '@/components/common/InstagramIcon';

export default function InstagramStrip() {
  // 8 Curated photos in cohesive warm golden / champagne tones
  const photos = [
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1609234656388-0ff363383899?auto=format&fit=crop&w=400&q=80',
  ];

  return (
    <section className="bg-[#0A0A0B] py-14 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 mb-6 flex flex-col sm:flex-row sm:items-center justify-between">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-[#C6A87D] font-bold block">
            FOLLOW US ON INSTAGRAM
          </span>
          <h3 className="font-serif text-lg font-bold text-white mt-1">
            @harvest_studiophoto
          </h3>
        </div>
        <a
          href="https://instagram.com/harvest_studiophoto"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 sm:mt-0 inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-[#C6A87D] transition-colors"
        >
          <InstagramIcon className="w-4 h-4 text-[#C6A87D]" />
          <span>Ikuti di Instagram</span>
        </a>
      </div>

      {/* 8 Square Thumbnails Strip */}
      <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-2 px-2 sm:px-4">
        {photos.map((src, i) => (
          <a
            key={i}
            href="https://instagram.com/harvest_studiophoto"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square overflow-hidden rounded-sm bg-zinc-900 block"
          >
            <img
              src={src}
              alt="Harvest Studio Instagram Feed"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <InstagramIcon className="w-6 h-6 text-[#C6A87D]" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
