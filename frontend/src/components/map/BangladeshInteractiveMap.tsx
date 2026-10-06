'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Manchitro, resolveDistrict, ValidDistrict } from 'manchitro';
import { District } from '@/lib/api-client';
import { useTravelStore } from '@/stores/useTravelStore';
import { useMounted } from '@/hooks/useMounted';
import {
  Compass,
  MapPin,
  Check,
  Plus,
  Share2,
  ExternalLink,
  Sparkles,
  Info,
  CheckCircle2,
  X,
} from 'lucide-react';

interface BangladeshInteractiveMapProps {
  districts: District[];
  onOpenShareModal?: () => void;
}

export function BangladeshInteractiveMap({
  districts,
  onOpenShareModal,
}: BangladeshInteractiveMapProps) {
  const mounted = useMounted();
  const {
    getVisitedDistrictSlugs,
    toggleDistrictVisit,
    isDistrictVisited,
    getDistrictVisits,
  } = useTravelStore();

  const [selectedDistrictName, setSelectedDistrictName] = useState<ValidDistrict | null>(null);
  const [hoveredDistrict, setHoveredDistrict] = useState<{
    name: ValidDistrict;
    x: number;
    y: number;
  } | null>(null);

  // Map district slugs to canonical manchitro names and vice-versa
  const { slugToCanonical, canonicalToDistrict } = useMemo(() => {
    const slugMap = new Map<string, ValidDistrict>();
    const canonMap = new Map<ValidDistrict, District>();

    districts.forEach((d) => {
      const canonical = resolveDistrict(d.name) || resolveDistrict(d.slug);
      if (canonical) {
        slugMap.set(d.slug, canonical);
        canonMap.set(canonical, d);
      }
    });

    return { slugToCanonical: slugMap, canonicalToDistrict: canonMap };
  }, [districts]);

  // Compute active (visited) canonical district names for Manchitro
  const activeCanonicalDistricts = useMemo(() => {
    if (!mounted) return [];
    const visitedSlugs = getVisitedDistrictSlugs();
    const result: ValidDistrict[] = [];

    visitedSlugs.forEach((slug) => {
      const canon = slugToCanonical.get(slug);
      if (canon && !result.includes(canon)) {
        result.push(canon);
      }
    });

    return result;
  }, [mounted, getVisitedDistrictSlugs, slugToCanonical]);

  // Find currently selected district object from our database
  const selectedDistrictObj = useMemo(() => {
    if (!selectedDistrictName) return null;
    return canonicalToDistrict.get(selectedDistrictName) || null;
  }, [selectedDistrictName, canonicalToDistrict]);

  const isSelectedVisited = Boolean(
    selectedDistrictObj && mounted && isDistrictVisited(selectedDistrictObj.slug)
  );

  const selectedVisits = useMemo(() => {
    if (!selectedDistrictObj || !mounted) return [];
    return getDistrictVisits(selectedDistrictObj.slug);
  }, [selectedDistrictObj, mounted, getDistrictVisits]);

  const visitedCount = activeCanonicalDistricts.length;
  const percentage = Math.round((visitedCount / 64) * 100);

  return (
    <div className="relative flex flex-col lg:flex-row gap-6 items-stretch rounded-3xl glass-card border border-white/10 p-5 sm:p-8 overflow-hidden shadow-2xl">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Map Column */}
      <div className="relative flex-1 flex flex-col items-center justify-center min-h-[440px] sm:min-h-[560px]">
        {/* Header inside map */}
        <div className="w-full flex items-center justify-between pb-3 border-b border-white/5 mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-slate-300">
              ইন্টারেক্টিভ বাংলাদেশ মানচিত্র (৬৪ জেলা)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 font-bold">
              {visitedCount} / ৬৪ জেলা ({percentage}%)
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="w-full flex flex-wrap items-center gap-4 text-[11px] text-slate-400 mb-2 py-1">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-500 shadow-sm shadow-emerald-500/50" />
            <span>ঘুরেছি (Visited)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-slate-800 border border-white/20" />
            <span>অদেখা জেলা</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-400" />
            <span>নির্বাচিত</span>
          </div>
          <span className="text-slate-500 text-[10px]">
            • যে কোনো জেলায় ক্লিক করে ঘুরেছি/অদেখা টগল করুন
          </span>
        </div>

        {/* Manchitro SVG Map Container */}
        <div className="relative w-full max-w-[500px] aspect-[1555/2140] flex items-center justify-center py-2">
          <Manchitro
            items={activeCanonicalDistricts}
            value={selectedDistrictName}
            onSelect={(district) => setSelectedDistrictName(district)}
            onDistrictMouseEnter={(district, e) => {
              setHoveredDistrict({
                name: district,
                x: e.clientX,
                y: e.clientY,
              });
            }}
            onDistrictMouseLeave={() => setHoveredDistrict(null)}
            className="w-full h-full flex items-center justify-center relative cursor-pointer"
            svgClassName="w-full h-auto max-h-[520px] transition-transform duration-300"
            colors={{
              base: '#1e293b',
              active: '#10b981',
              selected: '#f59e0b',
              stroke: 'rgba(255, 255, 255, 0.2)',
              selectedStroke: '#ffffff',
              selectedGlow: 'rgba(245, 158, 11, 0.45)',
            }}
            renderSelected={() => null}
            renderDebug={() => null}
          />

          {/* Hover Floating Tooltip */}
          {hoveredDistrict && (
            <div
              className="fixed pointer-events-none z-50 px-3 py-1.5 rounded-xl bg-slate-950/90 backdrop-blur-md border border-emerald-500/40 text-xs shadow-2xl text-white transform -translate-x-1/2 -translate-y-full mt-[-8px]"
              style={{ left: hoveredDistrict.x, top: hoveredDistrict.y }}
            >
              <div className="font-bold text-emerald-300">{hoveredDistrict.name}</div>
              <div className="text-[10px] text-slate-300">
                {activeCanonicalDistricts.includes(hoveredDistrict.name)
                  ? '✅ ভ্রমণ সম্পন্ন'
                  : 'ক্লিক করে ঘুরেছি মার্ক করুন'}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Side Details & Action Panel */}
      <div className="w-full lg:w-80 shrink-0 flex flex-col justify-between space-y-6 pt-4 lg:pt-0 lg:border-l lg:border-white/10 lg:pl-6">
        <div className="space-y-5">
          {/* Top Quick Action: Download Travel Map */}
          {onOpenShareModal && (
            <button
              onClick={onOpenShareModal}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-xl shadow-emerald-950/60 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Share2 className="w-4 h-4 text-emerald-200" />
              <span>ম্যাপ ইমেজ ডাউনলোড ও শেয়ার করুন</span>
            </button>
          )}

          {/* Selected District Card or Default Helper */}
          {selectedDistrictObj ? (
            <div className="glass-card rounded-2xl p-5 border border-emerald-500/30 space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                    {selectedDistrictObj.division?.name || 'বাংলাদেশ'} বিভাগ
                  </span>
                  <h3 className="text-xl font-black text-white mt-0.5">
                    {selectedDistrictObj.bnName || selectedDistrictObj.name}
                  </h3>
                  <p className="text-xs text-slate-400">{selectedDistrictObj.name} District</p>
                </div>
                <button
                  onClick={() => setSelectedDistrictName(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Status and Toggle */}
              <div className="space-y-3 pt-2 border-t border-white/5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">ভ্রমণ অবস্থা:</span>
                  {isSelectedVisited ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>ঘুরেছি</span>
                    </span>
                  ) : (
                    <span className="text-slate-400">অদেখা</span>
                  )}
                </div>

                {/* Toggle Button */}
                <button
                  onClick={() => toggleDistrictVisit(selectedDistrictObj.slug)}
                  className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    isSelectedVisited
                      ? 'bg-red-950/60 border border-red-500/40 text-red-300 hover:bg-red-900/60'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-950/60'
                  }`}
                >
                  {isSelectedVisited ? (
                    <>
                      <X className="w-3.5 h-3.5" />
                      <span>চিহ্নিত বাদ দিন (Mark Unvisited)</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>জেলায় ঘুরেছি মার্ক করুন</span>
                    </>
                  )}
                </button>

                {/* District Local Spots Link */}
                <Link
                  href={`/districts/${selectedDistrictObj.slug}`}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-white/10 hover:border-emerald-500/40 text-slate-200 hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>জেলার জনপ্রিয় স্পটগুলো দেখুন</span>
                  <ExternalLink className="w-3 h-3 text-emerald-400" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-5 border border-white/5 space-y-3 text-center">
              <Compass className="w-8 h-8 text-emerald-400 mx-auto animate-pulse" />
              <h4 className="text-sm font-bold text-white">যে কোনো জেলায় ক্লিক করুন</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                মানচিত্রে আপনি যে জেলাগুলোতে গিয়েছেন সেগুলোতে ক্লিক করে সরাসরি ঘুরেছি মার্ক করতে
                পারবেন।
              </p>
            </div>
          )}
        </div>

        {/* Summary Footer */}
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-white/5 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">মোট ঘুরে দেখা জেলা:</span>
            <span className="text-emerald-400 font-bold">{visitedCount} টি</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">বাকি জেলা:</span>
            <span className="text-slate-300 font-semibold">{64 - visitedCount} টি</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-white/5 mt-1">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
