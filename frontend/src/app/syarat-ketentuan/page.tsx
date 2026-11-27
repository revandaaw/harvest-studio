import React from 'react';

export default function SyaratKetentuanPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-zinc-100 py-16 px-4 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8 bg-[#121215] border border-white/10 rounded-sm p-8 lg:p-12">
        <h1 className="font-serif text-3xl font-bold text-white border-b border-white/10 pb-4">
          Syarat & Ketentuan Layanan Harvest Studio
        </h1>

        <div className="space-y-6 text-xs text-zinc-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#C6A87D]">1. Ketentuan Pemesanan & Uang Muka (DP)</h2>
            <p>1.1. Pemesanan dianggap sah dan jadwal terkunci hanya setelah pembayaran uang muka (DP) diterima dan diverifikasi oleh pihak Harvest Studio.</p>
            <p>1.2. Besaran DP adalah 50% untuk layanan Studio Portrait dan 30% untuk Wedding / Event Photography.</p>
            <p>1.3. Batas waktu pembayaran DP adalah 24 jam setelah kode booking diterbitkan. Jika melewati batas waktu tersebut, slot jadwal akan dilepas otomatis.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#C6A87D]">2. Pelunasan Pembayaran</h2>
            <p>2.1. Pelunasan sisa biaya paket untuk acara wedding dan dokumentasi outdoor wajib diselesaikan maksimal H-3 sebelum tanggal acara.</p>
            <p>2.2. Pelunasan untuk sesi foto studio dilakukan pada hari H pemotretan sebelum penyerahan softcopy file mentah.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#C6A87D]">3. Kebijakan Reschedule & Pembatalan</h2>
            <p>3.1. Pengajuan perubahan tanggal (reschedule) diperbolehkan maksimal 1 kali dan wajib diajukan paling lambat H-7 sebelum sesi acara, menyesuaikan ketersediaan jadwal tim kami.</p>
            <p>3.2. Pembatalan sepihak oleh klien mengakibatkan uang muka (DP) yang telah dibayarkan dinyatakan hangus.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#C6A87D]">4. Hak Cipta & Portofolio</h2>
            <p>4.1. Harvest Studio memiliki hak artistik untuk menampilkan hasil karya foto/video pada portofolio resmi, website, dan media sosial @harvest_studiophoto untuk keperluan promosi.</p>
            <p>4.2. Klien berhak mengajukan permintaan tertulis jika tidak menghendaki karyanya dipublikasikan (kebijakan galeri privat).</p>
          </section>
        </div>
      </div>
    </div>
  );
}
