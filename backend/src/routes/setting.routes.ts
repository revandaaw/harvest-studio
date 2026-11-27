import { Router, Request, Response } from 'express';
import { prisma } from '../prisma.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Get all settings (Public)
router.get('/', async (req: Request, res: Response) => {
  try {
    const settings = await prisma.setting.findMany();
    const settingsMap: Record<string, string> = {};
    settings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });
    res.json({ success: true, data: settingsMap });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal memuat pengaturan.', error: error.message });
  }
});

// Update settings (Admin only)
router.post('/bulk', authenticateToken, async (req: Request, res: Response) => {
  try {
    const updates: Record<string, string> = req.body;
    for (const [key, value] of Object.entries(updates)) {
      await prisma.setting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value), group: 'general' },
      });
    }
    res.json({ success: true, message: 'Pengaturan berhasil diperbarui.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal memperbarui pengaturan.', error: error.message });
  }
});

export default router;
