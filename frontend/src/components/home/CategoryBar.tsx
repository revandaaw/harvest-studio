'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, User, Calendar, Video, Sparkles, Image as ImageIcon } from 'lucide-react';

export default function CategoryBar() {
  const categories = [
    {
      name: 'WEDDING',
      tagline: 'Timeless moments of your special day',
      icon: Heart,
      href: '/paket?category=wedding',
    },
    {
      name: 'PORTRAITS',
      tagline: 'Natural & stunning studio portraits',
      icon: User,
      href: '/paket?category=studio',
    },
    {
      name: 'EVENTS',
      tagline: 'Corporate, gathering & private events',
      icon: Calendar,
      href: '/paket?category=acara',
    },
    {
      name: 'VIDEOGRAFI',
      tagline: 'Cinematic 4K teaser & highlights',
      icon: Video,
      href: '/paket?category=videografi',
    },
    {
      name: 'EDIT FOTO',
      tagline: 'High-end retouch & color grading',
      icon: Sparkles,
      href: '/edit-cetak',
    },
    {
      name: 'CETAK & ALBUM',
      tagline: 'Premium lab prints & custom frames',
      icon: ImageIcon,
      href: '/edit-cetak',
    },
  ];

  return (
    <div className="relative z-20 max-w-7xl mx-auto px-4 lg:px-8 -mt-10 lg:-mt-12">
      <div className="bg-[#111114]/95 border border-white/10 rounded-sm shadow-2xl backdrop-blur-md p-4 lg:p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((cat, i) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.name}
              href={cat.href}
              className="group p-3 lg:p-4 rounded-sm hover:bg-zinc-800/60 border border-transparent hover:border-[#C6A87D]/30 transition-all flex flex-col items-center text-center space-y-2"
            >
              <div className="w-10 h-10 rounded-full border border-white/10 group-hover:border-[#C6A87D] flex items-center justify-center text-zinc-300 group-hover:text-[#C6A87D] transition-all bg-zinc-900 group-hover:scale-110 duration-300">
                <Icon className="w-5 h-5 stroke-[1.5]" />
              </div>
              <span className="font-serif text-xs font-bold tracking-wider text-white group-hover:text-[#C6A87D] transition-colors">
                {cat.name}
              </span>
              <span className="text-[10px] text-zinc-400 leading-tight hidden sm:block">
                {cat.tagline}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
