import React from 'react';
import Link from 'next/link';
import { Camera, Phone, Mail, MapPin, Send, ArrowUpRight } from 'lucide-react';
import InstagramIcon from '@/components/common/InstagramIcon';

export default function Footer() {
  return (
    <footer className="bg-[#050506] border-t border-white/10 text-zinc-400 text-sm pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Col 1: Bio */}
        <div className="lg:col-span-2 space-y-5">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-full border border-[#C6A87D]/50 flex items-center justify-center bg-zinc-900">
              <Camera className="w-5 h-5 text-[#C6A87D]" />
            </div>
            <div>
              <span className="font-serif tracking-widest text-xl font-bold text-white block">
                HARVEST <span className="text-[#C6A87D]">STUDIO</span>
              </span>
              <span className="text-[9px] tracking-[0.25em] text-zinc-500 uppercase block">
                Subang, Jawa Barat
              </span>
            </div>
          </Link>
          <p className="text-zinc-400 text-xs leading-relaxed max-w-sm">
            We don&apos;t just take photos, we capture emotions. Layanan fotografi dan videografi profesional di Subang untuk pernikahan, prewedding, wisuda, keluarga, dan dokumentasi event berkesan.
          </p>
          <div className="flex items-center space-x-3 pt-2">
            <a
              href="https://instagram.com/harvest_studiophoto"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-[#C6A87D] hover:border-[#C6A87D] transition-all"
              aria-label="Instagram Harvest Studio"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-[#C6A87D] hover:border-[#C6A87D] transition-all"
              aria-label="WhatsApp Harvest Studio"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div className="space-y-4">
          <h4 className="text-white font-serif text-sm tracking-wider uppercase border-b border-white/10 pb-2">
            Navigasi Cepat
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/paket" className="hover:text-[#C6A87D] transition-colors flex items-center justify-between">
                <span>Katalog Paket</span>
                <ArrowUpRight className="w-3 h-3 text-zinc-600" />
              </Link>
            </li>
            <li>
              <Link href="/portofolio" className="hover:text-[#C6A87D] transition-colors flex items-center justify-between">
                <span>Galeri Portofolio</span>
                <ArrowUpRight className="w-3 h-3 text-zinc-600" />
              </Link>
            </li>
            <li>
              <Link href="/edit-cetak" className="hover:text-[#C6A87D] transition-colors flex items-center justify-between">
                <span>Layanan Edit & Cetak</span>
                <ArrowUpRight className="w-3 h-3 text-zinc-600" />
              </Link>
            </li>
            <li>
              <Link href="/penawaran" className="hover:text-[#C6A87D] transition-colors flex items-center justify-between">
                <span>Minta Penawaran</span>
                <ArrowUpRight className="w-3 h-3 text-zinc-600" />
              </Link>
            </li>
            <li>
              <Link href="/wishlist" className="hover:text-[#C6A87D] transition-colors flex items-center justify-between">
                <span>Wishlist Tersimpan</span>
                <ArrowUpRight className="w-3 h-3 text-zinc-600" />
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Layanan Studio */}
        <div className="space-y-4">
          <h4 className="text-white font-serif text-sm tracking-wider uppercase border-b border-white/10 pb-2">
            Layanan Kami
          </h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/paket?category=wedding" className="hover:text-[#C6A87D] transition-colors">Wedding & Prewedding</Link></li>
            <li><Link href="/paket?category=studio" className="hover:text-[#C6A87D] transition-colors">Foto Studio & Portrait</Link></li>
            <li><Link href="/paket?category=acara" className="hover:text-[#C6A87D] transition-colors">Dokumentasi Acara</Link></li>
            <li><Link href="/paket?category=videografi" className="hover:text-[#C6A87D] transition-colors">Videografi Sinematik</Link></li>
            <li><Link href="/edit-cetak" className="hover:text-[#C6A87D] transition-colors">Retouch & Restorasi Foto</Link></li>
            <li><Link href="/edit-cetak" className="hover:text-[#C6A87D] transition-colors">Cetak Foto & Bingkai Lab</Link></li>
          </ul>
        </div>

        {/* Col 4: Informasi & Bantuan */}
        <div className="space-y-4">
          <h4 className="text-white font-serif text-sm tracking-wider uppercase border-b border-white/10 pb-2">
            Informasi
          </h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/status" className="text-[#C6A87D] font-medium hover:underline">Cek Status Pesanan</Link></li>
            <li><Link href="/faq" className="hover:text-[#C6A87D] transition-colors">Tanya Jawab (FAQ)</Link></li>
            <li><Link href="/syarat-ketentuan" className="hover:text-[#C6A87D] transition-colors">Syarat & Kebijakan DP</Link></li>
            <li><Link href="/kebijakan-privasi" className="hover:text-[#C6A87D] transition-colors">Kebijakan Privasi</Link></li>
            <li><Link href="/admin" className="text-zinc-500 hover:text-zinc-300 transition-colors">Portal Admin Studio</Link></li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-xs text-zinc-500">
        <p>© 2026 Harvest Studio (@harvest_studiophoto). All rights reserved.</p>
        <p className="mt-2 md:mt-0">Designed for Harvest Studio Photography & Cinema, Subang.</p>
      </div>
    </footer>
  );
}
