import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Harvest Studio database...');

  // 1. Settings
  const settings = [
    { key: 'studio_name', value: 'Harvest Studio', group: 'general' },
    { key: 'tagline', value: 'Capturing Moments, Creating Stories', group: 'general' },
    { key: 'address', value: 'Jl. Otto Iskandardinata No. 88, Subang, Jawa Barat 41211', group: 'general' },
    { key: 'phone', value: '+62 812-3456-7890', group: 'general' },
    { key: 'whatsapp', value: '6281234567890', group: 'general' },
    { key: 'email', value: 'halo@harveststudio.id', group: 'general' },
    { key: 'instagram', value: '@harvest_studiophoto', group: 'social' },
    { key: 'instagram_url', value: 'https://instagram.com/harvest_studiophoto', group: 'social' },
    { key: 'theme_bg', value: '#0B0B0C', group: 'theme' },
    { key: 'theme_accent', value: '#D4AF37', group: 'theme' },
    { key: 'theme_cream', value: '#F4ECE1', group: 'theme' },
    { key: 'bank_name', value: 'BCA (Bank Central Asia)', group: 'payment' },
    { key: 'bank_account_number', value: '1234-5678-90', group: 'payment' },
    { key: 'bank_account_name', value: 'HARVEST STUDIO SUBANG', group: 'payment' },
    { key: 'bank_mandiri_number', value: '173-00-1234567-8', group: 'payment' },
    { key: 'bank_mandiri_name', value: 'HARVEST STUDIO SUBANG', group: 'payment' },
    { key: 'dp_percentage_wedding', value: '30', group: 'policy' },
    { key: 'dp_percentage_studio', value: '50', group: 'policy' },
    { key: 'hero_experience_years', value: '10+', group: 'general' },
    { key: 'hero_experience_text', value: 'Tahun Pengalaman Profesional', group: 'general' },
  ];

  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value, group: s.group },
      create: s,
    });
  }

  // 2. Admin User
  const passwordHash = await bcrypt.hash('admin123', 10);
  await prisma.adminUser.upsert({
    where: { email: 'admin@harveststudio.com' },
    update: { passwordHash },
    create: {
      name: 'Owner Harvest Studio',
      email: 'admin@harveststudio.com',
      passwordHash,
      role: 'OWNER',
    },
  });

  // 3. Categories
  const categoriesData = [
    {
      name: 'Wedding & Prewedding',
      slug: 'wedding',
      description: 'Abadikan janji suci dan kemeriahan hari bahagia Anda dengan visual sinematik dan elegan.',
      icon: 'Ring',
      sortOrder: 1,
    },
    {
      name: 'Studio & Portrait',
      slug: 'studio',
      description: 'Sesi foto keluarga, wisuda, grup, dan personal dengan tata cahaya studio profesional.',
      icon: 'User',
      sortOrder: 2,
    },
    {
      name: 'Acara & Event',
      slug: 'acara',
      description: 'Dokumentasi lengkap acara lamaran, ulang tahun, gathering, dan corporate event.',
      icon: 'Calendar',
      sortOrder: 3,
    },
    {
      name: 'Videografi',
      slug: 'videografi',
      description: 'Video sinematik 4K, video teaser highlight, dan liputan dokumentasi penuh.',
      icon: 'Video',
      sortOrder: 4,
    },
    {
      name: 'Edit Foto & Retouch',
      slug: 'edit',
      description: 'Jasa retouch wajah, color grading profesional, dan restorasi foto lama kenangan.',
      icon: 'Sparkles',
      sortOrder: 5,
    },
    {
      name: 'Cetak & Album',
      slug: 'cetak',
      description: 'Cetak foto premium lab, bingkai minimalis/ukir, canvas, dan album kolase eksklusif.',
      icon: 'Image',
      sortOrder: 6,
    },
  ];

  const catMap: Record<string, string> = {};
  for (const c of categoriesData) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: c,
      create: c,
    });
    catMap[c.slug] = cat.id;
  }

  // 4. Packages
  const packagesData = [
    {
      categoryId: catMap['wedding'],
      name: 'Wedding Full Day Platinum (Foto + Video)',
      slug: 'wedding-full-day-platinum',
      description: 'Paket terlengkap untuk mengabadikan momen akad hingga resepsi pernikahan Anda secara utuh dari pagi hingga malam.',
      price: 8500000,
      promoPrice: 7999000,
      duration: '10 - 12 Jam',
      locationType: 'both',
      crewCount: '2 Fotografer + 2 Videografer + 1 Asisten',
      maxPersons: null,
      inclusions: JSON.stringify([
        'Liputan akad nikah & resepsi hingga selesai',
        '2 Fotografer senior & 2 Videografer sinematik',
        'Semua file foto original (RAW/JPEG full resolusi) di Flashdisk 64GB',
        '100 Foto edit retouch halus dan color graded',
        '1 Video Cinematic Teaser (1 menit untuk Instagram Reels/TikTok)',
        '1 Video Highlight Sinematik (3 - 5 menit)',
        '1 Video Dokumentasi Lengkap Full Acara (30 - 45 menit)',
        '1 Album Magazine Premium 20x30 cm (20 Halaman box eksklusif)',
        '2 Cetak Foto 16RP + Bingkai Minimalis Kaca',
      ]),
      badge: 'Paling Populer',
      status: 'active',
      coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000',
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000',
        'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000',
      ]),
      sortOrder: 1,
    },
    {
      categoryId: catMap['wedding'],
      name: 'Prewedding Outdoor Cinematic',
      slug: 'prewedding-outdoor-cinematic',
      description: 'Sesi pemotretan romantis di lokasi outdoor pilihan (kebun teh Subang, pantai, atau alam terbuka).',
      price: 3500000,
      promoPrice: 2990000,
      duration: '4 Jam',
      locationType: 'outdoor',
      crewCount: '1 Fotografer + 1 Videografer',
      maxPersons: 2,
      inclusions: JSON.stringify([
        'Sesi pemotretan outdoor 4 jam (hingga 2 konsep pakaian)',
        'Semua file foto mentah kualitas tinggi',
        '30 Foto pilihan diedit dan color graded',
        '1 Video Cinematic Prewedding 1-2 menit',
        '1 Cetak Foto 16R + Bingkai Minimalis (siap pajang saat resepsi)',
      ]),
      badge: 'Best Seller',
      status: 'active',
      coverImage: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=1000',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=1000',
        'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1000',
      ]),
      sortOrder: 2,
    },
    {
      categoryId: catMap['studio'],
      name: 'Studio Foto Keluarga Harmoni',
      slug: 'studio-foto-keluarga-harmoni',
      description: 'Momen kehangatan keluarga tercinta dalam studio modern dengan pilihan latar adat, batik, atau minimalis.',
      price: 950000,
      promoPrice: 850000,
      duration: '60 Menit',
      locationType: 'studio',
      crewCount: '1 Fotografer Studio + 1 Asisten Lighting',
      maxPersons: 8,
      inclusions: JSON.stringify([
        'Sesi foto studio 60 menit (maksimal 8 orang)',
        'Bebas pilih 2 tema background studio',
        'Semua file foto softcopy asli dikirim via Google Drive',
        '15 Foto terbaik diedit profesional',
        '1 Cetak Pembesar 12R + Bingkai Minimalis',
        '5 Lembar Cetak 4R',
      ]),
      badge: 'Favorit Keluarga',
      status: 'active',
      coverImage: 'https://images.unsplash.com/photo-1609234656388-0ff363383899?q=80&w=1000',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1609234656388-0ff363383899?q=80&w=1000',
        'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?q=80&w=1000',
      ]),
      sortOrder: 3,
    },
    {
      categoryId: catMap['studio'],
      name: 'Studio Wisuda & Personal Portrait',
      slug: 'studio-wisuda-personal-portrait',
      description: 'Rayakan kelulusan dan potret diri profesional dengan pencahayaan editorial berkualitas tinggi.',
      price: 450000,
      promoPrice: 399000,
      duration: '45 Menit',
      locationType: 'studio',
      crewCount: '1 Fotografer Studio',
      maxPersons: 3,
      inclusions: JSON.stringify([
        'Sesi studio 45 menit',
        'Toga / pakaian wisuda + pendamping (orang tua / pasangan)',
        'Seluruh softcopy foto asli',
        '8 Foto diedit halus (skin retouch & tone)',
        '1 Cetak 10R + Bingkai Minimalis',
      ]),
      badge: 'Promo Musim Wisuda',
      status: 'active',
      coverImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000',
      ]),
      sortOrder: 4,
    },
    {
      categoryId: catMap['acara'],
      name: 'Dokumentasi Acara & Gathering Perusahaan',
      slug: 'dokumentasi-acara-gathering',
      description: 'Dokumentasi profesional untuk acara ulang tahun, lamaran/tunangan, aqiqah, reuni, hingga seminar perusahaan.',
      price: 2200000,
      promoPrice: null,
      duration: '4 Jam',
      locationType: 'outdoor',
      crewCount: '1 Fotografer + 1 Asisten',
      maxPersons: null,
      inclusions: JSON.stringify([
        'Liputan acara selama 4 jam penuh',
        'Unlimited shoot selama durasi acara',
        'Semua file foto JPEG resolusi tinggi dalam Google Drive',
        '50 Foto pilihan diedit dan color graded',
        'Pengerjaan cepat (maksimal 5 hari kerja)',
      ]),
      badge: null,
      status: 'active',
      coverImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1000',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1000',
      ]),
      sortOrder: 5,
    },
    {
      categoryId: catMap['videografi'],
      name: 'Cinematic Video Highlight & Drone 4K',
      slug: 'cinematic-video-highlight-drone',
      description: 'Produksi video sinematik dengan visual udara (drone 4K) dan sound design berkelas tinggi.',
      price: 4500000,
      promoPrice: 4000000,
      duration: 'Sesuai Event',
      locationType: 'both',
      crewCount: '2 Videografer + Pilot Drone Berlisensi',
      maxPersons: null,
      inclusions: JSON.stringify([
        'Liputan kamera cinema 4K + Pilot Drone DJI',
        'Audio recording profesional untuk sambutan / ijab qabul',
        '1 Video Teaser Instagram 60 detik (vertikal 9:16)',
        '1 Video Cinematic Film 4 - 6 menit (horizontal 16:9)',
        'Color grading estetik profesional',
      ]),
      badge: 'Sinematik Mewah',
      status: 'active',
      coverImage: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1000',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1000',
      ]),
      sortOrder: 6,
    },
  ];

  for (const p of packagesData) {
    await prisma.package.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }

  // 5. Add-ons
  const addOnsData = [
    {
      name: 'Tambahan Durasi Layanan (per 1 Jam)',
      price: 350000,
      priceType: 'per_hour',
      categoryIds: JSON.stringify(['ALL']),
      description: 'Perpanjangan sesi pemotretan atau liputan acara.',
    },
    {
      name: 'Liputan Udara Drone 4K Aerial',
      price: 1000000,
      priceType: 'fixed',
      categoryIds: JSON.stringify(['wedding', 'acara', 'videografi']),
      description: 'Termasuk pilot berlisensi & video footage 4K.',
    },
    {
      name: 'Album Kolase Magazine Eksklusif (20 Halaman)',
      price: 750000,
      priceType: 'fixed',
      categoryIds: JSON.stringify(['wedding', 'studio', 'acara']),
      description: 'Ukuran 20x30 cm dengan kertas foto metallic & hardbox.',
    },
    {
      name: 'Makeup Artist (MUA) & Hairdo/Hijab',
      price: 500000,
      priceType: 'fixed',
      categoryIds: JSON.stringify(['studio', 'wedding']),
      description: 'Riasan wajah halus tahan lama di studio sebelum sesi foto.',
    },
    {
      name: 'Cetak Foto 16RP + Bingkai Minimalis Kaca',
      price: 250000,
      priceType: 'fixed',
      categoryIds: JSON.stringify(['ALL']),
      description: 'Kualitas cetak lab tahan puluhan tahun dengan bingkai estetik.',
    },
    {
      name: 'Layanan Edit Kilat (Express 24 Jam)',
      price: 300000,
      priceType: 'fixed',
      categoryIds: JSON.stringify(['ALL']),
      description: 'Hasil foto diedit dan diserahkan dalam waktu 24 jam.',
    },
  ];

  for (const a of addOnsData) {
    const existing = await prisma.addOn.findFirst({ where: { name: a.name } });
    if (!existing) {
      await prisma.addOn.create({ data: a });
    }
  }

  // 6. Portfolio Albums (Cohesive 1-Tone Warm Luxury / Cinematic Gold)
  const albumsData = [
    {
      title: 'The Wedding of Reza & Anisa',
      slug: 'the-wedding-of-reza-anisa',
      categoryId: catMap['wedding'],
      tags: JSON.stringify(['Wedding', 'Sunda', 'Resepsi', 'Candlelight']),
      eventDate: '15 Oktober 2026',
      description: 'Liputan akad nikah dan resepsi bernuansa adat Sunda modern di Lembah Sarimas Subang dengan tata cahaya lilin hangat.',
      coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
      isFeatured: true,
      sortOrder: 1,
    },
    {
      title: 'Sunset Romance at Tea Garden',
      slug: 'sunset-romance-prewedding',
      categoryId: catMap['wedding'],
      tags: JSON.stringify(['Prewedding', 'Outdoor', 'Sunset', 'Golden Hour']),
      eventDate: '28 September 2026',
      description: 'Sesi prewedding outdoor di hamparan kebun teh Ciater dengan pendar keemasan matahari terbenam yang memeluk hangat kedua mempelai.',
      coverImage: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=80',
      isFeatured: true,
      sortOrder: 2,
    },
    {
      title: 'Potret Kehangatan Keluarga Tiga Generasi',
      slug: 'kehangatan-keluarga-hartono',
      categoryId: catMap['studio'],
      tags: JSON.stringify(['Studio', 'Keluarga', 'Batik', 'Harmoni']),
      eventDate: '02 November 2026',
      description: 'Harmoni cinta keluarga besar dalam balutan busana batik senada. Tata lampu studio lembut menghasilkan kontras kulit natural yang hangat.',
      coverImage: 'https://images.unsplash.com/photo-1609234656388-0ff363383899?auto=format&fit=crop&w=1200&q=80',
      isFeatured: true,
      sortOrder: 3,
    },
    {
      title: 'Editorial Personal & Beauty Portrait',
      slug: 'editorial-personal-portrait',
      categoryId: catMap['studio'],
      tags: JSON.stringify(['Studio', 'Portrait', 'Editorial', 'Lighting']),
      eventDate: '12 November 2026',
      description: 'Pencahayaan Rembrandt bernuansa warm champagne yang menonjolkan karakter wajah dan tekstur alami dengan kesan mewah kontemporer.',
      coverImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
      isFeatured: true,
      sortOrder: 4,
    },
    {
      title: 'Gala Dinner & Corporate Annual Gathering',
      slug: 'gala-dinner-corporate-gathering',
      categoryId: catMap['acara'],
      tags: JSON.stringify(['Acara', 'Corporate', 'Gathering', 'Banquet']),
      eventDate: '20 Oktober 2026',
      description: 'Dokumentasi malam keakraban perusahaan dengan dekorasi lampu gantung kristal dan ambient candlelight yang intim dan berkelas.',
      coverImage: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
      isFeatured: true,
      sortOrder: 5,
    },
    {
      title: 'Momen Kebanggaan Wisuda Sarjana',
      slug: 'wisuda-sarjana-subang',
      categoryId: catMap['studio'],
      tags: JSON.stringify(['Studio', 'Wisuda', 'Portrait', 'Kelulusan']),
      eventDate: '08 November 2026',
      description: 'Abadikan perayaan gelar akademik dan senyuman orang tua tercinta dalam frame foto wisuda berstandar studio majalah.',
      coverImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
      isFeatured: true,
      sortOrder: 6,
    },
    {
      title: 'Cinematic 4K Wedding Film & Drone',
      slug: 'cinematic-wedding-film-drone',
      categoryId: catMap['videografi'],
      tags: JSON.stringify(['Videografi', 'Cinematic', 'Drone', '4K']),
      eventDate: '05 Oktober 2026',
      description: 'Produksi video highlight sinematik 4K dengan visual aerial drone saat matahari terbit, menangkap setiap janji suci penuh emosi.',
      coverImage: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80',
      isFeatured: true,
      sortOrder: 7,
    },
    {
      title: 'Kemewahan Detail Cincin & Busana Pengantin',
      slug: 'wedding-details-and-rings',
      categoryId: catMap['wedding'],
      tags: JSON.stringify(['Wedding', 'Details', 'Jewelry', 'Macro']),
      eventDate: '18 Oktober 2026',
      description: 'Sentuhan makro pada cincin emas kawin, undangan bertekstur, dan payet kebaya pengantin dalam kilau hangat yang abadi.',
      coverImage: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=80',
      isFeatured: true,
      sortOrder: 8,
    },
    {
      title: 'Savanna & Pines Prewedding Story',
      slug: 'savanna-pines-prewedding',
      categoryId: catMap['wedding'],
      tags: JSON.stringify(['Prewedding', 'Outdoor', 'Alam', 'Intimate']),
      eventDate: '22 September 2026',
      description: 'Kisah cinta di antara pepohonan pinus berkabut dengan berkas cahaya keemasan yang menyinari pasangan.',
      coverImage: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=80',
      isFeatured: false,
      sortOrder: 9,
    },
    {
      title: 'Executive & Professional Business Portrait',
      slug: 'executive-business-portrait',
      categoryId: catMap['studio'],
      tags: JSON.stringify(['Studio', 'Portrait', 'Executive', 'Corporate']),
      eventDate: '10 November 2026',
      description: 'Foto profil profesional berwibawa untuk CEO dan eksekutif perusahaan dalam palet warna arang & warm amber.',
      coverImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1200&q=80',
      isFeatured: false,
      sortOrder: 10,
    },
    {
      title: 'Prosesi Khidmat Lamaran & Pertunangan',
      slug: 'prosesi-lamaran-pertunangan',
      categoryId: catMap['acara'],
      tags: JSON.stringify(['Acara', 'Lamaran', 'Engagement', 'Keluarga']),
      eventDate: '01 Oktober 2026',
      description: 'Kehangatan pertemuan dua keluarga besar, penyerahan seserahan berhias bunga mawar krem, dan ikatan janji pertunangan.',
      coverImage: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200&q=80',
      isFeatured: false,
      sortOrder: 11,
    },
    {
      title: 'The Royal Heritage Wedding Ceremony',
      slug: 'royal-heritage-wedding',
      categoryId: catMap['wedding'],
      tags: JSON.stringify(['Wedding', 'Adat', 'Royal', 'Resepsi']),
      eventDate: '25 Oktober 2026',
      description: 'Kemegahan busana pengantin tradisional bersulam benang emas di bawah temaram lampu chandeliers, menciptakan nuansa agung penuh wibawa.',
      coverImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
      isFeatured: false,
      sortOrder: 12,
    },
  ];

  for (const a of albumsData) {
    await prisma.portfolioAlbum.upsert({
      where: { slug: a.slug },
      update: a,
      create: a,
    });
  }

  // 7. Testimonials
  const testimonials = [
    {
      name: 'Sarah & Dimas',
      role: 'Pengantin Wedding Full Day',
      content: 'Harvest Studio luar biasa! Hasil foto dan video pernikahan kami sangat elegan dan berkelas. Timnya ramah, tepat waktu, dan sangat sabar mengarahkan gaya kami yang kaku. Recommended sekali!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150',
      isFeatured: true,
      sortOrder: 1,
    },
    {
      name: 'Michael & Emily',
      role: 'Klien Prewedding Outdoor',
      content: 'Incredible eye for detail and creativity! Video teaser prewedding kami viral di Instagram keluarga. Tonality warnanya hangat dan mewah persis seperti yang kami impikan.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150',
      isFeatured: true,
      sortOrder: 2,
    },
    {
      name: 'Pak Andi Wijaya',
      role: 'Foto Keluarga Studio',
      content: 'Sangat puas dengan foto studio keluarga di Harvest Studio Subang. Ruang studionya bersih, AC dingin, propertinya lengkap, dan cetak bingkainya sangat mewah.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150',
      isFeatured: true,
      sortOrder: 3,
    },
  ];

  for (const t of testimonials) {
    const existing = await prisma.testimonial.findFirst({ where: { name: t.name } });
    if (!existing) {
      await prisma.testimonial.create({ data: t });
    }
  }

  // 8. Resources
  const resources = [
    { name: 'Kamera Utama & Fotografer Lead', type: 'photographer' },
    { name: 'Fotografer Studio 1', type: 'photographer' },
    { name: 'Videografer Sinematik & Drone', type: 'videographer' },
    { name: 'Ruang Studio Utama (Subang)', type: 'studio_room' },
    { name: 'Ruang Studio Tematik', type: 'studio_room' },
  ];

  for (const r of resources) {
    const existing = await prisma.resource.findFirst({ where: { name: r.name } });
    if (!existing) {
      await prisma.resource.create({ data: r });
    }
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
