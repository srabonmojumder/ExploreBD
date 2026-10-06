'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Place } from '@/lib/api-client';
import { useTravelStore } from '@/stores/useTravelStore';
import { useMounted } from '@/hooks/useMounted';
import { CategoryBadge } from '@/components/places/CategoryBadge';
import { Check, Plus, Minus, MapPin, Eye, Sparkles } from 'lucide-react';

interface DistrictSpotTrackerCardProps {
  place: Place;
  districtSlug: string;
}

export function DistrictSpotTrackerCard({
  place,
  districtSlug,
}: DistrictSpotTrackerCardProps) {
  const mounted = useMounted();
  const { getPlaceVisit, incrementVisit, decrementVisit, recordVisit } = useTravelStore();

  const visit = mounted ? getPlaceVisit(place.slug) : undefined;
  const isVisited = Boolean(visit && visit.count > 0);
  const visitCount = visit ? visit.count : 0;

  const coverUrl =
    place.coverImage ||
    place.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';

  const handleToggle = () => {
    if (isVisited) {
      decrementVisit(place.slug);
    } else {
      recordVisit(
        {
          placeId: place.id,
          placeSlug: place.slug,
          placeName: place.name,
          bnName: place.bnName,
          districtSlug: districtSlug,
          category: place.category,
        },
        1
      );
    }
  };

  const handleAddOne = (e: React.MouseEvent) => {
    e.stopPropagation();
    incrementVisit({
      placeId: place.id,
      placeSlug: place.slug,
      placeName: place.name,
      bnName: place.bnName,
      districtSlug: districtSlug,
      category: place.category,
    });
  };

  const handleMinusOne = (e: React.MouseEvent) => {
    e.stopPropagation();
    decrementVisit(place.slug);
  };

  return (
    <div
      className={`group relative flex flex-col rounded-2xl glass-card overflow-hidden transition-all duration-300 border ${
        isVisited
          ? 'border-emerald-500/60 bg-emerald-950/20 shadow-xl shadow-emerald-950/30'
          : 'border-white/10 hover:border-white/20'
      }`}
    >
      {/* Cover Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
        <Image
          src={coverUrl}
          alt={place.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`object-cover transition-transform duration-500 ${
            isVisited ? 'scale-100' : 'group-hover:scale-105'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <CategoryBadge category={place.category} />

          {isVisited ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-900/60 animate-in fade-in zoom-in-95 duration-200">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>ঘুরেছি</span>
            </div>
          ) : (
            <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-[11px] font-medium text-slate-400">
              অদেখা
            </span>
          )}
        </div>

        {/* Floating visited counter indicator on photo */}
        {isVisited && (
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-xl bg-slate-950/90 border border-emerald-500/40 text-emerald-300 text-xs font-bold backdrop-blur-md flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>{visitCount} বার ভ্রমণ</span>
          </div>
        )}
      </div>

      {/* Body Information */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-bold text-base text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
              {place.bnName || place.name}
            </h3>
            {place.bnName && (
              <span className="text-[11px] text-slate-400 font-medium truncate max-w-[110px]">
                {place.name}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
            {place.description}
          </p>
        </div>

        {/* Interactive Visit Action Bar */}
        <div className="pt-3 border-t border-white/5 space-y-2.5">
          {isVisited ? (
            /* Visited Stepper Area */
            <div className="flex items-center justify-between gap-2 bg-slate-900/80 border border-emerald-500/30 rounded-xl p-1.5">
              <button
                type="button"
                onClick={handleMinusOne}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-red-950/60 hover:text-red-300 text-slate-300 flex items-center justify-center transition-colors text-sm font-bold"
                title="কমাও"
                aria-label="Decrease visit count"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              <div className="text-center">
                <span className="text-xs text-slate-400 font-medium block text-[10px] uppercase tracking-wider">
                  ভ্রমণ সংখ্যা
                </span>
                <span className="text-sm font-black text-emerald-400">
                  {visitCount} বার
                </span>
              </div>

              <button
                type="button"
                onClick={handleAddOne}
                className="w-8 h-8 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center transition-colors text-sm font-bold shadow-md shadow-emerald-950/40"
                title="আরো ১ বার বাড়াও"
                aria-label="Increase visit count"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            /* Unvisited Quick Mark Button */
            <button
              type="button"
              onClick={handleToggle}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-emerald-600/90 text-slate-200 hover:text-white border border-white/10 hover:border-emerald-500/40 text-xs font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Check className="w-3.5 h-3.5 text-emerald-400 group-hover:text-white" />
              <span>ঘুরেছি? এখানে ক্লিক করুন</span>
            </button>
          )}

          {/* Place Details Link */}
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-500 text-[11px] flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>{place.district?.name || 'Local Spot'}</span>
            </span>

            <Link
              href={`/places/${place.slug}`}
              className="text-slate-400 hover:text-emerald-400 font-medium inline-flex items-center gap-1 transition-colors text-[11px]"
            >
              <span>বিস্তারিত দেখুন</span>
              <Eye className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
