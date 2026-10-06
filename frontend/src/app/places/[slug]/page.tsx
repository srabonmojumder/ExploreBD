'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { ApiClient } from '@/lib/api-client';
import { CategoryBadge } from '@/components/places/CategoryBadge';
import { PlaceCard } from '@/components/places/PlaceCard';
import {
  MapPin,
  ChevronRight,
  Star,
  Users,
  Calendar,
  Compass,
  PlusCircle,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Sparkles,
  Camera,
  Share2,
} from 'lucide-react';

export default function PlaceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['place-detail', slug],
    queryFn: () => ApiClient.getPlaceBySlug(slug),
  });

  const place = data?.data;

  const allImages = place
    ? [
        place.coverImage ||
          'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
        ...(place.images?.map((img) => img.url) || []),
      ].filter((v, i, a) => a.indexOf(v) === i)
    : [];

  const activeImage = allImages[activeImageIndex] || allImages[0];

  return (
    <div className="space-y-12 pb-24">
      {/* Loading State */}
      {isLoading && (
        <div className="py-32 flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="w-10 h-10 text-emerald-400 animate-spin" />
          <p className="text-sm text-slate-400">Loading destination details...</p>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="max-w-2xl mx-auto my-20 glass-card rounded-2xl p-8 border border-red-500/20 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Destination Not Found</h2>
          <p className="text-sm text-red-300/80">
            {error instanceof Error ? error.message : 'Could not load destination.'}
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => refetch()}
              className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold"
            >
              Retry
            </button>
            <Link
              href="/places"
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold"
            >
              Browse All Places
            </Link>
          </div>
        </div>
      )}

      {/* Main Content */}
      {place && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pt-6">
          {/* Breadcrumbs Navigation */}
          <nav className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-400">
            <Link href="/" className="hover:text-emerald-400 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <Link href="/districts" className="hover:text-emerald-400 transition-colors">
              {place.division.name}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <Link
              href={`/districts/${place.district.slug}`}
              className="hover:text-emerald-400 transition-colors"
            >
              {place.district.name}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-emerald-400 font-semibold">{place.name}</span>
          </nav>

          {/* Hero Header & Action Area */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <CategoryBadge category={place.category} size="md" />

                <Link
                  href={`/districts/${place.district.slug}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-white/10 text-xs font-medium text-slate-300 hover:text-white hover:border-emerald-500/40 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    {place.district.name}, {place.division.name}
                  </span>
                </Link>

                {place.bnName && (
                  <span className="text-lg text-slate-300 font-semibold font-sans">
                    {place.bnName}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                {place.name}
              </h1>
            </div>

            {/* Quick Actions (Add Visit ready for Phase 4) */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  alert('Destination link copied to clipboard!');
                }}
                className="p-3 rounded-xl glass-card hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                title="Share place"
              >
                <Share2 className="w-5 h-5" />
              </button>

              <button
                type="button"
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm shadow-xl shadow-emerald-950/60 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Log Visit</span>
              </button>
            </div>
          </div>

          {/* Gallery Showcase */}
          <section className="space-y-3">
            {/* Primary Featured Image */}
            <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-2xl overflow-hidden bg-slate-900 border border-white/10 shadow-2xl">
              <Image
                src={activeImage}
                alt={place.name}
                fill
                priority
                className="object-cover transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10">
                  <Camera className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    Photo {activeImageIndex + 1} of {allImages.length}
                  </span>
                </span>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 backdrop-blur-md border border-emerald-500/30 text-emerald-300 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View on Google Maps</span>
                </a>
              </div>
            </div>

            {/* Thumbnail Row */}
            {allImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                {allImages.map((img, idx) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      activeImageIndex === idx
                        ? 'border-emerald-400 scale-105 shadow-md shadow-emerald-950/60'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt="Thumbnail" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Place Details & Side Meta Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Col: Description & Experience */}
            <div className="lg:col-span-2 space-y-8">
              <div className="glass-card p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4">
                <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  <span>About {place.name}</span>
                </h2>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed whitespace-pre-line">
                  {place.description}
                </p>
              </div>

              {/* Geographic Coordinates & Location Info */}
              <div className="glass-card p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4">
                <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-400" />
                  <span>Geographic Location</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                    <span className="text-slate-400 font-medium">GPS Coordinates:</span>
                    <p className="text-emerald-400 font-mono text-sm font-semibold">
                      {place.latitude.toFixed(4)}° N, {place.longitude.toFixed(4)}° E
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                    <span className="text-slate-400 font-medium">Administrative Jurisdiction:</span>
                    <p className="text-white text-sm font-semibold">
                      {place.district.name} District, {place.division.name}
                    </p>
                  </div>
                </div>
              </div>

              {/* Visit History Section (Travel tracking placeholder for Phase 4) */}
              <div className="glass-card p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-emerald-400" />
                    <span>Your Visit History</span>
                  </h3>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-slate-900 text-slate-400 border border-white/10">
                    0 visits recorded
                  </span>
                </div>
                <div className="py-8 border border-dashed border-white/10 rounded-xl text-center space-y-2 bg-slate-900/30">
                  <p className="text-sm font-medium text-slate-300">
                    You haven&apos;t marked your visit to {place.name} yet.
                  </p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Click &ldquo;Log Visit&rdquo; to add your visit date, rating, photos, and personal memories.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Col: Quick Facts Card */}
            <div className="space-y-6">
              <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-5">
                <h3 className="font-bold text-white text-base tracking-tight pb-3 border-b border-white/10">
                  Destination Overview
                </h3>

                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span>Average Rating</span>
                    </span>
                    <span className="font-bold text-amber-300 text-sm">
                      {place.averageRating.toFixed(1)} / 5.0
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-2">
                      <Users className="w-4 h-4 text-teal-400" />
                      <span>Total Travelers</span>
                    </span>
                    <span className="font-bold text-white text-sm">
                      {place.totalVisitors.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-2">
                      <Compass className="w-4 h-4 text-emerald-400" />
                      <span>Category</span>
                    </span>
                    <CategoryBadge category={place.category} />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-400" />
                      <span>District</span>
                    </span>
                    <Link
                      href={`/districts/${place.district.slug}`}
                      className="font-bold text-emerald-400 hover:underline"
                    >
                      {place.district.name}
                    </Link>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <Link
                    href={`/districts/${place.district.slug}`}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>View All {place.district.name} Places</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Destinations */}
          {place.recommended && place.recommended.length > 0 && (
            <section className="space-y-6 pt-6 border-t border-white/10">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Recommended Destinations in {place.category.toLowerCase()}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  More spectacular spots across Bangladesh you might want to explore next
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
                {place.recommended.map((rec) => (
                  <Link
                    key={rec.id}
                    href={`/places/${rec.slug}`}
                    className="glass-card rounded-2xl overflow-hidden group hover:border-emerald-500/40 transition-all hover:-translate-y-1"
                  >
                    <div className="relative aspect-[16/10] w-full bg-slate-900">
                      <Image
                        src={
                          rec.coverImage ||
                          rec.images?.[0]?.url ||
                          'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'
                        }
                        alt={rec.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4 space-y-1">
                      <h4 className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                        {rec.name}
                      </h4>
                      <p className="text-xs text-slate-400">{rec.district.name}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </main>
      )}
    </div>
  );
}
