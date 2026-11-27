import { Router, Request, Response } from 'express';
import { prisma } from '../prisma.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Public: Get all active add-ons
router.get('/', async (req: Request, res: Response) => {
  try {
    const addOns = await prisma.addOn.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' },
    });
    const parsed = addOns.map((a) => ({
      ...a,
      categoryIds: JSON.parse(a.categoryIds || '["ALL"]'),
    }));
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal memuat add-ons.' });
  }
});

// Admin: Create add-on
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { name, price, priceType, categoryIds, description, isActive } = req.body;
    const addOn = await prisma.addOn.create({
      data: {
        name,
        price: Number(price),
        priceType: priceType || 'fixed',
        categoryIds: JSON.stringify(Array.isArray(categoryIds) ? categoryIds : ['ALL']),
        description,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });
    res.json({ success: true, message: 'Add-on berhasil ditambahkan.', data: addOn });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal menambahkan add-on.', error: error.message });
  }
});

// Admin: Update add-on
router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, price, priceType, categoryIds, description, isActive } = req.body;
    const addOn = await prisma.addOn.update({
      where: { id },
      data: {
        name,
        price: Number(price),
        priceType,
        categoryIds: JSON.stringify(Array.isArray(categoryIds) ? categoryIds : ['ALL']),
        description,
        isActive: Boolean(isActive),
      },
    });
    res.json({ success: true, message: 'Add-on berhasil diperbarui.', data: addOn });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal memperbarui add-on.', error: error.message });
  }
});

// Admin: Delete add-on
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.addOn.delete({ where: { id } });
    res.json({ success: true, message: 'Add-on berhasil dihapus.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal menghapus add-on.', error: error.message });
  }
});

export default router;
