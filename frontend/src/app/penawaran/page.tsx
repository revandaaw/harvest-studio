'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, Sparkles, Building, Calendar, MapPin, DollarSign } from 'lucide-react';
import { fetchAPI } from '@/lib/api';

export default function PenawaranPage() {
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    email: '',
    eventType: 'Wedding / Resepsi Besar',
    eventDate: '',
    location: '',
    duration: '',
    budget: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    const res = await fetchAPI('/quotations', {
      method: 'POST',
      body: JSON.stringify(formData),
    });

    if (res.success) {
      setSuccess(true);
    } else {
      setErrorMessage(res.message || 'Gagal mengirim penawaran. Silakan coba kembali.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-zinc-100 py-12 px-4 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-[#C6A87D] text-xs font-bold tracking-[0.25em] uppercase block">
            CUSTOM QUOTATION
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white">
            Minta Penawaran Acara Khusus
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm font-light max-w-xl mx-auto leading-relaxed">
            Punya kebutuhan liputan acara berskala besar, multi-hari, luar kota, atau format kustom? Isi formulir di bawah dan tim Harvest Studio akan menyusun proposal penawaran harga khusus untuk Anda.
          </p>
        </div>

        {success ? (
          <div className="bg-[#121215] border border-[#C6A87D] rounded-sm p-12 text-center space-y-4 max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#C6A87D]/20 text-[#C6A87D] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-white">Permintaan Terkirim!</h2>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Terima kasih, <strong>{formData.name}</strong>. Tim admin Harvest Studio akan segera mempelajari rincian kebutuhan acara Anda dan mengirimkan penawaran harga via WhatsApp ke <strong>{formData.whatsapp}</strong>.
            </p>
          </div>
        ) : (
          <div className="bg-[#121215] border border-white/10 rounded-sm p-6 lg:p-10 shadow-2xl">
            {errorMessage && (
              <div className="mb-6 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs p-3 rounded-sm">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Nama Lengkap / Instansi *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Anda atau Perusahaan"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#18181D] border border-white/10 rounded-sm px-4 py-3 text-xs text-white focus:outline-none focus:border-[#C6A87D]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Nomor WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="081234567890"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full bg-[#18181D] border border-white/10 rounded-sm px-4 py-3 text-xs text-white focus:outline-none focus:border-[#C6A87D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Email</label>
                  <input
                    type="email"
                    placeholder="email@perusahaan.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#18181D] border border-white/10 rounded-sm px-4 py-3 text-xs text-white focus:outline-none focus:border-[#C6A87D]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Jenis Acara *</label>
                  <select
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                    className="w-full bg-[#18181D] border border-white/10 rounded-sm px-4 py-3 text-xs text-white focus:outline-none focus:border-[#C6A87D]"
                  >
                    <option value="Wedding / Resepsi Besar">Wedding / Resepsi Adat Besar</option>
                    <option value="Corporate Gathering / Gala Dinner">Corporate Gathering / Gala Dinner</option>
                    <option value="Konferensi / Seminar Internasional">Konferensi / Seminar</option>
                    <option value="Dokumentasi Acara Multi-Hari">Dokumentasi Acara Multi-Hari</option>
                    <option value="Komersial Produk / Iklan Brand">Komersial Produk / Iklan Brand</option>
                    <option value="Lainnya">Lainnya (Jelaskan di catatan)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Perkiraan Tanggal</label>
                  <input
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full bg-[#18181D] border border-white/10 rounded-sm px-4 py-3 text-xs text-white focus:outline-none focus:border-[#C6A87D]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Lokasi Acara</label>
                  <input
                    type="text"
                    placeholder="Kota / Nama Gedung"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-[#18181D] border border-white/10 rounded-sm px-4 py-3 text-xs text-white focus:outline-none focus:border-[#C6A87D]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Estimasi Anggaran</label>
                  <input
                    type="text"
                    placeholder="Contoh: 10jt - 15jt"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full bg-[#18181D] border border-white/10 rounded-sm px-4 py-3 text-xs text-white focus:outline-none focus:border-[#C6A87D]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Rincian Kebutuhan Khusus</label>
                <textarea
                  rows={4}
                  placeholder="Ceritakan detail acara Anda, misalnya: butuh 3 fotografer + drone, cetak langsung di lokasi (instant photobooth), layar live streaming, dsb..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-[#18181D] border border-white/10 rounded-sm p-4 text-xs text-white focus:outline-none focus:border-[#C6A87D]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#C6A87D] hover:bg-[#D4AF37] text-black py-4 rounded-sm font-bold text-xs uppercase tracking-widest transition-all shadow-xl disabled:opacity-50"
              >
                {loading ? 'Mengirim Permintaan...' : 'Kirim Permintaan Penawaran'}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
