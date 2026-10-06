'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { ApiClient, PlaceCategory } from '@/lib/api-client';
import { PlaceCard } from '@/components/places/PlaceCard';
import {
  MapPin,
  ChevronRight,
  Compass,
  Trophy,
  RefreshCw,
  AlertCircle,
  Sparkles,
  Layers,
  ArrowLeft,
  Navigation,
} from 'lucide-react';

export default function DistrictDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['district-detail', slug],
    queryFn: () => ApiClient.getDistrictBySlug(slug),
  });

  const district = data?.data;

  const filteredPlaces =
    district?.places.filter((p) =>
      selectedCategory === 'ALL' ? true : p.category === selectedCategory
    ) || [];

  const availableCategories = Array.from(
    new Set(district?.places.map((p) => p.category) || [])
  );

  return (
    <div className="space-y-12 pb-20">
      {/* Loading State */}
      {isLoading && (
        <div className="py-32 flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="w-10 h-10 text-emerald-400 animate-spin" />
          <p className="text-sm text-slate-400">Loading district details...</p>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="max-w-2xl mx-auto my-20 glass-card rounded-2xl p-8 border border-red-500/20 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">District Not Found</h2>
          <p className="text-sm text-red-300/80">
            {error instanceof Error ? error.message : 'Could not load this district.'}
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
              href="/districts"
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold"
            >
              Browse All Districts
            </Link>
          </div>
        </div>
      )}

      {/* Main District Content */}
      {district && (
        <>
          {/* Hero Section */}
          <section className="relative h-[420px] sm:h-[480px] w-full overflow-hidden bg-slate-950">
            <Image
              src={
                district.coverImage ||
                'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80'
              }
              alt={district.name}
              fill
              priority
              className="object-cover opacity-45 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

            <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-10 space-y-4">
              {/* Breadcrumbs */}
              <nav className="flex items-center gap-2 text-xs font-medium text-slate-300">
                <Link href="/" className="hover:text-emerald-400 transition-colors">
                  Home
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                <Link href="/districts" className="hover:text-emerald-400 transition-colors">
                  Districts
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-emerald-400 font-semibold">{district.division.name}</span>
              </nav>

              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-xs font-semibold text-emerald-300">
                      {district.division.name} Division
                    </span>
                    {district.bnName && (
                      <span className="text-xl sm:text-2xl font-bold text-slate-300 font-sans">
                        {district.bnName}
                      </span>
                    )}
                  </div>
                  <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mt-2">
                    {district.name}
                  </h1>
                  <p className="text-sm sm:text-base text-slate-300 max-w-2xl mt-2 leading-relaxed">
                    {district.description ||
                      'Discover scenic tourist spots, cultural heritage, and natural wonders.'}
                  </p>
                </div>

                {/* Exploration Stats Card */}
                <div className="glass-card p-5 rounded-2xl border border-white/10 shrink-0 w-full sm:w-80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5 text-amber-400" />
                      <span>District Progress</span>
                    </span>
                    <span className="text-xs font-bold text-emerald-400">
                      {district.stats.explorationPercentage}% Explored
                    </span>
                  </div>

                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-white/5">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${district.stats.explorationPercentage}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>
                      <strong className="text-white">{district.stats.exploredPlaces}</strong> /{' '}
                      {district.stats.totalPlaces} Places Explored
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="text-emerald-400 font-medium">Ready to track</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* District Places Grid Container */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            {/* Filter Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-emerald-400" />
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Tourist Destinations in {district.name}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-500/20">
                  {district.places.length}
                </span>
              </div>

              {/* Category Filter Pills */}
              {availableCategories.length > 0 && (
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('ALL')}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === 'ALL'
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/60 ring-1 ring-emerald-400'
                        : 'glass-card text-slate-300 hover:text-white'
                    }`}
                  >
                    All ({district.places.length})
                  </button>
                  {availableCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap capitalize transition-all ${
                        selectedCategory === cat
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/60 ring-1 ring-emerald-400'
                          : 'glass-card text-slate-300 hover:text-white'
                      }`}
                    >
                      {cat.toLowerCase()}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Places Grid */}
            {filteredPlaces.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPlaces.map((place) => (
                  <PlaceCard key={place.id} place={place} />
                ))}
              </div>
            ) : (
              <div className="py-16 glass-card rounded-2xl p-8 text-center space-y-3">
                <Compass className="w-10 h-10 text-slate-500 mx-auto" />
                <h3 className="font-bold text-white text-lg">
                  No places listed in this category
                </h3>
                <p className="text-sm text-slate-400 max-w-sm mx-auto">
                  Select another category or view all places in {district.name}.
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('ALL')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold"
                >
                  View All Places
                </button>
              </div>
            )}

            {/* User Visited Places Section (Empty state preview for travel tracking) */}
            <section className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Your Visited Places in {district.name}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                    Keep a personal record of every waterfall, park, and hill you visit in this district.
                  </p>
                </div>
              </div>

              <div className="py-8 border border-dashed border-white/10 rounded-xl text-center space-y-2 bg-slate-900/30">
                <p className="text-sm font-medium text-slate-300">
                  No visits logged in {district.name} yet.
                </p>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Once you visit destinations here, your dates, ratings, and memories will appear in this section.
                </p>
              </div>
            </section>
          </main>
        </>
      )}
    </div>
  );
}
