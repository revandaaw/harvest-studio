import React from 'react';
import Link from 'next/link';
import { Camera, Award, Heart, CheckCircle2, MapPin, Sparkles } from 'lucide-react';

export default function TentangPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-zinc-100 py-16 px-4 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Hero About */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-[#C6A87D] text-xs font-bold tracking-[0.25em] uppercase block">
            TENTANG HARVEST STUDIO
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white">
            Dedikasi Menangkap Emosi & Cerita Abadi
          </h1>
          <p className="text-zinc-300 text-sm font-light leading-relaxed">
            Berdiri di jantung kota Subang, Jawa Barat, Harvest Studio hadir sebagai studio fotografi dan videografi profesional yang memadukan kehangatan emosi dengan estetika visual sinematik modern.
          </p>
        </div>

        {/* 2-Column Story */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative rounded-sm overflow-hidden border border-white/10 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1200"
              alt="Harvest Studio Subang Studio Photography"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-xs uppercase font-bold text-[#C6A87D] tracking-widest block">Subang, Jawa Barat</span>
              <p className="text-white font-serif text-lg font-bold">Studio Lengkap & Modern dengan Tata Lampu Standar Industri</p>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Bukan Sekadar Mengambil Foto, Kami Menjaga Setiap Cerita Tetap Hidup
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Kami percaya bahwa setiap detik dalam momen pernikahan, senyum kelulusan anak, atau kebersamaan keluarga memiliki nilainya tersendiri. Tim Harvest Studio mengedepankan pendekatan personal, mengarahkan gaya dengan santai dan ramah agar setiap pose tampak natural dan penuh jiwa.
            </p>
            <div className="space-y-3 pt-2">
              {[
                'Peralatan kamera mirrorless cinema 4K dan lighting studio berstandar internasional.',
                'Studio ber-AC nyaman dengan ragam properti adat, formal, hingga minimalis.',
                'Jalur komunikasi cepat via WhatsApp dan sistem pengecekan ketersediaan jadwal terpadu.',
                'Hasil cetak lab profesional bergaransi anti pudar dan tahan puluhan tahun.',
              ].map((point, i) => (
                <div key={i} className="flex items-start space-x-3 text-xs text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-[#C6A87D] shrink-0 mt-0.5" />
                  <span>{point}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link
                href="/booking"
                className="inline-flex items-center space-x-2 bg-[#C6A87D] hover:bg-[#D4AF37] text-black font-semibold text-xs uppercase tracking-widest px-7 py-3.5 rounded-sm transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Konsultasi & Reservasi</span>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
