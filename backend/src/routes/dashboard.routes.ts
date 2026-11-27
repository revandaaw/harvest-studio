import { Router, Request, Response } from 'express';
import { prisma } from '../prisma.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/stats', authenticateToken, async (req: Request, res: Response) => {
  try {
    const today = new Date().toISOString().slice(0, 10);

    const [
      totalBookings,
      pendingPaymentCount,
      pendingConfirmationCount,
      confirmedCount,
      completedCount,
      totalEditPrint,
      recentBookings,
      todayBookings,
      allConfirmedPayments,
    ] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: 'PENDING_PAYMENT' } }),
      prisma.booking.count({ where: { status: 'PENDING_CONFIRMATION' } }),
      prisma.booking.count({ where: { status: 'CONFIRMED' } }),
      prisma.booking.count({ where: { status: 'COMPLETED' } }),
      prisma.editPrintOrder.count(),
      prisma.booking.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: true,
          package: { select: { name: true } },
        },
      }),
      prisma.booking.findMany({
        where: { eventDate: today },
        include: {
          customer: true,
          package: { select: { name: true, duration: true } },
        },
      }),
      prisma.payment.findMany({
        where: { status: 'VERIFIED' },
        select: { amount: true },
      }),
    ]);

    const totalRevenue = allConfirmedPayments.reduce((acc, curr) => acc + curr.amount, 0);

    res.json({
      success: true,
      data: {
        totalBookings,
        pendingPaymentCount,
        pendingConfirmationCount,
        confirmedCount,
        completedCount,
        totalEditPrint,
        totalRevenue,
        recentBookings,
        todayBookings,
        todayDate: today,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal memuat statistik dasbor.', error: error.message });
  }
});

export default router;
