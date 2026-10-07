'use client';

import React, { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { Manchitro, resolveDistrict, ValidDistrict } from 'manchitro';
import { District } from '@/lib/api-client';
import { useTravelStore } from '@/stores/useTravelStore';
import { useMounted } from '@/hooks/useMounted';
import {
  Compass,
  MapPin,
  Check,
  Share2,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Pin,
  Layers,
  Move,
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
  } = useTravelStore();

  const [selectedDistrictName, setSelectedDistrictName] = useState<ValidDistrict | null>(null);
  const [hoveredDistrict, setHoveredDistrict] = useState<{
    name: ValidDistrict;
    x: number;
    y: number;
  } | null>(null);

  // Zoom & Pan State
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

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

  const hoveredDistrictObj = useMemo(() => {
    if (!hoveredDistrict) return null;
    return canonicalToDistrict.get(hoveredDistrict.name) || null;
  }, [hoveredDistrict, canonicalToDistrict]);

  const isSelectedVisited = Boolean(
    selectedDistrictObj && mounted && isDistrictVisited(selectedDistrictObj.slug)
  );

  const visitedCount = activeCanonicalDistricts.length;
  const percentage = Math.round((visitedCount / 64) * 100);

  // Toggle selection: Tap to pin, tap same district again to unselect!
  const handleSelectDistrict = (district: ValidDistrict) => {
    if (selectedDistrictName === district) {
      setSelectedDistrictName(null);
    } else {
      setSelectedDistrictName(district);
    }
  };

  // Zoom controls
  const handleZoomIn = () => setZoomLevel((z) => Math.min(Number((z + 0.25).toFixed(2)), 2.5));
  const handleZoomOut = () => {
    setZoomLevel((z) => {
      const next = Math.max(Number((z - 0.25).toFixed(2)), 1);
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  };
  const handleResetZoom = () => {
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
  };

  // Drag to pan when zoomed
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  // Touch handlers for mobile pan
  const handleTouchStart = (e: React.TouchEvent) => {
    if (zoomLevel > 1 && e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX - pan.x, y: e.touches[0].clientY - pan.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && zoomLevel > 1 && e.touches.length === 1) {
      setPan({ x: e.touches[0].clientX - dragStart.x, y: e.touches[0].clientY - dragStart.y });
    }
  };

  const handleTouchEnd = () => setIsDragging(false);

  return (
    <div className="relative flex flex-col lg:flex-row gap-6 items-stretch rounded-3xl glass-card border border-white/10 p-4 sm:p-7 overflow-hidden shadow-2xl">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Map Column */}
      <div className="relative flex-1 flex flex-col items-center justify-between min-h-[460px] sm:min-h-[580px]">
        {/* Header inside map */}
        <div className="w-full flex items-center justify-between pb-3 border-b border-white/5 mb-2 gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs sm:text-sm font-bold text-slate-200">
              ইন্টারেক্টিভ বাংলাদেশ মানচিত্র (৬৪ জেলা)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] sm:text-xs px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 font-bold">
              {visitedCount} / ৬৪ জেলা ({percentage}%)
            </span>
          </div>
        </div>

        {/* Legend & Instructions */}
        <div className="w-full flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 mb-2 py-1 bg-slate-900/40 px-3 rounded-xl border border-white/5">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
              <span>ঘুরেছি</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-700 border border-white/20" />
              <span>অদেখা</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <span>পিন করা</span>
            </div>
          </div>
          <span className="text-slate-400 text-[10px]">
            • ট্যাপ করে পিন করুন • একই জায়গায় আবার ট্যাপ করলে আনসিলেক্ট হবে
          </span>
        </div>

        {/* Manchitro SVG Map Container with Zoom Controls */}
        <div className="relative w-full flex-1 flex items-center justify-center overflow-hidden rounded-2xl bg-slate-950/40 border border-white/5 min-h-[380px] sm:min-h-[480px]">
          {/* Floating Zoom Controls Bar */}
          <div className="absolute top-3 right-3 z-30 flex flex-col gap-1.5 p-1 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-white/10 shadow-xl">
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoomLevel >= 2.5}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-emerald-600/30 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
              title="Zoom In (+)"
              aria-label="Zoom In"
            >
              <ZoomIn className="w-4 h-4 text-emerald-400" />
            </button>
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoomLevel <= 1}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-emerald-600/30 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
              title="Zoom Out (-)"
              aria-label="Zoom Out"
            >
              <ZoomOut className="w-4 h-4 text-emerald-400" />
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              disabled={zoomLevel === 1 && pan.x === 0 && pan.y === 0}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-emerald-600/30 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
              title="Reset Zoom (100%)"
              aria-label="Reset Zoom"
            >
              <RotateCcw className="w-4 h-4 text-amber-400" />
            </button>
            {zoomLevel > 1 && (
              <span className="text-[9px] font-bold text-center text-emerald-300 pb-0.5">
                {Math.round(zoomLevel * 100)}%
              </span>
            )}
          </div>

          {/* Floating Pinned District Indicator on Map */}
          {selectedDistrictObj && (
            <div className="absolute top-3 left-3 z-30 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/90 backdrop-blur-md border border-amber-500/50 text-xs shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 max-w-[80%]">
              <Pin className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
              <div className="truncate">
                <span className="font-bold text-white">
                  {selectedDistrictObj.bnName || selectedDistrictObj.name}
                </span>
                <span className="text-[11px] text-emerald-300 ml-1.5">
                  ({selectedDistrictObj.division?.name} বিভাগ)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDistrictName(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 shrink-0"
                title="আনসিলেক্ট করুন (Unpin)"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Zoom & Pan Drag Area */}
          <div
            className={`relative w-full max-w-[500px] aspect-[1555/2140] flex items-center justify-center py-2 select-none ${
              zoomLevel > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-pointer'
            }`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => {
              handleMouseUp();
              setHoveredDistrict(null);
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              style={{
                transform: `scale(${zoomLevel}) translate(${pan.x / zoomLevel}px, ${pan.y / zoomLevel}px)`,
                transformOrigin: 'center center',
                transition: isDragging ? 'none' : 'transform 200ms ease-out',
              }}
              className="w-full h-full flex items-center justify-center transform-gpu"
            >
              <Manchitro
                items={activeCanonicalDistricts}
                value={selectedDistrictName}
                onSelect={handleSelectDistrict}
                onDistrictMouseEnter={(district, e) => {
                  setHoveredDistrict({
                    name: district,
                    x: e.clientX,
                    y: e.clientY,
                  });
                }}
                onDistrictMouseLeave={() => setHoveredDistrict(null)}
                className="w-full h-full flex items-center justify-center relative"
                svgClassName="w-full h-auto max-h-[500px] transition-transform duration-300 drop-shadow-md"
                colors={{
                  base: '#1e293b',
                  active: '#10b981',
                  selected: '#f59e0b',
                  stroke: 'rgba(255, 255, 255, 0.25)',
                  selectedStroke: '#ffffff',
                  selectedGlow: 'rgba(245, 158, 11, 0.6)',
                }}
                renderSelected={() => null}
                renderDebug={() => null}
              />
            </div>

            {/* Hover Floating Tooltip with Division Name */}
            {hoveredDistrict && (
              <div
                className="fixed pointer-events-none z-50 px-3.5 py-2 rounded-2xl bg-slate-950/95 backdrop-blur-xl border border-emerald-500/50 text-xs shadow-2xl text-white transform -translate-x-1/2 -translate-y-full mt-[-12px] space-y-1 animate-in fade-in zoom-in-95 duration-150 pointer-events-none"
                style={{ left: hoveredDistrict.x, top: hoveredDistrict.y }}
              >
                <div className="flex items-center gap-1.5 font-bold text-white text-sm">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{hoveredDistrictObj?.bnName || hoveredDistrict.name}</span>
                  {hoveredDistrictObj?.name && (
                    <span className="text-[11px] font-normal text-slate-400">
                      ({hoveredDistrictObj.name})
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-teal-300 font-semibold">
                  <Layers className="w-3 h-3 text-teal-400" />
                  <span>
                    বিভাগ: {hoveredDistrictObj?.division?.bnName || hoveredDistrictObj?.division?.name || 'বাংলাদেশ'} বিভাগ
                  </span>
                </div>

                <div className="text-[10px] text-slate-400 pt-0.5 border-t border-white/5">
                  {activeCanonicalDistricts.includes(hoveredDistrict.name)
                    ? '✅ ভ্রমণ সম্পন্ন (Visited)'
                    : 'ট্যাপ করে পিন করুন / ঘুরেছি মার্ক করুন'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Zoom drag guide when zoomed */}
        {zoomLevel > 1 && (
          <div className="w-full flex items-center justify-center gap-1.5 text-[10px] text-slate-400 pt-2">
            <Move className="w-3 h-3 text-emerald-400" />
            <span>ড্র্যাগ করে ম্যাপের অন্যান্য অংশ দেখুন</span>
          </div>
        )}
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
            <div className="glass-card rounded-2xl p-5 border border-amber-500/40 space-y-4 animate-in fade-in zoom-in-95 duration-200 bg-slate-900/80 shadow-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] uppercase font-bold text-emerald-400 tracking-wider">
                    <Layers className="w-3.5 h-3.5 text-teal-400" />
                    <span>{selectedDistrictObj.division?.name || 'বাংলাদেশ'} বিভাগ</span>
                  </div>
                  <h3 className="text-xl font-black text-white mt-0.5 flex items-center gap-1.5">
                    <Pin className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span>{selectedDistrictObj.bnName || selectedDistrictObj.name}</span>
                  </h3>
                  <p className="text-xs text-slate-400">{selectedDistrictObj.name} District</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedDistrictName(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                  title="আনসিলেক্ট করুন (Unselect)"
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
                  type="button"
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
                মানচিত্রে আপনি যে জেলাগুলোতে গিয়েছেন সেগুলোতে ক্লিক করে সরাসরি ঘুরেছি পিন ও মার্ক করতে
                পারবেন। একই জেলায় আবার ক্লিক করলে আনসিলেক্ট হয়ে যাবে।
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
