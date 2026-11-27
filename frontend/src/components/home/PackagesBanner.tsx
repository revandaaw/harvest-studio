'use client';

import React from 'react';
import Link from 'next/link';
import { Camera, Sparkles, ArrowRight } from 'lucide-react';

export default function PackagesBanner() {
  const packages = [
    {
      tier: 'BASIC',
      name: 'Studio Portrait & Wisuda',
      desc: 'Cocok untuk sesi potret diri, wisuda, atau pasangan di studio ber-AC.',
      price: 'Mulai Rp 399.000',
      href: '/paket?category=studio',
      badge: 'Favorit',
    },
    {
      tier: 'STANDARD',
      name: 'Prewedding & Acara',
      desc: 'Ideal untuk lamaran, prewedding outdoor, atau dokumentasi gathering.',
      price: 'Mulai Rp 2.200.000',
      href: '/paket?category=wedding',
      badge: 'Best Seller',
    },
    {
      tier: 'PREMIUM',
      name: 'Wedding Full Day Platinum',
      desc: 'Liputan lengkap akad + resepsi foto & video sinematik 4K + album.',
      price: 'Mulai Rp 7.999.000',
      href: '/paket?category=wedding',
      badge: 'Terlengkap',
    },
  ];

  return (
    <section className="bg-[#0D0D0F] text-white py-20 px-4 lg:px-8 border-y border-white/10 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C6A87D]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Headline & Button */}
        <div className="lg:col-span-4 space-y-5">
          <span className="text-[#C6A87D] text-xs font-bold tracking-[0.2em] uppercase block">
            CHOOSE YOUR PERFECT PACKAGE
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            Packages That Fit <br />
            <span className="text-[#C6A87D]">Every Moment</span>
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-sm">
            Tersedia berbagai pilihan paket yang dapat disesuaikan dengan kebutuhan acara Anda. Harga transparan tanpa biaya tersembunyi.
          </p>
          <div className="pt-2">
            <Link
              href="/paket"
              className="inline-flex items-center space-x-2 bg-[#C6A87D] hover:bg-[#D4AF37] text-black font-semibold text-xs uppercase tracking-widest px-7 py-3.5 rounded-sm transition-all shadow-xl hover:shadow-[#C6A87D]/20 transform hover:-translate-y-0.5"
            >
              <span>Lihat Semua Paket</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Middle/Right: 3 Package Cards */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {packages.map((pkg) => (
            <div
              key={pkg.tier}
              className="bg-[#141417] border border-white/10 hover:border-[#C6A87D]/50 rounded-sm p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 group relative shadow-xl"
            >
              {pkg.badge && (
                <span className="absolute top-3 right-3 text-[9px] font-bold uppercase tracking-wider bg-[#C6A87D]/20 text-[#C6A87D] px-2 py-0.5 rounded-sm border border-[#C6A87D]/30">
                  {pkg.badge}
                </span>
              )}

              <div>
                <div className="w-10 h-10 rounded-sm bg-zinc-900 border border-white/10 flex items-center justify-center text-[#C6A87D] mb-4 group-hover:border-[#C6A87D] transition-colors">
                  <Camera className="w-5 h-5" />
                </div>
                <div className="text-[11px] font-bold uppercase tracking-widest text-[#C6A87D]">
                  {pkg.tier}
                </div>
                <h3 className="font-serif text-lg font-bold text-white mt-1 mb-2 group-hover:text-[#F4ECE1] transition-colors">
                  {pkg.name}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {pkg.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block tracking-wider">Investasi</span>
                  <span className="text-sm font-bold text-white group-hover:text-[#C6A87D] transition-colors">
                    {pkg.price}
                  </span>
                </div>
                <Link
                  href={pkg.href}
                  className="w-8 h-8 rounded-full border border-white/20 group-hover:border-[#C6A87D] group-hover:bg-[#C6A87D] group-hover:text-black flex items-center justify-center text-zinc-300 transition-all"
                  aria-label={`Lihat ${pkg.name}`}
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
