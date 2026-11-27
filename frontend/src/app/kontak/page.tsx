import React from 'react';
import { MapPin, Phone, Mail, Clock, MessageSquare } from 'lucide-react';
import InstagramIcon from '@/components/common/InstagramIcon';

export default function KontakPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-zinc-100 py-16 px-4 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[#C6A87D] text-xs font-bold tracking-[0.25em] uppercase block">
            HUBUNGI KAMI
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white">
            Kontak & Lokasi Studio
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm font-light">
            Kunjungi studio kami di Subang atau hubungi admin Harvest Studio untuk diskusi konsep dan jadwal.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#121215] border border-white/10 rounded-sm p-6 space-y-4">
              <h3 className="font-serif text-lg font-bold text-white border-b border-white/5 pb-2">
                Informasi Kontak
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start space-x-3 text-zinc-300">
                  <MapPin className="w-4 h-4 text-[#C6A87D] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-0.5">Alamat Studio:</strong>
                    <span>Jl. Otto Iskandardinata No. 88, Subang, Jawa Barat 41211 (Dekat Alun-Alun Subang)</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-zinc-300">
                  <Phone className="w-4 h-4 text-[#C6A87D] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-0.5">Telepon & WhatsApp:</strong>
                    <span>+62 812-3456-7890</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-zinc-300">
                  <Mail className="w-4 h-4 text-[#C6A87D] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-0.5">Email Resmi:</strong>
                    <span>halo@harveststudio.id</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-zinc-300">
                  <InstagramIcon className="w-4 h-4 text-[#C6A87D] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-0.5">Instagram:</strong>
                    <a
                      href="https://instagram.com/harvest_studiophoto"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#C6A87D] hover:underline"
                    >
                      @harvest_studiophoto
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-zinc-300 border-t border-white/5 pt-3">
                  <Clock className="w-4 h-4 text-[#C6A87D] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-0.5">Jam Operasional Studio:</strong>
                    <span>Senin - Minggu: 09:00 - 20:30 WIB</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-sm font-bold text-xs uppercase tracking-wider transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat WhatsApp Langsung</span>
                </a>
              </div>
            </div>
          </div>

          {/* Map Area */}
          <div className="lg:col-span-7 bg-[#121215] border border-white/10 rounded-sm overflow-hidden p-6 space-y-4">
            <h3 className="font-serif text-lg font-bold text-white">
              Peta Lokasi Harvest Studio Subang
            </h3>
            <div className="aspect-[16/10] bg-zinc-900 rounded-sm overflow-hidden relative border border-white/5 flex items-center justify-center text-center p-6">
              <div className="space-y-3">
                <MapPin className="w-8 h-8 text-[#C6A87D] mx-auto animate-bounce" />
                <h4 className="font-serif text-base font-bold text-white">Harvest Studio Subang</h4>
                <p className="text-xs text-zinc-400 max-w-sm">
                  Jl. Otto Iskandardinata No. 88, Subang, Jawa Barat. Mudah diakses dari pusat kota Subang dan Tol Cipali.
                </p>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-[#C6A87D] text-black text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-sm"
                >
                  Buka di Google Maps
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
