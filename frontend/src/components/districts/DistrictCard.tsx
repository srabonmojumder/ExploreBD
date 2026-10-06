import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { District } from '@/lib/api-client';
import { MapPin, Navigation, Compass } from 'lucide-react';

interface DistrictCardProps {
  district: District;
}

export function DistrictCard({ district }: DistrictCardProps) {
  const coverUrl =
    district.coverImage ||
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';

  return (
    <Link
      href={`/districts/${district.slug}`}
      className="group flex flex-col rounded-2xl glass-card overflow-hidden hover:border-emerald-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-950/40"
    >
      {/* Cover Image Container */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
        <Image
          src={coverUrl}
          alt={district.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

        {/* Division Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-xs font-semibold text-emerald-300">
            {district.division?.name || 'Bangladesh'}
          </span>
        </div>

        {/* Places count pill */}
        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 backdrop-blur-md border border-emerald-500/20 text-xs font-medium text-emerald-400 flex items-center gap-1">
            <Compass className="w-3 h-3" />
            <span>{district._count?.places ?? 0} Places</span>
          </span>
        </div>

        {/* Title over image */}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-baseline justify-between">
            <h3 className="font-bold text-lg text-white group-hover:text-emerald-300 transition-colors">
              {district.name}
            </h3>
            {district.bnName && (
              <span className="text-xs text-slate-300 font-medium">
                {district.bnName}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {district.description || 'Explore scenic tourist destinations and landmarks.'}
        </p>

        {/* Exploration Status Preview */}
        <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>Exploration</span>
          </span>

          <span className="text-emerald-400 font-semibold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
            <span>Explore District</span>
            <Navigation className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default DistrictCard;
