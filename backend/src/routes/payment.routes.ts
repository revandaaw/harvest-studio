import { Router, Request, Response } from 'express';
import { prisma } from '../prisma.js';
import { authenticateToken } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

// Submit payment proof (Manual Transfer)
router.post('/proof', upload.single('proof'), async (req: Request, res: Response) => {
  try {
    const { bookingId, amount, type, method, notes } = req.body;

    if (!bookingId || !amount) {
      res.status(400).json({ success: false, message: 'ID Pesanan dan Nominal pembayaran wajib diisi.' });
      return;
    }

    const proofFileUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const payment = await prisma.payment.create({
      data: {
        bookingId,
        amount: Number(amount),
        type: type || 'DP',
        method: method || 'TRANSFER_MANUAL',
        status: 'PENDING',
        proofImage: proofFileUrl,
        notes: notes || null,
      },
    });

    // Update booking status to PENDING_CONFIRMATION
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'PENDING_CONFIRMATION' },
    });

    res.json({
      success: true,
      message: 'Bukti pembayaran berhasil diunggah. Tim admin Harvest Studio akan segera memverifikasi.',
      data: payment,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal mengunggah bukti pembayaran.', error: error.message });
  }
});

// Simulate Instant Payment (QRIS / VA)
router.post('/simulate-instant', async (req: Request, res: Response) => {
  try {
    const { bookingId, amount, method, type } = req.body;

    if (!bookingId || !amount) {
      res.status(400).json({ success: false, message: 'Booking ID dan Amount wajib diisi.' });
      return;
    }

    const payment = await prisma.payment.create({
      data: {
        bookingId,
        amount: Number(amount),
        type: type || 'DP',
        method: method || 'QRIS_SIMULASI',
        status: 'VERIFIED',
        verifiedAt: new Date(),
        notes: `Simulasi Pembayaran Otomatis (${method}) Berhasil`,
      },
    });

    // Automatically confirm the booking
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CONFIRMED' },
    });

    res.json({
      success: true,
      message: 'Pembayaran berhasil disimulasikan dan jadwal booking telah TERKONFIRMASI!',
      data: payment,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal memproses simulasi pembayaran.', error: error.message });
  }
});

// Admin: Verify or Reject payment
router.patch('/:id/verify', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body; // "VERIFIED" or "REJECTED"

    const payment = await prisma.payment.update({
      where: { id },
      data: {
        status,
        verifiedAt: status === 'VERIFIED' ? new Date() : null,
        notes: notes || undefined,
      },
      include: { booking: true },
    });

    if (status === 'VERIFIED') {
      await prisma.booking.update({
        where: { id: payment.bookingId },
        data: { status: 'CONFIRMED' },
      });
    }

    res.json({ success: true, message: `Pembayaran berhasil di-${status.toLowerCase()}.`, data: payment });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal memverifikasi pembayaran.' });
  }
});

export default router;
