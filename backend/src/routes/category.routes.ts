import { Router, Request, Response } from 'express';
import { prisma } from '../prisma.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Public: Get all active categories
router.get('/', async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: { packages: true, portfolios: true },
        },
      },
    });
    res.json({ success: true, data: categories });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal mengambil kategori.', error: error.message });
  }
});

// Admin: Get all categories (including inactive)
router.get('/admin', authenticateToken, async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: { packages: true, portfolios: true },
        },
      },
    });
    res.json({ success: true, data: categories });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal mengambil kategori.', error: error.message });
  }
});

// Admin: Create category
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { name, slug, description, icon, sortOrder, isActive } = req.body;
    const category = await prisma.category.create({
      data: {
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description,
        icon,
        sortOrder: Number(sortOrder) || 0,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });
    res.json({ success: true, message: 'Kategori berhasil ditambahkan.', data: category });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal membuat kategori.', error: error.message });
  }
});

// Admin: Update category
router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, slug, description, icon, sortOrder, isActive } = req.body;
    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        icon,
        sortOrder: Number(sortOrder),
        isActive: Boolean(isActive),
      },
    });
    res.json({ success: true, message: 'Kategori berhasil diperbarui.', data: category });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal memperbarui kategori.', error: error.message });
  }
});

// Admin: Delete category
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.category.delete({ where: { id } });
    res.json({ success: true, message: 'Kategori berhasil dihapus.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal menghapus kategori.', error: error.message });
  }
});

export default router;
