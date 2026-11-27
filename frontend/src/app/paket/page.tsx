'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, Filter, Heart, Check, Clock, Users, MapPin, 
  ArrowRight, Sparkles, Scale, X, ChevronRight, SlidersHorizontal 
} from 'lucide-react';
import { fetchAPI, formatRupiah } from '@/lib/api';
import { getWishlist, toggleWishlist, isInWishlist } from '@/lib/wishlist';

interface PackageItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  promoPrice?: number | null;
  duration: string;
  locationType: string;
  crewCount: string;
  maxPersons?: number | null;
  inclusions: string[];
  badge?: string | null;
  coverImage: string;
  gallery: string[];
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

export default function PackageCatalogPage() {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(10000000);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('popular');
  
  // Wishlist & Compare States
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<PackageItem[]>([]);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  useEffect(() => {
    // Read category from URL query if present
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const catParam = urlParams.get('category');
      if (catParam) setSelectedCategory(catParam);
    }

    setWishlist(getWishlist());

    async function loadPackages() {
      setLoading(true);
      const res = await fetchAPI('/packages');
      if (res.success && Array.isArray(res.data)) {
        setPackages(res.data);
      }
      setLoading(false);
    }
    loadPackages();
  }, []);

  const handleWishlistToggle = (id: string) => {
    const updated = toggleWishlist(id);
    setWishlist(updated);
  };

  const handleCompareToggle = (pkg: PackageItem) => {
    if (compareList.some((p) => p.id === pkg.id)) {
      setCompareList(compareList.filter((p) => p.id !== pkg.id));
    } else {
      if (compareList.length >= 3) {
        alert('Maksimal 3 paket yang dapat dibandingkan sekaligus.');
        return;
      }
      setCompareList([...compareList, pkg]);
    }
  };

  // Filter & Sort Logic
  const filteredPackages = useMemo(() => {
    return packages
      .filter((pkg) => {
        if (selectedCategory !== 'all' && pkg.category.slug !== selectedCategory) return false;
        if (selectedLocation !== 'all') {
          if (pkg.locationType !== selectedLocation && pkg.locationType !== 'both') return false;
        }
        const effectivePrice = pkg.promoPrice || pkg.price;
        if (effectivePrice > maxPrice) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = pkg.name.toLowerCase().includes(q);
          const matchDesc = pkg.description.toLowerCase().includes(q);
          if (!matchName && !matchDesc) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const priceA = a.promoPrice || a.price;
        const priceB = b.promoPrice || b.price;
        if (sortBy === 'price_asc') return priceA - priceB;
        if (sortBy === 'price_desc') return priceB - priceA;
        return 0; // default order
      });
  }, [packages, selectedCategory, selectedLocation, maxPrice, searchQuery, sortBy]);

  const categories = [
    { slug: 'all', label: 'Semua Kategori' },
    { slug: 'wedding', label: 'Wedding & Prewedding' },
    { slug: 'studio', label: 'Studio & Portrait' },
    { slug: 'acara', label: 'Dokumentasi Acara' },
    { slug: 'videografi', label: 'Videografi Sinematik' },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-zinc-100 py-12 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="border-b border-white/10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-[#C6A87D] text-xs font-bold tracking-widest uppercase mb-2">
              <span>✦</span>
              <span>KATALOG LAYANAN HARVEST STUDIO</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
              Pilihan Paket & Harga
            </h1>
            <p className="text-zinc-400 text-sm max-w-xl mt-2 font-light">
              Pilih paket fotografi dan videografi profesional terbaik dengan transparansi rincian fasilitas dan jaminan kualitas eksklusif.
            </p>
          </div>

          {/* Search bar & Mobile filter button */}
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari paket foto..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#141417] border border-white/10 rounded-sm pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#C6A87D] transition-colors"
              />
            </div>
            <button
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              className="lg:hidden p-2.5 bg-zinc-900 border border-white/10 rounded-sm text-zinc-300 hover:text-white"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Tabs Bar */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-5 py-2.5 rounded-sm text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.slug
                  ? 'bg-[#C6A87D] text-black shadow-lg shadow-[#C6A87D]/20'
                  : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Main Layout: Sidebar Filters + Package Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar Filters */}
          <aside
            className={`lg:col-span-3 bg-[#111114] border border-white/10 rounded-sm p-6 space-y-6 ${
              showFiltersMobile ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="font-serif text-sm font-bold uppercase tracking-wider text-white flex items-center space-x-2">
                <Filter className="w-4 h-4 text-[#C6A87D]" />
                <span>Filter Paket</span>
              </span>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedLocation('all');
                  setMaxPrice(10000000);
                  setSearchQuery('');
                }}
                className="text-[11px] text-[#C6A87D] hover:underline"
              >
                Reset
              </button>
            </div>

            {/* Lokasi */}
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-wider font-semibold text-zinc-300 block">
                Lokasi Sesi
              </label>
              <div className="space-y-2 text-xs">
                {[
                  { value: 'all', label: 'Semua Lokasi' },
                  { value: 'studio', label: 'Di Dalam Studio' },
                  { value: 'outdoor', label: 'Luar Ruangan (Outdoor)' },
                ].map((loc) => (
                  <label
                    key={loc.value}
                    className="flex items-center space-x-2 cursor-pointer text-zinc-400 hover:text-white"
                  >
                    <input
                      type="radio"
                      name="location"
                      value={loc.value}
                      checked={selectedLocation === loc.value}
                      onChange={() => setSelectedLocation(loc.value)}
                      className="accent-[#C6A87D]"
                    />
                    <span>{loc.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Batas Harga Maksimal */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase tracking-wider font-semibold text-zinc-300">
                  Harga Maksimal
                </label>
                <span className="text-xs text-[#C6A87D] font-mono font-bold">
                  {formatRupiah(maxPrice)}
                </span>
              </div>
              <input
                type="range"
                min={300000}
                max={10000000}
                step={250000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#C6A87D] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                <span>Rp 300rb</span>
                <span>Rp 10jt+</span>
              </div>
            </div>

            {/* Urutkan */}
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider font-semibold text-zinc-300 block">
                Urutkan Berdasarkan
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-[#18181C] border border-white/10 rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C6A87D]"
              >
                <option value="popular">Paling Populer</option>
                <option value="price_asc">Harga Terendah</option>
                <option value="price_desc">Harga Tertinggi</option>
              </select>
            </div>
          </aside>

          {/* Package Grid */}
          <div className="lg:col-span-9 space-y-6">
            {/* Results count */}
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span>Menampilkan <strong className="text-white">{filteredPackages.length}</strong> paket pilihan</span>
              {compareList.length > 0 && (
                <span className="text-[#C6A87D] font-medium">
                  {compareList.length} paket dipilih untuk perbandingan
                </span>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="h-96 bg-zinc-900/60 rounded-sm animate-pulse" />
                ))}
              </div>
            ) : filteredPackages.length === 0 ? (
              <div className="bg-[#111114] border border-white/10 rounded-sm p-12 text-center space-y-3">
                <Sparkles className="w-8 h-8 text-[#C6A87D] mx-auto" />
                <h3 className="font-serif text-lg font-bold text-white">Tidak Ada Paket Yang Sesuai</h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  Coba sesuaikan filter atau rentang harga untuk menemukan paket fotografi yang Anda butuhkan.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedLocation('all');
                    setMaxPrice(10000000);
                    setSearchQuery('');
                  }}
                  className="bg-[#C6A87D] text-black text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-sm"
                >
                  Reset Semua Filter
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPackages.map((pkg) => {
                  const isFavorited = wishlist.includes(pkg.id);
                  const isCompared = compareList.some((p) => p.id === pkg.id);
                  const effectivePrice = pkg.promoPrice || pkg.price;

                  return (
                    <div
                      key={pkg.id}
                      className="bg-[#121215] border border-white/10 hover:border-[#C6A87D]/50 rounded-sm overflow-hidden flex flex-col justify-between shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                    >
                      {/* Image Thumbnail & Badges */}
                      <div className="relative h-56 bg-zinc-900 overflow-hidden">
                        <img
                          src={pkg.coverImage}
                          alt={pkg.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#121215] via-transparent to-black/40" />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-[#C6A87D] px-2.5 py-1 rounded-sm border border-[#C6A87D]/30">
                            {pkg.category.name}
                          </span>
                          {pkg.badge && (
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#C6A87D] text-black px-2 py-0.5 rounded-sm">
                              {pkg.badge}
                            </span>
                          )}
                        </div>

                        {/* Wishlist Button */}
                        <button
                          onClick={() => handleWishlistToggle(pkg.id)}
                          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
                            isFavorited
                              ? 'bg-rose-500 text-white'
                              : 'bg-black/60 text-white hover:text-rose-400'
                          }`}
                          title="Simpan ke Wishlist"
                        >
                          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      {/* Card Body */}
                      <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                        <div className="space-y-3">
                          <h3 className="font-serif text-xl font-bold text-white group-hover:text-[#C6A87D] transition-colors leading-snug">
                            {pkg.name}
                          </h3>

                          {/* Quick Specs */}
                          <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 border-y border-white/5 py-2.5">
                            <span className="flex items-center space-x-1.5">
                              <Clock className="w-3.5 h-3.5 text-[#C6A87D]" />
                              <span>{pkg.duration}</span>
                            </span>
                            <span className="flex items-center space-x-1.5">
                              <Users className="w-3.5 h-3.5 text-[#C6A87D]" />
                              <span>{pkg.crewCount}</span>
                            </span>
                            <span className="flex items-center space-x-1.5">
                              <MapPin className="w-3.5 h-3.5 text-[#C6A87D]" />
                              <span className="capitalize">{pkg.locationType}</span>
                            </span>
                          </div>

                          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                            {pkg.description}
                          </p>

                          {/* Inclusions list preview */}
                          <div className="space-y-1.5 pt-1">
                            {Array.isArray(pkg.inclusions) &&
                              pkg.inclusions.slice(0, 3).map((inc, i) => (
                                <div key={i} className="flex items-start space-x-2 text-xs text-zinc-300">
                                  <Check className="w-3.5 h-3.5 text-[#C6A87D] shrink-0 mt-0.5" />
                                  <span className="truncate">{inc}</span>
                                </div>
                              ))}
                          </div>
                        </div>

                        {/* Pricing & Actions */}
                        <div className="pt-4 border-t border-white/10 space-y-3">
                          <div className="flex items-baseline justify-between">
                            <div>
                              <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">Investasi</span>
                              <div className="flex items-baseline space-x-2">
                                <span className="font-serif text-2xl font-bold text-white group-hover:text-[#C6A87D] transition-colors">
                                  {formatRupiah(effectivePrice)}
                                </span>
                                {pkg.promoPrice && (
                                  <span className="text-xs text-zinc-500 line-through">
                                    {formatRupiah(pkg.price)}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Compare Checkbox */}
                            <label className="flex items-center space-x-1.5 text-[11px] text-zinc-400 cursor-pointer hover:text-white">
                              <input
                                type="checkbox"
                                checked={isCompared}
                                onChange={() => handleCompareToggle(pkg)}
                                className="accent-[#C6A87D] rounded"
                              />
                              <span>Bandingkan</span>
                            </label>
                          </div>

                          {/* Action Buttons */}
                          <div className="grid grid-cols-2 gap-2">
                            <Link
                              href={`/paket/${pkg.slug}`}
                              className="px-3 py-2.5 border border-white/20 hover:border-[#C6A87D] text-xs font-semibold uppercase tracking-wider text-center text-zinc-300 hover:text-white rounded-sm transition-colors"
                            >
                              Detail Paket
                            </Link>
                            <Link
                              href={`/booking?package=${pkg.id}`}
                              className="px-3 py-2.5 bg-[#C6A87D] hover:bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-wider text-center rounded-sm transition-all shadow-md hover:shadow-[#C6A87D]/20"
                            >
                              Booking
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Compare Tray (when 1 or more packages selected) */}
      {compareList.length > 0 && (
        <div className="fixed bottom-6 inset-x-4 max-w-2xl mx-auto z-40 bg-[#141418] border border-[#C6A87D]/50 rounded-lg p-4 shadow-2xl backdrop-blur-md flex items-center justify-between animate-fade-in">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#C6A87D]/20 flex items-center justify-center text-[#C6A87D]">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Perbandingan Paket ({compareList.length}/3)
              </h4>
              <p className="text-[11px] text-zinc-400 truncate max-w-xs">
                {compareList.map((p) => p.name).join(', ')}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCompareList([])}
              className="text-xs text-zinc-400 hover:text-white px-2 py-1"
            >
              Batal
            </button>
            <Link
              href={`/paket/bandingkan?ids=${compareList.map((p) => p.id).join(',')}`}
              className="bg-[#C6A87D] hover:bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-sm"
            >
              Bandingkan Sekarang
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
