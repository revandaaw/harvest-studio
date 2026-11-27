'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Check, X, ArrowLeft, Sparkles, Scale } from 'lucide-react';
import { fetchAPI, formatRupiah } from '@/lib/api';

function CompareContent() {
  const searchParams = useSearchParams();
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadComparePackages() {
      setLoading(true);
      const idsStr = searchParams.get('ids') || '';
      const ids = idsStr.split(',').filter(Boolean);

      const res = await fetchAPI('/packages');
      if (res.success && Array.isArray(res.data)) {
        const selected = res.data.filter((p: any) => ids.includes(p.id));
        setPackages(selected);
      }
      setLoading(false);
    }
    loadComparePackages();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-2 border-[#C6A87D] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs uppercase tracking-widest text-zinc-400">Memuat perbandingan paket...</p>
      </div>
    );
  }

  if (packages.length === 0) {
    return (
      <div className="bg-[#121215] border border-white/10 rounded-sm p-12 text-center space-y-4 max-w-lg mx-auto">
        <Scale className="w-10 h-10 text-[#C6A87D] mx-auto" />
        <h2 className="font-serif text-2xl font-bold text-white">Belum Ada Paket Yang Dipilih</h2>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Silakan buka katalog paket dan centang kotak &apos;Bandingkan&apos; pada hingga 3 paket yang ingin Anda bandingkan.
        </p>
        <Link
          href="/paket"
          className="inline-block bg-[#C6A87D] text-black text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-sm"
        >
          Lihat Katalog Paket
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <Link
          href="/paket"
          className="inline-flex items-center space-x-2 text-xs uppercase tracking-wider text-zinc-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Katalog Paket</span>
        </Link>
        <span className="text-xs text-[#C6A87D] font-mono font-medium">
          Membandingkan {packages.length} Paket
        </span>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse border border-white/10">
          <thead>
            <tr className="bg-[#121215] border-b border-white/10">
              <th className="p-4 text-xs uppercase tracking-widest font-bold text-zinc-400 w-1/4">
                Fitur & Spesifikasi
              </th>
              {packages.map((pkg) => (
                <th key={pkg.id} className="p-4 text-center border-l border-white/10 w-1/4">
                  <div className="relative aspect-video rounded-sm overflow-hidden mb-3">
                    <img src={pkg.coverImage} alt={pkg.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] uppercase font-bold text-[#C6A87D] block mb-1">
                    {pkg.category?.name}
                  </span>
                  <h3 className="font-serif text-base font-bold text-white leading-snug">
                    {pkg.name}
                  </h3>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-xs">
            {/* Price */}
            <tr className="hover:bg-white/[0.02]">
              <td className="p-4 font-semibold text-zinc-300">Investasi (Harga)</td>
              {packages.map((pkg) => (
                <td key={pkg.id} className="p-4 text-center border-l border-white/10">
                  <span className="font-serif text-lg font-bold text-[#C6A87D] block">
                    {formatRupiah(pkg.promoPrice || pkg.price)}
                  </span>
                  {pkg.promoPrice && (
                    <span className="text-[11px] text-zinc-500 line-through">
                      {formatRupiah(pkg.price)}
                    </span>
                  )}
                </td>
              ))}
            </tr>

            {/* Duration */}
            <tr className="hover:bg-white/[0.02]">
              <td className="p-4 font-semibold text-zinc-300">Durasi Layanan</td>
              {packages.map((pkg) => (
                <td key={pkg.id} className="p-4 text-center border-l border-white/10 text-zinc-200">
                  {pkg.duration}
                </td>
              ))}
            </tr>

            {/* Crew Count */}
            <tr className="hover:bg-white/[0.02]">
              <td className="p-4 font-semibold text-zinc-300">Jumlah Kru Bertugas</td>
              {packages.map((pkg) => (
                <td key={pkg.id} className="p-4 text-center border-l border-white/10 text-zinc-200">
                  {pkg.crewCount}
                </td>
              ))}
            </tr>

            {/* Location */}
            <tr className="hover:bg-white/[0.02]">
              <td className="p-4 font-semibold text-zinc-300">Tipe Lokasi</td>
              {packages.map((pkg) => (
                <td key={pkg.id} className="p-4 text-center border-l border-white/10 capitalize text-zinc-200">
                  {pkg.locationType}
                </td>
              ))}
            </tr>

            {/* Inclusions */}
            <tr className="hover:bg-white/[0.02]">
              <td className="p-4 font-semibold text-zinc-300 align-top">Fasilitas Utama Termasuk</td>
              {packages.map((pkg) => (
                <td key={pkg.id} className="p-4 border-l border-white/10 align-top">
                  <ul className="space-y-2 text-left">
                    {Array.isArray(pkg.inclusions) &&
                      pkg.inclusions.map((inc: string, idx: number) => (
                        <li key={idx} className="flex items-start space-x-1.5 text-[11px] text-zinc-300">
                          <Check className="w-3.5 h-3.5 text-[#C6A87D] shrink-0 mt-0.5" />
                          <span>{inc}</span>
                        </li>
                      ))}
                  </ul>
                </td>
              ))}
            </tr>

            {/* Action Row */}
            <tr className="bg-[#121215]">
              <td className="p-4 font-bold uppercase tracking-wider text-[#C6A87D]">Pilihan Tindakan</td>
              {packages.map((pkg) => (
                <td key={pkg.id} className="p-4 text-center border-l border-white/10">
                  <Link
                    href={`/booking?package=${pkg.id}`}
                    className="inline-flex items-center space-x-1.5 bg-[#C6A87D] hover:bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-sm transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Booking Paket Ini</span>
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function PackageComparePage() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-zinc-100 py-12 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Suspense fallback={<div className="text-center py-20 text-xs text-zinc-400">Memuat...</div>}>
          <CompareContent />
        </Suspense>
      </div>
    </div>
  );
}
