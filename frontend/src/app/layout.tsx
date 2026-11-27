import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingWhatsApp from '@/components/layout/FloatingWhatsApp';

export const metadata: Metadata = {
  title: 'Harvest Studio Subang | Fotografi & Videografi Eksklusif',
  description: 'Studio foto dan videografi profesional di Subang, Jawa Barat. Abadikan momen pernikahan, keluarga, wisuda, dan acara spesial Anda dengan visual sinematik dan mewah.',
  keywords: ['studio foto subang', 'fotografer subang', 'wedding photography subang', 'foto wisuda subang', 'harvest studio photo'],
  openGraph: {
    title: 'Harvest Studio Subang | Fotografi & Videografi Eksklusif',
    description: 'We Capture Emotions. You Live Them. Studio foto & videografi pernikahan, keluarga, dan acara profesional.',
    url: 'https://harveststudio.id',
    siteName: 'Harvest Studio',
    locale: 'id_ID',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#0A0A0B] text-zinc-100 selection:bg-[#C6A87D] selection:text-black">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
