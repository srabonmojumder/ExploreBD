'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ApiClient } from '@/lib/api-client';
import { PlaceCard } from '@/components/places/PlaceCard';
import { ApiStatusCard } from '@/components/home/ApiStatusCard';
import { DivisionPreview } from '@/components/home/DivisionPreview';
import {
  Compass,
  MapPin,
  Trophy,
  ChevronRight,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export default function HomePage() {
  const { data: popularData, isLoading: loadingPopular } = useQuery({
    queryKey: ['popular-places-home'],
    queryFn: () => ApiClient.getPlaces({ sortBy: 'popular', limit: 6 }),
  });

  const popularPlaces = Array.isArray(popularData?.data) ? popularData.data : [];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Subtle Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-emerald-500/15 to-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-emerald-500/30 text-xs sm:text-sm font-medium text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>The Social Travel Platform for Bangladesh</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Explore Bangladesh. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
              Track Every Journey.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Discover destinations across 8 divisions and 64 districts. Mark your visits, calculate personal exploration stats, and unlock achievements as you wander the delta.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/districts"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm shadow-xl shadow-emerald-950/60 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <Compass className="w-4 h-4" />
              <span>Explore 64 Districts</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>

            <Link
              href="/places"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl glass-card hover:bg-slate-800 text-slate-200 font-semibold text-sm border border-white/10 flex items-center justify-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Browse Places</span>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-10 grid grid-cols-3 gap-4 max-w-xl mx-auto border-t border-white/10">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">8</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                Divisions
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">64</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                Districts
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-teal-300">100+</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                Destinations
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
        {/* Popular Tourist Places Section */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Trending Across Bangladesh</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
                Popular Tourist Destinations
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Top-rated waterfalls, beaches, and historic monuments to add to your bucket list
              </p>
            </div>

            <Link
              href="/places"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 self-start sm:self-auto group"
            >
              <span>View all destinations</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loadingPopular ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl glass-card aspect-[16/11] animate-pulse bg-slate-900/60"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularPlaces.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          )}
        </section>

        {/* Division Preview Section */}
        <DivisionPreview />

        {/* System Verification Card */}
        <section id="status">
          <ApiStatusCard />
        </section>

        {/* Core Capabilities */}
        <section id="features" className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Core Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
              Engineered for Real Explorers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-white">Division & District Hierarchy</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Structured exploration across all 8 administrative divisions and 64 individual districts.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-950 border border-teal-500/20 flex items-center justify-center text-teal-400">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-white">Multi-Visit Tracking</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Logs repeat visits, dates, and photos while calculating genuine unique exploration percentages.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Trophy className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-white">Gamified Badges & Levels</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Earn &ldquo;Waterfall Hunter&rdquo;, &ldquo;Division Master&rdquo;, and compete on the national leaderboard.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
