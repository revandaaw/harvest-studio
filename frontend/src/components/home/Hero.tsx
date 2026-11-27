'use client';

import React from 'react';
import Link from 'next/link';
import { Camera, Sparkles, Play, Award } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] lg:min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#0A0A0B]">
      {/* Cinematic Background Image with Dark Gradient Overlays */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 transform scale-105 transition-transform duration-1000"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2000')`,
        }}
      />
      {/* Dark Vignette & Gradients to guarantee text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0B] via-[#0A0A0B]/80 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-[#0A0A0B]/60" />

      {/* Main Content Container */}
      <div className="relative max-w-7xl mx-auto px-4 lg:px-8 py-20 w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Headlines & CTAs */}
        <div className="lg:col-span-8 space-y-6">
          <div className="inline-flex items-center space-x-2 text-[#C6A87D] text-xs font-semibold tracking-[0.25em] uppercase">
            <span className="w-6 h-[1px] bg-[#C6A87D]" />
            <span>WE DON&apos;T JUST TAKE PHOTOS,</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
            We Capture <br />
            Emotions. <br />
            <span className="font-script text-[#C6A87D] font-normal text-5xl sm:text-7xl lg:text-8xl tracking-normal inline-block mt-1">
              You Live Them.
            </span>
          </h1>

          <p className="text-zinc-300 text-sm sm:text-base max-w-xl font-light leading-relaxed">
            Layanan fotografi & videografi profesional untuk setiap momen berharga Anda di Subang dan sekitarnya. Ciptakan kenangan abadi yang bernilai dan bercerita bersama Harvest Studio.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              href="/booking"
              className="bg-[#C6A87D] hover:bg-[#D4AF37] text-black font-semibold text-xs uppercase tracking-widest px-8 py-4 rounded-sm transition-all shadow-xl hover:shadow-[#C6A87D]/30 flex items-center space-x-2 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Sparkles className="w-4 h-4" />
              <span>Booking Sekarang</span>
            </Link>

            <Link
              href="/portofolio"
              className="border border-white/20 hover:border-[#C6A87D] bg-zinc-900/60 hover:bg-zinc-900 text-white hover:text-[#C6A87D] font-semibold text-xs uppercase tracking-widest px-7 py-4 rounded-sm transition-all flex items-center space-x-2 backdrop-blur-sm"
            >
              <Play className="w-3.5 h-3.5 text-[#C6A87D] fill-[#C6A87D]" />
              <span>Lihat Portofolio</span>
            </Link>
          </div>
        </div>

        {/* Right Column: 10+ Years Experience Badge (Sesuai Referensi) */}
        <div className="lg:col-span-4 flex justify-start lg:justify-end">
          <div className="bg-zinc-900/80 border border-white/10 backdrop-blur-md p-6 rounded-sm max-w-xs shadow-2xl relative group hover:border-[#C6A87D]/50 transition-all">
            <div className="w-12 h-12 rounded-sm bg-[#C6A87D]/10 border border-[#C6A87D]/30 flex items-center justify-center text-[#C6A87D] mb-4">
              <Camera className="w-6 h-6" />
            </div>
            <div className="font-serif text-3xl font-bold text-white tracking-tight flex items-baseline space-x-1">
              <span>10+</span>
              <span className="text-[#C6A87D] text-lg font-sans">TAHUN</span>
            </div>
            <div className="text-xs uppercase tracking-widest text-zinc-400 font-medium mt-1">
              Pengalaman Profesional
            </div>
            <p className="text-[11px] text-zinc-500 mt-2 leading-relaxed">
              Telah mendokumentasikan lebih dari 800+ pernikahan, prewedding, & momen berharga di Subang & Jawa Barat.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
