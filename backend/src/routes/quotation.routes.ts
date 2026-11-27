import { Router, Request, Response } from 'express';
import { prisma } from '../prisma.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Submit quotation request (Public)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, whatsapp, email, eventType, eventDate, location, duration, budget, notes } = req.body;

    if (!name || !whatsapp || !eventType) {
      res.status(400).json({ success: false, message: 'Nama, WhatsApp, dan Jenis Acara wajib diisi.' });
      return;
    }

    const quotation = await prisma.quotationRequest.create({
      data: {
        name,
        whatsapp,
        email: email || null,
        eventType,
        eventDate: eventDate || null,
        location: location || null,
        duration: duration || null,
        budget: budget || null,
        notes: notes || null,
        status: 'NEW',
      },
    });

    res.json({
      success: true,
      message: 'Permintaan penawaran harga Anda telah kami terima! Tim Harvest Studio akan segera menghubungi Anda melalui WhatsApp.',
      data: quotation,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal mengirim permintaan penawaran.', error: error.message });
  }
});

// Admin: List quotations
router.get('/admin', authenticateToken, async (req: Request, res: Response) => {
  try {
    const list = await prisma.quotationRequest.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: list });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal memuat penawaran.' });
  }
});

// Admin: Update quotation status
router.patch('/:id/status', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const updated = await prisma.quotationRequest.update({
      where: { id },
      data: {
        status,
        adminNotes: adminNotes !== undefined ? adminNotes : undefined,
      },
    });

    res.json({ success: true, message: 'Status penawaran berhasil diperbarui.', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal memperbarui status penawaran.' });
  }
});

export default router;
