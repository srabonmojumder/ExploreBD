'use client';

import React, { useState, useMemo } from 'react';
import { Place } from '@/lib/api-client';
import { useTravelStore } from '@/stores/useTravelStore';
import { useMounted } from '@/hooks/useMounted';
import { DistrictSpotTrackerCard } from './DistrictSpotTrackerCard';
import { DistrictShareCardModal } from './DistrictShareCardModal';
import { getDistrictUpazilas, resolvePlaceUpazila } from '@/components/map/upazilaMetadata';
import { getStaticPlacesForDistrict } from '@/data/bangladeshPlacesData';
import {
  Compass,
  Trophy,
  Sparkles,
  Share2,
  CheckCircle2,
  Circle,
  Filter,
  RotateCcw,
  MapPin,
  ChevronDown,
  ChevronUp,
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
  const [selectedUpazila, setSelectedUpazila] = useState<string>('ALL');
  const [showAllUpazilas, setShowAllUpazilas] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // 1. Get official Upazilas/Thanas for this district
  const districtUpazilas = useMemo(() => {
    return getDistrictUpazilas(districtSlug);
  }, [districtSlug]);

  // 2. Seamlessly merge incoming DB places with curated static places to guarantee full coverage
  const allPlaces = useMemo(() => {
    const list = [...places];
    const existingSlugs = new Set(places.map((p) => p.slug));
    const staticSpots = getStaticPlacesForDistrict(districtSlug);

    for (const spot of staticSpots) {
      if (!existingSlugs.has(spot.slug)) {
        list.push({
          id: `static-${spot.slug}`,
          name: spot.name,
          bnName: spot.bnName,
          slug: spot.slug,
          description: spot.description,
          coverImage: spot.coverImage,
          category: spot.category,
          averageRating: spot.averageRating,
          totalVisitors: spot.totalVisitors,
          latitude: spot.latitude,
          longitude: spot.longitude,
          thana: spot.upazilaBn,
          upazila: spot.upazilaBn,
          district: { name: districtName, bnName: districtBnName || null, slug: districtSlug },
          division: { name: '', bnName: null, slug: '' },
          images: [{ url: spot.coverImage, caption: spot.bnName }],
          _count: { visits: 0, reviews: 0 },
        });
      }
    }
    return list;
  }, [places, districtSlug, districtName, districtBnName]);

  const defaultStats = {
    totalPlaces: allPlaces.length,
    visitedPlaces: 0,
    totalVisits: 0,
    percentage: 0,
    levelTitle: 'ভ্রমণ শুরুর অপেক্ষায়',
    levelBadge: '🌱',
  };
  const stats = mounted ? getDistrictStats(districtSlug, allPlaces.length) : defaultStats;
  const displayName = districtBnName || districtName;

  // 3. Filter places based on activeTab, category, and selectedUpazila
  const filteredPlaces = useMemo(() => {
    return allPlaces.filter((place) => {
      if (!mounted) {
        if (activeTab === 'VISITED') return false;
        if (selectedCategory !== 'ALL' && place.category !== selectedCategory) return false;
        return true;
      }
      const visit = getPlaceVisit(place.slug);
      const isVisited = Boolean(visit && visit.count > 0);

      // Filter by visit status
      if (activeTab === 'VISITED' && !isVisited) return false;
      if (activeTab === 'UNVISITED' && isVisited) return false;

      // Filter by category
      if (selectedCategory !== 'ALL' && place.category !== selectedCategory) return false;

      // Filter by Upazila/Thana
      if (selectedUpazila !== 'ALL') {
        const placeUpazila = resolvePlaceUpazila(place, districtSlug);
        const matches =
          placeUpazila === selectedUpazila ||
          place.thana === selectedUpazila ||
          place.upazila === selectedUpazila;
        if (!matches) return false;
      }

      return true;
    });
  }, [allPlaces, activeTab, selectedCategory, selectedUpazila, mounted, districtSlug, getPlaceVisit]);

  const categories = Array.from(new Set(allPlaces.map((p) => p.category)));

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
                className="py-3 px-5 rounded-lg btn-glitch bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-xl shadow-emerald-950/60 flex items-center justify-center gap-2 border border-emerald-400/40"
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

      {/* 2. Upazila & Thana Directory & Quick Interactive Filter */}
      {districtUpazilas.length > 0 && (
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-white/10 space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <h4 className="font-bold text-sm text-white">
                {displayName}-এর উপজেলা ও থানা সমূহ ({districtUpazilas.length}টি)
              </h4>
            </div>
            {districtUpazilas.length > 8 && (
              <button
                type="button"
                onClick={() => setShowAllUpazilas(!showAllUpazilas)}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
              >
                <span>{showAllUpazilas ? 'কম দেখুন' : `সবগুলো দেখুন (+${districtUpazilas.length - 8})`}</span>
                {showAllUpazilas ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedUpazila('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                selectedUpazila === 'ALL'
                  ? 'bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-950/60'
                  : 'bg-slate-900/80 border-white/5 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              সব থানা ({districtUpazilas.length})
            </button>
            {(showAllUpazilas ? districtUpazilas : districtUpazilas.slice(0, 8)).map((u) => {
              const isSelected = selectedUpazila === u.bnName;
              return (
                <button
                  key={u.slug}
                  type="button"
                  onClick={() => setSelectedUpazila(isSelected ? 'ALL' : u.bnName)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-950/60'
                      : 'bg-slate-900/60 border-white/5 hover:border-emerald-500/30 text-slate-300 hover:text-white'
                  }`}
                >
                  {u.bnName}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Interactive Spot Filter Toolbar */}
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
              সকল স্থান ({allPlaces.length})
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
              <span>বাকি আছে ({allPlaces.length - stats.visitedPlaces})</span>
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

        {/* 4. Spots Grid with Interactive +/- Steppers */}
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
              {selectedUpazila !== 'ALL'
                ? `"${selectedUpazila}" থানায় এখনো কোনো পর্যটন স্পট যুক্ত নেই।`
                : 'আপনার ফিল্টার অনুযায়ী কোনো স্থান খুঁজে পাওয়া যায়নি।'}
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveTab('ALL');
                setSelectedCategory('ALL');
                setSelectedUpazila('ALL');
              }}
              className="px-4 py-2 rounded-xl btn-glitch bg-emerald-600 text-white text-xs font-semibold"
            >
              ফিল্টার রিসেট করুন
            </button>
          </div>
        )}
      </div>

      {/* 5. Social Share Card Modal */}
      <DistrictShareCardModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        districtName={districtName}
        districtBnName={districtBnName}
        districtSlug={districtSlug}
        places={allPlaces}
      />
    </section>
  );
}
