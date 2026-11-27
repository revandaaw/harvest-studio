import { Router, Request, Response } from 'express';
import { prisma } from '../prisma.js';
import { authenticateToken } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

// Submit edit/print order (Public)
router.post('/', upload.array('files', 10), async (req: Request, res: Response) => {
  try {
    const {
      customerName,
      whatsapp,
      email,
      serviceType,
      specifications,
      cloudLink,
      quantity,
      notes,
      deliveryMethod,
      shippingAddress,
      totalAmount,
    } = req.body;

    if (!customerName || !whatsapp || !serviceType) {
      res.status(400).json({ success: false, message: 'Nama, WhatsApp, dan Jenis Layanan wajib diisi.' });
      return;
    }

    const uploadedFiles = req.files && Array.isArray(req.files)
      ? req.files.map((f: any) => `/uploads/${f.filename}`)
      : [];

    const fileUrls = cloudLink ? [cloudLink, ...uploadedFiles] : uploadedFiles;

    const count = await prisma.editPrintOrder.count();
    const orderCode = `HSE-${new Date().toISOString().slice(0, 7).replace('-', '')}-${String(count + 1).padStart(4, '0')}`;

    const order = await prisma.editPrintOrder.create({
      data: {
        orderCode,
        customerName,
        whatsapp,
        email: email || null,
        serviceType,
        specifications: typeof specifications === 'string' ? specifications : JSON.stringify(specifications || {}),
        fileUrls: JSON.stringify(fileUrls),
        quantity: Number(quantity) || 1,
        notes: notes || null,
        status: 'RECEIVED',
        deliveryMethod: deliveryMethod || 'PICKUP',
        shippingAddress: shippingAddress || null,
        totalAmount: Number(totalAmount) || 0,
      },
    });

    res.json({
      success: true,
      message: 'Pesanan layanan berhasil dibuat! Tim kami akan meninjau berkas Anda.',
      data: {
        ...order,
        specifications: JSON.parse(order.specifications),
        fileUrls: JSON.parse(order.fileUrls),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal membuat pesanan edit/cetak.', error: error.message });
  }
});

// Track edit/print order by code and phone
router.get('/track', async (req: Request, res: Response) => {
  try {
    const { code, phone } = req.query;
    if (!code || !phone) {
      res.status(400).json({ success: false, message: 'Kode pesanan dan nomor WhatsApp wajib diisi.' });
      return;
    }

    const order = await prisma.editPrintOrder.findFirst({
      where: {
        orderCode: String(code).trim().toUpperCase(),
        whatsapp: { contains: String(phone).trim() },
      },
    });

    if (!order) {
      res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
      return;
    }

    res.json({
      success: true,
      data: {
        ...order,
        specifications: JSON.parse(order.specifications),
        fileUrls: JSON.parse(order.fileUrls),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal melacak pesanan.' });
  }
});

// Admin: List all edit/print orders
router.get('/admin', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { status, type } = req.query;
    const where: any = {};
    if (status && status !== 'all') where.status = String(status);
    if (type && type !== 'all') where.serviceType = String(type);

    const orders = await prisma.editPrintOrder.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    const parsed = orders.map((o) => ({
      ...o,
      specifications: JSON.parse(o.specifications || '{}'),
      fileUrls: JSON.parse(o.fileUrls || '[]'),
    }));

    res.json({ success: true, data: parsed });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal memuat pesanan edit & cetak.' });
  }
});

// Admin: Update status
router.patch('/:id/status', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const updated = await prisma.editPrintOrder.update({
      where: { id },
      data: {
        status,
        notes: notes !== undefined ? notes : undefined,
      },
    });

    res.json({ success: true, message: 'Status produksi berhasil diperbarui.', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal memperbarui status.' });
  }
});

export default router;
