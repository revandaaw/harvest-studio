import { Router, Request, Response } from 'express';
import { prisma } from '../prisma.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Public: Get albums with category & tag filters
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, tag, isFeatured } = req.query;
    const where: any = {};

    if (category && category !== 'all') {
      where.category = { slug: String(category) };
    }

    if (isFeatured === 'true') {
      where.isFeatured = true;
    }

    const albums = await prisma.portfolioAlbum.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        package: { select: { id: true, name: true, slug: true, price: true } },
        media: { orderBy: { sortOrder: 'asc' } },
      },
    });

    let filtered = albums.map((a) => ({
      ...a,
      tags: typeof a.tags === 'string' ? JSON.parse(a.tags) : a.tags,
    }));

    if (tag && tag !== 'all') {
      filtered = filtered.filter((a) => a.tags.includes(String(tag)));
    }

    res.json({ success: true, data: filtered });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal memuat portofolio.', error: error.message });
  }
});

// Public: Get album detail
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const album = await prisma.portfolioAlbum.findUnique({
      where: { slug },
      include: {
        category: true,
        package: true,
        media: { orderBy: { sortOrder: 'asc' } },
      },
    });

    if (!album) {
      res.status(404).json({ success: false, message: 'Album tidak ditemukan.' });
      return;
    }

    res.json({
      success: true,
      data: {
        ...album,
        tags: typeof album.tags === 'string' ? JSON.parse(album.tags) : album.tags,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal mengambil detail album.' });
  }
});

// Admin: Create album
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { title, slug, categoryId, packageId, tags, eventDate, description, coverImage, isFeatured, sortOrder, media } = req.body;

    const album = await prisma.portfolioAlbum.create({
      data: {
        title,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        categoryId,
        packageId: packageId || null,
        tags: JSON.stringify(Array.isArray(tags) ? tags : []),
        eventDate: eventDate || null,
        description: description || null,
        coverImage: coverImage || 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800',
        isFeatured: Boolean(isFeatured),
        sortOrder: Number(sortOrder) || 0,
        media: {
          create: Array.isArray(media)
            ? media.map((m: any, idx: number) => ({
                type: m.type || 'photo',
                url: m.url,
                caption: m.caption || null,
                sortOrder: idx,
              }))
            : [],
        },
      },
      include: { media: true },
    });

    res.json({ success: true, message: 'Album berhasil dibuat.', data: album });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal membuat album.', error: error.message });
  }
});

// Admin: Delete album
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.portfolioAlbum.delete({ where: { id } });
    res.json({ success: true, message: 'Album berhasil dihapus.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal menghapus album.' });
  }
});

export default router;
