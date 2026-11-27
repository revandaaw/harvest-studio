import { Router, Request, Response } from 'express';
import { prisma } from '../prisma.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Public: Get packages with filtering, searching, and sorting
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, minPrice, maxPrice, location, search, sort, status } = req.query;

    const where: any = {
      status: status ? String(status) : 'active',
    };

    if (category && category !== 'all') {
      where.category = { slug: String(category) };
    }

    if (location && location !== 'all') {
      where.locationType = { in: [String(location), 'both'] };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }

    if (search) {
      where.OR = [
        { name: { contains: String(search) } },
        { description: { contains: String(search) } },
      ];
    }

    let orderBy: any = { sortOrder: 'asc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    else if (sort === 'price_desc') orderBy = { price: 'desc' };
    else if (sort === 'newest') orderBy = { createdAt: 'desc' };

    const packages = await prisma.package.findMany({
      where,
      orderBy,
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    // Parse JSON fields
    const parsedPackages = packages.map((pkg) => ({
      ...pkg,
      inclusions: typeof pkg.inclusions === 'string' ? JSON.parse(pkg.inclusions) : pkg.inclusions,
      gallery: typeof pkg.gallery === 'string' ? JSON.parse(pkg.gallery) : pkg.gallery,
    }));

    res.json({ success: true, data: parsedPackages });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal memuat paket.', error: error.message });
  }
});

// Public: Get single package by slug
router.get('/detail/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const pkg = await prisma.package.findUnique({
      where: { slug },
      include: {
        category: true,
        portfolios: {
          take: 4,
          select: { id: true, title: true, slug: true, coverImage: true },
        },
      },
    });

    if (!pkg) {
      res.status(404).json({ success: false, message: 'Paket tidak ditemukan.' });
      return;
    }

    res.json({
      success: true,
      data: {
        ...pkg,
        inclusions: typeof pkg.inclusions === 'string' ? JSON.parse(pkg.inclusions) : pkg.inclusions,
        gallery: typeof pkg.gallery === 'string' ? JSON.parse(pkg.gallery) : pkg.gallery,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal mengambil detail paket.', error: error.message });
  }
});

// Admin: Create package
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const {
      categoryId,
      name,
      slug,
      description,
      price,
      promoPrice,
      duration,
      locationType,
      crewCount,
      maxPersons,
      inclusions,
      badge,
      status,
      coverImage,
      gallery,
      sortOrder,
    } = req.body;

    const newPackage = await prisma.package.create({
      data: {
        categoryId,
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description,
        price: Number(price),
        promoPrice: promoPrice ? Number(promoPrice) : null,
        duration: duration || '60 Menit',
        locationType: locationType || 'studio',
        crewCount: crewCount || '1 Fotografer',
        maxPersons: maxPersons ? Number(maxPersons) : null,
        inclusions: JSON.stringify(Array.isArray(inclusions) ? inclusions : []),
        badge: badge || null,
        status: status || 'active',
        coverImage: coverImage || 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=800',
        gallery: JSON.stringify(Array.isArray(gallery) ? gallery : []),
        sortOrder: Number(sortOrder) || 0,
      },
    });

    res.json({ success: true, message: 'Paket berhasil dibuat.', data: newPackage });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal membuat paket.', error: error.message });
  }
});

// Admin: Update package
router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };

    if (data.price !== undefined) data.price = Number(data.price);
    if (data.promoPrice !== undefined) data.promoPrice = data.promoPrice ? Number(data.promoPrice) : null;
    if (data.maxPersons !== undefined) data.maxPersons = data.maxPersons ? Number(data.maxPersons) : null;
    if (data.sortOrder !== undefined) data.sortOrder = Number(data.sortOrder);
    if (Array.isArray(data.inclusions)) data.inclusions = JSON.stringify(data.inclusions);
    if (Array.isArray(data.gallery)) data.gallery = JSON.stringify(data.gallery);

    const updated = await prisma.package.update({
      where: { id },
      data,
    });

    res.json({ success: true, message: 'Paket berhasil diperbarui.', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal memperbarui paket.', error: error.message });
  }
});

// Admin: Delete package
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.package.delete({ where: { id } });
    res.json({ success: true, message: 'Paket berhasil dihapus.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal menghapus paket.', error: error.message });
  }
});

export default router;
