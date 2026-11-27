'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, Calendar, Package as PackageIcon, Image as ImageIcon, 
  Settings, LogOut, CheckCircle, Clock, AlertCircle, TrendingUp, 
  Search, Filter, Plus, Trash2, Edit, Eye, ShieldCheck, Printer, 
  Sliders, MessageSquare, Star, DollarSign, Lock, ArrowUpRight 
} from 'lucide-react';
import { fetchAPI, formatRupiah } from '@/lib/api';

export default function AdminPage() {
  // Auth state
  const [token, setToken] = useState<string | null>(null);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [loginEmail, setLoginEmail] = useState('admin@harveststudio.com');
  const [loginPassword, setLoginPassword] = useState('admin123');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'overview' | 'bookings' | 'edit-print' | 'packages' | 'portfolio' | 'schedule' | 'quotations' | 'settings'
  >('overview');

  // Dashboard Data
  const [stats, setStats] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [editPrintOrders, setEditPrintOrders] = useState<any[]>([]);
  const [scheduleBlocks, setScheduleBlocks] = useState<any[]>([]);
  const [quotations, setQuotations] = useState<any[]>([]);
  const [settingsMap, setSettingsMap] = useState<Record<string, string>>({});
  const [loadingData, setLoadingData] = useState(false);

  // Modal / Form States
  const [bookingFilterStatus, setBookingFilterStatus] = useState('all');
  const [bookingSearch, setBookingSearch] = useState('');
  
  // Package Form Modal
  const [showPkgModal, setShowPkgModal] = useState(false);
  const [pkgFormData, setPkgFormData] = useState<any>({
    categoryId: '',
    name: '',
    slug: '',
    description: '',
    price: 0,
    promoPrice: null,
    duration: '60 Menit',
    locationType: 'studio',
    crewCount: '1 Fotografer',
    inclusions: '',
    badge: '',
    coverImage: '',
    status: 'active',
  });

  // Schedule Block Modal
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockDate, setBlockDate] = useState('');
  const [blockReason, setBlockReason] = useState('');

  useEffect(() => {
    // Check saved token in localStorage
    const savedToken = localStorage.getItem('harvest_admin_token');
    if (savedToken) {
      setToken(savedToken);
      fetchAdminData(savedToken);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    const res = await fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: loginEmail, password: loginPassword }),
    });

    if (res.success && res.token) {
      setToken(res.token);
      setAdminUser(res.user);
      localStorage.setItem('harvest_admin_token', res.token);
      fetchAdminData(res.token);
    } else {
      setLoginError(res.message || 'Login gagal. Periksa kembali email dan password Anda.');
    }
    setLoginLoading(false);
  };

  const handleLogout = () => {
    setToken(null);
    setAdminUser(null);
    localStorage.removeItem('harvest_admin_token');
  };

  const fetchAdminData = async (jwtToken: string) => {
    setLoadingData(true);
    const authHeaders = { Authorization: `Bearer ${jwtToken}` };

    const [statsRes, bookRes, pkgRes, portRes, epRes, schedRes, quotRes, setRes] = await Promise.all([
      fetchAPI('/dashboard/stats', { headers: authHeaders }),
      fetchAPI('/bookings/admin', { headers: authHeaders }),
      fetchAPI('/packages'),
      fetchAPI('/portfolios'),
      fetchAPI('/edit-print/admin', { headers: authHeaders }),
      fetchAPI('/schedules/blocks', { headers: authHeaders }),
      fetchAPI('/quotations/admin', { headers: authHeaders }),
      fetchAPI('/settings'),
    ]);

    if (statsRes.success) setStats(statsRes.data);
    if (bookRes.success) setBookings(bookRes.data);
    if (pkgRes.success) setPackages(pkgRes.data);
    if (portRes.success) setPortfolios(portRes.data);
    if (epRes.success) setEditPrintOrders(epRes.data);
    if (schedRes.success) setScheduleBlocks(schedRes.data);
    if (quotRes.success) setQuotations(quotRes.data);
    if (setRes.success) setSettingsMap(setRes.data);

    setLoadingData(false);
  };

  // Update Booking Status
  const handleUpdateBookingStatus = async (bookingId: string, status: string) => {
    if (!token) return;
    const res = await fetchAPI(`/bookings/${bookingId}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    if (res.success) {
      alert(`Status pesanan berhasil diperbarui menjadi ${status}.`);
      fetchAdminData(token);
    } else {
      alert(res.message || 'Gagal memperbarui status.');
    }
  };

  // Verify Payment
  const handleVerifyPayment = async (paymentId: string, status: 'VERIFIED' | 'REJECTED') => {
    if (!token) return;
    const res = await fetchAPI(`/payments/${paymentId}/verify`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    if (res.success) {
      alert(`Pembayaran berhasil di-${status.toLowerCase()}.`);
      fetchAdminData(token);
    } else {
      alert(res.message || 'Gagal memverifikasi pembayaran.');
    }
  };

  // Update Edit/Print Order Status
  const handleUpdateEditPrintStatus = async (orderId: string, status: string) => {
    if (!token) return;
    const res = await fetchAPI(`/edit-print/${orderId}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    if (res.success) {
      alert('Status pesanan edit/cetak berhasil diperbarui.');
      fetchAdminData(token);
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    const res = await fetchAPI('/settings/bulk', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(settingsMap),
    });
    if (res.success) {
      alert('Pengaturan studio & tema berhasil disimpan!');
    } else {
      alert(res.message || 'Gagal menyimpan pengaturan.');
    }
  };

  // Add Date Block
  const handleAddScheduleBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !blockDate) return;
    const res = await fetchAPI('/schedules/blocks', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ date: blockDate, reason: blockReason, isFullDay: true }),
    });
    if (res.success) {
      alert('Tanggal berhasil diblokir dari sistem booking!');
      setShowBlockModal(false);
      setBlockDate('');
      setBlockReason('');
      fetchAdminData(token);
    }
  };

  // Delete Date Block
  const handleDeleteScheduleBlock = async (blockId: string) => {
    if (!token || !confirm('Buka kembali blokir tanggal ini?')) return;
    const res = await fetchAPI(`/schedules/blocks/${blockId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.success) {
      fetchAdminData(token);
    }
  };

  // LOGIN SCREEN
  if (!token) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] text-zinc-100 flex items-center justify-center p-4">
        <div className="bg-[#121215] border border-white/10 rounded-sm p-8 max-w-md w-full space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full border border-[#C6A87D]/50 flex items-center justify-center bg-zinc-900 mx-auto text-[#C6A87D]">
              <Lock className="w-6 h-6" />
            </div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#C6A87D] block">
              PORTAL ADMIN HARVEST STUDIO
            </span>
            <h1 className="font-serif text-2xl font-bold text-white">Login Pemilik / Staf</h1>
            <p className="text-xs text-zinc-400">
              Masuk untuk mengelola katalog paket, portofolio, jadwal, dan pesanan pelanggan.
            </p>
          </div>

          {loginError && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs p-3 rounded-sm flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Email Akun Admin</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full bg-[#18181D] border border-white/10 rounded-sm px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C6A87D]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Password</label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full bg-[#18181D] border border-white/10 rounded-sm px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C6A87D]"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-[#C6A87D] hover:bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-widest py-3 rounded-sm transition-all shadow-xl disabled:opacity-50 mt-2"
            >
              {loginLoading ? 'Memeriksa Kredensial...' : 'Masuk ke Dasbor'}
            </button>
          </form>

          <div className="text-center pt-2">
            <Link href="/" className="text-xs text-zinc-500 hover:text-white transition-colors">
              ← Kembali ke Beranda Publik
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Filtered Bookings for the Booking Management Tab
  const filteredBookings = bookings.filter((b) => {
    if (bookingFilterStatus !== 'all' && b.status !== bookingFilterStatus) return false;
    if (bookingSearch.trim()) {
      const q = bookingSearch.toLowerCase();
      const codeMatch = b.bookingCode?.toLowerCase().includes(q);
      const nameMatch = b.customer?.name?.toLowerCase().includes(q);
      const phoneMatch = b.customer?.whatsapp?.includes(q);
      if (!codeMatch && !nameMatch && !phoneMatch) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-zinc-100 flex flex-col">
      {/* Top Admin Header */}
      <header className="bg-[#111114] border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full border border-[#C6A87D] flex items-center justify-center text-[#C6A87D] bg-zinc-900">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-serif text-base font-bold text-white tracking-wide">
              PANEL ADMIN HARVEST STUDIO
            </h1>
            <span className="text-[10px] text-zinc-400 block tracking-wider uppercase">
              Subang Photography & Videography Management
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            href="/"
            target="_blank"
            className="text-xs text-zinc-400 hover:text-[#C6A87D] flex items-center space-x-1"
          >
            <span>Buka Website</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-1.5 text-xs text-rose-400 hover:text-rose-300 border border-rose-500/30 px-3 py-1.5 rounded-sm bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar</span>
          </button>
        </div>
      </header>

      {/* Main Admin Workspace (Sidebar + Content) */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 bg-[#0E0E11] border-r border-white/10 p-4 space-y-1">
          {[
            { id: 'overview', label: 'Ringkasan / Dasbor', icon: LayoutDashboard },
            { id: 'bookings', label: 'Pesanan & Reservasi', icon: Calendar, badge: stats?.pendingConfirmationCount },
            { id: 'edit-print', label: 'Layanan Edit & Cetak', icon: ImageIcon, badge: stats?.totalEditPrint },
            { id: 'packages', label: 'Katalog Paket', icon: PackageIcon },
            { id: 'portfolio', label: 'Galeri Portofolio', icon: Sliders },
            { id: 'schedule', label: 'Jadwal & Blokir Tanggal', icon: Clock },
            { id: 'quotations', label: 'Permintaan Penawaran', icon: MessageSquare },
            { id: 'settings', label: 'Pengaturan & Tema', icon: Settings },
          ].map((tab: any) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between p-3 rounded-sm text-xs font-semibold uppercase tracking-wider transition-all text-left ${
                  isActive
                    ? 'bg-[#C6A87D] text-black font-bold shadow-lg'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </div>
                {tab.badge > 0 && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-black text-[#C6A87D]' : 'bg-[#C6A87D] text-black'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Content View */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto space-y-8">
          
          {/* TAB 1: OVERVIEW / DASBOR */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-white">Ringkasan Operasional Studio</h2>
                  <span className="text-xs text-zinc-400">Statistik pesanan, pendapatan, dan agenda pemotretan hari ini.</span>
                </div>
                <button
                  onClick={() => token && fetchAdminData(token)}
                  className="text-xs text-[#C6A87D] hover:underline"
                >
                  Segarkan Data
                </button>
              </div>

              {/* 4 Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#121215] border border-white/10 p-5 rounded-sm space-y-2">
                  <div className="flex justify-between items-center text-zinc-400 text-xs uppercase tracking-wider">
                    <span>Total Reservasi</span>
                    <Calendar className="w-4 h-4 text-[#C6A87D]" />
                  </div>
                  <div className="font-serif text-3xl font-bold text-white">{stats?.totalBookings || 0}</div>
                  <div className="text-[11px] text-zinc-500">Seluruh waktu booking masuk</div>
                </div>

                <div className="bg-[#121215] border border-white/10 p-5 rounded-sm space-y-2">
                  <div className="flex justify-between items-center text-zinc-400 text-xs uppercase tracking-wider">
                    <span>Menunggu Konfirmasi</span>
                    <Clock className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="font-serif text-3xl font-bold text-amber-400">
                    {stats?.pendingConfirmationCount || 0}
                  </div>
                  <div className="text-[11px] text-zinc-500">Bukti transfer butuh verifikasi</div>
                </div>

                <div className="bg-[#121215] border border-white/10 p-5 rounded-sm space-y-2">
                  <div className="flex justify-between items-center text-zinc-400 text-xs uppercase tracking-wider">
                    <span>Jadwal Terkonfirmasi</span>
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="font-serif text-3xl font-bold text-emerald-400">
                    {stats?.confirmedCount || 0}
                  </div>
                  <div className="text-[11px] text-zinc-500">Siap bertugas / sesi aktif</div>
                </div>

                <div className="bg-[#121215] border border-white/10 p-5 rounded-sm space-y-2">
                  <div className="flex justify-between items-center text-zinc-400 text-xs uppercase tracking-wider">
                    <span>Pendapatan Terverifikasi</span>
                    <TrendingUp className="w-4 h-4 text-[#C6A87D]" />
                  </div>
                  <div className="font-serif text-2xl font-bold text-[#C6A87D]">
                    {formatRupiah(stats?.totalRevenue || 0)}
                  </div>
                  <div className="text-[11px] text-zinc-500">Total DP & pelunasan masuk</div>
                </div>
              </div>

              {/* Today's Bookings & Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#121215] border border-white/10 rounded-sm p-6 space-y-4">
                  <h3 className="font-serif text-lg font-bold text-white border-b border-white/5 pb-2">
                    Agenda Sesi Hari Ini ({stats?.todayDate || 'Hari ini'})
                  </h3>
                  {Array.isArray(stats?.todayBookings) && stats.todayBookings.length === 0 ? (
                    <p className="text-xs text-zinc-500 py-6 text-center">
                      Tidak ada jadwal sesi foto hari ini. Studio siap menerima walk-in / order baru.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {stats?.todayBookings?.map((tb: any) => (
                        <div key={tb.id} className="p-3 bg-zinc-900 border border-white/5 rounded-sm text-xs space-y-1">
                          <div className="flex justify-between font-bold text-white">
                            <span>{tb.customer?.name} ({tb.package?.name})</span>
                            <span className="text-[#C6A87D] font-mono">{tb.timeSlot}</span>
                          </div>
                          <div className="text-zinc-400">WhatsApp: {tb.customer?.whatsapp}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-[#121215] border border-white/10 rounded-sm p-6 space-y-4">
                  <h3 className="font-serif text-lg font-bold text-white border-b border-white/5 pb-2">
                    Reservasi Terbaru
                  </h3>
                  <div className="space-y-2 text-xs">
                    {Array.isArray(stats?.recentBookings) &&
                      stats.recentBookings.map((rb: any) => (
                        <div key={rb.id} className="flex justify-between items-center p-3 bg-zinc-900 border border-white/5 rounded-sm">
                          <div>
                            <span className="font-mono text-[#C6A87D] font-bold block">{rb.bookingCode}</span>
                            <span className="text-white font-medium">{rb.customer?.name} - {rb.package?.name}</span>
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                            {rb.status}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BOOKINGS MANAGEMENT */}
          {activeTab === 'bookings' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-white">Manajemen Reservasi & Jadwal</h2>
                  <span className="text-xs text-zinc-400">Verifikasi bukti pembayaran, perbarui status booking, dan hubungi pelanggan.</span>
                </div>

                {/* Filter and Search */}
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    placeholder="Cari kode/nama..."
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)}
                    className="bg-[#18181D] border border-white/10 rounded-sm px-3 py-1.5 text-xs text-white"
                  />
                  <select
                    value={bookingFilterStatus}
                    onChange={(e) => setBookingFilterStatus(e.target.value)}
                    className="bg-[#18181D] border border-white/10 rounded-sm px-3 py-1.5 text-xs text-white"
                  >
                    <option value="all">Semua Status</option>
                    <option value="PENDING_PAYMENT">Pending Payment</option>
                    <option value="PENDING_CONFIRMATION">Pending Confirmation</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Bookings Table */}
              <div className="bg-[#121215] border border-white/10 rounded-sm overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#18181D] text-zinc-400 border-b border-white/10 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3.5">Kode & Tanggal</th>
                      <th className="p-3.5">Pelanggan</th>
                      <th className="p-3.5">Paket & Jam</th>
                      <th className="p-3.5">Total & DP</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-center">Tindakan Admin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-white/[0.02]">
                        <td className="p-3.5">
                          <span className="font-mono font-bold text-[#C6A87D] block">{b.bookingCode}</span>
                          <span className="text-zinc-400">{b.eventDate}</span>
                        </td>
                        <td className="p-3.5">
                          <strong className="text-white block">{b.customer?.name}</strong>
                          <span className="text-zinc-400">{b.customer?.whatsapp}</span>
                        </td>
                        <td className="p-3.5">
                          <span className="text-white block">{b.package?.name}</span>
                          <span className="text-zinc-400 font-mono">{b.timeSlot}</span>
                        </td>
                        <td className="p-3.5">
                          <span className="text-white font-mono block">{formatRupiah(b.totalAmount)}</span>
                          <span className="text-zinc-400 font-mono text-[11px]">DP: {formatRupiah(b.dpAmount)}</span>
                        </td>
                        <td className="p-3.5">
                          <span className={`inline-block px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider ${
                            b.status === 'CONFIRMED'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : b.status === 'PENDING_CONFIRMATION'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : b.status === 'COMPLETED'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-rose-500/20 text-rose-400'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-center space-x-2">
                          {b.status !== 'CONFIRMED' && (
                            <button
                              onClick={() => handleUpdateBookingStatus(b.id, 'CONFIRMED')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-semibold"
                            >
                              Konfirmasi
                            </button>
                          )}
                          {b.status === 'CONFIRMED' && (
                            <button
                              onClick={() => handleUpdateBookingStatus(b.id, 'COMPLETED')}
                              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-[11px] font-semibold"
                            >
                              Selesai
                            </button>
                          )}
                          <a
                            href={`https://wa.me/${b.customer?.whatsapp?.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 border border-white/20 text-zinc-300 hover:text-white rounded text-[11px]"
                          >
                            WhatsApp
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: EDIT & PRINT PRODUCTION */}
          {activeTab === 'edit-print' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-white/10 pb-4">
                <h2 className="font-serif text-2xl font-bold text-white">Pesanan Edit Foto & Cetak Lab</h2>
                <span className="text-xs text-zinc-400">Pantau status pengerjaan retouch, lab cetak, dan pengiriman ke pelanggan.</span>
              </div>

              <div className="bg-[#121215] border border-white/10 rounded-sm overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#18181D] text-zinc-400 border-b border-white/10 uppercase text-[10px]">
                    <tr>
                      <th className="p-3.5">Kode</th>
                      <th className="p-3.5">Pelanggan</th>
                      <th className="p-3.5">Layanan</th>
                      <th className="p-3.5">File Foto</th>
                      <th className="p-3.5">Status Produksi</th>
                      <th className="p-3.5 text-center">Ubah Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {editPrintOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-white/[0.02]">
                        <td className="p-3.5 font-mono font-bold text-[#C6A87D]">{o.orderCode}</td>
                        <td className="p-3.5">
                          <strong className="text-white block">{o.customerName}</strong>
                          <span className="text-zinc-400">{o.whatsapp}</span>
                        </td>
                        <td className="p-3.5">
                          <span className="text-white font-medium">{o.serviceType}</span>
                          <span className="text-zinc-400 block text-[11px]">{o.specifications?.optionName}</span>
                        </td>
                        <td className="p-3.5">
                          {Array.isArray(o.fileUrls) && o.fileUrls[0] ? (
                            <a
                              href={o.fileUrls[0]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#C6A87D] underline truncate max-w-xs block"
                            >
                              Buka File / Link
                            </a>
                          ) : (
                            <span className="text-zinc-500">-</span>
                          )}
                        </td>
                        <td className="p-3.5">
                          <span className="bg-[#C6A87D]/20 text-[#C6A87D] px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                            {o.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-center space-x-1.5">
                          {['RECEIVED', 'IN_PROGRESS', 'COMPLETED', 'DELIVERED'].map((st) => (
                            <button
                              key={st}
                              onClick={() => handleUpdateEditPrintStatus(o.id, st)}
                              className={`px-2 py-1 rounded text-[10px] font-bold ${
                                o.status === st ? 'bg-[#C6A87D] text-black' : 'bg-zinc-800 text-zinc-400 hover:text-white'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: SCHEDULE & DATE BLOCKER */}
          {activeTab === 'schedule' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-white">Kalender & Blokir Jadwal</h2>
                  <span className="text-xs text-zinc-400">Blokir tanggal libur studio, renovasi, atau hari penuh agar pelanggan tidak dapat memilih slot.</span>
                </div>
                <button
                  onClick={() => setShowBlockModal(true)}
                  className="bg-[#C6A87D] text-black text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-sm flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Blokir Tanggal Baru</span>
                </button>
              </div>

              {/* Block List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {scheduleBlocks.map((sb) => (
                  <div key={sb.id} className="bg-[#121215] border border-rose-500/30 p-4 rounded-sm flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="font-mono text-xs font-bold text-rose-400 block">{sb.date}</span>
                      <strong className="text-white text-xs block">{sb.reason}</strong>
                      <span className="text-[10px] text-zinc-500 uppercase">Tutup Seharian Penuh</span>
                    </div>
                    <button
                      onClick={() => handleDeleteScheduleBlock(sb.id)}
                      className="text-zinc-500 hover:text-rose-400 p-1"
                      title="Hapus Blokir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Block Modal */}
              {showBlockModal && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                  <div className="bg-[#141418] border border-white/10 rounded-sm p-6 max-w-md w-full space-y-4">
                    <h3 className="font-serif text-lg font-bold text-white">Blokir Tanggal Baru</h3>
                    <form onSubmit={handleAddScheduleBlock} className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-xs text-zinc-300">Pilih Tanggal Tutup *</label>
                        <input
                          type="date"
                          required
                          value={blockDate}
                          onChange={(e) => setBlockDate(e.target.value)}
                          className="w-full bg-[#18181D] border border-white/10 rounded-sm p-2 text-xs text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-zinc-300">Alasan Penutupan *</label>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: Libur Hari Raya / Studio Penuh"
                          value={blockReason}
                          onChange={(e) => setBlockReason(e.target.value)}
                          className="w-full bg-[#18181D] border border-white/10 rounded-sm p-2 text-xs text-white"
                        />
                      </div>
                      <div className="flex justify-end space-x-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowBlockModal(false)}
                          className="border border-white/20 text-xs px-4 py-2 rounded-sm"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-4 py-2 rounded-sm"
                        >
                          Simpan Blokir
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: PACKAGES LIST */}
          {activeTab === 'packages' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-white">Katalog Paket Layanan ({packages.length})</h2>
                  <span className="text-xs text-zinc-400">Daftar harga, fasilitas, dan status paket yang tampil di website publik.</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map((pkg) => (
                  <div key={pkg.id} className="bg-[#121215] border border-white/10 rounded-sm overflow-hidden flex flex-col justify-between">
                    <div className="h-44 bg-zinc-900 relative">
                      <img src={pkg.coverImage} alt={pkg.name} className="w-full h-full object-cover" />
                      <span className="absolute top-3 left-3 text-[10px] uppercase font-bold bg-black/70 text-[#C6A87D] px-2 py-0.5 rounded">
                        {pkg.category?.name}
                      </span>
                    </div>
                    <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-serif text-base font-bold text-white">{pkg.name}</h3>
                        <span className="text-xs text-zinc-400 block">{pkg.duration} • {pkg.crewCount}</span>
                        <div className="font-serif text-lg font-bold text-[#C6A87D] pt-2">
                          {formatRupiah(pkg.promoPrice || pkg.price)}
                        </div>
                      </div>
                      <div className="pt-3 border-t border-white/5 flex justify-between items-center text-xs">
                        <span className="text-emerald-400 font-bold uppercase text-[10px]">Aktif</span>
                        <Link href={`/paket/${pkg.slug}`} target="_blank" className="text-[#C6A87D] hover:underline">
                          Lihat Publik →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: SETTINGS (Multi-client White-label Configuration) */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-fade-in max-w-4xl">
              <div className="border-b border-white/10 pb-4">
                <h2 className="font-serif text-2xl font-bold text-white">Pengaturan Identitas Studio & Tema</h2>
                <span className="text-xs text-zinc-400">
                  Ubah identitas studio, nomor WhatsApp, nomor rekening pembayaran, dan kebijakan DP untuk kustomisasi klien baru.
                </span>
              </div>

              <form onSubmit={handleSaveSettings} className="bg-[#121215] border border-white/10 rounded-sm p-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="font-serif text-base font-bold text-[#C6A87D] border-b border-white/5 pb-2">
                    Profil & Kontak Studio
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <label className="text-zinc-300 font-semibold">Nama Studio</label>
                      <input
                        type="text"
                        value={settingsMap['studio_name'] || 'Harvest Studio'}
                        onChange={(e) => setSettingsMap({ ...settingsMap, studio_name: e.target.value })}
                        className="w-full bg-[#18181D] border border-white/10 rounded-sm p-2 text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-zinc-300 font-semibold">Tagline Studio</label>
                      <input
                        type="text"
                        value={settingsMap['tagline'] || 'Capturing Moments, Creating Stories'}
                        onChange={(e) => setSettingsMap({ ...settingsMap, tagline: e.target.value })}
                        className="w-full bg-[#18181D] border border-white/10 rounded-sm p-2 text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-zinc-300 font-semibold">Nomor WhatsApp Admin (diawali 62)</label>
                      <input
                        type="text"
                        value={settingsMap['whatsapp'] || '6281234567890'}
                        onChange={(e) => setSettingsMap({ ...settingsMap, whatsapp: e.target.value })}
                        className="w-full bg-[#18181D] border border-white/10 rounded-sm p-2 text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-zinc-300 font-semibold">Akun Instagram</label>
                      <input
                        type="text"
                        value={settingsMap['instagram'] || '@harvest_studiophoto'}
                        onChange={(e) => setSettingsMap({ ...settingsMap, instagram: e.target.value })}
                        className="w-full bg-[#18181D] border border-white/10 rounded-sm p-2 text-white"
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-zinc-300 font-semibold">Alamat Lengkap Studio</label>
                      <input
                        type="text"
                        value={settingsMap['address'] || 'Jl. Otto Iskandardinata No. 88, Subang, Jawa Barat 41211'}
                        onChange={(e) => setSettingsMap({ ...settingsMap, address: e.target.value })}
                        className="w-full bg-[#18181D] border border-white/10 rounded-sm p-2 text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/5">
                  <h3 className="font-serif text-base font-bold text-[#C6A87D] border-b border-white/5 pb-2">
                    Rekening Pembayaran Bank
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <label className="text-zinc-300 font-semibold">Nomor Rekening BCA</label>
                      <input
                        type="text"
                        value={settingsMap['bank_account_number'] || '1234-5678-90'}
                        onChange={(e) => setSettingsMap({ ...settingsMap, bank_account_number: e.target.value })}
                        className="w-full bg-[#18181D] border border-white/10 rounded-sm p-2 text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-zinc-300 font-semibold">Nama Pemilik Rekening BCA</label>
                      <input
                        type="text"
                        value={settingsMap['bank_account_name'] || 'HARVEST STUDIO SUBANG'}
                        onChange={(e) => setSettingsMap({ ...settingsMap, bank_account_name: e.target.value })}
                        className="w-full bg-[#18181D] border border-white/10 rounded-sm p-2 text-white"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-[#C6A87D] hover:bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-sm transition-all"
                >
                  Simpan Semua Pengaturan
                </button>
              </form>
            </div>
          )}

          {/* TAB 7: QUOTATIONS */}
          {activeTab === 'quotations' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-white/10 pb-4">
                <h2 className="font-serif text-2xl font-bold text-white">Permintaan Penawaran Kustom</h2>
                <span className="text-xs text-zinc-400">Daftar calon klien yang membutuhkan liputan acara custom / skala besar.</span>
              </div>

              <div className="space-y-4">
                {quotations.map((q) => (
                  <div key={q.id} className="bg-[#121215] border border-white/10 p-5 rounded-sm space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <strong className="text-white text-sm">{q.name} ({q.eventType})</strong>
                      <span className="text-[10px] uppercase font-bold bg-[#C6A87D]/20 text-[#C6A87D] px-2 py-0.5 rounded">
                        {q.status}
                      </span>
                    </div>
                    <div className="text-zinc-400">
                      WhatsApp: {q.whatsapp} • Tanggal: {q.eventDate || '-'} • Budget: {q.budget || '-'}
                    </div>
                    <p className="text-zinc-300 pt-1 border-t border-white/5">{q.notes}</p>
                    <div className="pt-2">
                      <a
                        href={`https://wa.me/${q.whatsapp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold px-3 py-1.5 rounded"
                      >
                        Balas via WhatsApp
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
