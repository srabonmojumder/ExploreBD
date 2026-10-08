'use client';

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
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
import { DISTRICT_MAP_COORDINATES } from './districtCoordinates';
import {
  ALL_STATIC_DISTRICTS,
  ALL_STATIC_DIVISIONS,
  STATIC_SLUG_TO_CANONICAL,
  STATIC_CANONICAL_TO_DISTRICT,
  STATIC_SLUG_TO_DISTRICT,
} from './districtMetadata';

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
  // Subscribe to real-time state slices so clicks re-render instantly (0 latency)
  const manualVisitedDistricts = useTravelStore((s) => s.manualVisitedDistricts);
  const visits = useTravelStore((s) => s.visits);
  const toggleDistrictVisit = useTravelStore((s) => s.toggleDistrictVisit);
  const isDistrictVisited = useTravelStore((s) => s.isDistrictVisited);

  // Division & District Selection State
  const [selectedDivisionSlug, setSelectedDivisionSlug] = useState<string | null>(null);
  const [selectedDistrictName, setSelectedDistrictName] = useState<ValidDistrict | null>(null);

  // Hover state (No cursor tooltip - shown in stationary top banner!)
  const [hoveredDistrictName, setHoveredDistrictName] = useState<ValidDistrict | null>(null);

  // Zoom & Pan State
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  // High-performance 60FPS refs to avoid unnecessary re-renders during motion
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const zoomLevelRef = useRef(zoomLevel);
  zoomLevelRef.current = zoomLevel;
  const panRef = useRef(pan);
  panRef.current = pan;

  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragStartPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const hasDraggedRef = useRef<boolean>(false);
  const touchPinchDistRef = useRef<number | null>(null);

  // Map district slugs to canonical manchitro names and vice-versa
  const { slugToCanonical, canonicalToDistrict, divisionDataMap } = useMemo(() => {
    // 1. Initialize maps with all 64 static districts and 8 divisions guaranteed
    const slugMap = new Map<string, ValidDistrict>(STATIC_SLUG_TO_CANONICAL);
    const canonMap = new Map<ValidDistrict, District>(STATIC_CANONICAL_TO_DISTRICT);
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

    ALL_STATIC_DIVISIONS.forEach((div) => {
      divMap.set(div.slug, {
        name: div.name,
        bnName: div.bnName,
        slug: div.slug,
        districts: [],
        canonicalNames: [],
        spotsCount: 0,
      });
    });

    ALL_STATIC_DISTRICTS.forEach((d) => {
      const divItem = divMap.get(d.division.slug);
      const districtObj = STATIC_SLUG_TO_DISTRICT.get(d.slug);
      if (divItem && districtObj) {
        divItem.districts.push(districtObj);
        divItem.canonicalNames.push(d.canonicalName);
      }
    });

    // 2. If live API districts are supplied, enrich and augment with real places count
    if (districts && districts.length > 0) {
      districts.forEach((d) => {
        const canonical = resolveDistrict(d.name) || resolveDistrict(d.slug);
        if (canonical) {
          slugMap.set(d.slug, canonical);
          canonMap.set(canonical, d);
        }

        const divSlug = d.division?.slug || 'other';
        const divItem = divMap.get(divSlug);
        if (divItem) {
          divItem.spotsCount += d._count?.places || 0;
          const existingIdx = divItem.districts.findIndex((x) => x.slug === d.slug);
          if (existingIdx >= 0) {
            divItem.districts[existingIdx] = d;
          } else {
            divItem.districts.push(d);
            if (canonical && !divItem.canonicalNames.includes(canonical)) {
              divItem.canonicalNames.push(canonical);
            }
          }
        }
      });
    }

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

  // Compute visited canonical district names in real time whenever visits change
  const visitedCanonicalDistricts = useMemo(() => {
    if (!mounted) return [];
    
    const visitedSlugs = new Set<string>();
    Object.entries(manualVisitedDistricts || {}).forEach(([slug, val]) => {
      if (val) visitedSlugs.add(slug);
    });
    Object.values(visits || {}).forEach((item) => {
      if (item && item.count > 0 && item.districtSlug) {
        visitedSlugs.add(item.districtSlug);
      }
    });

    const result: ValidDistrict[] = [];
    visitedSlugs.forEach((slug) => {
      const canon = slugToCanonical.get(slug);
      if (canon && !result.includes(canon)) {
        result.push(canon);
      }
    });

    return result;
  }, [mounted, manualVisitedDistricts, visits, slugToCanonical]);

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

  // Visited count within selected division (updates in real time)
  const divisionVisitedCount = useMemo(() => {
    if (!selectedDivisionInfo) return 0;
    return selectedDivisionInfo.districts.filter((d) =>
      mounted && isDistrictVisited(d.slug)
    ).length;
  }, [selectedDivisionInfo, mounted, isDistrictVisited, manualVisitedDistricts, visits]);

  const isSelectedDistrictVisited = Boolean(
    selectedDistrictObj && mounted && isDistrictVisited(selectedDistrictObj.slug)
  );

  /**
   * Handle Click / Tap on Map District:
   * When user clicks a district on the map:
   * 1. Toggle visit/pinned state so it gets permanently PINNED (or unpinned if clicked again)
   * 2. Set as focused selected district
   * 3. Set selectedDivisionSlug to that district's division so user can see its details in the sidebar
   * DOES NOT unpin or unselect any other districts!
   */
  const handleSelectDistrict = (district: ValidDistrict) => {
    // If the user was dragging/panning the map, ignore selection click!
    if (hasDraggedRef.current) return;

    const d = canonicalToDistrict.get(district);
    if (!d) return;

    // Toggle pin/visited state
    toggleDistrictVisit(d.slug);

    // Focus this district
    setSelectedDistrictName(district);

    // Keep division context
    if (d.division?.slug) {
      setSelectedDivisionSlug(d.division.slug);
      useAppStore.getState().setSelectedDivisionSlug(d.division.slug);
    }
  };

  /**
   * Handle Division Tab Click:
   * Tabbing between divisions focuses that division WITHOUT unselecting any pinned districts!
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

  // Zoom controls (min: 1.0, max: 3.5)
  const handleZoomIn = () => setZoomLevel((z) => Math.min(Number((z + 0.25).toFixed(2)), 3.5));
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

  // Mouse drag: start dragging map on left-click
  const handleMouseDownCapture = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only primary mouse button
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - panRef.current.x, y: e.clientY - panRef.current.y };
    dragStartPosRef.current = { x: e.clientX, y: e.clientY };
    hasDraggedRef.current = false;
  };

  // Touch handlers for mobile pan & pinch-to-zoom
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStartRef.current = {
        x: e.touches[0].clientX - panRef.current.x,
        y: e.touches[0].clientY - panRef.current.y,
      };
      dragStartPosRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
      hasDraggedRef.current = false;
    } else if (e.touches.length === 2) {
      setIsDragging(false);
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchPinchDistRef.current = dist;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      const dx = e.touches[0].clientX - dragStartPosRef.current.x;
      const dy = e.touches[0].clientY - dragStartPosRef.current.y;
      if (Math.hypot(dx, dy) > 5) {
        hasDraggedRef.current = true;
      }
      const newX = e.touches[0].clientX - dragStartRef.current.x;
      const newY = e.touches[0].clientY - dragStartRef.current.y;
      const z = zoomLevelRef.current;
      const maxPanX = (z - 1) * 350 + 160;
      const maxPanY = (z - 1) * 450 + 160;
      setPan({
        x: Math.min(Math.max(newX, -maxPanX), maxPanX),
        y: Math.min(Math.max(newY, -maxPanY), maxPanY),
      });
    } else if (e.touches.length === 2 && touchPinchDistRef.current !== null) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const diff = dist - touchPinchDistRef.current;
      touchPinchDistRef.current = dist;
      setZoomLevel((prev) => {
        const next = Math.min(Math.max(Number((prev + diff * 0.007).toFixed(2)), 1), 3.5);
        if (next === 1) setPan({ x: 0, y: 0 });
        return next;
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    touchPinchDistRef.current = null;
    if (hasDraggedRef.current) {
      setTimeout(() => {
        hasDraggedRef.current = false;
      }, 100);
    }
  };

  // Global mousemove and mouseup listeners when dragging is active
  useEffect(() => {
    if (!isDragging) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - dragStartPosRef.current.x;
      const dy = e.clientY - dragStartPosRef.current.y;
      if (Math.hypot(dx, dy) > 5) {
        hasDraggedRef.current = true;
      }

      const newX = e.clientX - dragStartRef.current.x;
      const newY = e.clientY - dragStartRef.current.y;
      const z = zoomLevelRef.current;
      const maxPanX = (z - 1) * 350 + 160;
      const maxPanY = (z - 1) * 450 + 160;

      setPan({
        x: Math.min(Math.max(newX, -maxPanX), maxPanX),
        y: Math.min(Math.max(newY, -maxPanY), maxPanY),
      });
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      if (hasDraggedRef.current) {
        setTimeout(() => {
          hasDraggedRef.current = false;
        }, 120);
      }
    };

    window.addEventListener('mousemove', handleGlobalMouseMove, { passive: true });
    window.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging]);

  // Touchpad pinch-to-zoom and mouse wheel zoom listener (passive: false)
  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // If touchpad pinch gesture (ctrlKey is true)
      if (e.ctrlKey) {
        e.preventDefault();
        const factor = 0.03;
        const delta = -e.deltaY * factor;
        setZoomLevel((prev) => {
          const next = Math.min(Math.max(Number((prev + delta).toFixed(2)), 1), 3.5);
          if (next === 1) setPan({ x: 0, y: 0 });
          return next;
        });
        return;
      }

      // Trackpad 2-finger scroll or mouse wheel
      const delta = -e.deltaY * 0.0018;
      const curZoom = zoomLevelRef.current;
      const willZoom = (delta > 0 && curZoom < 3.5) || (delta < 0 && curZoom > 1);

      if (willZoom) {
        e.preventDefault();
        setZoomLevel((prev) => {
          const next = Math.min(Math.max(Number((prev + delta).toFixed(2)), 1), 3.5);
          if (next === 1) {
            setPan({ x: 0, y: 0 });
          } else {
            const maxPanX = (next - 1) * 350 + 160;
            const maxPanY = (next - 1) * 450 + 160;
            setPan((p) => ({
              x: Math.min(Math.max(p.x, -maxPanX), maxPanX),
              y: Math.min(Math.max(p.y, -maxPanY), maxPanY),
            }));
          }
          return next;
        });
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // Memoized, lightning-fast SVG stylesheet (0 re-parsing overhead on mouse moves)
  const dynamicMapStyles = useMemo(() => {
    const visitedRules = visitedCanonicalDistricts
      .map(
        (name) => `
        .manchitro-interactive-svg g[aria-label="${name}"] path {
          fill: #059669 !important;
          stroke: #34d399 !important;
          stroke-width: 1.8px !important;
          opacity: 1 !important;
        }
        .manchitro-interactive-svg g[aria-label="${name}"]:hover path {
          fill: #10b981 !important;
          stroke: #6ee7b7 !important;
        }
      `
      )
      .join('\n');

    const selectedDivisionRules = selectedDivisionSlug
      ? selectedDivisionCanonicalNames
          .filter((name) => !visitedCanonicalDistricts.includes(name))
          .map(
            (name) => `
          .manchitro-interactive-svg g[aria-label="${name}"] path {
            fill: #0891b2 !important;
            stroke: #38bdf8 !important;
            stroke-width: 2.2px !important;
            opacity: 1 !important;
          }
          .manchitro-interactive-svg g[aria-label="${name}"]:hover path {
            fill: #06b6d4 !important;
            stroke: #bae6fd !important;
          }
        `
          )
          .join('\n')
      : '';

    const focusedDistrictRule = selectedDistrictName
      ? `
        .manchitro-interactive-svg g[aria-label="${selectedDistrictName}"] path {
          stroke: #f59e0b !important;
          stroke-width: 3.2px !important;
          fill-opacity: 0.95 !important;
        }
      `
      : '';

    return `
      .manchitro-interactive-svg g path {
        transition: fill 120ms ease, stroke 120ms ease !important;
        cursor: pointer !important;
        fill: #1e293b !important;
        stroke: rgba(255, 255, 255, 0.25) !important;
        stroke-width: 1.2px !important;
        opacity: 1 !important;
      }
      .manchitro-interactive-svg g:hover path {
        fill: #334155 !important;
        stroke: #fef08a !important;
        stroke-width: 2.2px !important;
      }
      ${visitedRules}
      ${selectedDivisionRules}
      ${focusedDistrictRule}
    `;
  }, [visitedCanonicalDistricts, selectedDivisionSlug, selectedDivisionCanonicalNames, selectedDistrictName]);

  return (
    <div className="relative flex flex-col lg:flex-row gap-6 items-stretch rounded-3xl glass-card border border-white/10 p-4 sm:p-7 overflow-hidden shadow-2xl">
      {/* Optimized Dynamic Scoped CSS for Manchitro SVG styling */}
      <style dangerouslySetInnerHTML={{ __html: dynamicMapStyles }} />

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
        <div
          ref={mapContainerRef}
          onMouseDownCapture={handleMouseDownCapture}
          className={`relative w-full flex-1 flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/90 via-slate-950/80 to-slate-900/90 border border-slate-800 shadow-inner min-h-[380px] sm:min-h-[480px] select-none ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        >
          {/* Floating Zoom Controls Bar */}
          <div className="absolute top-3 right-3 z-30 flex flex-col gap-1.5 p-1 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-white/10 shadow-xl pointer-events-auto">
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoomLevel >= 3.5}
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
            <div className="absolute top-3 left-3 z-30 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/90 backdrop-blur-md border border-cyan-500/50 text-xs shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 max-w-[80%] pointer-events-auto">
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

          {/* Bottom Gesture & Zoom Info Badge */}
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 pointer-events-none px-3.5 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-white/10 text-[10px] sm:text-[11px] text-slate-300 shadow-xl flex items-center gap-2 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span>ড্র্যাগ করে সরান • টাচপ্যাড বা স্ক্রলে জুম করুন ({Math.round(zoomLevel * 100)}%)</span>
          </div>

          {/* Zoom & Pan Drag Area */}
          <div
            className={`relative w-full max-w-[500px] aspect-[1555/2140] flex items-center justify-center py-2 select-none touch-none ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
          >
            <div
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomLevel})`,
                transformOrigin: 'center center',
                transition: isDragging ? 'none' : 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)',
                willChange: 'transform',
              }}
              className="w-full h-full flex items-center justify-center transform-gpu relative"
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
                className="w-full h-full relative"
                style={{ width: '100%', height: '100%' }}
                svgClassName="manchitro-interactive-svg w-full h-full block transition-transform duration-300 drop-shadow-md"
                svgStyle={{ width: '100%', height: '100%', display: 'block' }}
                colors={{
                  base: '#1e293b',
                  active: '#1e293b',
                  selected: '#f59e0b',
                  stroke: 'rgba(255, 255, 255, 0.25)',
                  selectedStroke: '#ffffff',
                  selectedGlow: 'rgba(245, 158, 11, 0.6)',
                }}
                renderSelected={() => null}
                renderDebug={() => null}
              />

              {/* Map Pin Layer: Perfectly aligned 1:1 overlay with Manchitro viewBox */}
              <svg
                viewBox="0 0 1555 2140"
                preserveAspectRatio="xMidYMid meet"
                className="absolute inset-0 w-full h-full pointer-events-none transition-transform duration-300 drop-shadow-md"
                style={{ width: '100%', height: '100%', display: 'block' }}
              >
                <defs>
                  <filter id="pin-shadow" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#000000" floodOpacity="0.75" />
                  </filter>
                  <filter id="tooltip-shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#000000" floodOpacity="0.85" />
                  </filter>
                </defs>
                {visitedCanonicalDistricts.map((canonicalName) => {
                  const coords = DISTRICT_MAP_COORDINATES[canonicalName];
                  if (!coords) return null;
                  const dObj = canonicalToDistrict.get(canonicalName);
                  const isSelected = selectedDistrictName === canonicalName;
                  const isHovered = hoveredDistrictName === canonicalName;
                  const districtBnName = dObj?.bnName || canonicalName;
                  const districtEnName = dObj?.name || canonicalName;
                  const divisionBnName = dObj?.division?.bnName ? `${dObj.division.bnName} বিভাগ` : 'বাংলাদেশ';

                  return (
                    <g
                      key={`pin-${canonicalName}`}
                      transform={`translate(${coords.x}, ${coords.y})`}
                      className="pointer-events-auto cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (hasDraggedRef.current) return;
                        handleSelectDistrict(canonicalName);
                      }}
                      onMouseEnter={() => setHoveredDistrictName(canonicalName)}
                      onMouseLeave={() => setHoveredDistrictName(null)}
                    >
                      {/* Ground Shadow */}
                      <ellipse cx="0" cy="0" rx="16" ry="6" fill="rgba(0, 0, 0, 0.55)" />

                      {/* Active beacon ripple for selected district */}
                      {isSelected && (
                        <circle r="36" fill="#f59e0b" opacity="0.45" className="animate-ping" />
                      )}

                      {/* Crisp, professional Teardrop Map Pin Marker with smooth hover elevation */}
                      <g
                        transform={isHovered || isSelected ? 'translate(-28, -80) scale(1.14)' : 'translate(-25, -72)'}
                        style={{ transition: 'transform 160ms cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                      >
                        <path
                          d="M25 0 C11.19 0 0 11.19 0 25 C0 44 25 72 25 72 C25 72 50 44 50 25 C50 11.19 38.81 0 25 0 Z"
                          fill={isSelected ? '#f59e0b' : '#ef4444'}
                          stroke="#ffffff"
                          strokeWidth={isHovered ? '4.5' : '3.8'}
                          filter="url(#pin-shadow)"
                        />
                        <circle cx="25" cy="25" r="11" fill="#ffffff" />
                        <circle cx="25" cy="25" r="6" fill={isSelected ? '#d97706' : '#b91c1c'} />
                      </g>

                      {/* User-friendly District & Division Hover Tooltip Card */}
                      {(isHovered || isSelected) && (
                        <g transform="translate(0, -96)" className="pointer-events-none select-none">
                          {/* Tooltip Card Box */}
                          <rect
                            x="-115"
                            y="-52"
                            width="230"
                            height="60"
                            rx="14"
                            fill="rgba(15, 23, 42, 0.98)"
                            stroke={isSelected ? '#f59e0b' : '#10b981'}
                            strokeWidth="2.5"
                            filter="url(#tooltip-shadow)"
                          />
                          {/* Triangle Pointer down to pin */}
                          <path
                            d="M -10 8 L 0 18 L 10 8 Z"
                            fill="rgba(15, 23, 42, 0.98)"
                            stroke={isSelected ? '#f59e0b' : '#10b981'}
                            strokeWidth="2.5"
                          />
                          {/* Seamless connector seam */}
                          <rect
                            x="-12"
                            y="5"
                            width="24"
                            height="4"
                            fill="rgba(15, 23, 42, 0.98)"
                          />

                          {/* Line 1: District Bangla & English Name */}
                          <text
                            x="0"
                            y="-27"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="#ffffff"
                            fontSize="17"
                            fontWeight="bold"
                          >
                            {districtBnName}
                            <tspan fill="#94a3b8" fontSize="13" fontWeight="normal"> ({districtEnName})</tspan>
                          </text>

                          {/* Line 2: Division Name & Pinned Status */}
                          <text
                            x="0"
                            y="-6"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="#34d399"
                            fontSize="13"
                            fontWeight="600"
                          >
                            🏛️ {divisionBnName} • ✓ পিন করা
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </svg>
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
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-300 block">
                    {selectedDivisionInfo.bnName} বিভাগের জেলাসমূহ:
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold">
                    ট্যাপ করে পিন করুন 📍
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
                  {selectedDivisionInfo.districts.map((d) => {
                    const isVisited = mounted && isDistrictVisited(d.slug);
                    const canon = slugToCanonical.get(d.slug);
                    const isFocused = selectedDistrictName === canon;

                    return (
                      <button
                        key={d.slug}
                        type="button"
                        onClick={() => {
                          toggleDistrictVisit(d.slug);
                          if (canon) setSelectedDistrictName(canon);
                        }}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all outline-none select-none border ${
                          isVisited
                            ? 'bg-emerald-600 text-white font-bold border-emerald-400 shadow-md shadow-emerald-950/40'
                            : isFocused
                            ? 'bg-amber-400 text-slate-950 font-black border-amber-200'
                            : 'bg-slate-800/80 border-slate-700/60 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-slate-500'
                        }`}
                      >
                        {isVisited ? (
                          <MapPin className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                        ) : (
                          <Pin className="w-3.5 h-3.5 text-slate-400" />
                        )}
                        <span>{d.bnName || d.name}</span>
                        {isVisited && <Check className="w-3 h-3 text-emerald-200 stroke-[3]" />}
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
                      <MapPin className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>{selectedDistrictObj.bnName || selectedDistrictObj.name}</span>
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isSelectedDistrictVisited
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isSelectedDistrictVisited ? '📍 পিন করা' : '⭕ অপিনকৃত'}
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
                        <span>পিন বাদ দিন (Unpin)</span>
                      </>
                    ) : (
                      <>
                        <MapPin className="w-3.5 h-3.5 fill-current" />
                        <span>ম্যাপে পিন করুন (Pin on Map)</span>
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

              {/* All Pinned Districts Across Entire Bangladesh */}
              <div className="space-y-2 pt-3 border-t border-white/5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                    <span>সকল পিন করা জেলা ({visitedCount}/৬৪)</span>
                  </span>
                </div>
                {visitedCount > 0 ? (
                  <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
                    {visitedCanonicalDistricts.map((canon) => {
                      const d = canonicalToDistrict.get(canon);
                      if (!d) return null;
                      const isFocused = selectedDistrictName === canon;
                      return (
                        <button
                          key={`all-pinned-${canon}`}
                          type="button"
                          onClick={() => {
                            setSelectedDistrictName(canon);
                            if (d.division?.slug) {
                              setSelectedDivisionSlug(d.division.slug);
                            }
                          }}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all border ${
                            isFocused
                              ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md'
                              : 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900'
                          }`}
                        >
                          <MapPin className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span>{d.bnName || d.name}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400">
                    ম্যাপে ক্লিক করে আপনার ভ্রমণ করা জেলাগুলো পিন করুন।
                  </p>
                )}
              </div>

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
            <div className="glass-card rounded-2xl p-5 border border-white/5 space-y-4">
              <div className="text-center space-y-2">
                <Compass className="w-8 h-8 text-emerald-400 mx-auto animate-pulse" />
                <h4 className="text-sm font-bold text-white">যে কোনো বিভাগে ক্লিক করুন</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  ম্যাপের যে কোনো জেলায় সরাসরি ক্লিক করলেই সেটি পিন হয়ে যাবে! অন্য বিভাগে গেলেও আপনার পিন করা জেলাগুলো পিন থাকবে।
                </p>
              </div>

              {/* All Pinned Districts list when no division is selected */}
              <div className="space-y-2 pt-3 border-t border-white/5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                    <span>সকল পিন করা জেলা ({visitedCount}/৬৪)</span>
                  </span>
                </div>
                {visitedCount > 0 ? (
                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                    {visitedCanonicalDistricts.map((canon) => {
                      const d = canonicalToDistrict.get(canon);
                      if (!d) return null;
                      const isFocused = selectedDistrictName === canon;
                      return (
                        <button
                          key={`all-pinned-default-${canon}`}
                          type="button"
                          onClick={() => {
                            setSelectedDistrictName(canon);
                            if (d.division?.slug) {
                              setSelectedDivisionSlug(d.division.slug);
                            }
                          }}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all border ${
                            isFocused
                              ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md'
                              : 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900'
                          }`}
                        >
                          <MapPin className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span>{d.bnName || d.name}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400">
                    ম্যাপের যেকোনো জেলায় ক্লিক করুন এবং নিজের ভ্রমণ পিন করুন।
                  </p>
                )}
              </div>
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
