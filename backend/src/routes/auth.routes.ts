import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'harvest_studio_jwt_secret_key_2026_super_secure';

// Login Admin
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email dan password wajib diisi.' });
      return;
    }

    const admin = await prisma.adminUser.findUnique({ where: { email } });
    if (!admin) {
      res.status(401).json({ success: false, message: 'Email atau password salah.' });
      return;
    }

    const isValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isValid) {
      res.status(401).json({ success: false, message: 'Email atau password salah.' });
      return;
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role, name: admin.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login berhasil.',
      token,
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.', error: error.message });
  }
});

// Get current logged in user
router.get('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const admin = await prisma.adminUser.findUnique({
      where: { id: req.user?.id },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    if (!admin) {
      res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });
      return;
    }
    res.json({ success: true, user: admin });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data pengguna.' });
  }
});

export default router;
