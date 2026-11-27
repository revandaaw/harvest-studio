'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, Image as ImageIcon, Upload, CheckCircle2, 
  Sliders, Link2, Truck, Store, ArrowRight, ShieldCheck 
} from 'lucide-react';
import { formatRupiah, uploadFormData } from '@/lib/api';

export default function EditCetakPage() {
  // Before / After Slider state (0 to 100%)
  const [sliderPos, setSliderPos] = useState(50);

  // Form State
  const [serviceType, setServiceType] = useState<'EDIT' | 'CETAK'>('EDIT');
  const [customerName, setCustomerName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [specOption, setSpecOption] = useState('retouch_skin');
  const [quantity, setQuantity] = useState(1);
  const [cloudLink, setCloudLink] = useState('');
  const [notes, setNotes] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'PICKUP' | 'DELIVERY'>('PICKUP');
  const [shippingAddress, setShippingAddress] = useState('');
  
  // Submit state
  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Service pricing options
  const editOptions = [
    { id: 'retouch_skin', name: 'Retouch Kulit & Wajah Halus', price: 25000, desc: 'Pembersihan jerawat, flek, perataan warna kulit natural tanpa merusak tekstur.' },
    { id: 'color_grade', name: 'Color Grading Sinematik', price: 35000, desc: 'Penyesuaian tone warna elegan ala film, moody, warm champagne atau vintage look.' },
    { id: 'restorasi_lama', name: 'Restorasi Foto Lama Rusak', price: 75000, desc: 'Perbaikan foto lama yang robek, pudar, berjamur, atau hitam-putih menjadi jernih & berwarna.' },
    { id: 'edit_video_reels', name: 'Editing Video Reels / TikTok', price: 150000, desc: 'Editing video vertikal 60 detik dengan transisi dinamis & pemilihan audio viral.' },
  ];

  const printOptions = [
    { id: 'cetak_4r', name: 'Cetak Foto 4R (10x15 cm)', price: 5000, desc: 'Kertas foto lab premium anti luntur dan tahan air.' },
    { id: 'cetak_10r_bingkai', name: 'Cetak 10R + Bingkai Minimalis', price: 85000, desc: 'Ukuran 20x25 cm dengan bingkai kayu minimalis kaca elegan.' },
    { id: 'cetak_16rp_bingkai', name: 'Cetak 16RP + Bingkai Eksklusif', price: 225000, desc: 'Ukuran 40x60 cm sangat cocok untuk foto keluarga & prewedding resepsi.' },
    { id: 'cetak_kanvas_4060', name: 'Cetak Kanvas Tekstur Kayu 40x60 cm', price: 350000, desc: 'Tekstur kanvas lukisan tebal dengan spanram kayu kokoh modern.' },
    { id: 'album_kolase', name: 'Album Kolase Magazine 20 Hal (Box)', price: 650000, desc: 'Album eksklusif laminasi doff/glossy dengan hardbox kemasan mewah.' },
  ];

  const currentOptions = serviceType === 'EDIT' ? editOptions : printOptions;
  const currentSelected = currentOptions.find((o) => o.id === specOption) || currentOptions[0];
  const unitPrice = currentSelected.price;
  const totalAmount = unitPrice * quantity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!customerName || !whatsapp) {
      setErrorMessage('Nama dan Nomor WhatsApp wajib diisi.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('customerName', customerName);
    formData.append('whatsapp', whatsapp);
    formData.append('email', email);
    formData.append('serviceType', serviceType);
    formData.append('specifications', JSON.stringify({
      optionId: currentSelected.id,
      optionName: currentSelected.name,
      unitPrice,
    }));
    formData.append('quantity', String(quantity));
    formData.append('totalAmount', String(totalAmount));
    formData.append('cloudLink', cloudLink);
    formData.append('notes', notes);
    formData.append('deliveryMethod', deliveryMethod);
    formData.append('shippingAddress', shippingAddress);

    const res = await uploadFormData('/edit-print', formData);
    if (res.success && res.data) {
      setOrderResult(res.data);
    } else {
      setErrorMessage(res.message || 'Gagal mengirim pesanan. Silakan periksa formulir Anda.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-zinc-100 py-12 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[#C6A87D] text-xs font-bold tracking-[0.25em] uppercase block">
            JASA EDIT & CETAK LAB
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white">
            Layanan Edit Foto & Cetak Presisi
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm font-light leading-relaxed">
            Sempurnakan foto berharga Anda dengan sentuhan retouch warna profesional dan kualitas cetak lab terbaik yang tahan puluhan tahun.
          </p>
        </div>

        {/* 1. BEFORE / AFTER COMPARISON SLIDER (FR-060) */}
        <div className="bg-[#121215] border border-white/10 rounded-sm p-6 lg:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-4">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-[#C6A87D] block">
                PRATINJAU KUALITAS RETOUCH
              </span>
              <h2 className="font-serif text-2xl font-bold text-white">
                Bandingkan Hasil Sebelum vs Sesudah Edit
              </h2>
            </div>
            <span className="text-xs text-zinc-400">
              Geser garis pembatas di bawah untuk melihat perbandingan
            </span>
          </div>

          <div className="relative aspect-[16/9] max-h-[500px] w-full rounded-sm overflow-hidden select-none shadow-2xl">
            {/* After Image (Full background) */}
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1400"
              alt="Setelah Retouch Harvest Studio"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-[#C6A87D] text-black text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-sm shadow-lg">
              Sesudah (Retouched & Graded)
            </div>

            {/* Before Image (Clipped by slider position) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPos}%` }}
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=20&w=1400&blur=2"
                alt="Sebelum Retouch"
                className="absolute inset-0 w-full h-full object-cover filter grayscale contrast-75 brightness-90 max-w-none"
                style={{ width: '100%', height: '100%' }}
              />
              <div className="absolute top-4 left-4 bg-black/80 text-zinc-300 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-sm shadow-lg border border-white/10">
                Sebelum (Original)
              </div>
            </div>

            {/* Divider Line & Handle */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white cursor-ew-resize"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#C6A87D] text-black flex items-center justify-center shadow-xl border-2 border-white">
                <Sliders className="w-4 h-4 rotate-90" />
              </div>
            </div>

            {/* Interactive Range Input overlay */}
            <input
              type="range"
              min={0}
              max={100}
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              aria-label="Geser untuk membandingkan sebelum dan sesudah edit foto"
              className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full"
            />
          </div>
        </div>

        {/* 2. ORDER FORM & SPECIFICATIONS */}
        {orderResult ? (
          <div className="bg-[#121215] border border-[#C6A87D] rounded-sm p-8 max-w-xl mx-auto text-center space-y-5 animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-[#C6A87D]/20 text-[#C6A87D] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <span className="text-xs uppercase font-bold tracking-widest text-[#C6A87D] block">
              PESANAN DITERIMA
            </span>
            <h2 className="font-serif text-2xl font-bold text-white">
              Pesanan Layanan Berhasil Dibuat!
            </h2>
            <div className="bg-[#18181D] border border-white/10 p-4 rounded-sm text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-400">Kode Pesanan:</span>
                <span className="font-mono font-bold text-[#C6A87D]">{orderResult.orderCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Nama Pemesan:</span>
                <span className="text-white font-medium">{orderResult.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Estimasi Total:</span>
                <span className="font-mono font-bold text-white">{formatRupiah(orderResult.totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Status Awal:</span>
                <span className="text-amber-400 font-semibold">{orderResult.status}</span>
              </div>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Tim Harvest Studio akan memeriksa berkas Anda dan mengirim instruksi konfirmasi via WhatsApp ke {orderResult.whatsapp}.
            </p>
            <div className="pt-2 flex justify-center space-x-3">
              <Link
                href={`/status?code=${orderResult.orderCode}&phone=${orderResult.whatsapp}`}
                className="bg-[#C6A87D] text-black text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-sm"
              >
                Cek Status Pesanan
              </Link>
              <button
                onClick={() => setOrderResult(null)}
                className="border border-white/20 text-xs text-zinc-300 px-4 py-3 rounded-sm hover:bg-white/5"
              >
                Buat Pesanan Baru
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Service Type Selection & Price List */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center space-x-2 bg-zinc-900 p-1 rounded-sm border border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setServiceType('EDIT');
                    setSpecOption('retouch_skin');
                  }}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-sm text-xs uppercase font-bold tracking-wider transition-all ${
                    serviceType === 'EDIT'
                      ? 'bg-[#C6A87D] text-black shadow-md'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Jasa Edit & Retouch</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setServiceType('CETAK');
                    setSpecOption('cetak_10r_bingkai');
                  }}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-sm text-xs uppercase font-bold tracking-wider transition-all ${
                    serviceType === 'CETAK'
                      ? 'bg-[#C6A87D] text-black shadow-md'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>Jasa Cetak & Bingkai</span>
                </button>
              </div>

              {/* Service Cards */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase tracking-widest font-bold text-zinc-300">
                  Pilih Spesifikasi Layanan:
                </h3>
                {currentOptions.map((opt) => {
                  const isChecked = specOption === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setSpecOption(opt.id)}
                      className={`p-4 rounded-sm border cursor-pointer transition-all flex items-start justify-between ${
                        isChecked
                          ? 'bg-[#18181D] border-[#C6A87D] shadow-lg'
                          : 'bg-[#121215] border-white/10 text-zinc-300 hover:border-white/30'
                      }`}
                    >
                      <div className="space-y-1 pr-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="specOption"
                            checked={isChecked}
                            onChange={() => setSpecOption(opt.id)}
                            className="accent-[#C6A87D]"
                          />
                          <span className="text-xs font-bold text-white">{opt.name}</span>
                        </div>
                        <p className="text-[11px] text-zinc-400 pl-5">{opt.desc}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-mono text-xs font-bold text-[#C6A87D] block">
                          {formatRupiah(opt.price)}
                        </span>
                        <span className="text-[10px] text-zinc-500 uppercase">per unit</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Order Form */}
            <div className="lg:col-span-6 bg-[#121215] border border-white/10 rounded-sm p-6 lg:p-8 space-y-6">
              <h3 className="font-serif text-xl font-bold text-white border-b border-white/10 pb-3">
                Formulir Pemesanan {serviceType === 'EDIT' ? 'Edit Foto' : 'Cetak Foto'}
              </h3>

              {errorMessage && (
                <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs p-3 rounded-sm">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-300">Nama Lengkap *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Dimas Aditya"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-[#18181D] border border-white/10 rounded-sm px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C6A87D]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-300">Nomor WhatsApp Aktif *</label>
                    <input
                      type="tel"
                      required
                      placeholder="Contoh: 081234567890"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full bg-[#18181D] border border-white/10 rounded-sm px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C6A87D]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Email (Opsional)</label>
                  <input
                    type="email"
                    placeholder="email@anda.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#18181D] border border-white/10 rounded-sm px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C6A87D]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Jumlah File / Lembar</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                      className="w-24 bg-[#18181D] border border-white/10 rounded-sm px-3 py-2 text-xs text-white font-mono"
                    />
                    <span className="text-xs text-zinc-400">
                      Total: <strong className="text-[#C6A87D]">{formatRupiah(totalAmount)}</strong>
                    </span>
                  </div>
                </div>

                {/* Cloud link or file */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300 flex items-center space-x-1.5">
                    <Link2 className="w-3.5 h-3.5 text-[#C6A87D]" />
                    <span>Tautan Google Drive / Cloud File Foto</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://drive.google.com/drive/folders/..."
                    value={cloudLink}
                    onChange={(e) => setCloudLink(e.target.value)}
                    className="w-full bg-[#18181D] border border-white/10 rounded-sm px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C6A87D]"
                  />
                  <p className="text-[10px] text-zinc-500">
                    Pastikan izin akses tautan Google Drive disetel ke &apos;Siapa saja yang memiliki link&apos;.
                  </p>
                </div>

                {/* Delivery options for Print */}
                {serviceType === 'CETAK' && (
                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <label className="text-xs font-semibold text-zinc-300 block">Metode Pengambilan</label>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <label className="flex items-center space-x-2 p-3 bg-zinc-900 border border-white/10 rounded-sm cursor-pointer">
                        <input
                          type="radio"
                          name="delivery"
                          checked={deliveryMethod === 'PICKUP'}
                          onChange={() => setDeliveryMethod('PICKUP')}
                          className="accent-[#C6A87D]"
                        />
                        <Store className="w-4 h-4 text-[#C6A87D]" />
                        <span>Ambil di Studio (Subang)</span>
                      </label>
                      <label className="flex items-center space-x-2 p-3 bg-zinc-900 border border-white/10 rounded-sm cursor-pointer">
                        <input
                          type="radio"
                          name="delivery"
                          checked={deliveryMethod === 'DELIVERY'}
                          onChange={() => setDeliveryMethod('DELIVERY')}
                          className="accent-[#C6A87D]"
                        />
                        <Truck className="w-4 h-4 text-[#C6A87D]" />
                        <span>Kirim Kurir</span>
                      </label>
                    </div>

                    {deliveryMethod === 'DELIVERY' && (
                      <textarea
                        rows={2}
                        placeholder="Alamat lengkap penerima & kecamatan..."
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        className="w-full bg-[#18181D] border border-white/10 rounded-sm p-3 text-xs text-white mt-2"
                      />
                    )}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Catatan Khusus / Permintaan Edit</label>
                  <textarea
                    rows={3}
                    placeholder="Contoh: Hilangkan noda di baju sebelah kiri, beri nuansa warm sunset..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-[#18181D] border border-white/10 rounded-sm p-3 text-xs text-white focus:outline-none focus:border-[#C6A87D]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#C6A87D] hover:bg-[#D4AF37] text-black py-4 rounded-sm font-bold text-xs uppercase tracking-widest transition-all shadow-xl disabled:opacity-50 mt-4"
                >
                  {loading ? 'Mengirim Pesanan...' : `Kirim Pesanan (${formatRupiah(totalAmount)})`}
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
