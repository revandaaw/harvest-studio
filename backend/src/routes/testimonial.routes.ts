import { Router, Request, Response } from 'express';
import { prisma } from '../prisma.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Public: Get testimonials
router.get('/', async (req: Request, res: Response) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { isFeatured: true },
      orderBy: { sortOrder: 'asc' },
    });
    res.json({ success: true, data: testimonials });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal memuat testimoni.' });
  }
});

// Admin: Get all testimonials
router.get('/admin', authenticateToken, async (req: Request, res: Response) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: testimonials });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal memuat testimoni.' });
  }
});

// Admin: Create testimonial
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { name, role, content, rating, avatar, isFeatured, sortOrder } = req.body;
    const item = await prisma.testimonial.create({
      data: {
        name,
        role: role || 'Klien Harvest Studio',
        content,
        rating: Number(rating) || 5,
        avatar: avatar || null,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : true,
        sortOrder: Number(sortOrder) || 0,
      },
    });
    res.json({ success: true, message: 'Testimoni berhasil dibuat.', data: item });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal membuat testimoni.' });
  }
});

// Admin: Delete testimonial
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.testimonial.delete({ where: { id } });
    res.json({ success: true, message: 'Testimoni berhasil dihapus.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal menghapus testimoni.' });
  }
});

export default router;
