'use client';

import React, { useState } from 'react';
import { Place } from '@/lib/api-client';
import { useTravelStore } from '@/stores/useTravelStore';
import { useMounted } from '@/hooks/useMounted';
import { DistrictSpotTrackerCard } from './DistrictSpotTrackerCard';
import { DistrictShareCardModal } from './DistrictShareCardModal';
import {
  Compass,
  Trophy,
  Sparkles,
  Share2,
  CheckCircle2,
  Circle,
  Filter,
  RotateCcw,
} from 'lucide-react';

interface DistrictSpotTrackerProps {
  districtName: string;
  districtBnName?: string | null;
  districtSlug: string;
  places: Place[];
}

export function DistrictSpotTracker({
  districtName,
  districtBnName,
  districtSlug,
  places,
}: DistrictSpotTrackerProps) {
  const mounted = useMounted();
  const { getDistrictStats, getPlaceVisit, clearDistrictVisits } = useTravelStore();

  const [activeTab, setActiveTab] = useState<'ALL' | 'VISITED' | 'UNVISITED'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const defaultStats = {
    totalPlaces: places.length,
    visitedPlaces: 0,
    totalVisits: 0,
    percentage: 0,
    levelTitle: 'ভ্রমণ শুরুর অপেক্ষায়',
    levelBadge: '🌱',
  };
  const stats = mounted ? getDistrictStats(districtSlug, places.length) : defaultStats;
  const displayName = districtBnName || districtName;

  // Filter places based on activeTab and category
  const filteredPlaces = places.filter((place) => {
    if (!mounted) {
      if (activeTab === 'VISITED') return false;
      if (selectedCategory !== 'ALL' && place.category !== selectedCategory) return false;
      return true;
    }
    const visit = getPlaceVisit(place.slug);
    const isVisited = Boolean(visit && visit.count > 0);

    // Filter by visit state
    if (activeTab === 'VISITED' && !isVisited) return false;
    if (activeTab === 'UNVISITED' && isVisited) return false;

    // Filter by category
    if (selectedCategory !== 'ALL' && place.category !== selectedCategory) return false;

    return true;
  });

  const categories = Array.from(new Set(places.map((p) => p.category)));

  return (
    <section className="space-y-8 pt-4">
      {/* 1. Live Exploration Progress & Share Bar */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-emerald-500/30 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-500/15 via-teal-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left stats info */}
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-xs font-semibold text-emerald-300">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{displayName} ব্যক্তিগত ভ্রমণ খতিয়ান</span>
            </div>

            <div>
              <div className="flex items-center gap-3">
                <span className="text-3xl sm:text-4xl">{stats.levelBadge}</span>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {stats.levelTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                    {stats.totalPlaces}টি দর্শনীয় স্থানের মধ্যে আপনি{' '}
                    <strong className="text-emerald-400 font-bold">
                      {stats.visitedPlaces}টি স্থান
                    </strong>{' '}
                    ঘুরেছেন!
                  </p>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-400">ভ্রমণ সম্পন্ন:</span>
                <span className="text-emerald-400">{stats.percentage}%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-white/5 p-0.5">
                <div
                  className="bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-300 h-full rounded-full transition-all duration-500"
                  style={{ width: `${stats.percentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right Metrics & Share CTA */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 lg:border-l lg:border-white/10 lg:pl-8">
            <div className="grid grid-cols-2 gap-3 text-center sm:text-left">
              <div className="glass-card p-4 rounded-2xl border border-white/5 bg-slate-900/50">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium block">
                  মোট স্থান
                </span>
                <div className="text-2xl font-black text-white mt-1">
                  {stats.visitedPlaces} <span className="text-xs text-slate-500">/ {stats.totalPlaces}</span>
                </div>
              </div>

              <div className="glass-card p-4 rounded-2xl border border-white/5 bg-slate-900/50">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium block">
                  মোট ভ্রমণ
                </span>
                <div className="text-2xl font-black text-amber-300 mt-1">
                  {stats.totalVisits} <span className="text-xs text-amber-400/80">বার</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setIsShareModalOpen(true)}
                className="py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-xl shadow-emerald-950/60 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <Share2 className="w-4 h-4" />
                <span>সোশ্যাল কার্ড বানান</span>
              </button>

              {stats.visitedPlaces > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`আপনি কি ${displayName}-এর সব ভ্রমণ রেকর্ড রিসেট করতে চান?`)) {
                      clearDistrictVisits(districtSlug);
                    }
                  }}
                  className="py-2 px-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-950/20 text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>রিসেট করুন</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Spot Filter Toolbar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
          {/* Main Status Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveTab('ALL')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all outline-none focus:outline-none select-none border ${
                activeTab === 'ALL'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/50 border-emerald-400'
                  : 'glass-card text-slate-300 hover:text-white border-white/5'
              }`}
            >
              সকল স্থান ({places.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('VISITED')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all outline-none focus:outline-none select-none border ${
                activeTab === 'VISITED'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/50 border-emerald-400'
                  : 'glass-card text-slate-300 hover:text-white border-white/5'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>ঘুরেছি ({stats.visitedPlaces})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('UNVISITED')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all outline-none focus:outline-none select-none border ${
                activeTab === 'UNVISITED'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/50 border-emerald-400'
                  : 'glass-card text-slate-300 hover:text-white border-white/5'
              }`}
            >
              <Circle className="w-3.5 h-3.5 text-slate-400" />
              <span>বাকি আছে ({places.length - stats.visitedPlaces})</span>
            </button>
          </div>

          {/* Category Filter dropdown / pills */}
          {categories.length > 1 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                type="button"
                onClick={() => setSelectedCategory('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                  selectedCategory === 'ALL'
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                সব ক্যাটাগরি
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cat.toLowerCase()}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 3. Spots Grid with Interactive +/- Steppers */}
        {filteredPlaces.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlaces.map((place) => (
              <DistrictSpotTrackerCard
                key={place.id}
                place={place}
                districtSlug={districtSlug}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 glass-card rounded-3xl p-8 text-center space-y-3">
            <Compass className="w-12 h-12 text-slate-500 mx-auto" />
            <h4 className="font-bold text-white text-lg">
              কোনো স্থান পাওয়া যায়নি
            </h4>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
              আপনার ফিল্টার অনুযায়ী কোনো স্থান খুঁজে পাওয়া যায়নি। ফিল্টার পরিবর্তন করে দেখুন।
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveTab('ALL');
                setSelectedCategory('ALL');
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold"
            >
              ফিল্টার রিসেট করুন
            </button>
          </div>
        )}
      </div>

      {/* 4. Social Share Card Modal */}
      <DistrictShareCardModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        districtName={districtName}
        districtBnName={districtBnName}
        districtSlug={districtSlug}
        places={places}
      />
    </section>
  );
}
