'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Check, Clock, Users, MapPin, Heart, Share2, 
  Sparkles, ArrowLeft, ShieldCheck, HelpCircle, Plus 
} from 'lucide-react';
import { fetchAPI, formatRupiah } from '@/lib/api';
import { toggleWishlist, isInWishlist } from '@/lib/wishlist';

export default function PackageDetailPage() {
  const { slug } = useParams();
  const [pkg, setPkg] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [addons, setAddons] = useState<any[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [isFavorited, setIsFavorited] = useState(false);
  const [activeImage, setActiveImage] = useState<string>('');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const res = await fetchAPI(`/packages/detail/${slug}`);
      if (res.success && res.data) {
        setPkg(res.data);
        setActiveImage(res.data.coverImage);
        setIsFavorited(isInWishlist(res.data.id));
      }

      const addRes = await fetchAPI('/addons');
      if (addRes.success && Array.isArray(addRes.data)) {
        setAddons(addRes.data);
      }
      setLoading(false);
    }
    if (slug) loadData();
  }, [slug]);

  const handleWishlist = () => {
    if (!pkg) return;
    toggleWishlist(pkg.id);
    setIsFavorited(!isFavorited);
  };

  const toggleAddon = (addonId: string) => {
    if (selectedAddons.includes(addonId)) {
      setSelectedAddons(selectedAddons.filter((id) => id !== addonId));
    } else {
      setSelectedAddons([...selectedAddons, addonId]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] py-20 px-4 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-[#C6A87D] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs uppercase tracking-widest text-zinc-400">Memuat rincian paket...</p>
        </div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] py-20 px-4 text-center">
        <h2 className="font-serif text-2xl text-white">Paket Tidak Ditemukan</h2>
        <Link href="/paket" className="text-xs text-[#C6A87D] underline mt-4 inline-block">
          Kembali ke Katalog Paket
        </Link>
      </div>
    );
  }

  const effectiveBasePrice = pkg.promoPrice || pkg.price;
  const addonsTotal = selectedAddons.reduce((acc, id) => {
    const item = addons.find((a) => a.id === id);
    return acc + (item ? item.price : 0);
  }, 0);
  const estimatedTotal = effectiveBasePrice + addonsTotal;
  const isStudio = pkg.category?.slug?.includes('studio');
  const dpAmount = Math.round(estimatedTotal * (isStudio ? 0.5 : 0.3));

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-zinc-100 py-12 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <Link
            href="/paket"
            className="inline-flex items-center space-x-2 text-xs uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Semua Paket</span>
          </Link>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleWishlist}
              className={`p-2 rounded-full border border-white/10 transition-colors ${
                isFavorited ? 'text-rose-500 bg-rose-500/10 border-rose-500/30' : 'text-zinc-400 hover:text-white'
              }`}
              title="Simpan Wishlist"
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Top Section: Gallery & Quick Booking Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left: Gallery (60%) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[4/3] rounded-sm overflow-hidden bg-zinc-900 border border-white/10 shadow-2xl">
              <img
                src={activeImage || pkg.coverImage}
                alt={pkg.name}
                className="w-full h-full object-cover"
              />
              {pkg.badge && (
                <div className="absolute top-4 left-4 bg-[#C6A87D] text-black text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-sm shadow-lg">
                  {pkg.badge}
                </div>
              )}
            </div>

            {/* Thumbnail row */}
            {Array.isArray(pkg.gallery) && pkg.gallery.length > 0 && (
              <div className="flex items-center space-x-3 overflow-x-auto pb-2">
                {[pkg.coverImage, ...pkg.gallery].map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-20 h-20 rounded-sm overflow-hidden border-2 shrink-0 transition-all ${
                      activeImage === img ? 'border-[#C6A87D] scale-95' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Package Info & Price Summary (40%) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="text-xs uppercase font-bold tracking-widest text-[#C6A87D]">
                {pkg.category?.name}
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
                {pkg.name}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light pt-2">
                {pkg.description}
              </p>
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-3 gap-3 bg-[#121215] border border-white/10 rounded-sm p-4 text-center">
              <div>
                <Clock className="w-4 h-4 text-[#C6A87D] mx-auto mb-1" />
                <span className="text-[10px] text-zinc-400 block uppercase">Durasi</span>
                <span className="text-xs font-semibold text-white">{pkg.duration}</span>
              </div>
              <div>
                <Users className="w-4 h-4 text-[#C6A87D] mx-auto mb-1" />
                <span className="text-[10px] text-zinc-400 block uppercase">Kru</span>
                <span className="text-xs font-semibold text-white">{pkg.crewCount}</span>
              </div>
              <div>
                <MapPin className="w-4 h-4 text-[#C6A87D] mx-auto mb-1" />
                <span className="text-[10px] text-zinc-400 block uppercase">Lokasi</span>
                <span className="text-xs font-semibold text-white capitalize">{pkg.locationType}</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="bg-[#141418] border border-[#C6A87D]/40 rounded-sm p-6 space-y-4 shadow-xl">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 block">
                  Estimasi Total Investasi
                </span>
                <div className="flex items-baseline space-x-3 mt-1">
                  <span className="font-serif text-3xl font-bold text-[#C6A87D]">
                    {formatRupiah(estimatedTotal)}
                  </span>
                  {pkg.promoPrice && (
                    <span className="text-sm text-zinc-500 line-through">
                      {formatRupiah(pkg.price)}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-zinc-400 mt-1">
                  Uang Muka (DP): <strong className="text-white">{formatRupiah(dpAmount)}</strong> ({isStudio ? '50%' : '30%'}) untuk mengunci slot tanggal.
                </p>
              </div>

              <Link
                href={`/booking?package=${pkg.id}&addons=${selectedAddons.join(',')}`}
                className="w-full flex items-center justify-center space-x-2 bg-[#C6A87D] hover:bg-[#D4AF37] text-black py-4 rounded-sm font-bold text-xs uppercase tracking-widest transition-all shadow-xl hover:shadow-[#C6A87D]/30"
              >
                <Sparkles className="w-4 h-4" />
                <span>Pilih Tanggal & Booking</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Middle Section: Inclusions & Add-on Calculator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-8 border-t border-white/10">
          
          {/* Facilities / What's Included (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="font-serif text-2xl font-bold text-white flex items-center space-x-2">
              <span>Fasilitas & Rincian Paket</span>
            </h3>

            <div className="bg-[#121215] border border-white/10 rounded-sm p-6 space-y-3">
              {Array.isArray(pkg.inclusions) &&
                pkg.inclusions.map((item: string, i: number) => (
                  <div key={i} className="flex items-start space-x-3 py-2 border-b border-white/5 last:border-0">
                    <div className="w-5 h-5 rounded-full bg-[#C6A87D]/20 text-[#C6A87D] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs sm:text-sm text-zinc-200">{item}</span>
                  </div>
                ))}
            </div>

            {/* Terms & Policies */}
            <div className="bg-[#121215] border border-white/10 rounded-sm p-6 space-y-3">
              <h4 className="text-xs uppercase tracking-widest font-bold text-white flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-[#C6A87D]" />
                <span>Ketentuan Pemesanan Harvest Studio</span>
              </h4>
              <ul className="text-xs text-zinc-400 space-y-2 list-disc pl-5">
                <li>Booking wajib membayar DP minimal {isStudio ? '50%' : '30%'} dalam waktu 24 jam setelah reservasi dibuat.</li>
                <li>Pelunasan sisa biaya dilakukan maksimal H-3 sebelum acara (wedding/event) atau pada hari pemotretan (studio).</li>
                <li>Pengajuan reschedule diperbolehkan maksimal H-7 (1 kali tanpa biaya tambahan, tergantung ketersediaan).</li>
                <li>Hasil editing foto diserahkan maksimal 7-14 hari kerja via Google Drive resolusi tinggi.</li>
              </ul>
            </div>
          </div>

          {/* Add-ons Interactive Calculator (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="font-serif text-2xl font-bold text-white">
              Layanan Tambahan (Add-on)
            </h3>
            <p className="text-xs text-zinc-400 font-light">
              Centang add-on di bawah untuk menambahkan fasilitas ke paket Anda secara otomatis.
            </p>

            <div className="space-y-3">
              {addons.map((add) => {
                const isSelected = selectedAddons.includes(add.id);
                return (
                  <div
                    key={add.id}
                    onClick={() => toggleAddon(add.id)}
                    className={`p-4 rounded-sm border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#18181F] border-[#C6A87D] text-white'
                        : 'bg-[#121215] border-white/10 text-zinc-300 hover:border-white/30'
                    }`}
                  >
                    <div className="space-y-1 pr-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold">{add.name}</span>
                      </div>
                      {add.description && (
                        <p className="text-[11px] text-zinc-400">{add.description}</p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono font-bold text-[#C6A87D] block">
                        +{formatRupiah(add.price)}
                      </span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-emerald-400' : 'text-zinc-500'}`}>
                        {isSelected ? '✓ Terpilih' : '+ Tambah'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
