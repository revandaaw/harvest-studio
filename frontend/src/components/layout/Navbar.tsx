'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Camera, MapPin, Phone, Mail, Heart, Menu, X, Sparkles } from 'lucide-react';
import { getWishlist } from '@/lib/wishlist';

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);

    const updateWishlist = () => {
      setWishlistCount(getWishlist().length);
    };
    updateWishlist();
    window.addEventListener('wishlist-updated', updateWishlist);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wishlist-updated', updateWishlist);
    };
  }, []);

  const navLinks = [
    { name: 'Beranda', href: '/' },
    { name: 'Paket & Harga', href: '/paket' },
    { name: 'Portofolio', href: '/portofolio' },
    { name: 'Edit & Cetak', href: '/edit-cetak' },
    { name: 'Penawaran', href: '/penawaran' },
    { name: 'Cek Status', href: '/status' },
    { name: 'Tentang', href: '/tentang' },
    { name: 'Kontak', href: '/kontak' },
  ];

  return (
    <>
      {/* 1. TOP BAR (Sesuai Referensi Foto Desain) */}
      <div className="bg-[#050506] border-b border-white/5 text-zinc-400 text-xs py-2 px-4 lg:px-12 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="w-3.5 h-3.5 text-[#C6A87D]" />
            <span>Jl. Otto Iskandardinata No. 88, Subang, Jawa Barat</span>
          </div>
          <div className="flex items-center space-x-2 tracking-wider text-[#C6A87D] font-medium uppercase text-[11px]">
            <span>✦</span>
            <span>Capturing Moments, Creating Stories</span>
            <span>✦</span>
          </div>
          <div className="flex items-center space-x-6">
            <a href="tel:081234567890" className="flex items-center space-x-1.5 hover:text-white transition-colors">
              <Phone className="w-3.5 h-3.5 text-[#C6A87D]" />
              <span>(0812) 3456-7890</span>
            </a>
            <a href="mailto:halo@harveststudio.id" className="flex items-center space-x-1.5 hover:text-white transition-colors">
              <Mail className="w-3.5 h-3.5 text-[#C6A87D]" />
              <span>halo@harveststudio.id</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. STICKY MAIN NAVBAR */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0A0A0B]/95 backdrop-blur-md shadow-2xl py-3 border-b border-white/10'
            : 'bg-[#0A0A0B]/80 backdrop-blur-sm py-4 border-b border-white/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between">
          {/* Logo Aperture */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-full border border-[#C6A87D]/50 flex items-center justify-center bg-zinc-900 group-hover:border-[#C6A87D] transition-colors shadow-inner">
              <Camera className="w-5 h-5 text-[#C6A87D] group-hover:rotate-45 transition-transform duration-500" />
            </div>
            <div>
              <span className="font-serif tracking-widest text-lg lg:text-xl font-bold text-white block leading-tight">
                HARVEST <span className="text-[#C6A87D]">STUDIO</span>
              </span>
              <span className="text-[9px] tracking-[0.25em] text-zinc-400 uppercase block">
                Photography & Cinema
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-7">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-xs uppercase tracking-widest transition-all relative py-1 ${
                    isActive ? 'text-[#C6A87D] font-semibold' : 'text-zinc-300 hover:text-white'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#C6A87D] rounded-full animate-fade-in" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-4">
            {/* Wishlist Icon */}
            <Link
              href="/wishlist"
              className="relative p-2 text-zinc-300 hover:text-[#C6A87D] transition-colors rounded-full hover:bg-zinc-800"
              title="Paket Favorit"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C6A87D] text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* CTA Button "Booking Sekarang" */}
            <Link
              href="/booking"
              className="hidden sm:inline-flex items-center space-x-2 bg-[#C6A87D] hover:bg-[#D4AF37] text-zinc-950 px-5 py-2.5 rounded-sm font-semibold text-xs tracking-wider uppercase transition-all shadow-lg hover:shadow-[#C6A87D]/20 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Booking Sekarang</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-zinc-300 hover:text-white focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#111114] border-t border-white/10 px-6 py-6 space-y-4">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm uppercase tracking-wider py-2 border-b border-white/5 ${
                    pathname === link.href ? 'text-[#C6A87D] font-bold' : 'text-zinc-300'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="pt-2">
              <Link
                href="/booking"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center space-x-2 bg-[#C6A87D] text-black py-3 rounded text-center font-bold text-xs uppercase tracking-wider"
              >
                <Sparkles className="w-4 h-4" />
                <span>Booking Sekarang</span>
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
