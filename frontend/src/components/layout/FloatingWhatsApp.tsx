'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function FloatingWhatsApp() {
  const whatsappNumber = '6281234567890';
  const defaultMessage = encodeURIComponent('Halo Harvest Studio, saya ingin bertanya tentang paket foto dan booking jadwal.');

  return (
    <aside
      aria-label="Kontak WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center group"
    >
      <div className="mr-3 hidden md:block bg-zinc-900 border border-white/10 text-white text-xs px-3 py-1.5 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        Chat Admin Harvest Studio
      </div>
      <a
        href={`https://wa.me/${whatsappNumber}?text=${defaultMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-all duration-300 relative focus:outline-none"
        aria-label="Chat WhatsApp Admin Harvest Studio"
      >
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-300"></span>
        </span>
        <MessageCircle className="w-7 h-7" />
      </a>
    </aside>
  );
}
