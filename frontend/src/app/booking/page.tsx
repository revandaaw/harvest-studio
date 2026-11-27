'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Check, Calendar, Clock, Sparkles, MapPin, Phone, Mail, 
  User, CreditCard, QrCode, AlertCircle, CheckCircle2, ChevronRight, Copy, Upload 
} from 'lucide-react';
import { fetchAPI, formatRupiah, uploadFormData } from '@/lib/api';

function BookingStepper() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Current Step: 1 (Paket), 2 (Jadwal), 3 (Data & Addon), 4 (Pembayaran)
  const [currentStep, setCurrentStep] = useState(1);

  // Data packages & addons
  const [packages, setPackages] = useState<any[]>([]);
  const [addons, setAddons] = useState<any[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Selected Data
  const [selectedPackageId, setSelectedPackageId] = useState<string>('');
  const [eventDate, setEventDate] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<{ slot: string; isAvailable: boolean }[]>([]);
  const [checkingSlots, setCheckingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [isDateBlocked, setIsDateBlocked] = useState(false);
  const [blockReason, setBlockReason] = useState('');

  // Add-ons & Customer details
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [locationType, setLocationType] = useState('studio');
  const [locationAddress, setLocationAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [promoCode, setPromoCode] = useState('');

  // Payment Options
  const [paymentMethod, setPaymentMethod] = useState<'MANUAL' | 'QRIS_SIMULASI' | 'VA_SIMULASI'>('MANUAL');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function init() {
      setLoadingInitial(true);
      const [pkgRes, addRes] = await Promise.all([
        fetchAPI('/packages'),
        fetchAPI('/addons'),
      ]);

      if (pkgRes.success && Array.isArray(pkgRes.data)) {
        setPackages(pkgRes.data);
        const paramPkg = searchParams.get('package');
        if (paramPkg) {
          const found = pkgRes.data.find((p: any) => p.id === paramPkg);
          if (found) {
            setSelectedPackageId(found.id);
            setCurrentStep(2); // Jump directly to Date picking if package is chosen
          }
        } else if (pkgRes.data.length > 0) {
          setSelectedPackageId(pkgRes.data[0].id);
        }
      }

      if (addRes.success && Array.isArray(addRes.data)) {
        setAddons(addRes.data);
        const paramAddons = searchParams.get('addons');
        if (paramAddons) {
          setSelectedAddons(paramAddons.split(',').filter(Boolean));
        }
      }

      // Default date: tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const defaultDateStr = tomorrow.toISOString().slice(0, 10);
      setEventDate(defaultDateStr);

      setLoadingInitial(false);
    }
    init();
  }, [searchParams]);

  // Check availability when date changes
  useEffect(() => {
    async function checkAvailability() {
      if (!eventDate) return;
      setCheckingSlots(true);
      setSelectedSlot('');
      setIsDateBlocked(false);

      const res = await fetchAPI(`/bookings/availability?date=${eventDate}`);
      if (res.success) {
        if (res.isBlocked) {
          setIsDateBlocked(true);
          setBlockReason(res.reason);
          setAvailableSlots([]);
        } else {
          setAvailableSlots(res.slots || []);
          // Auto select first available slot
          const firstAvail = (res.slots || []).find((s: any) => s.isAvailable);
          if (firstAvail) setSelectedSlot(firstAvail.slot);
        }
      }
      setCheckingSlots(false);
    }
    checkAvailability();
  }, [eventDate]);

  const selectedPackage = packages.find((p) => p.id === selectedPackageId);
  const basePrice = selectedPackage ? (selectedPackage.promoPrice || selectedPackage.price) : 0;
  const addonsTotal = selectedAddons.reduce((acc, id) => {
    const item = addons.find((a) => a.id === id);
    return acc + (item ? item.price : 0);
  }, 0);
  const grandTotal = basePrice + addonsTotal;
  const isStudio = selectedPackage?.category?.slug?.includes('studio');
  const dpAmount = Math.round(grandTotal * (isStudio ? 0.5 : 0.3));

  const toggleAddon = (id: string) => {
    if (selectedAddons.includes(id)) {
      setSelectedAddons(selectedAddons.filter((a) => a !== id));
    } else {
      setSelectedAddons([...selectedAddons, id]);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(`Nomor rekening ${text} berhasil disalin!`);
  };

  // Submit Booking
  const handleFinalSubmit = async () => {
    setErrorMessage('');
    if (!customerName || !whatsapp) {
      setErrorMessage('Nama dan Nomor WhatsApp wajib diisi.');
      setCurrentStep(3);
      return;
    }

    if (!selectedSlot) {
      setErrorMessage('Silakan pilih jam sesi terlebih dahulu.');
      setCurrentStep(2);
      return;
    }

    setSubmitting(true);
    try {
      // 1. Create Booking in database
      const payload = {
        name: customerName,
        whatsapp,
        email,
        packageId: selectedPackageId,
        eventDate,
        timeSlot: selectedSlot,
        location: locationType,
        locationAddress,
        addOns: selectedAddons.map((id) => {
          const item = addons.find((a) => a.id === id);
          return { id, name: item?.name, price: item?.price, qty: 1 };
        }),
        notes,
        promoCode,
      };

      const bookingRes = await fetchAPI('/bookings', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (!bookingRes.success) {
        setErrorMessage(bookingRes.message || 'Gagal membuat reservasi.');
        setSubmitting(false);
        return;
      }

      const bookingData = bookingRes.data;
      setCreatedBooking(bookingData);

      // 2. Process Payment based on chosen method
      if (paymentMethod === 'MANUAL' && proofFile) {
        const formData = new FormData();
        formData.append('bookingId', bookingData.id);
        formData.append('amount', String(dpAmount));
        formData.append('type', 'DP');
        formData.append('method', 'TRANSFER_MANUAL');
        formData.append('proof', proofFile);
        await uploadFormData('/payments/proof', formData);
      } else if (paymentMethod === 'QRIS_SIMULASI' || paymentMethod === 'VA_SIMULASI') {
        await fetchAPI('/payments/simulate-instant', {
          method: 'POST',
          body: JSON.stringify({
            bookingId: bookingData.id,
            amount: dpAmount,
            method: paymentMethod,
            type: 'DP',
          }),
        });
      }

      // Success!
    } catch (err: any) {
      setErrorMessage('Terjadi kendala saat memproses booking.');
    }
    setSubmitting(false);
  };

  if (loadingInitial) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-2 border-[#C6A87D] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs uppercase tracking-widest text-zinc-400">Menyiapkan sistem reservasi...</p>
      </div>
    );
  }

  // Confirmation Success View
  if (createdBooking) {
    return (
      <div className="max-w-2xl mx-auto bg-[#121215] border border-[#C6A87D] rounded-sm p-8 text-center space-y-6 shadow-2xl animate-fade-in my-8">
        <div className="w-16 h-16 rounded-full bg-[#C6A87D]/20 text-[#C6A87D] flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#C6A87D] block mb-1">
            RESERVASI BERHASIL
          </span>
          <h2 className="font-serif text-3xl font-bold text-white">
            Booking Anda Telah Tercatat!
          </h2>
          <p className="text-xs text-zinc-400 mt-2">
            Simpan kode booking Anda untuk memantau status pesanan dan konfirmasi jadwal pemotretan.
          </p>
        </div>

        <div className="bg-[#18181D] border border-white/10 rounded-sm p-5 text-left text-xs space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <span className="text-zinc-400">Kode Booking:</span>
            <span className="font-mono text-base font-bold text-[#C6A87D]">
              {createdBooking.bookingCode}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Paket:</span>
            <span className="text-white font-semibold">{createdBooking.package?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Tanggal & Jam:</span>
            <span className="text-white font-medium">{createdBooking.eventDate} ({createdBooking.timeSlot})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Nama Pemesan:</span>
            <span className="text-white">{createdBooking.customer?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Nomor WhatsApp:</span>
            <span className="text-white font-mono">{createdBooking.customer?.whatsapp}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-white/5">
            <span className="text-zinc-400">Nominal Uang Muka (DP):</span>
            <span className="font-mono text-sm font-bold text-[#C6A87D]">
              {formatRupiah(createdBooking.dpAmount)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Status Awal:</span>
            <span className="text-amber-400 font-bold uppercase tracking-wider text-[11px]">
              {paymentMethod === 'MANUAL' ? 'Menunggu Konfirmasi Admin' : 'Terkonfirmasi Otomatis'}
            </span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
          <Link
            href={`/status?code=${createdBooking.bookingCode}&phone=${createdBooking.customer?.whatsapp}`}
            className="bg-[#C6A87D] hover:bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-wider py-3.5 px-6 rounded-sm transition-all"
          >
            Buka Halaman Status & Invoice
          </Link>
          <a
            href={`https://wa.me/6281234567890?text=${encodeURIComponent(
              `Halo Admin Harvest Studio, saya telah membuat booking dengan kode ${createdBooking.bookingCode} atas nama ${createdBooking.customer?.name}.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-white/20 hover:border-emerald-500 text-xs text-zinc-300 hover:text-white py-3.5 px-6 rounded-sm transition-all"
          >
            Konfirmasi via WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      
      {/* 4-Step Progress Indicator */}
      <div className="border-b border-white/10 pb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-xs">
          {[
            { num: 1, title: '1. Pilih Paket' },
            { num: 2, title: '2. Jadwal & Jam' },
            { num: 3, title: '3. Data & Add-on' },
            { num: 4, title: '4. Pembayaran DP' },
          ].map((st) => (
            <button
              key={st.num}
              onClick={() => setCurrentStep(st.num)}
              className={`p-3 rounded-sm font-semibold uppercase tracking-wider transition-all flex items-center justify-center space-x-2 ${
                currentStep === st.num
                  ? 'bg-[#C6A87D] text-black shadow-lg'
                  : currentStep > st.num
                  ? 'bg-zinc-800 text-zinc-300'
                  : 'bg-zinc-900/60 text-zinc-500'
              }`}
            >
              <span>{st.title}</span>
            </button>
          ))}
        </div>
      </div>

      {errorMessage && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs p-4 rounded-sm flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* STEP 1: PILIH PAKET */}
      {currentStep === 1 && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-[#C6A87D]">Langkah 1</span>
            <h2 className="font-serif text-2xl font-bold text-white mt-1">Pilih Paket Layanan</h2>
            <p className="text-xs text-zinc-400">Pilih paket yang sesuai dengan kebutuhan sesi atau acara Anda.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {packages.map((pkg) => {
              const isSelected = selectedPackageId === pkg.id;
              return (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPackageId(pkg.id)}
                  className={`border rounded-sm p-5 cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#18181F] border-[#C6A87D] shadow-xl'
                      : 'bg-[#121215] border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#C6A87D]">
                        {pkg.category?.name}
                      </span>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-[#C6A87D] text-black flex items-center justify-center text-xs font-bold">
                          ✓
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif text-lg font-bold text-white">{pkg.name}</h3>
                    <p className="text-xs text-zinc-400 line-clamp-2">{pkg.description}</p>
                    <div className="text-xs text-zinc-300 font-mono">
                      <span>{pkg.duration}</span> • <span>{pkg.crewCount}</span>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-white/5 flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase">Investasi</span>
                      <span className="font-serif text-lg font-bold text-[#C6A87D] block">
                        {formatRupiah(pkg.promoPrice || pkg.price)}
                      </span>
                    </div>
                    <span className="text-xs text-[#C6A87D] font-bold uppercase tracking-wider">
                      {isSelected ? 'Terpilih' : 'Pilih'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setCurrentStep(2)}
              className="bg-[#C6A87D] hover:bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-sm transition-all flex items-center space-x-2"
            >
              <span>Lanjut ke Kalender Jadwal</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: KALENDER & PILIH SLOT JAM (Anti-Double Booking) */}
      {currentStep === 2 && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-[#C6A87D]">Langkah 2</span>
            <h2 className="font-serif text-2xl font-bold text-white mt-1">Pilih Tanggal & Jam Sesi</h2>
            <p className="text-xs text-zinc-400">
              Sistem kami secara otomatis memeriksa ketersediaan slot agar tidak terjadi jadwal bentrok.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-[#121215] border border-white/10 rounded-sm p-6 lg:p-8">
            {/* Date Picker */}
            <div className="md:col-span-5 space-y-4">
              <label className="text-xs font-semibold text-zinc-300 flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-[#C6A87D]" />
                <span>Pilih Tanggal Sesi Pemotretan *</span>
              </label>
              <input
                type="date"
                min={new Date().toISOString().slice(0, 10)}
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full bg-[#18181D] border border-white/10 rounded-sm p-3.5 text-xs text-white focus:outline-none focus:border-[#C6A87D]"
              />
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                * Untuk acara pernikahan berskala besar multi-hari, Anda juga dapat menggunakan formulir penawaran khusus.
              </p>
            </div>

            {/* Time Slots */}
            <div className="md:col-span-7 space-y-4">
              <label className="text-xs font-semibold text-zinc-300 flex items-center space-x-2">
                <Clock className="w-4 h-4 text-[#C6A87D]" />
                <span>Pilih Slot Jam yang Tersedia *</span>
              </label>

              {checkingSlots ? (
                <div className="py-8 text-center text-xs text-zinc-400">
                  <div className="w-6 h-6 border-2 border-[#C6A87D] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <span>Memeriksa jadwal studio...</span>
                </div>
              ) : isDateBlocked ? (
                <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-4 rounded-sm text-xs space-y-1">
                  <strong>Jadwal Ditutup / Agenda Penuh</strong>
                  <p>{blockReason || 'Studio tutup pada tanggal yang Anda pilih. Silakan pilih tanggal lain.'}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {availableSlots.map((slotItem) => (
                    <button
                      key={slotItem.slot}
                      type="button"
                      disabled={!slotItem.isAvailable}
                      onClick={() => setSelectedSlot(slotItem.slot)}
                      className={`p-3.5 rounded-sm border text-xs font-mono font-medium transition-all text-left flex items-center justify-between ${
                        selectedSlot === slotItem.slot
                          ? 'bg-[#C6A87D] text-black border-[#C6A87D] font-bold'
                          : slotItem.isAvailable
                          ? 'bg-[#18181D] text-zinc-200 border-white/10 hover:border-white/30'
                          : 'bg-zinc-900/60 text-zinc-600 border-white/5 cursor-not-allowed line-through'
                      }`}
                    >
                      <span>{slotItem.slot}</span>
                      <span className="text-[10px] uppercase font-sans tracking-wider">
                        {slotItem.isAvailable ? (selectedSlot === slotItem.slot ? 'Terpilih' : 'Tersedia') : 'Penuh'}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setCurrentStep(1)}
              className="border border-white/20 text-zinc-300 hover:text-white text-xs uppercase tracking-wider px-6 py-3 rounded-sm"
            >
              Kembali
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              disabled={!selectedSlot}
              className="bg-[#C6A87D] hover:bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-sm transition-all disabled:opacity-50 flex items-center space-x-2"
            >
              <span>Lanjut ke Data Diri</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: DATA PEMESAN & ADD-ON */}
      {currentStep === 3 && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-[#C6A87D]">Langkah 3</span>
            <h2 className="font-serif text-2xl font-bold text-white mt-1">Data Pemesan & Fasilitas Tambahan</h2>
            <p className="text-xs text-zinc-400">Lengkapi identitas untuk penerbitan bukti reservasi dan komunikasi tim studio.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form */}
            <div className="lg:col-span-7 bg-[#121215] border border-white/10 rounded-sm p-6 lg:p-8 space-y-4">
              <h3 className="font-serif text-base font-bold text-white border-b border-white/5 pb-2">
                Informasi Kontak Pemesan
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Anda"
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
                <label className="text-xs font-semibold text-zinc-300">Email (Untuk Bukti Invoice)</label>
                <input
                  type="email"
                  placeholder="email@anda.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#18181D] border border-white/10 rounded-sm px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C6A87D]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Lokasi Pelaksanaan</label>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <label className="flex items-center space-x-2 p-3 bg-zinc-900 border border-white/10 rounded-sm cursor-pointer">
                    <input
                      type="radio"
                      name="loc"
                      checked={locationType === 'studio'}
                      onChange={() => setLocationType('studio')}
                      className="accent-[#C6A87D]"
                    />
                    <span>Studio Harvest (Subang)</span>
                  </label>
                  <label className="flex items-center space-x-2 p-3 bg-zinc-900 border border-white/10 rounded-sm cursor-pointer">
                    <input
                      type="radio"
                      name="loc"
                      checked={locationType === 'outdoor'}
                      onChange={() => setLocationType('outdoor')}
                      className="accent-[#C6A87D]"
                    />
                    <span>Lokasi Luar (Outdoor/Gedung)</span>
                  </label>
                </div>
              </div>

              {locationType === 'outdoor' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Alamat Lengkap / Nama Venue Acara</label>
                  <textarea
                    rows={2}
                    placeholder="Contoh: Gedung Wisma Karya Subang, Jl. Ade Irma Suryani..."
                    value={locationAddress}
                    onChange={(e) => setLocationAddress(e.target.value)}
                    className="w-full bg-[#18181D] border border-white/10 rounded-sm p-3 text-xs text-white focus:outline-none focus:border-[#C6A87D]"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Catatan Tambahan untuk Fotografer</label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Kami ingin konsep foto keluarga bernuansa batik adat Sunda..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#18181D] border border-white/10 rounded-sm p-3 text-xs text-white focus:outline-none focus:border-[#C6A87D]"
                />
              </div>
            </div>

            {/* Add-ons Selector */}
            <div className="lg:col-span-5 bg-[#121215] border border-white/10 rounded-sm p-6 space-y-4">
              <h3 className="font-serif text-base font-bold text-white border-b border-white/5 pb-2">
                Pilih Add-on Layanan (Opsional)
              </h3>
              <div className="space-y-2.5">
                {addons.map((add) => {
                  const isChecked = selectedAddons.includes(add.id);
                  return (
                    <div
                      key={add.id}
                      onClick={() => toggleAddon(add.id)}
                      className={`p-3 rounded-sm border cursor-pointer transition-all flex items-center justify-between ${
                        isChecked
                          ? 'bg-[#18181F] border-[#C6A87D] text-white'
                          : 'bg-[#18181D] border-white/10 text-zinc-300 hover:border-white/30'
                      }`}
                    >
                      <div className="pr-2">
                        <span className="text-xs font-semibold block">{add.name}</span>
                        <span className="text-[10px] text-zinc-400">{add.description}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-mono font-bold text-[#C6A87D] block">
                          +{formatRupiah(add.price)}
                        </span>
                        <span className={`text-[10px] font-bold uppercase ${isChecked ? 'text-emerald-400' : 'text-zinc-500'}`}>
                          {isChecked ? '✓ Terpilih' : '+ Tambah'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setCurrentStep(2)}
              className="border border-white/20 text-zinc-300 hover:text-white text-xs uppercase tracking-wider px-6 py-3 rounded-sm"
            >
              Kembali
            </button>
            <button
              onClick={() => {
                if (!customerName || !whatsapp) {
                  setErrorMessage('Nama dan Nomor WhatsApp wajib diisi.');
                  return;
                }
                setErrorMessage('');
                setCurrentStep(4);
              }}
              className="bg-[#C6A87D] hover:bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-sm transition-all flex items-center space-x-2"
            >
              <span>Lanjut ke Pembayaran DP</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: RINGKASAN PESANAN & PEMBAYARAN DP */}
      {currentStep === 4 && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-[#C6A87D]">Langkah 4</span>
            <h2 className="font-serif text-2xl font-bold text-white mt-1">Ringkasan & Pembayaran Uang Muka (DP)</h2>
            <p className="text-xs text-zinc-400">Periksa kembali detail pesanan Anda dan pilih metode pembayaran.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Summary breakdown */}
            <div className="lg:col-span-6 bg-[#121215] border border-white/10 rounded-sm p-6 space-y-4">
              <h3 className="font-serif text-base font-bold text-white border-b border-white/5 pb-2">
                Rincian Pesanan
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-zinc-400">Paket:</span>
                  <span className="font-bold text-white">{selectedPackage?.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-zinc-400">Harga Paket Dasar:</span>
                  <span className="font-mono text-zinc-200">{formatRupiah(basePrice)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-zinc-400">Jadwal Sesi:</span>
                  <span className="text-white font-medium">{eventDate} ({selectedSlot})</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-zinc-400">Pemesan:</span>
                  <span className="text-white">{customerName} ({whatsapp})</span>
                </div>

                {selectedAddons.length > 0 && (
                  <div className="py-2 border-b border-white/5 space-y-1">
                    <span className="text-zinc-400 block font-semibold">Add-on Terpilih:</span>
                    {selectedAddons.map((id) => {
                      const add = addons.find((a) => a.id === id);
                      return (
                        <div key={id} className="flex justify-between pl-2 text-[11px] text-zinc-300">
                          <span>• {add?.name}</span>
                          <span className="font-mono">{formatRupiah(add?.price || 0)}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="flex justify-between pt-3 text-sm font-bold border-t border-white/10">
                  <span className="text-white">Total Biaya Layanan:</span>
                  <span className="font-mono text-[#C6A87D]">{formatRupiah(grandTotal)}</span>
                </div>

                <div className="bg-[#18181D] border border-[#C6A87D]/30 p-3 rounded-sm flex justify-between items-center text-xs">
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Wajib Dibayar Sekarang</span>
                    <strong className="text-white font-serif text-base">Uang Muka (DP {isStudio ? '50%' : '30%'})</strong>
                  </div>
                  <span className="font-mono text-lg font-bold text-[#C6A87D]">
                    {formatRupiah(dpAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Payment Method & Proof Upload */}
            <div className="lg:col-span-6 bg-[#121215] border border-white/10 rounded-sm p-6 space-y-5">
              <h3 className="font-serif text-base font-bold text-white border-b border-white/5 pb-2">
                Pilih Metode Pembayaran
              </h3>

              <div className="space-y-3">
                {/* Option 1: Manual Transfer */}
                <label className={`p-4 rounded-sm border cursor-pointer block transition-all ${
                  paymentMethod === 'MANUAL' ? 'bg-[#18181D] border-[#C6A87D]' : 'bg-zinc-900 border-white/10'
                }`}>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="payMethod"
                      checked={paymentMethod === 'MANUAL'}
                      onChange={() => setPaymentMethod('MANUAL')}
                      className="accent-[#C6A87D]"
                    />
                    <CreditCard className="w-4 h-4 text-[#C6A87D]" />
                    <span className="text-xs font-bold text-white">Transfer Bank Manual (BCA & Mandiri)</span>
                  </div>

                  {paymentMethod === 'MANUAL' && (
                    <div className="mt-3 pt-3 border-t border-white/5 space-y-3 text-xs animate-fade-in">
                      <div className="bg-black/40 p-3 rounded-sm space-y-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-[10px] text-zinc-400 uppercase">Bank Central Asia (BCA)</span>
                            <div className="font-mono font-bold text-white text-sm">1234-5678-90</div>
                            <span className="text-[10px] text-zinc-400">a.n HARVEST STUDIO SUBANG</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard('1234567890')}
                            className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-[11px] flex items-center space-x-1"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Salin</span>
                          </button>
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-white/5">
                          <div>
                            <span className="text-[10px] text-zinc-400 uppercase">Bank Mandiri</span>
                            <div className="font-mono font-bold text-white text-sm">173-00-1234567-8</div>
                            <span className="text-[10px] text-zinc-400">a.n HARVEST STUDIO SUBANG</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard('1730012345678')}
                            className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-[11px] flex items-center space-x-1"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Salin</span>
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-zinc-300 flex items-center space-x-1">
                          <Upload className="w-3 h-3 text-[#C6A87D]" />
                          <span>Unggah Bukti Transfer (Opsional saat ini, dapat diunggah nanti di halaman Cek Status)</span>
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setProofFile(e.target.files ? e.target.files[0] : null)}
                          className="w-full text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:bg-[#C6A87D] file:text-black cursor-pointer"
                        />
                      </div>
                    </div>
                  )}
                </label>

                {/* Option 2: QRIS Instant Simulation */}
                <label className={`p-4 rounded-sm border cursor-pointer block transition-all ${
                  paymentMethod === 'QRIS_SIMULASI' ? 'bg-[#18181D] border-[#C6A87D]' : 'bg-zinc-900 border-white/10'
                }`}>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="payMethod"
                      checked={paymentMethod === 'QRIS_SIMULASI'}
                      onChange={() => setPaymentMethod('QRIS_SIMULASI')}
                      className="accent-[#C6A87D]"
                    />
                    <QrCode className="w-4 h-4 text-[#C6A87D]" />
                    <span className="text-xs font-bold text-white">Simulasi QRIS Instant (Otomatis Terkonfirmasi)</span>
                  </div>
                  {paymentMethod === 'QRIS_SIMULASI' && (
                    <p className="text-[11px] text-zinc-400 mt-2 pl-6">
                      Metode simulasi payment gateway QRIS untuk pengujian pemesanan tanpa transfer manual. Sistem akan langsung mengunci jadwal secara otomatis.
                    </p>
                  )}
                </label>
              </div>

              <button
                type="button"
                disabled={submitting}
                onClick={handleFinalSubmit}
                className="w-full bg-[#C6A87D] hover:bg-[#D4AF37] text-black py-4 rounded-sm font-bold text-xs uppercase tracking-widest transition-all shadow-xl disabled:opacity-50 mt-4 flex items-center justify-center space-x-2"
              >
                {submitting ? (
                  <span>Memproses Reservasi...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Konfirmasi Booking ({formatRupiah(dpAmount)})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-zinc-100 py-12 px-4 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Page Title */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[#C6A87D] text-xs font-bold tracking-[0.25em] uppercase block">
            RESERVASI DARING
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Booking Sesi Foto & Video
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm font-light">
            Alur pemesanan mudah dan cepat dengan kepastian ketersediaan jadwal tim Harvest Studio Subang.
          </p>
        </div>

        <Suspense fallback={<div className="text-center py-20 text-xs text-zinc-400">Memuat formulir...</div>}>
          <BookingStepper />
        </Suspense>
      </div>
    </div>
  );
}
