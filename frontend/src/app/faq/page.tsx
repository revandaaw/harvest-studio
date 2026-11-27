'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Bagaimana alur pemesanan (booking) di Harvest Studio?',
      a: 'Pilih paket yang Anda inginkan di halaman Katalog Paket, tentukan tanggal dan jam sesi yang tersedia di kalender booking, pilih add-on (opsional), lalu isi data diri. Setelah booking dibuat, silakan lakukan pembayaran DP untuk mengunci jadwal.',
    },
    {
      q: 'Berapa besaran uang muka (DP) yang harus dibayarkan?',
      a: 'Besaran DP adalah 50% untuk sesi foto studio dan 30% untuk paket wedding / dokumentasi acara. Pembayaran DP wajib dilakukan dalam waktu maksimal 24 jam setelah reservasi.',
    },
    {
      q: 'Apakah bisa mengajukan perubahan jadwal (reschedule)?',
      a: 'Bisa. Permintaan reschedule dapat diajukan maksimal H-7 sebelum hari pemotretan (1 kali tanpa biaya tambahan), dengan catatan jadwal pengganti masih tersedia di sistem kami.',
    },
    {
      q: 'Berapa lama proses pengerjaan dan penyerahan hasil foto?',
      a: 'Semua softcopy foto mentah original (Google Drive) diserahkan maksimal 2 hari setelah acara. Foto edit diserahkan 7-14 hari kerja, dan album cetak siap diambil/dikirim dalam 14-21 hari kerja.',
    },
    {
      q: 'Apakah tim Harvest Studio bisa melayani sesi di luar kota Subang?',
      a: 'Bisa! Kami siap melayani pemotretan ke Bandung, Purwakarta, Karawang, Jakarta, maupun destinasi luar kota lainnya. Biaya akomodasi & transport disesuaikan dengan jarak lokasi.',
    },
    {
      q: 'Apakah saya bisa booking langsung lewat WhatsApp?',
      a: 'Tentu. Anda dapat menekan tombol WhatsApp di pojok kanan bawah website untuk berkonsultasi langsung dengan admin kami.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-zinc-100 py-16 px-4 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-[#C6A87D] text-xs font-bold tracking-[0.25em] uppercase block">
            PERTANYAAN UMUM
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white">
            Frequently Asked Questions
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm font-light">
            Temukan jawaban atas pertanyaan yang paling sering diajukan mengenai layanan studio dan prosedur pemesanan kami.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="bg-[#121215] border border-white/10 rounded-sm overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full p-5 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-white hover:text-[#C6A87D] transition-colors"
                >
                  <span className="pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#C6A87D] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-zinc-400 leading-relaxed border-t border-white/5 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still Have Questions CTA */}
        <div className="bg-[#141418] border border-[#C6A87D]/30 rounded-sm p-8 text-center space-y-4">
          <HelpCircle className="w-8 h-8 text-[#C6A87D] mx-auto" />
          <h3 className="font-serif text-xl font-bold text-white">Masih Memiliki Pertanyaan Lain?</h3>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            Admin Harvest Studio dengan senang hati siap membantu menjawab pertanyaan Anda melalui chat WhatsApp interaktif.
          </p>
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-[#C6A87D] hover:bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-sm transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Tanya Admin via WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
