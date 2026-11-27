import React from 'react';

export default function KebijakanPrivasiPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-zinc-100 py-16 px-4 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8 bg-[#121215] border border-white/10 rounded-sm p-8 lg:p-12">
        <h1 className="font-serif text-3xl font-bold text-white border-b border-white/10 pb-4">
          Kebijakan Privasi (Privacy Policy)
        </h1>

        <div className="space-y-6 text-xs text-zinc-300 leading-relaxed">
          <p>
            Harvest Studio berkomitmen melindungi data pribadi Anda sesuai ketentuan Undang-Undang Pelindungan Data Pribadi (UU PDP) yang berlaku di Republik Indonesia.
          </p>

          <section className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#C6A87D]">1. Data yang Kami Kumpulkan</h2>
            <p>Kami mengumpulkan informasi yang Anda berikan saat melakukan reservasi atau pemesanan layanan, seperti: nama lengkap, nomor telepon / WhatsApp, alamat email, alamat acara / pengiriman cetak, serta berkas foto yang diunggah.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#C6A87D]">2. Penggunaan Informasi</h2>
            <p>Informasi tersebut digunakan semata-mata untuk memproses jadwal pemotretan, memverifikasi pembayaran, mengirimkan konfirmasi via WhatsApp/Email, dan menyerahkan hasil akhir produksi foto/video kepada Anda.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#C6A87D]">3. Perlindungan & Keamanan Data</h2>
            <p>Kami tidak akan pernah menjual, menyewakan, atau membagikan data pribadi Anda kepada pihak ketiga tanpa persetujuan tegas dari Anda.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
