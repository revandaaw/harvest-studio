import { DEFAULT_PACKAGES, DEFAULT_ADDONS, DEFAULT_SLOTS } from './defaultData';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  try {
    const res = await fetch(url, { ...options, headers, cache: 'no-store' });
    const data = await res.json();
    return data;
  } catch (err) {
    // Graceful offline fallback if backend port 5000 is not running
    console.warn(`[Harvest Studio] Backend (${API_BASE}) offline pada endpoint "${endpoint}", menggunakan fallback data.`);

    // 1. Single Package Detail
    if (endpoint.startsWith('/packages/detail/')) {
      const slug = endpoint.replace('/packages/detail/', '');
      const found = DEFAULT_PACKAGES.find((p) => p.slug === slug) || DEFAULT_PACKAGES[0];
      return { success: true, data: found };
    }

    // 2. Package List
    if (endpoint.startsWith('/packages')) {
      return { success: true, data: DEFAULT_PACKAGES };
    }

    // 3. Addon List
    if (endpoint.startsWith('/addons')) {
      return { success: true, data: DEFAULT_ADDONS };
    }

    // 4. Booking Slot Availability
    if (endpoint.startsWith('/bookings/availability')) {
      return { success: true, isBlocked: false, slots: DEFAULT_SLOTS };
    }

    // 5. Booking Creation POST Simulation
    if (endpoint.startsWith('/bookings') && options.method === 'POST') {
      let bodyData: any = {};
      try {
        bodyData = JSON.parse(options.body as string);
      } catch {}
      const dateCode = new Date().toISOString().slice(0, 7).replace('-', '');
      const code = `HSV-${dateCode}-${Math.floor(1000 + Math.random() * 9000)}`;
      const pkg = DEFAULT_PACKAGES.find((p) => p.id === bodyData.packageId) || DEFAULT_PACKAGES[0];
      const total = pkg.promoPrice || pkg.price;
      const isStudio = pkg.category.slug.includes('studio');
      const dp = Math.round(total * (isStudio ? 0.5 : 0.3));

      return {
        success: true,
        data: {
          id: 'test-booking-' + Date.now(),
          bookingCode: code,
          customer: { name: bodyData.name, whatsapp: bodyData.whatsapp },
          package: pkg,
          eventDate: bodyData.eventDate,
          timeSlot: bodyData.timeSlot,
          totalAmount: total,
          dpAmount: dp,
          status: 'PENDING_CONFIRMATION',
        },
      };
    }

    // 6. Settings
    if (endpoint.startsWith('/settings')) {
      return {
        success: true,
        data: {
          studio_name: 'Harvest Studio',
          tagline: 'Capturing Moments, Creating Stories',
          address: 'Jl. Otto Iskandardinata No. 88, Subang, Jawa Barat 41211',
          whatsapp: '6281234567890',
          email: 'halo@harveststudio.id',
          instagram: '@harvest_studiophoto',
        },
      };
    }

    return {
      success: false,
      message: 'Server backend (Port 5000) belum aktif. Silakan jalankan "npm run dev" di folder backend.',
    };
  }
}

export async function uploadFormData(endpoint: string, formData: FormData, token?: string) {
  const url = `${API_BASE}${endpoint}`;
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });
    return await res.json();
  } catch (err) {
    console.warn(`[Harvest Studio] Backend offline on upload ${endpoint}`);
    // Fallback simulation for proof upload
    if (endpoint.includes('proof')) {
      return {
        success: true,
        message: 'Bukti pembayaran berhasil dicatat (mode simulasi offline).',
      };
    }
    return { success: false, message: 'Gagal mengunggah berkas. Pastikan backend di port 5000 aktif.' };
  }
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}
