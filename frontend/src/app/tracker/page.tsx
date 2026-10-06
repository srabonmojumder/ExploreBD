'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ApiClient } from '@/lib/api-client';
import { useTravelStore } from '@/stores/useTravelStore';
import {
  Compass,
  MapPin,
  Trophy,
  Sparkles,
  Share2,
  CheckCircle2,
  ChevronRight,
  RefreshCw,
  Search,
  Filter,
  Flame,
  Award,
} from 'lucide-react';

const DIVISIONS = [
  { label: 'সব বিভাগ', slug: '' },
  { label: 'চট্টগ্রাম', slug: 'chattogram' },
  { label: 'ঢাকা', slug: 'dhaka' },
  { label: 'সিলেট', slug: 'sylhet' },
  { label: 'খুলনা', slug: 'khulna' },
  { label: 'রাজশাহী', slug: 'rajshahi' },
  { label: 'বরিশাল', slug: 'barishal' },
  { label: 'রংপুর', slug: 'rangpur' },
  { label: 'ময়মনসিংহ', slug: 'mymensingh' },
];

export default function TravelTrackerPage() {
  const {
    travelerName,
    setTravelerName,
    getDistrictStats,
    getVisitedDistrictSlugs,
    getTotalVisitedCount,
    getTotalVisitsCount,
  } = useTravelStore();

  const [selectedDivision, setSelectedDivision] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [nameInput, setNameInput] = useState(travelerName);

  const { data, isLoading } = useQuery({
    queryKey: ['tracker-districts'],
    queryFn: () => ApiClient.getDistricts(),
  });

  const districts = data?.data || [];
  const visitedDistrictSlugs = getVisitedDistrictSlugs();
  const totalVisitedPlaces = getTotalVisitedCount();
  const totalVisitsCount = getTotalVisitsCount();
  const visitedDistrictCount = visitedDistrictSlugs.length;
  const nationalPercentage = Math.round((visitedDistrictCount / 64) * 100);

  // Filter districts
  const filteredDistricts = districts.filter((d) => {
    if (selectedDivision && d.division?.slug !== selectedDivision) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = d.name.toLowerCase().includes(q);
      const matchBn = d.bnName ? d.bnName.includes(q) : false;
      return matchName || matchBn;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 pb-24">
      {/* 1. Hero Overview & National Tracker Summary */}
      <section className="relative rounded-3xl glass-card p-6 sm:p-10 border border-emerald-500/30 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-500/20 via-teal-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-xs font-semibold text-emerald-300">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>৬৪ জেলা ও সকল দর্শনীয় স্থান ভ্রমণ খতিয়ান</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              বাংলাদেশের কতটুকু <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
                ঘুরে দেখেছেন আপনি?
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              শুধুমাত্র জেলা টিক নয়—প্রতিটি জেলার ভেতরে কোন কোন ঝর্ণা, পার্ক, লেক বা পাহাড়ে আপনি
              গিয়েছেন এবং <strong>কত বার গিয়েছেন</strong>, তা ট্র্যাক করুন ও শেয়ার করুন নিজের ভ্রমণ খতিয়ান!
            </p>

            {/* Custom Name Field */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 max-w-md">
              <label className="text-xs text-slate-400 font-semibold whitespace-nowrap">
                আপনার নাম:
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => {
                  setNameInput(e.target.value);
                  setTravelerName(e.target.value);
                }}
                placeholder="আপনার নাম লিখুন..."
                className="px-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-semibold focus:outline-none focus:border-emerald-500 flex-1"
                maxLength={25}
              />
            </div>
          </div>

          {/* National Stats Grid */}
          <div className="grid grid-cols-2 gap-3.5 lg:w-96 shrink-0">
            <div className="glass-card p-4 sm:p-5 rounded-2xl border border-white/5 bg-slate-900/60 text-center">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                ঘুরে দেখা জেলা
              </span>
              <div className="text-3xl font-black text-white mt-1">
                {visitedDistrictCount}
                <span className="text-xs text-slate-500 font-normal"> / ৬৪</span>
              </div>
              <span className="text-[11px] text-emerald-400 font-semibold block mt-1">
                {nationalPercentage}% জেলা সম্পন্ন
              </span>
            </div>

            <div className="glass-card p-4 sm:p-5 rounded-2xl border border-white/5 bg-slate-900/60 text-center">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                ঘুরে দেখা স্পট
              </span>
              <div className="text-3xl font-black text-teal-300 mt-1">
                {totalVisitedPlaces}
                <span className="text-xs text-teal-400/80 font-normal"> টি</span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium block mt-1">
                ব্যক্তিগত পরিদর্শন
              </span>
            </div>

            <div className="glass-card p-4 sm:p-5 rounded-2xl border border-white/5 bg-slate-900/60 text-center col-span-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                সর্বমোট ভ্রমণ গণনা
              </span>
              <div className="text-4xl font-black text-amber-300 mt-1">
                {totalVisitsCount} <span className="text-sm font-semibold text-amber-400/90">বার</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                নিজ জেলার পার্ক, ঝর্ণা বা বিচে একাধিকবার ভ্রমণ সহ
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. District Filter Bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Division Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {DIVISIONS.map((div) => {
              const isActive = selectedDivision === div.slug;
              return (
                <button
                  key={div.label}
                  type="button"
                  onClick={() => setSelectedDivision(div.slug)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/50 ring-1 ring-emerald-400'
                      : 'glass-card text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {div.label}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="জেলা খুঁজুন (চট্টগ্রাম, ঢাকা...)"
              className="w-full px-3.5 py-2 pl-9 rounded-xl bg-slate-900 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* 3. 64 Districts Explorer Grid */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
          <p className="text-sm text-slate-400">লোডিং জেলা তালিকা...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredDistricts.map((district) => {
            const totalPlaces = district._count?.places ?? 0;
            const stats = getDistrictStats(district.slug, totalPlaces);
            const isVisited = stats.visitedPlaces > 0;

            return (
              <Link
                key={district.id}
                href={`/districts/${district.slug}`}
                className={`group flex flex-col rounded-2xl glass-card overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl border ${
                  isVisited
                    ? 'border-emerald-500/50 bg-emerald-950/20 hover:border-emerald-400 shadow-emerald-950/40'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                {/* District Header Card */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <h3 className="font-bold text-lg text-white group-hover:text-emerald-300 transition-colors">
                          {district.bnName || district.name}
                        </h3>
                        {district.bnName && (
                          <span className="text-[11px] text-slate-400 font-medium">
                            {district.name}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500 mt-0.5 block">
                        {district.division?.name} বিভাগ
                      </span>
                    </div>

                    {isVisited ? (
                      <div className="px-2.5 py-1 rounded-full bg-emerald-500 text-slate-950 font-black text-xs shrink-0 flex items-center gap-1 shadow-md shadow-emerald-950/60">
                        <CheckCircle2 className="w-3 h-3 stroke-[3]" />
                        <span>ঘুরেছি</span>
                      </div>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-400 shrink-0">
                        অদেখা
                      </span>
                    )}
                  </div>

                  {/* Progress Stats */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">
                        {isVisited
                          ? `${stats.visitedPlaces}টি স্পট ঘুরেছেন`
                          : `${totalPlaces}টি স্পট তালিকাভুক্ত`}
                      </span>
                      {isVisited && (
                        <span className="text-amber-300 font-bold">
                          {stats.totalVisits} বার
                        </span>
                      )}
                    </div>

                    <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-white/5">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300"
                        style={{ width: `${stats.percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-400 group-hover:text-emerald-400 transition-colors">
                    <span className="font-semibold text-[11px]">
                      স্পট ও ভিজিট মার্ক করুন
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
