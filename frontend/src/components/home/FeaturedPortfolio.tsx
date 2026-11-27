'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Eye, X } from 'lucide-react';

interface PortfolioItem {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  image: string;
  description: string;
}

export default function FeaturedPortfolio() {
  const [activeItem, setActiveItem] = useState<PortfolioItem | null>(null);

  // 5 Vertical cards perfectly matched with design reference item 6 in 1 warm tone:
  const portfolioItems: PortfolioItem[] = [
    {
      id: '1',
      category: 'WEDDING',
      title: 'Love Stories',
      subtitle: 'The Wedding of Reza & Anisa',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80',
      description: 'Momen sakral bernuansa adat Sunda modern di Subang dengan pencahayaan hangat dan detail emosional.',
    },
    {
      id: '2',
      category: 'PORTRAITS',
      title: 'People & Expressions',
      subtitle: 'Editorial Warm Studio Portrait',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80',
      description: 'Potret personal studio dengan tata lampu sinematik Rembrandt, menghasilkan ekspresi natural dan berkarakter kuat.',
    },
    {
      id: '3',
      category: 'EVENTS',
      title: 'Moments & Memories',
      subtitle: 'Candlelight Banquet & Gala Dinner',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80',
      description: 'Dokumentasi malam keakraban acara dengan pendar lampu gantung kristal dan suasana candlelight yang elegan.',
    },
    {
      id: '4',
      category: 'DETAILS / PRODUCT',
      title: 'Details That Matter',
      subtitle: 'Gold Wedding Bands & Craftsmanship',
      image: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1000&q=80',
      description: 'Kemewahan kilau cincin kawin dan detail busana bertekstur dalam pencahayaan makro yang presisi.',
    },
    {
      id: '5',
      category: 'PREWEDDING',
      title: 'Wild & Beautiful',
      subtitle: 'Sunset in Tea Plantation Ciater',
      image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1000&q=80',
      description: 'Pemotretan prewedding romantis dengan latar belakang perbukitan hijau dan langit senja keemasan khas Subang.',
    },
  ];

  return (
    <section className="bg-[#FAF7F2] text-zinc-900 py-24 px-4 lg:px-8 mt-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-[#A27B42] text-xs font-bold tracking-[0.2em] uppercase block mb-2">
              OUR PORTFOLIO
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-950">
              Moments We&apos;ve Captured
            </h2>
          </div>
          <Link
            href="/portofolio"
            className="mt-4 md:mt-0 inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-[#A27B42] hover:text-black transition-colors group"
          >
            <span>Lihat Semua Galeri</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 5 Vertical Cards (Sesuai Referensi Gambar) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {portfolioItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="group relative h-[440px] rounded-lg overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1.5"
            >
              {/* Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${item.image}')` }}
              />

              {/* Dark Gradient Overlay for Bottom Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              {/* Hover Overlay Icon */}
              <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Eye className="w-4 h-4 text-[#C6A87D]" />
              </div>

              {/* Bottom Card Content */}
              <div className="absolute bottom-0 inset-x-0 p-5 text-white space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#C6A87D] block">
                  {item.category}
                </span>
                <h3 className="font-serif text-lg font-bold leading-tight group-hover:text-[#F4ECE1] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-300 font-light truncate">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Preview Modal */}
      {activeItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="lightbox-title"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setActiveItem(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-[#141416] border border-white/10 rounded-lg overflow-hidden shadow-2xl flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
              aria-label="Tutup Pratinjau Foto"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="md:w-3/5 h-96 md:h-[500px] relative bg-black">
              <img
                src={activeItem.image}
                alt={activeItem.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="md:w-2/5 p-6 md:p-8 flex flex-col justify-between text-white space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#C6A87D] block mb-2">
                  {activeItem.category}
                </span>
                <h2 id="lightbox-title" className="font-serif text-2xl font-bold">{activeItem.title}</h2>
                <h3 className="text-sm text-zinc-400 font-medium mt-1">{activeItem.subtitle}</h3>
                <p className="text-xs text-zinc-300 leading-relaxed mt-4">
                  {activeItem.description}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center space-x-3">
                <Link
                  href="/booking"
                  onClick={() => setActiveItem(null)}
                  className="flex-1 bg-[#C6A87D] hover:bg-[#D4AF37] text-black text-center font-bold text-xs uppercase tracking-wider py-3 rounded-sm transition-all"
                >
                  Pesan Paket Serupa
                </Link>
                <Link
                  href="/portofolio"
                  onClick={() => setActiveItem(null)}
                  className="px-4 py-3 border border-white/20 text-xs uppercase font-medium hover:bg-white/10 rounded-sm transition-all"
                >
                  Galeri
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
