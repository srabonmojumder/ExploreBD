'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Manchitro, resolveDistrict, DISTRICTS, ValidDistrict } from 'manchitro';
import { District } from '@/lib/api-client';
import { useTravelStore } from '@/stores/useTravelStore';
import { useAppStore } from '@/stores/useAppStore';
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
  CheckCheck,
} from 'lucide-react';

interface BangladeshInteractiveMapProps {
  districts: District[];
  onOpenShareModal?: () => void;
}

const DIVISION_TABS = [
  { label: 'সব বিভাগ', slug: '' },
  { label: 'ঢাকা', slug: 'dhaka' },
  { label: 'চট্টগ্রাম', slug: 'chattogram' },
  { label: 'সিলেট', slug: 'sylhet' },
  { label: 'খুলনা', slug: 'khulna' },
  { label: 'রাজশাহী', slug: 'rajshahi' },
  { label: 'বরিশাল', slug: 'barishal' },
  { label: 'রংপুর', slug: 'rangpur' },
  { label: 'ময়মনসিংহ', slug: 'mymensingh' },
];

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

  // Division & District Selection State
  const [selectedDivisionSlug, setSelectedDivisionSlug] = useState<string | null>(null);
  const [selectedDistrictName, setSelectedDistrictName] = useState<ValidDistrict | null>(null);

  // Hover state (No cursor tooltip - shown in stationary top banner!)
  const [hoveredDistrictName, setHoveredDistrictName] = useState<ValidDistrict | null>(null);

  // Zoom & Pan State
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Map district slugs to canonical manchitro names and vice-versa
  const { slugToCanonical, canonicalToDistrict, divisionDataMap } = useMemo(() => {
    const slugMap = new Map<string, ValidDistrict>();
    const canonMap = new Map<ValidDistrict, District>();
    const divMap = new Map<
      string,
      {
        name: string;
        bnName: string;
        slug: string;
        districts: District[];
        canonicalNames: ValidDistrict[];
        spotsCount: number;
      }
    >();

    districts.forEach((d) => {
      const canonical = resolveDistrict(d.name) || resolveDistrict(d.slug);
      if (canonical) {
        slugMap.set(d.slug, canonical);
        canonMap.set(canonical, d);
      }

      const divSlug = d.division?.slug || 'other';
      const divName = d.division?.name || 'Other';
      const divBnName = d.division?.bnName || divName;

      if (!divMap.has(divSlug)) {
        divMap.set(divSlug, {
          name: divName,
          bnName: divBnName,
          slug: divSlug,
          districts: [],
          canonicalNames: [],
          spotsCount: 0,
        });
      }

      const divItem = divMap.get(divSlug)!;
      divItem.districts.push(d);
      if (canonical && !divItem.canonicalNames.includes(canonical)) {
        divItem.canonicalNames.push(canonical);
      }
      divItem.spotsCount += d._count?.places || 0;
    });

    return {
      slugToCanonical: slugMap,
      canonicalToDistrict: canonMap,
      divisionDataMap: divMap,
    };
  }, [districts]);

  // All 64 canonical districts so Manchitro attaches interactive handlers to all of them
  const allCanonicalDistricts = useMemo(() => {
    return [...DISTRICTS] as ValidDistrict[];
  }, []);

  // Compute visited canonical district names
  const visitedCanonicalDistricts = useMemo(() => {
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

  // Canonical districts belonging to the currently selected division
  const selectedDivisionCanonicalNames = useMemo(() => {
    if (!selectedDivisionSlug) return [];
    const div = divisionDataMap.get(selectedDivisionSlug);
    return div ? div.canonicalNames : [];
  }, [selectedDivisionSlug, divisionDataMap]);

  // Information of the currently selected division
  const selectedDivisionInfo = useMemo(() => {
    if (!selectedDivisionSlug) return null;
    return divisionDataMap.get(selectedDivisionSlug) || null;
  }, [selectedDivisionSlug, divisionDataMap]);

  // Currently focused district object
  const selectedDistrictObj = useMemo(() => {
    if (!selectedDistrictName) return null;
    return canonicalToDistrict.get(selectedDistrictName) || null;
  }, [selectedDistrictName, canonicalToDistrict]);

  // Hovered district object
  const hoveredDistrictObj = useMemo(() => {
    if (!hoveredDistrictName) return null;
    return canonicalToDistrict.get(hoveredDistrictName) || null;
  }, [hoveredDistrictName, canonicalToDistrict]);

  const visitedCount = visitedCanonicalDistricts.length;
  const percentage = Math.round((visitedCount / 64) * 100);

  // Visited count within selected division
  const divisionVisitedCount = useMemo(() => {
    if (!selectedDivisionInfo) return 0;
    return selectedDivisionInfo.districts.filter((d) =>
      mounted && isDistrictVisited(d.slug)
    ).length;
  }, [selectedDivisionInfo, mounted, isDistrictVisited]);

  const isSelectedDistrictVisited = Boolean(
    selectedDistrictObj && mounted && isDistrictVisited(selectedDistrictObj.slug)
  );

  /**
   * Handle Click / Tap on Map District:
   * Tapping any district tabs/selects that whole division!
   * Clicking a district within the already selected division unselects it.
   */
  const handleSelectDistrict = (district: ValidDistrict) => {
    const d = canonicalToDistrict.get(district);
    if (!d) return;

    const divSlug = d.division?.slug;
    if (!divSlug) return;

    if (selectedDivisionSlug === divSlug) {
      // If the division is already selected: unselect it!
      setSelectedDivisionSlug(null);
      setSelectedDistrictName(null);
      useAppStore.getState().setSelectedDivisionSlug(null);
    } else {
      // Select this division and focus the clicked district
      setSelectedDivisionSlug(divSlug);
      setSelectedDistrictName(district);
      useAppStore.getState().setSelectedDivisionSlug(divSlug);
    }
  };

  /**
   * Handle Division Tab Click:
   * Clicking the active division tab unselects it!
   */
  const handleDivisionTabClick = (slug: string) => {
    if (selectedDivisionSlug === slug || slug === '') {
      setSelectedDivisionSlug(null);
      setSelectedDistrictName(null);
      useAppStore.getState().setSelectedDivisionSlug(null);
    } else {
      setSelectedDivisionSlug(slug);
      useAppStore.getState().setSelectedDivisionSlug(slug);
      const divInfo = divisionDataMap.get(slug);
      if (divInfo && divInfo.canonicalNames.length > 0) {
        setSelectedDistrictName(divInfo.canonicalNames[0]);
      } else {
        setSelectedDistrictName(null);
      }
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
      {/* Dynamic Scoped CSS for Manchitro SVG styling */}
      <style>{`
        /* Base styling: ALL 64 districts of Bangladesh are clearly visible and defined */
        .manchitro-interactive-svg g path {
          transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1) !important;
          cursor: pointer !important;
          fill: #1e293b !important;
          stroke: rgba(255, 255, 255, 0.28) !important;
          stroke-width: 1.2px !important;
          opacity: 1 !important;
        }

        /* Visited districts across ALL of Bangladesh: distinct rich emerald green */
        ${visitedCanonicalDistricts
          .map(
            (name) => `
          .manchitro-interactive-svg g[aria-label="${name}"] path {
            fill: #047857 !important;
            stroke: #10b981 !important;
            stroke-width: 1.6px !important;
            opacity: 1 !important;
          }
        `
          )
          .join('\n')}

        /* Selected division districts: Highlighted with vibrant Cyan / Emerald glow while whole map stays visible! */
        ${
          selectedDivisionSlug
            ? selectedDivisionCanonicalNames
                .map((name) => {
                  const isVisited = visitedCanonicalDistricts.includes(name);
                  return `
            .manchitro-interactive-svg g[aria-label="${name}"] path {
              fill: ${isVisited ? '#059669' : '#0891b2'} !important;
              stroke: ${isVisited ? '#34d399' : '#38bdf8'} !important;
              stroke-width: 2.8px !important;
              opacity: 1 !important;
              filter: drop-shadow(0 0 14px ${
                isVisited ? 'rgba(52, 211, 153, 0.9)' : 'rgba(56, 189, 248, 0.9)'
              }) !important;
            }
          `;
                })
                .join('\n')
            : ''
        }

        /* Pinned district (if any) */
        ${
          selectedDistrictName
            ? `
          .manchitro-interactive-svg g[aria-label="${selectedDistrictName}"] path {
            fill: #f59e0b !important;
            stroke: #ffffff !important;
            stroke-width: 3.2px !important;
            opacity: 1 !important;
            filter: drop-shadow(0 0 16px rgba(245, 158, 11, 1)) !important;
          }
        `
            : ''
        }

        /* Hovered district highlight */
        ${
          hoveredDistrictName
            ? `
          .manchitro-interactive-svg g[aria-label="${hoveredDistrictName}"] path {
            fill: #fbbf24 !important;
            stroke: #ffffff !important;
            stroke-width: 3.2px !important;
            opacity: 1 !important;
            filter: drop-shadow(0 0 18px rgba(251, 191, 36, 1)) !important;
          }
        `
            : ''
        }
      `}</style>

      {/* Ambient background lighting */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Map Column */}
      <div className="relative flex-1 flex flex-col items-center justify-between min-h-[500px] sm:min-h-[620px] w-full">
        {/* Top Title & Stats Bar */}
        <div className="w-full flex items-center justify-between pb-3 border-b border-white/5 mb-3 gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs sm:text-sm font-bold text-slate-200">
              ইন্টারেক্টিভ বাংলাদেশ ভ্রমণ মানচিত্র
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] sm:text-xs px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 font-bold">
              {visitedCount} / ৬৪ জেলা ({percentage}%)
            </span>
          </div>
        </div>

        {/* Division Selector Tabs (All 8 Divisions + All) */}
        <div className="w-full flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none mb-3">
          {DIVISION_TABS.map((div) => {
            const isActive =
              div.slug === ''
                ? selectedDivisionSlug === null
                : selectedDivisionSlug === div.slug;

            return (
              <button
                key={div.label}
                type="button"
                onClick={() => handleDivisionTabClick(div.slug)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 outline-none focus:outline-none select-none border ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/60 border-emerald-400'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border-white/10'
                }`}
              >
                {div.slug !== '' && <Layers className="w-3 h-3 text-teal-300" />}
                <span>{div.label}</span>
                {isActive && div.slug !== '' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping ml-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/*
          Stationary Beautiful Name Banner (NOT A FLOATING CURSOR TOOLTIP!)
          Displays hovered district/division info, selected division info, or default guidance.
        */}
        <div className="w-full mb-3 min-h-[58px] flex items-center">
          {hoveredDistrictObj ? (
            /* Hover State: Shows division name prominently and district info */
            <div className="w-full rounded-2xl p-3 bg-gradient-to-r from-slate-900/95 via-teal-950/80 to-slate-900/95 border border-emerald-500/40 shadow-xl backdrop-blur-md flex flex-wrap items-center justify-between gap-2.5 animate-in fade-in duration-150">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                  <Layers className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-black text-white">
                      {hoveredDistrictObj.division?.bnName || hoveredDistrictObj.division?.name} বিভাগ
                    </span>
                    <span className="text-[10px] text-slate-400">
                      ({hoveredDistrictObj.division?.name} Division)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-emerald-300 font-semibold mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>জেলা: {hoveredDistrictObj.bnName || hoveredDistrictObj.name}</span>
                    <span className="text-slate-400 font-normal">
                      ({hoveredDistrictObj.name})
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  {hoveredDistrictObj._count?.places || 0}টি স্পট
                </span>
                <span
                  className={`text-[11px] px-2.5 py-1 rounded-full font-bold ${
                    mounted && isDistrictVisited(hoveredDistrictObj.slug)
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-300 border border-white/10'
                  }`}
                >
                  {mounted && isDistrictVisited(hoveredDistrictObj.slug)
                    ? '✅ ঘুরেছি'
                    : '⭕ অদেখা'}
                </span>
              </div>
            </div>
          ) : selectedDivisionInfo ? (
            /* Selected Division State */
            <div className="w-full rounded-2xl p-3 bg-gradient-to-r from-teal-950/90 via-slate-900/90 to-cyan-950/90 border border-teal-500/40 shadow-xl backdrop-blur-md flex flex-wrap items-center justify-between gap-2.5 animate-in fade-in duration-150">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center shrink-0">
                  <Layers className="w-5 h-5 text-teal-300 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-black text-white">
                      {selectedDivisionInfo.bnName} বিভাগ নির্বাচিত
                    </span>
                    <span className="text-[10px] text-teal-300/80">
                      ({selectedDivisionInfo.name} Division)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    {selectedDivisionInfo.districts.length}টি জেলা • {selectedDivisionInfo.spotsCount}টি স্পট • পুনরায় ট্যাপে আনসিলেক্ট হবে
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedDivisionSlug(null);
                  setSelectedDistrictName(null);
                }}
                className="px-3 py-1.5 rounded-lg btn-glitch bg-slate-800/90 hover:bg-slate-700 border border-white/20 text-white text-xs font-bold flex items-center gap-1.5 ml-auto"
              >
                <X className="w-3.5 h-3.5 text-amber-400" />
                <span>আনসিলেক্ট করুন</span>
              </button>
            </div>
          ) : (
            /* Default Guidance State */
            <div className="w-full rounded-2xl p-2.5 sm:p-3 bg-slate-900/60 border border-white/5 backdrop-blur-md flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold text-slate-200 text-xs sm:text-[13px]">
                  মানচিত্রের যেকোনো জেলা বা বিভাগে ক্লিক করুন — পুরো বিভাগ সিলেক্ট হবে • পুনরায় ক্লিকে আনসিলেক্ট
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" /> ঘুরেছি
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" /> নির্বাচিত বিভাগ
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-slate-500 border border-white/30" /> সম্পূর্ণ বাংলাদেশ দৃশ্যমান
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Manchitro SVG Map Canvas Container with Zoom Controls */}
        <div className="relative w-full flex-1 flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/90 via-slate-950/80 to-slate-900/90 border border-slate-800 shadow-inner min-h-[380px] sm:min-h-[480px]">
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

          {/* Floating Selected Division Badge Overlay */}
          {selectedDivisionInfo && (
            <div className="absolute top-3 left-3 z-30 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/90 backdrop-blur-md border border-cyan-500/50 text-xs shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 max-w-[80%]">
              <Layers className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <div className="truncate">
                <span className="font-bold text-white">
                  {selectedDivisionInfo.bnName} বিভাগ
                </span>
                <span className="text-[11px] text-emerald-300 ml-1.5">
                  ({divisionVisitedCount}/{selectedDivisionInfo.districts.length} ঘুরেছি)
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedDivisionSlug(null);
                  setSelectedDistrictName(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 shrink-0"
                title="বিভাগ আনসিলেক্ট করুন"
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
              setHoveredDistrictName(null);
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
                items={allCanonicalDistricts}
                value={selectedDistrictName}
                onSelect={handleSelectDistrict}
                onDistrictMouseEnter={(district) => {
                  setHoveredDistrictName(district);
                }}
                onDistrictMouseLeave={() => {
                  setHoveredDistrictName(null);
                }}
                className="w-full h-full flex items-center justify-center relative"
                svgClassName="manchitro-interactive-svg w-full h-auto max-h-[500px] transition-transform duration-300 drop-shadow-md"
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
              className="w-full py-3 px-4 rounded-lg btn-glitch bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-xl shadow-emerald-950/60 flex items-center justify-center gap-2 border border-emerald-400/40"
            >
              <Share2 className="w-4 h-4 text-emerald-200" />
              <span>ম্যাপ ইমেজ ডাউনলোড ও শেয়ার করুন</span>
            </button>
          )}

          {/* Selected Division Card or Default Info */}
          {selectedDivisionInfo ? (
            <div className="glass-card rounded-2xl p-5 border border-cyan-500/40 space-y-4 animate-in fade-in zoom-in-95 duration-200 bg-slate-900/80 shadow-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] uppercase font-bold text-cyan-400 tracking-wider">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    <span>প্রশাসনিক বিভাগ</span>
                  </div>
                  <h3 className="text-xl font-black text-white mt-0.5 flex items-center gap-1.5">
                    <span>{selectedDivisionInfo.bnName} বিভাগ</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    {selectedDivisionInfo.name} Division • {selectedDivisionInfo.districts.length}টি জেলা
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDivisionSlug(null);
                    setSelectedDistrictName(null);
                  }}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                  title="বিভাগ আনসিলেক্ট করুন"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Division Stats & Progress */}
              <div className="space-y-2 pt-2 border-t border-white/5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">ঘুরেছি:</span>
                  <span className="font-bold text-emerald-400">
                    {divisionVisitedCount} / {selectedDivisionInfo.districts.length} জেলা (
                    {Math.round(
                      (divisionVisitedCount / selectedDivisionInfo.districts.length) * 100
                    )}
                    %)
                  </span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-white/5">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.round(
                        (divisionVisitedCount / selectedDivisionInfo.districts.length) * 100
                      )}%`,
                    }}
                  />
                </div>
                <div className="flex items-center justify-between text-slate-400 pt-1">
                  <span>মোট পর্যটন স্পট:</span>
                  <span className="text-slate-200 font-semibold">
                    {selectedDivisionInfo.spotsCount} টি
                  </span>
                </div>
              </div>

              {/* District Pills inside this division */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <span className="text-[11px] font-bold text-slate-400 block">
                  বিভাগের জেলাসমূহ (ট্যাপ করে পিন করুন):
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {selectedDivisionInfo.districts.map((d) => {
                    const isVisited = mounted && isDistrictVisited(d.slug);
                    const canon = slugToCanonical.get(d.slug);
                    const isFocused = selectedDistrictName === canon;

                    return (
                      <button
                        key={d.slug}
                        type="button"
                        onClick={() => {
                          if (canon) setSelectedDistrictName(canon);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all outline-none focus:outline-none select-none border ${
                          isFocused
                            ? 'bg-amber-400 text-slate-950 font-black border-amber-200 shadow-md shadow-amber-500/20'
                            : isVisited
                            ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/70 hover:border-emerald-400'
                            : 'bg-slate-800/80 border-slate-700/60 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-slate-500'
                        }`}
                      >
                        {isVisited && <Check className="w-3 h-3 text-emerald-400" />}
                        <span>{d.bnName || d.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Focused District Actions (if selected) */}
              {selectedDistrictObj && (
                <div className="space-y-2 pt-3 border-t border-white/5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-bold flex items-center gap-1">
                      <Pin className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span>{selectedDistrictObj.bnName || selectedDistrictObj.name}</span>
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isSelectedDistrictVisited
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isSelectedDistrictVisited ? 'ঘুরেছি' : 'অদেখা'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleDistrictVisit(selectedDistrictObj.slug)}
                    className={`w-full py-2.5 px-3 rounded-lg btn-glitch font-bold text-xs flex items-center justify-center gap-1.5 ${
                      isSelectedDistrictVisited
                        ? 'bg-red-950/70 border border-red-500/50 text-red-300 hover:bg-red-900/70'
                        : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-950/60'
                    }`}
                  >
                    {isSelectedDistrictVisited ? (
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

                  <Link
                    href={`/districts/${selectedDistrictObj.slug}`}
                    className="w-full py-2.5 px-3 rounded-lg btn-glitch bg-slate-900 border border-white/10 hover:border-emerald-500/40 text-slate-200 hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5"
                  >
                    <span>জেলার স্পটগুলো দেখুন</span>
                    <ExternalLink className="w-3 h-3 text-emerald-400" />
                  </Link>
                </div>
              )}

              {/* Explore Division Spots Link */}
              <Link
                href={`/districts?division=${selectedDivisionInfo.slug}`}
                className="w-full py-2.5 px-3 rounded-lg btn-glitch bg-gradient-to-r from-teal-900/70 to-cyan-900/70 border border-cyan-500/40 hover:border-cyan-400 text-cyan-200 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 block text-center"
              >
                <span>{selectedDivisionInfo.bnName} বিভাগের সব স্পট দেখুন</span>
                <ExternalLink className="w-3 h-3 text-cyan-400" />
              </Link>
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-5 border border-white/5 space-y-3 text-center">
              <Compass className="w-8 h-8 text-emerald-400 mx-auto animate-pulse" />
              <h4 className="text-sm font-bold text-white">যে কোনো বিভাগে ক্লিক করুন</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                মানচিত্রে আপনি যে বিভাগে ক্লিক করবেন, পুরো বিভাগ হাইলাইট হবে এবং এর সকল জেলা দেখা
                যাবে। একই জায়গায় আবার ক্লিক করলে আনসিলেক্ট হয়ে যাবে।
              </p>
            </div>
          )}
        </div>

        {/* National Exploration Summary Footer */}
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
