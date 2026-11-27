import { Router, Request, Response } from 'express';
import { prisma } from '../prisma.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Public & Admin: Get blocked schedules / holidays
router.get('/blocks', async (req: Request, res: Response) => {
  try {
    const { month } = req.query; // YYYY-MM
    const where: any = {};
    if (month) {
      where.date = { startsWith: String(month) };
    }
    const blocks = await prisma.scheduleBlock.findMany({
      where,
      orderBy: { date: 'asc' },
      include: { resource: true },
    });
    res.json({ success: true, data: blocks });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal memuat jadwal blokir.' });
  }
});

// Admin: Add date block
router.post('/blocks', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { date, startTime, endTime, reason, isFullDay, resourceId } = req.body;
    const block = await prisma.scheduleBlock.create({
      data: {
        date,
        startTime: startTime || null,
        endTime: endTime || null,
        reason: reason || 'Studio Libur / Agenda Tertutup',
        isFullDay: isFullDay !== undefined ? Boolean(isFullDay) : true,
        resourceId: resourceId || null,
      },
    });
    res.json({ success: true, message: 'Jadwal blokir berhasil ditambahkan.', data: block });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal menambahkan blokir jadwal.', error: error.message });
  }
});

// Admin: Delete date block
router.delete('/blocks/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.scheduleBlock.delete({ where: { id } });
    res.json({ success: true, message: 'Jadwal blokir berhasil dihapus.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal menghapus blokir jadwal.' });
  }
});

// Resources CRUD
router.get('/resources', async (req: Request, res: Response) => {
  try {
    const resources = await prisma.resource.findMany({ orderBy: { name: 'asc' } });
    res.json({ success: true, data: resources });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal mengambil sumber daya.' });
  }
});

export default router;
