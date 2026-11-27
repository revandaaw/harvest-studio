'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Eye, X, ChevronLeft, ChevronRight, Sparkles, Filter, 
  Calendar, MapPin, Layers 
} from 'lucide-react';
import { fetchAPI } from '@/lib/api';

// Cohesive 1-Tone Portfolio Collection (Warm Luxury / Cinematic Champagne & Gold)
export const COHESIVE_PORTFOLIO_ITEMS = [
  {
    id: '1',
    title: 'The Wedding of Reza & Anisa',
    slug: 'the-wedding-of-reza-anisa',
    categoryName: 'Wedding & Prewedding',
    categorySlug: 'wedding',
    tags: ['Wedding', 'Sunda', 'Resepsi', 'Candlelight'],
    eventDate: '15 Oktober 2026',
    location: 'Lembah Sarimas, Subang',
    description: 'Liputan akad nikah dan resepsi bernuansa adat Sunda modern dengan tata cahaya lilin hangat, menghasilkan dokumentasi sakral yang emosional dan elegan.',
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: '2',
    title: 'Sunset Romance at Tea Garden',
    slug: 'sunset-romance-prewedding',
    categoryName: 'Wedding & Prewedding',
    categorySlug: 'wedding',
    tags: ['Prewedding', 'Outdoor', 'Sunset', 'Golden Hour'],
    eventDate: '28 September 2026',
    location: 'Perkebunan Teh Ciater, Subang',
    description: 'Sesi prewedding outdoor di hamparan kebun teh dengan pendar keemasan matahari terbenam (golden hour) yang memeluk hangat kedua mempelai.',
    coverImage: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: '3',
    title: 'Potret Kehangatan Keluarga Tiga Generasi',
    slug: 'kehangatan-keluarga-hartono',
    categoryName: 'Studio & Portrait',
    categorySlug: 'studio',
    tags: ['Studio', 'Keluarga', 'Batik', 'Harmoni'],
    eventDate: '02 November 2026',
    location: 'Studio Utama Harvest, Subang',
    description: 'Harmoni cinta keluarga besar dalam balutan busana batik senada. Tata lampu studio lembut menghasilkan kontras kulit natural yang hangat.',
    coverImage: 'https://images.unsplash.com/photo-1609234656388-0ff363383899?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1609234656388-0ff363383899?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: '4',
    title: 'Editorial Personal & Beauty Portrait',
    slug: 'editorial-personal-portrait',
    categoryName: 'Studio & Portrait',
    categorySlug: 'studio',
    tags: ['Studio', 'Portrait', 'Editorial', 'Lighting'],
    eventDate: '12 November 2026',
    location: 'Studio Tematik Harvest, Subang',
    description: 'Pencahayaan Rembrandt bernuansa warm champagne yang menonjolkan karakter wajah dan tekstur alami dengan kesan mewah kontemporer.',
    coverImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: '5',
    title: 'Gala Dinner & Corporate Annual Gathering',
    slug: 'gala-dinner-corporate-gathering',
    categoryName: 'Acara & Event',
    categorySlug: 'acara',
    tags: ['Acara', 'Corporate', 'Gathering', 'Banquet'],
    eventDate: '20 Oktober 2026',
    location: 'Grand Ballroom Subang',
    description: 'Dokumentasi malam keakraban perusahaan dengan dekorasi lampu gantung kristal dan ambient candlelight yang intim dan berkelas.',
    coverImage: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: '6',
    title: 'Momen Kebanggaan Wisuda Sarjana',
    slug: 'wisuda-sarjana-subang',
    categoryName: 'Studio & Portrait',
    categorySlug: 'studio',
    tags: ['Studio', 'Wisuda', 'Portrait', 'Kelulusan'],
    eventDate: '08 November 2026',
    location: 'Studio Harvest Subang',
    description: 'Abadikan perayaan gelar akademik dan senyuman orang tua tercinta dalam frame foto wisuda berstandar studio majalah.',
    coverImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1627556704290-2b1f5853ff78?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: '7',
    title: 'Cinematic 4K Wedding Film & Drone',
    slug: 'cinematic-wedding-film-drone',
    categoryName: 'Videografi',
    categorySlug: 'videografi',
    tags: ['Videografi', 'Cinematic', 'Drone', '4K'],
    eventDate: '05 Oktober 2026',
    location: 'Resort Ciater & Subang',
    description: 'Produksi video highlight sinematik 4K dengan visual aerial drone saat matahari terbit, menangkap setiap janji suci penuh emosi.',
    coverImage: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: '8',
    title: 'Kemewahan Detail Cincin & Busana Pengantin',
    slug: 'wedding-details-and-rings',
    categoryName: 'Wedding & Prewedding',
    categorySlug: 'wedding',
    tags: ['Wedding', 'Details', 'Jewelry', 'Macro'],
    eventDate: '18 Oktober 2026',
    location: 'Bridal Suite Subang',
    description: 'Sentuhan makro pada cincin emas kawin, undangan bertekstur, dan payet kebaya pengantin dalam kilau hangat yang abadi.',
    coverImage: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: '9',
    title: 'Savanna & Pines Prewedding Story',
    slug: 'savanna-pines-prewedding',
    categoryName: 'Wedding & Prewedding',
    categorySlug: 'wedding',
    tags: ['Prewedding', 'Outdoor', 'Alam', 'Intimate'],
    eventDate: '22 September 2026',
    location: 'Hutan Pinus Cikole - Subang',
    description: 'Kisah cinta di antara pepohonan pinus berkabut dengan berkas cahaya keemasan (crepuscular rays) yang menyinari pasangan.',
    coverImage: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1494774157365-9e04c6720e47?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: '10',
    title: 'Executive & Professional Business Portrait',
    slug: 'executive-business-portrait',
    categoryName: 'Studio & Portrait',
    categorySlug: 'studio',
    tags: ['Studio', 'Portrait', 'Executive', 'Corporate'],
    eventDate: '10 November 2026',
    location: 'Studio Harvest Subang',
    description: 'Foto profil profesional berwibawa untuk CEO, dokter, notaris, dan eksekutif perusahaan dalam palet warna arang & warm amber.',
    coverImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: '11',
    title: 'Prosesi Khidmat Lamaran & Pertunangan',
    slug: 'prosesi-lamaran-pertunangan',
    categoryName: 'Acara & Event',
    categorySlug: 'acara',
    tags: ['Acara', 'Lamaran', 'Engagement', 'Keluarga'],
    eventDate: '01 Oktober 2026',
    location: 'Kediaman Klien, Subang',
    description: 'Kehangatan pertemuan dua keluarga besar, penyerahan seserahan berhias bunga mawar krem, dan ikatan janji pertunangan.',
    coverImage: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: '12',
    title: 'The Royal Heritage Wedding Ceremony',
    slug: 'royal-heritage-wedding',
    categoryName: 'Wedding & Prewedding',
    categorySlug: 'wedding',
    tags: ['Wedding', 'Adat', 'Royal', 'Resepsi'],
    eventDate: '25 Oktober 2026',
    location: 'Wisma Karya Heritage, Subang',
    description: 'Kemegahan busana pengantin tradisional bersulam benang emas di bawah temaram lampu chandeliers, menciptakan nuansa agung penuh wibawa.',
    coverImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
    ],
  },
];

export default function PortfolioPage() {
  const [albums, setAlbums] = useState<any[]>(COHESIVE_PORTFOLIO_ITEMS);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeTag, setActiveTag] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [currentGalleryIdx, setCurrentGalleryIdx] = useState<number>(0);

  useEffect(() => {
    async function loadPortfolio() {
      const res = await fetchAPI('/portfolios');
      if (res.success && Array.isArray(res.data) && res.data.length >= 8) {
        setAlbums(res.data);
      }
    }
    loadPortfolio();
  }, []);

  const categories = [
    { slug: 'all', label: 'Semua Kategori' },
    { slug: 'wedding', label: 'Wedding & Prewedding' },
    { slug: 'studio', label: 'Studio & Portrait' },
    { slug: 'acara', label: 'Dokumentasi Acara' },
    { slug: 'videografi', label: 'Videografi' },
  ];

  const allTags = [
    'all',
    'Wedding',
    'Prewedding',
    'Sunset',
    'Studio',
    'Keluarga',
    'Portrait',
    'Acara',
    'Videografi',
    'Adat',
  ];

  const filteredAlbums = albums.filter((album) => {
    const catSlug = album.categorySlug || album.category?.slug;
    if (activeCategory !== 'all' && catSlug !== activeCategory) return false;
    if (activeTag !== 'all') {
      const tags = Array.isArray(album.tags) ? album.tags : [];
      if (!tags.includes(activeTag)) return false;
    }
    return true;
  });

  const currentLightbox = lightboxIndex !== null ? filteredAlbums[lightboxIndex] : null;

  const currentPhotos = currentLightbox
    ? (Array.isArray(currentLightbox.gallery) && currentLightbox.gallery.length > 0
        ? currentLightbox.gallery
        : [currentLightbox.coverImage])
    : [];

  const nextLightbox = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredAlbums.length);
      setCurrentGalleryIdx(0);
    }
  };

  const prevLightbox = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredAlbums.length) % filteredAlbums.length);
      setCurrentGalleryIdx(0);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-zinc-100 py-12 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-[#C6A87D] text-xs font-bold tracking-[0.25em] uppercase block">
            GALLERY & STORIES
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Galeri Karya Harvest Studio
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm font-light leading-relaxed">
            Kumpulan momen emosional, kehangatan keluarga, dan janji suci pernikahan yang diabadikan dengan *signature tone* sinematik hangat, elegan, dan abadi di Subang, Jawa Barat.
          </p>
        </div>

        {/* Filters */}
        <div className="space-y-4 border-y border-white/10 py-6">
          {/* Category Tabs */}
          <div className="flex items-center justify-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => {
                  setActiveCategory(cat.slug);
                  setActiveTag('all');
                }}
                className={`px-5 py-2.5 rounded-sm text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat.slug
                    ? 'bg-[#C6A87D] text-black shadow-lg shadow-[#C6A87D]/20 font-bold'
                    : 'bg-zinc-900/90 text-zinc-400 hover:text-white border border-white/5'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Tag Pills */}
          <div className="flex items-center justify-center flex-wrap gap-2 text-xs">
            <span className="text-zinc-500 flex items-center space-x-1 text-[11px] mr-1">
              <Filter className="w-3 h-3 text-[#C6A87D]" />
              <span>Tag Pilihan:</span>
            </span>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-3 py-1 rounded-full text-[11px] transition-colors ${
                  activeTag === tag
                    ? 'bg-[#C6A87D]/20 text-[#C6A87D] font-semibold border border-[#C6A87D]/40'
                    : 'bg-zinc-900/60 text-zinc-400 hover:text-white border border-transparent'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid (Harmonious 1-Tone Photos) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlbums.map((album, idx) => (
            <div
              key={album.id}
              onClick={() => {
                setLightboxIndex(idx);
                setCurrentGalleryIdx(0);
              }}
              className="group relative h-[420px] rounded-sm overflow-hidden bg-zinc-900 border border-white/10 cursor-pointer shadow-xl transition-all duration-500 hover:-translate-y-1.5 hover:border-[#C6A87D]/60"
            >
              <img
                src={album.coverImage}
                alt={album.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Dark subtle vignette layer ensuring 100% legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/20" />

              {/* Top Category Badge */}
              <div className="absolute top-4 left-4">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-black/75 backdrop-blur-md text-[#C6A87D] px-2.5 py-1 rounded-sm border border-[#C6A87D]/30 shadow-md">
                  {album.categoryName || album.category?.name}
                </span>
              </div>

              {/* Hover Multi-photo Badge */}
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-zinc-300 text-[10px] font-mono px-2 py-1 rounded-sm flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Layers className="w-3 h-3 text-[#C6A87D]" />
                <span>{album.gallery ? album.gallery.length : 3} Foto</span>
              </div>

              {/* Bottom Overlay Info */}
              <div className="absolute bottom-0 inset-x-0 p-6 space-y-2 text-white">
                <div className="flex items-center space-x-3 text-[11px] text-[#C6A87D] font-mono">
                  {album.eventDate && (
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{album.eventDate}</span>
                    </span>
                  )}
                  {album.location && (
                    <span className="flex items-center space-x-1 text-zinc-400 truncate">
                      <MapPin className="w-3 h-3 text-[#C6A87D]" />
                      <span className="truncate">{album.location}</span>
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-xl font-bold leading-snug text-white group-hover:text-[#F4ECE1] transition-colors">
                  {album.title}
                </h3>
                
                <p className="text-xs text-zinc-300 font-light line-clamp-2 leading-relaxed">
                  {album.description}
                </p>

                <div className="pt-2 flex items-center justify-between text-xs text-[#C6A87D] font-medium">
                  <span className="flex items-center space-x-1.5 group-hover:translate-x-1 transition-transform">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Buka Galeri Foto</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal with Multi-Photo Session Carousel */}
      {currentLightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="portfolio-lightbox-title"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-6 right-6 z-30 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Tutup Galeri"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Left Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevLightbox();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors hidden sm:flex"
            aria-label="Album Sebelumnya"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextLightbox();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors hidden sm:flex"
            aria-label="Album Selanjutnya"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div
            className="relative max-w-5xl w-full bg-[#121215] border border-white/10 rounded-sm overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left: Active Photo in Session */}
            <div className="md:w-3/5 h-[340px] md:h-[580px] bg-black relative flex items-center justify-center overflow-hidden">
              <img
                src={currentPhotos[currentGalleryIdx] || currentLightbox.coverImage}
                alt={currentLightbox.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md text-[#C6A87D] text-xs font-mono px-3 py-1 rounded-sm">
                Foto {currentGalleryIdx + 1} dari {currentPhotos.length}
              </div>
            </div>

            {/* Right: Album Details & Session Thumbnail Strip */}
            <div className="md:w-2/5 p-6 md:p-8 flex flex-col justify-between text-white space-y-4 overflow-y-auto">
              <div className="space-y-3">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#C6A87D] block">
                  {currentLightbox.categoryName || currentLightbox.category?.name}
                </span>
                <h2 id="portfolio-lightbox-title" className="font-serif text-2xl font-bold leading-tight">
                  {currentLightbox.title}
                </h2>
                
                {currentLightbox.eventDate && (
                  <p className="text-xs text-zinc-400 font-mono">
                    Tanggal: {currentLightbox.eventDate} {currentLightbox.location ? `• ${currentLightbox.location}` : ''}
                  </p>
                )}

                <p className="text-xs text-zinc-300 leading-relaxed pt-1">
                  {currentLightbox.description}
                </p>

                {/* Thumbnails of this session */}
                {currentPhotos.length > 1 && (
                  <div className="pt-3 border-t border-white/5 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">
                      Foto Dalam Sesi Ini:
                    </span>
                    <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                      {currentPhotos.map((photoUrl: string, pIdx: number) => (
                        <button
                          key={pIdx}
                          onClick={() => setCurrentGalleryIdx(pIdx)}
                          className={`relative w-16 h-16 rounded-sm overflow-hidden shrink-0 border-2 transition-all ${
                            currentGalleryIdx === pIdx
                              ? 'border-[#C6A87D] scale-95 opacity-100'
                              : 'border-transparent opacity-50 hover:opacity-100'
                          }`}
                        >
                          <img src={photoUrl} alt="Session photo" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {Array.isArray(currentLightbox.tags) && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {currentLightbox.tags.map((t: string) => (
                      <span key={t} className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded-sm text-zinc-300">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-white/10 space-y-2">
                <Link
                  href="/booking"
                  onClick={() => setLightboxIndex(null)}
                  className="w-full flex items-center justify-center space-x-2 bg-[#C6A87D] hover:bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-wider py-3.5 rounded-sm transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Pesan Sesi Foto Serupa</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
