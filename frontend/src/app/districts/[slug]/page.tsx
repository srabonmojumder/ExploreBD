'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { ApiClient, PlaceCategory } from '@/lib/api-client';
import { useTravelStore } from '@/stores/useTravelStore';
import { useMounted } from '@/hooks/useMounted';
import { DistrictSpotTracker } from '@/components/districts/DistrictSpotTracker';
import { getDistrictUpazilas } from '@/components/map/upazilaMetadata';
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
  const mounted = useMounted();

  const { getDistrictStats } = useTravelStore();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['district-detail', slug],
    queryFn: () => ApiClient.getDistrictBySlug(slug),
  });

  const district = data?.data;
  const userStats = district && mounted ? getDistrictStats(district.slug, district.places.length) : null;

  const [bannerSrc, setBannerSrc] = useState<string>('/cover.jpg');

  React.useEffect(() => {
    if (district?.coverImage) {
      if (district.coverImage.includes('photo-1609137144822-0d1279a0cf34')) {
        setBannerSrc('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=80');
      } else {
        setBannerSrc(district.coverImage);
      }
    }
  }, [district?.coverImage]);

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
              className="px-4 py-2 rounded-xl btn-glitch bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
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
          <section className="relative min-h-[440px] sm:min-h-[480px] w-full overflow-hidden bg-slate-950 flex flex-col justify-end pt-12 pb-8 sm:pb-10">
            <Image
              src={bannerSrc}
              alt={district.name}
              fill
              priority
              onError={() => setBannerSrc('/cover.jpg')}
              className="object-cover opacity-60 scale-105 transition-opacity duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/30" />

            <div className="relative max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 space-y-4">
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
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-xs font-semibold text-emerald-300">
                      {district.division.name} Division
                    </span>
                    {getDistrictUpazilas(district.slug).length > 0 && (
                      <span className="px-3 py-1 rounded-full bg-slate-900/80 border border-white/10 text-xs font-semibold text-slate-300">
                        🏛️ {getDistrictUpazilas(district.slug).length}টি উপজেলা ও থানা
                      </span>
                    )}
                    {district.bnName && (
                      <span className="text-xl sm:text-2xl font-bold text-slate-300 font-sans ml-1">
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
                      <span>{userStats?.levelBadge || '🏆'} আপনার প্রগ্রেস</span>
                    </span>
                    <span className="text-xs font-bold text-emerald-400">
                      {userStats ? userStats.percentage : 0}% সম্পন্ন
                    </span>
                  </div>

                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-white/5">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${userStats ? userStats.percentage : 0}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>
                      <strong className="text-white">{userStats ? userStats.visitedPlaces : 0}</strong> /{' '}
                      {district.places.length} স্থান ঘুরেছেন
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="text-amber-300 font-semibold">
                      {userStats ? userStats.totalVisits : 0} বার ভ্রমণ
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* District Places & Micro-Spot Tracker */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <DistrictSpotTracker
              districtName={district.name}
              districtBnName={district.bnName}
              districtSlug={district.slug}
              places={district.places}
            />
          </main>
        </>
      )}
    </div>
  );
}
