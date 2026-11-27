'use client';

import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      id: '1',
      name: 'Sarah & Dimas',
      role: 'Klien Wedding Full Day Platinum',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200',
      quote:
        'Harvest Studio luar biasa! Hasil foto dan video pernikahan kami sangat elegan dan berkelas. Timnya ramah, tepat waktu, dan sangat sabar mengarahkan gaya kami yang kaku. Seluruh keluarga puas banget!',
      rating: 5,
    },
    {
      id: '2',
      name: 'Michael & Emily',
      role: 'Klien Prewedding Ciater Subang',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
      quote:
        'Incredible eye for detail and creativity! Video teaser prewedding kami banyak dipuji keluarga dan teman. Tone warnanya hangat, sinematik, dan mewah persis seperti impian kami berdua.',
      rating: 5,
    },
    {
      id: '3',
      name: 'Pak Andi Wijaya',
      role: 'Klien Foto Studio Keluarga',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200',
      quote:
        'Sangat puas dengan foto studio keluarga di Harvest Studio Subang. Ruang studionya bersih, nyaman, propertinya lengkap, dan cetak bingkainya sangat mewah siap dipajang di ruang tamu.',
      rating: 5,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const next = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="bg-[#FAF7F2] text-zinc-900 py-24 px-4 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
          <span className="text-[#A27B42] text-xs font-bold tracking-[0.25em] uppercase block">
            KIND WORDS
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-950">
            What Our Clients Say
          </h2>
          <div className="w-12 h-[2px] bg-[#A27B42] mx-auto mt-3" />
        </div>

        {/* 3 Testimonial Cards Grid (Desktop) / Carousel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-lg p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-zinc-200/80 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* 5 Stars */}
                <div className="flex items-center space-x-1 text-amber-500">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center space-x-3 pt-6 mt-6 border-t border-zinc-100">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-11 h-11 rounded-full object-cover border border-amber-300"
                />
                <div>
                  <h4 className="font-serif text-sm font-bold text-zinc-900">{t.name}</h4>
                  <span className="text-[11px] text-zinc-500 block">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
