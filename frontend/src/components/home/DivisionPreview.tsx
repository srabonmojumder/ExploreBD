'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Navigation, Sparkles, Compass } from 'lucide-react';

interface DivisionItem {
  name: string;
  bnName: string;
  districts: number;
  highlight: string;
  image: string;
}

const DIVISIONS: DivisionItem[] = [
  {
    name: 'Chattogram',
    bnName: 'চট্টগ্রাম',
    districts: 11,
    highlight: "Cox's Bazar, Sajek Valley, Sitakunda, Saint Martin",
    image: 'https://images.unsplash.com/photo-1585123388867-3bfe6dd4bdbf?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Sylhet',
    bnName: 'সিলেট',
    districts: 4,
    highlight: 'Sreemangal Tea Gardens, Ratargul Swamp, Bichanakandi',
    image: 'https://images.unsplash.com/photo-1608958435020-e8a7109ba809?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Dhaka',
    bnName: 'ঢাকা',
    districts: 13,
    highlight: 'Lalbagh Fort, Ahsan Manzil, Panam City, National Parliament',
    image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Khulna',
    bnName: 'খুলনা',
    districts: 10,
    highlight: 'Sundarbans Mangrove, Sixty Dome Mosque, Kotka Beach',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Rajshahi',
    bnName: 'রাজশাহী',
    districts: 8,
    highlight: 'Somapura Mahavihara, Varendra Museum, Puthia Temple Complex',
    image: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Barishal',
    bnName: 'বরিশাল',
    districts: 6,
    highlight: 'Kuakata Daughter of the Sea, Floating Guava Market',
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Rangpur',
    bnName: 'রংপুর',
    districts: 8,
    highlight: 'Tajhat Palace, Kantajew Temple, Ramsagar Dighi',
    image: 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Mymensingh',
    bnName: 'ময়মনসিংহ',
    districts: 4,
    highlight: 'Garo Hills, Birishiri Ceramic Hills, Shashi Lodge',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
  },
];

export function DivisionPreview() {
  return (
    <section id="divisions" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Discover Bangladesh</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Explore All 8 Divisions
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            From the deep mangroves of Sundarbans to the rolling green tea hills of Sylhet
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-slate-300 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-white/10 shadow-sm">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          <span>64 Districts Ready to Explore</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {DIVISIONS.map((div) => {
          return (
            <Link
              key={div.name}
              href={`/districts?division=${div.name.toLowerCase()}`}
              className="group relative flex flex-col rounded-2xl glass-card overflow-hidden hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-emerald-950/50"
            >
              {/* Division Cover Image */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                <Image
                  src={div.image}
                  alt={div.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                {/* Top Badge: District Count */}
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/15 text-[11px] font-bold text-emerald-300 shadow-md">
                    {div.districts} Districts
                  </span>
                </div>

                {/* Bottom Title on Image */}
                <div className="absolute bottom-3 left-3 right-3 flex items-baseline justify-between">
                  <h3 className="font-extrabold text-xl text-white group-hover:text-emerald-300 transition-colors">
                    {div.name}
                  </h3>
                  <span className="text-sm font-semibold text-slate-300">
                    {div.bnName}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-slate-950/40">
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {div.highlight}
                </p>

                <div className="pt-2.5 border-t border-white/5 flex items-center justify-between text-xs text-slate-400 group-hover:text-emerald-400 transition-colors font-semibold">
                  <span>জেলাগুলো দেখুন</span>
                  <Navigation className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform text-emerald-400" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default DivisionPreview;
