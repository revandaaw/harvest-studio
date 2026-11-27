import { Router, Request, Response } from 'express';
import { prisma } from '../prisma.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

const DEFAULT_SLOTS = [
  '09:00 - 11:00',
  '11:00 - 13:00',
  '13:00 - 15:00',
  '15:00 - 17:00',
  '18:30 - 20:30',
];

// Check availability for a given date
router.get('/availability', async (req: Request, res: Response) => {
  try {
    const { date, packageId } = req.query;
    if (!date) {
      res.status(400).json({ success: false, message: 'Parameter tanggal (date) wajib diisi (YYYY-MM-DD).' });
      return;
    }

    const dateStr = String(date);

    // 1. Check if date is blocked in ScheduleBlock
    const blocks = await prisma.scheduleBlock.findMany({
      where: { date: dateStr },
    });

    const isFullDayBlocked = blocks.some((b) => b.isFullDay);

    if (isFullDayBlocked) {
      res.json({
        success: true,
        date: dateStr,
        isBlocked: true,
        reason: blocks[0]?.reason || 'Jadwal studio tutup / penuh pada tanggal ini.',
        availableSlots: [],
      });
      return;
    }

    // 2. Check existing active bookings on that date
    const existingBookings = await prisma.booking.findMany({
      where: {
        eventDate: dateStr,
        status: { in: ['PENDING_PAYMENT', 'PENDING_CONFIRMATION', 'CONFIRMED'] },
      },
      select: { timeSlot: true, status: true },
    });

    const bookedSlots = existingBookings.map((b) => b.timeSlot);
    const partiallyBlockedSlots = blocks.filter((b) => !b.isFullDay).map((b) => `${b.startTime} - ${b.endTime}`);

    const slotStatuses = DEFAULT_SLOTS.map((slot) => {
      const isBooked = bookedSlots.includes(slot) || partiallyBlockedSlots.includes(slot);
      return {
        slot,
        isAvailable: !isBooked,
      };
    });

    res.json({
      success: true,
      date: dateStr,
      isBlocked: false,
      slots: slotStatuses,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal memeriksa ketersediaan.', error: error.message });
  }
});

// Create new booking (Public)
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      name,
      whatsapp,
      email,
      packageId,
      eventDate,
      timeSlot,
      location,
      locationAddress,
      addOns,
      notes,
      promoCode,
    } = req.body;

    if (!name || !whatsapp || !packageId || !eventDate || !timeSlot) {
      res.status(400).json({ success: false, message: 'Nama, WhatsApp, Paket, Tanggal, dan Jam Sesi wajib diisi.' });
      return;
    }

    // Check conflict (anti-double booking)
    const conflict = await prisma.booking.findFirst({
      where: {
        eventDate,
        timeSlot,
        status: { in: ['PENDING_PAYMENT', 'PENDING_CONFIRMATION', 'CONFIRMED'] },
      },
    });

    if (conflict) {
      res.status(409).json({
        success: false,
        message: 'Maaf, slot waktu pada tanggal tersebut baru saja dipesan oleh pelanggan lain. Silakan pilih slot lain.',
      });
      return;
    }

    // Fetch package
    const pkg = await prisma.package.findUnique({
      where: { id: packageId },
      include: { category: true },
    });

    if (!pkg) {
      res.status(404).json({ success: false, message: 'Paket tidak ditemukan.' });
      return;
    }

    // Calculate add-on total
    let addOnsList: any[] = [];
    let addOnsTotal = 0;
    if (Array.isArray(addOns)) {
      addOnsList = addOns;
      addOnsTotal = addOns.reduce((acc, curr) => acc + (Number(curr.price) || 0) * (Number(curr.qty) || 1), 0);
    }

    const packagePrice = pkg.promoPrice || pkg.price;
    let totalAmount = packagePrice + addOnsTotal;
    let discountAmount = 0;

    // Optional voucher discount check
    if (promoCode) {
      const voucher = await prisma.voucher.findUnique({ where: { code: promoCode.toUpperCase() } });
      if (voucher && voucher.isActive && voucher.usedCount < voucher.quota) {
        if (voucher.type === 'PERCENTAGE') {
          discountAmount = (totalAmount * voucher.value) / 100;
          if (voucher.maxDiscount && discountAmount > voucher.maxDiscount) {
            discountAmount = voucher.maxDiscount;
          }
        } else {
          discountAmount = voucher.value;
        }
        totalAmount = Math.max(0, totalAmount - discountAmount);
      }
    }

    // DP Calculation (e.g. 50% for studio, 30% for wedding/others)
    const isStudio = pkg.category.slug.includes('studio');
    const dpPercent = isStudio ? 0.5 : 0.3;
    const dpAmount = Math.round(totalAmount * dpPercent);

    // Upsert customer
    const customer = await prisma.customer.upsert({
      where: { whatsapp },
      update: { name, email, address: locationAddress },
      create: { name, whatsapp, email, address: locationAddress },
    });

    // Generate unique booking code
    const dateCode = new Date().toISOString().slice(0, 7).replace('-', '');
    const count = await prisma.booking.count();
    const bookingCode = `HSV-${dateCode}-${String(count + 1).padStart(4, '0')}`;

    const booking = await prisma.booking.create({
      data: {
        bookingCode,
        customerId: customer.id,
        packageId: pkg.id,
        eventDate,
        timeSlot,
        location: location || pkg.locationType,
        locationAddress: locationAddress || null,
        addOns: JSON.stringify(addOnsList),
        totalAmount,
        dpAmount,
        discountAmount,
        promoCode: promoCode || null,
        status: 'PENDING_PAYMENT',
        notes: notes || null,
      },
      include: {
        package: true,
        customer: true,
      },
    });

    res.json({
      success: true,
      message: 'Booking berhasil dibuat. Silakan lakukan pembayaran DP untuk mengunci jadwal Anda.',
      data: {
        ...booking,
        addOns: JSON.parse(booking.addOns),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal membuat reservasi.', error: error.message });
  }
});

// Track booking by code and phone (Public)
router.get('/track', async (req: Request, res: Response) => {
  try {
    const { code, phone } = req.query;
    if (!code || !phone) {
      res.status(400).json({ success: false, message: 'Kode booking dan nomor WhatsApp wajib diisi.' });
      return;
    }

    const booking = await prisma.booking.findFirst({
      where: {
        bookingCode: String(code).trim().toUpperCase(),
        customer: {
          whatsapp: { contains: String(phone).trim() },
        },
      },
      include: {
        customer: true,
        package: { include: { category: true } },
        payments: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!booking) {
      res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan. Periksa kembali kode booking dan nomor WhatsApp Anda.' });
      return;
    }

    res.json({
      success: true,
      data: {
        ...booking,
        addOns: typeof booking.addOns === 'string' ? JSON.parse(booking.addOns) : booking.addOns,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal melacak pesanan.', error: error.message });
  }
});

// Admin: Get all bookings
router.get('/admin', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { status, date, search } = req.query;
    const where: any = {};

    if (status && status !== 'all') {
      where.status = String(status);
    }
    if (date) {
      where.eventDate = String(date);
    }
    if (search) {
      where.OR = [
        { bookingCode: { contains: String(search) } },
        { customer: { name: { contains: String(search) } } },
        { customer: { whatsapp: { contains: String(search) } } },
      ];
    }

    const bookings = await prisma.booking.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: true,
        package: { select: { id: true, name: true, duration: true, category: true } },
        payments: true,
      },
    });

    const parsed = bookings.map((b) => ({
      ...b,
      addOns: typeof b.addOns === 'string' ? JSON.parse(b.addOns) : b.addOns,
    }));

    res.json({ success: true, data: parsed });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data booking.', error: error.message });
  }
});

// Admin: Update booking status
router.patch('/:id/status', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const updated = await prisma.booking.update({
      where: { id },
      data: {
        status,
        notes: notes !== undefined ? notes : undefined,
      },
    });

    res.json({ success: true, message: `Status pesanan berhasil diperbarui menjadi ${status}.`, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal memperbarui status booking.', error: error.message });
  }
});

export default router;
