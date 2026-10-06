import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Place } from '@/lib/api-client';
import { CategoryBadge } from './CategoryBadge';
import { MapPin, Star, Users } from 'lucide-react';

interface PlaceCardProps {
  place: Place;
}

export function PlaceCard({ place }: PlaceCardProps) {
  const coverUrl =
    place.coverImage ||
    place.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';

  return (
    <Link
      href={`/places/${place.slug}`}
      className="group flex flex-col rounded-2xl glass-card overflow-hidden hover:border-emerald-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-950/40"
    >
      {/* Cover Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
        <Image
          src={coverUrl}
          alt={place.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <CategoryBadge category={place.category} />

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-xs font-semibold text-amber-300">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{place.averageRating.toFixed(1)}</span>
          </div>
        </div>

        {/* Bottom District Tag inside image */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs font-medium text-slate-300">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          <span>{place.district.name}</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">{place.division.name}</span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-bold text-base text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
              {place.name}
            </h3>
            {place.bnName && (
              <span className="text-xs text-slate-400 font-medium shrink-0">
                {place.bnName}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
            {place.description}
          </p>
        </div>

        {/* Footer Meta */}
        <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-teal-400" />
            <span>{place.totalVisitors.toLocaleString()} visited</span>
          </span>

          <span className="text-emerald-400 font-semibold group-hover:underline">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default PlaceCard;
