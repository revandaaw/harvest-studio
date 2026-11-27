'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Trash2, ArrowRight, Sparkles, Clock, Users, MapPin } from 'lucide-react';
import { fetchAPI, formatRupiah } from '@/lib/api';
import { getWishlist, toggleWishlist } from '@/lib/wishlist';

export default function WishlistPage() {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWishlistPackages() {
      setLoading(true);
      const ids = getWishlist();
      setWishlistIds(ids);

      const res = await fetchAPI('/packages');
      if (res.success && Array.isArray(res.data)) {
        const favorited = res.data.filter((p: any) => ids.includes(p.id));
        setPackages(favorited);
      }
      setLoading(false);
    }
    loadWishlistPackages();
  }, []);

  const handleRemove = (id: string) => {
    const updated = toggleWishlist(id);
    setWishlistIds(updated);
    setPackages(packages.filter((p) => p.id !== id));
  };

  const handleClearAll = () => {
    if (confirm('Kosongkan semua paket dari daftar wishlist?')) {
      localStorage.removeItem('harvest_studio_wishlist');
      setWishlistIds([]);
      setPackages([]);
      window.dispatchEvent(new Event('wishlist-updated'));
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-zinc-100 py-12 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-white/10 pb-6 flex items-center justify-between">
          <div>
            <span className="text-[#C6A87D] text-xs font-bold tracking-widest uppercase block mb-1">
              FAVORIT TERSIMPAN
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Wishlist Paket Saya
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1">
              Daftar paket fotografi pilihan yang Anda simpan untuk perbandingan dan reservasi.
            </p>
          </div>

          {packages.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs text-rose-400 hover:text-rose-300 underline"
            >
              Kosongkan Wishlist
            </button>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-2 border-[#C6A87D] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs uppercase tracking-widest text-zinc-400">Memuat wishlist...</p>
          </div>
        ) : packages.length === 0 ? (
          <div className="bg-[#121215] border border-white/10 rounded-sm p-16 text-center space-y-4 max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-500 mx-auto">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-white">Wishlist Anda Masih Kosong</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Jelajahi paket fotografi kami dan tekan ikon hati pada paket yang Anda sukai untuk menyimpannya di sini.
            </p>
            <Link
              href="/paket"
              className="inline-block bg-[#C6A87D] hover:bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-sm transition-all"
            >
              Jelajahi Katalog Paket
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-[#121215] border border-white/10 rounded-sm overflow-hidden flex flex-col justify-between shadow-xl relative group"
              >
                <div className="relative h-48 bg-zinc-900">
                  <img src={pkg.coverImage} alt={pkg.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121215] to-transparent" />
                  <button
                    onClick={() => handleRemove(pkg.id)}
                    className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-rose-600 text-white rounded-full transition-colors"
                    title="Hapus dari Wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#C6A87D] tracking-wider block">
                      {pkg.category?.name}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-white group-hover:text-[#C6A87D] transition-colors mt-1">
                      {pkg.name}
                    </h3>

                    <div className="flex items-center space-x-3 text-xs text-zinc-400 py-2">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-[#C6A87D]" />
                        <span>{pkg.duration}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Users className="w-3 h-3 text-[#C6A87D]" />
                        <span>{pkg.crewCount}</span>
                      </span>
                    </div>

                    <span className="font-serif text-xl font-bold text-[#C6A87D] block pt-2">
                      {formatRupiah(pkg.promoPrice || pkg.price)}
                    </span>
                  </div>

                  <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-2">
                    <Link
                      href={`/paket/${pkg.slug}`}
                      className="px-3 py-2 border border-white/20 text-xs font-semibold uppercase tracking-wider text-center text-zinc-300 hover:text-white rounded-sm"
                    >
                      Detail
                    </Link>
                    <Link
                      href={`/booking?package=${pkg.id}`}
                      className="px-3 py-2 bg-[#C6A87D] hover:bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-wider text-center rounded-sm transition-all"
                    >
                      Booking
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
