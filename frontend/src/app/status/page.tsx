'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, CheckCircle2, Clock, AlertCircle, Upload, 
  Printer, CreditCard, QrCode, FileText, ChevronRight, Store, Truck, Phone 
} from 'lucide-react';
import { fetchAPI, formatRupiah, uploadFormData } from '@/lib/api';

function StatusContent() {
  const searchParams = useSearchParams();
  const [code, setCode] = useState('');
  const [phone, setPhone] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [orderType, setOrderType] = useState<'BOOKING' | 'EDIT_PRINT' | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Upload proof modal state
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [uploadingProof, setUploadingProof] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState('');

  useEffect(() => {
    const codeParam = searchParams.get('code');
    const phoneParam = searchParams.get('phone');
    if (codeParam && phoneParam) {
      setCode(codeParam);
      setPhone(phoneParam);
      trackOrder(codeParam, phoneParam);
    }
  }, [searchParams]);

  const trackOrder = async (searchCode: string, searchPhone: string) => {
    setErrorMsg('');
    setOrderData(null);
    setUploadSuccess('');
    if (!searchCode || !searchPhone) {
      setErrorMsg('Kode pesanan dan nomor WhatsApp wajib diisi.');
      return;
    }

    setLoading(true);
    const upperCode = searchCode.trim().toUpperCase();

    if (upperCode.startsWith('HSE-')) {
      // Edit/Print tracking
      const res = await fetchAPI(`/edit-print/track?code=${upperCode}&phone=${searchPhone.trim()}`);
      if (res.success && res.data) {
        setOrderData(res.data);
        setOrderType('EDIT_PRINT');
      } else {
        setErrorMsg(res.message || 'Pesanan edit/cetak tidak ditemukan.');
      }
    } else {
      // Booking tracking
      const res = await fetchAPI(`/bookings/track?code=${upperCode}&phone=${searchPhone.trim()}`);
      if (res.success && res.data) {
        setOrderData(res.data);
        setOrderType('BOOKING');
      } else {
        setErrorMsg(res.message || 'Pesanan reservasi tidak ditemukan.');
      }
    }
    setLoading(false);
  };

  const handleUploadProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofFile || !orderData) return;
    setUploadingProof(true);
    setUploadSuccess('');

    const formData = new FormData();
    formData.append('bookingId', orderData.id);
    formData.append('amount', String(orderData.dpAmount));
    formData.append('type', 'DP');
    formData.append('method', 'TRANSFER_MANUAL');
    formData.append('proof', proofFile);

    const res = await uploadFormData('/payments/proof', formData);
    if (res.success) {
      setUploadSuccess('Bukti pembayaran berhasil diunggah! Status pesanan kini menunggu konfirmasi admin.');
      setProofFile(null);
      // Re-fetch booking data
      trackOrder(code, phone);
    } else {
      alert(res.message || 'Gagal mengunggah bukti.');
    }
    setUploadingProof(false);
  };

  const handleSimulatePayment = async () => {
    if (!orderData) return;
    if (confirm('Jalankan simulasi pembayaran otomatis QRIS untuk mengonfirmasi jadwal ini sekarang?')) {
      setLoading(true);
      const res = await fetchAPI('/payments/simulate-instant', {
        method: 'POST',
        body: JSON.stringify({
          bookingId: orderData.id,
          amount: orderData.dpAmount,
          method: 'QRIS_SIMULASI',
          type: 'DP',
        }),
      });
      if (res.success) {
        alert('Simulasi pembayaran berhasil! Jadwal Anda telah Terkonfirmasi.');
        trackOrder(code, phone);
      } else {
        alert(res.message || 'Gagal memproses simulasi.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Search Box */}
      <div className="bg-[#121215] border border-white/10 rounded-sm p-6 lg:p-8 max-w-2xl mx-auto shadow-2xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            trackOrder(code, phone);
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Kode Booking / Pesanan *</label>
              <input
                type="text"
                required
                placeholder="Contoh: HSV-202611-0001"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full bg-[#18181D] border border-white/10 rounded-sm px-3.5 py-2.5 text-xs text-white uppercase font-mono focus:outline-none focus:border-[#C6A87D]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Nomor WhatsApp *</label>
              <input
                type="tel"
                required
                placeholder="Contoh: 081234567890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#18181D] border border-white/10 rounded-sm px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C6A87D]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C6A87D] hover:bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-widest py-3 rounded-sm transition-all flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50"
          >
            <Search className="w-4 h-4" />
            <span>{loading ? 'Mencari...' : 'Lacak Status Pesanan'}</span>
          </button>
        </form>

        {errorMsg && (
          <div className="mt-4 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs p-3 rounded-sm flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* TRACKING RESULTS */}
      {orderData && (
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-in print:m-0 print:p-0">
          
          {uploadSuccess && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs p-4 rounded-sm flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{uploadSuccess}</span>
            </div>
          )}

          {/* BOOKING DETAILS */}
          {orderType === 'BOOKING' && (
            <div className="bg-[#121215] border border-white/10 rounded-sm p-6 lg:p-8 space-y-6 shadow-2xl print:bg-white print:text-black print:border-black">
              {/* Header card with status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6 print:border-black">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#C6A87D] block">
                    HARVEST STUDIO SUBANG
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-white print:text-black">
                    Bukti Reservasi (Invoice)
                  </h2>
                  <span className="font-mono text-xs text-zinc-400 print:text-zinc-700">
                    Kode: {orderData.bookingCode}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-widest block mb-1">
                    Status Pesanan
                  </span>
                  <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-wider ${
                    orderData.status === 'CONFIRMED'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : orderData.status === 'PENDING_CONFIRMATION'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : orderData.status === 'COMPLETED'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}>
                    <span>{orderData.status}</span>
                  </span>
                </div>
              </div>

              {/* Rincian Customer & Jadwal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-zinc-300 print:text-black">
                <div className="space-y-2">
                  <strong className="text-white print:text-black uppercase text-[11px] tracking-wider block">
                    Data Pemesan:
                  </strong>
                  <div>Nama: <strong>{orderData.customer?.name}</strong></div>
                  <div>WhatsApp: {orderData.customer?.whatsapp}</div>
                  <div>Email: {orderData.customer?.email || '-'}</div>
                  <div>Lokasi: <span className="capitalize">{orderData.location}</span> ({orderData.locationAddress || 'Studio Subang'})</div>
                </div>

                <div className="space-y-2">
                  <strong className="text-white print:text-black uppercase text-[11px] tracking-wider block">
                    Jadwal Pemotretan:
                  </strong>
                  <div>Tanggal: <strong>{orderData.eventDate}</strong></div>
                  <div>Jam Sesi: <strong>{orderData.timeSlot}</strong></div>
                  <div>Paket Layanan: <strong>{orderData.package?.name}</strong></div>
                  <div>Kru Ditugaskan: {orderData.package?.crewCount}</div>
                </div>
              </div>

              {/* Tabel Biaya & DP */}
              <div className="border border-white/10 rounded-sm overflow-hidden text-xs print:border-black">
                <table className="w-full text-left">
                  <thead className="bg-[#18181D] text-zinc-400 print:bg-zinc-100 print:text-black border-b border-white/10 print:border-black">
                    <tr>
                      <th className="p-3">Deskripsi Fasilitas</th>
                      <th className="p-3 text-right">Nominal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 print:divide-black">
                    <tr>
                      <td className="p-3">Paket Dasar: {orderData.package?.name}</td>
                      <td className="p-3 text-right font-mono">{formatRupiah(orderData.package?.promoPrice || orderData.package?.price)}</td>
                    </tr>
                    {Array.isArray(orderData.addOns) &&
                      orderData.addOns.map((add: any, idx: number) => (
                        <tr key={idx}>
                          <td className="p-3 text-zinc-400">Add-on: {add.name}</td>
                          <td className="p-3 text-right font-mono">{formatRupiah(add.price)}</td>
                        </tr>
                      ))}
                    <tr className="bg-white/[0.02] font-bold text-white print:text-black">
                      <td className="p-3">Total Investasi Paket:</td>
                      <td className="p-3 text-right font-mono text-[#C6A87D]">{formatRupiah(orderData.totalAmount)}</td>
                    </tr>
                    <tr className="bg-[#18181D] font-bold text-[#C6A87D] print:bg-zinc-200">
                      <td className="p-3">Uang Muka (DP) Tertera:</td>
                      <td className="p-3 text-right font-mono">{formatRupiah(orderData.dpAmount)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* ACTION: Upload proof if PENDING_PAYMENT */}
              {orderData.status === 'PENDING_PAYMENT' && (
                <div className="bg-[#18181D] border border-amber-500/30 rounded-sm p-6 space-y-4 print:hidden">
                  <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                    <AlertCircle className="w-4 h-4" />
                    <span>Pembayaran DP Belum Terkonfirmasi</span>
                  </div>
                  <p className="text-xs text-zinc-300">
                    Silakan transfer uang muka (DP) sebesar <strong>{formatRupiah(orderData.dpAmount)}</strong> ke rekening BCA (<code>1234-5678-90</code> a.n HARVEST STUDIO SUBANG) lalu unggah foto bukti transfer di bawah.
                  </p>

                  <form onSubmit={handleUploadProof} className="space-y-3">
                    <input
                      type="file"
                      accept="image/*"
                      required
                      onChange={(e) => setProofFile(e.target.files ? e.target.files[0] : null)}
                      className="text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:bg-[#C6A87D] file:text-black cursor-pointer"
                    />
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="submit"
                        disabled={uploadingProof || !proofFile}
                        className="bg-[#C6A87D] hover:bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-sm transition-all disabled:opacity-50"
                      >
                        {uploadingProof ? 'Mengunggah...' : 'Unggah Bukti Transfer'}
                      </button>

                      <button
                        type="button"
                        onClick={handleSimulatePayment}
                        className="border border-[#C6A87D]/50 hover:bg-[#C6A87D]/10 text-[#C6A87D] text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-sm flex items-center space-x-1.5"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Simulasi Bayar QRIS Otomatis</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Action Buttons: Print Invoice & WhatsApp */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 print:hidden">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center space-x-2 border border-white/20 hover:border-white text-xs text-zinc-300 hover:text-white px-4 py-2.5 rounded-sm transition-all"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak / Simpan Invoice (PDF)</span>
                </button>

                <a
                  href={`https://wa.me/6281234567890?text=${encodeURIComponent(
                    `Halo Admin Harvest Studio, saya ingin menanyakan status booking saya (${orderData.bookingCode}).`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-sm transition-all"
                >
                  <Phone className="w-4 h-4" />
                  <span>Hubungi Admin Studio</span>
                </a>
              </div>
            </div>
          )}

          {/* EDIT & CETAK DETAILS */}
          {orderType === 'EDIT_PRINT' && (
            <div className="bg-[#121215] border border-white/10 rounded-sm p-6 lg:p-8 space-y-6 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#C6A87D] block">
                    PESANAN {orderData.serviceType}
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-white">
                    Status Produksi Foto
                  </h2>
                  <span className="font-mono text-xs text-zinc-400">
                    Kode: {orderData.orderCode}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-widest block mb-1">
                    Tahap Produksi
                  </span>
                  <span className="bg-[#C6A87D]/20 text-[#C6A87D] border border-[#C6A87D]/30 px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-wider">
                    {orderData.status}
                  </span>
                </div>
              </div>

              {/* Production Stepper Status */}
              <div className="py-4 border-y border-white/5">
                <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold uppercase tracking-wider">
                  {[
                    { key: 'RECEIVED', label: '1. Diterima' },
                    { key: 'IN_PROGRESS', label: '2. Diproses' },
                    { key: 'COMPLETED', label: '3. Selesai' },
                    { key: 'DELIVERED', label: '4. Diambil/Kirim' },
                  ].map((step, idx) => {
                    const statusOrder = ['RECEIVED', 'IN_PROGRESS', 'COMPLETED', 'DELIVERED'];
                    const currentIdx = statusOrder.indexOf(orderData.status);
                    const isDone = currentIdx >= idx;
                    return (
                      <div
                        key={step.key}
                        className={`p-2.5 rounded-sm ${
                          isDone ? 'bg-[#C6A87D] text-black font-bold' : 'bg-zinc-900 text-zinc-600'
                        }`}
                      >
                        {step.label}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-zinc-300">
                <div className="space-y-1">
                  <div>Nama Pemesan: <strong>{orderData.customerName}</strong></div>
                  <div>WhatsApp: {orderData.whatsapp}</div>
                  <div>Layanan: {orderData.serviceType} ({orderData.specifications?.optionName || '-'})</div>
                </div>
                <div className="space-y-1">
                  <div>Jumlah: {orderData.quantity} unit</div>
                  <div>Metode: {orderData.deliveryMethod === 'PICKUP' ? 'Ambil di Studio (Subang)' : 'Kirim ke Alamat'}</div>
                  <div>Total Investasi: <strong className="text-[#C6A87D]">{formatRupiah(orderData.totalAmount)}</strong></div>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}

export default function StatusPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-zinc-100 py-12 px-4 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[#C6A87D] text-xs font-bold tracking-[0.25em] uppercase block">
            PELACAKAN PESANAN
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Cek Status & Invoice
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm font-light">
            Masukkan kode reservasi (HSV-...) atau kode cetak (HSE-...) beserta nomor WhatsApp untuk melihat status jadwal dan kuitansi pembayaran Anda.
          </p>
        </div>

        <Suspense fallback={<div className="text-center py-20 text-xs text-zinc-400">Memuat status...</div>}>
          <StatusContent />
        </Suspense>

      </div>
    </div>
  );
}
