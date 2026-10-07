'use client';

import React, { useRef, useState, useMemo } from 'react';
import { toPng } from 'html-to-image';
import { Manchitro, resolveDistrict, DISTRICTS, ValidDistrict } from 'manchitro';
import { District } from '@/lib/api-client';
import { useTravelStore, calculateDistrictLevel } from '@/stores/useTravelStore';
import { useAppStore } from '@/stores/useAppStore';
import {
  X,
  Download,
  Share2,
  Copy,
  Check,
  Sparkles,
  Trophy,
  Compass,
  MapPin,
  Flame,
  Layers,
} from 'lucide-react';

interface NationalMapShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  districts: District[];
  selectedDivisionSlug?: string | null;
}

const DIVISION_META = [
  { name: 'চট্টগ্রাম', slug: 'chattogram', total: 11 },
  { name: 'ঢাকা', slug: 'dhaka', total: 13 },
  { name: 'সিলেট', slug: 'sylhet', total: 4 },
  { name: 'খুলনা', slug: 'khulna', total: 10 },
  { name: 'রাজশাহী', slug: 'rajshahi', total: 8 },
  { name: 'বরিশাল', slug: 'barishal', total: 6 },
  { name: 'রংপুর', slug: 'rangpur', total: 8 },
  { name: 'ময়মনসিংহ', slug: 'mymensingh', total: 4 },
];

export function NationalMapShareModal({
  isOpen,
  onClose,
  districts,
  selectedDivisionSlug: propSelectedDivisionSlug,
}: NationalMapShareModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { travelerName, setTravelerName, getVisitedDistrictSlugs, getTotalVisitsCount } =
    useTravelStore();
  const appSelectedDivisionSlug = useAppStore((state) => state.selectedDivisionSlug);

  const activeDivisionSlug = propSelectedDivisionSlug ?? appSelectedDivisionSlug;

  const [nameInput, setNameInput] = useState(travelerName || 'ভ্রমণপিপাসু');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // All 64 canonical districts so Manchitro renders every district cleanly
  const allCanonicalDistricts = useMemo(() => {
    return [...DISTRICTS] as ValidDistrict[];
  }, []);

  // Map district slugs to canonical manchitro names
  const { slugToCanonical, visitedSlugs, divisionCanonicalMap } = useMemo(() => {
    const slugMap = new Map<string, ValidDistrict>();
    const divCanonicalMap = new Map<string, ValidDistrict[]>();

    districts.forEach((d) => {
      const canonical = resolveDistrict(d.name) || resolveDistrict(d.slug);
      if (canonical) {
        slugMap.set(d.slug, canonical);
        const divSlug = d.division?.slug || 'other';
        if (!divCanonicalMap.has(divSlug)) {
          divCanonicalMap.set(divSlug, []);
        }
        divCanonicalMap.get(divSlug)!.push(canonical);
      }
    });

    const vSlugs = getVisitedDistrictSlugs();
    return {
      slugToCanonical: slugMap,
      visitedSlugs: vSlugs,
      divisionCanonicalMap: divCanonicalMap,
    };
  }, [districts, getVisitedDistrictSlugs]);

  // Active visited canonical names for Manchitro
  const visitedCanonicalDistricts = useMemo(() => {
    const result: ValidDistrict[] = [];
    visitedSlugs.forEach((slug) => {
      const canon = slugToCanonical.get(slug);
      if (canon && !result.includes(canon)) {
        result.push(canon);
      }
    });
    return result;
  }, [visitedSlugs, slugToCanonical]);

  // Canonical districts of the currently selected division (if any)
  const activeDivisionCanonicalNames = useMemo(() => {
    if (!activeDivisionSlug) return [];
    return divisionCanonicalMap.get(activeDivisionSlug) || [];
  }, [activeDivisionSlug, divisionCanonicalMap]);

  const visitedCount = visitedSlugs.length;
  const percentage = Math.round((visitedCount / 64) * 100);
  const totalVisitsCount = getTotalVisitsCount();
  const level = calculateDistrictLevel(percentage);

  // Calculate division counts
  const divisionCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    districts.forEach((d) => {
      if (visitedSlugs.includes(d.slug) && d.division?.slug) {
        counts[d.division.slug] = (counts[d.division.slug] || 0) + 1;
      }
    });
    return counts;
  }, [districts, visitedSlugs]);

  if (!isOpen) return null;

  // Handle Download Image (PNG)
  const handleDownload = async () => {
    if (!cardRef.current || isDownloading) return;
    setIsDownloading(true);

    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2, // 2x crisp HD rendering
        backgroundColor: '#020617',
      });

      const link = document.createElement('a');
      const filename = `ExploreBD-Map-${(nameInput || 'Traveler').replace(/\s+/g, '-')}.png`;
      link.download = filename;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export map card:', err);
      alert('ইমেজ ডাউনলোড করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।');
    } finally {
      setIsDownloading(false);
    }
  };

  // Handle Copy Image to Clipboard
  const handleCopy = async () => {
    if (!cardRef.current || isCopied) return;

    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#020617',
      });

      const blob = await (await fetch(dataUrl)).blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);

      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch (err) {
      console.error('Clipboard copy error:', err);
      // Fallback: Copy link
      navigator.clipboard.writeText(window.location.href);
      alert('লিঙ্ক ক্লিপবোর্ডে কপি করা হয়েছে!');
    }
  };

  // Share to WhatsApp
  const handleShareWhatsApp = () => {
    const text = `আমি বাংলাদেশের ${visitedCount}টি জেলা (${percentage}%) ঘুরেছি! আমার লেভেল: ${level.title} ${level.badge}। আপনার ভ্রমণ খতিয়ান দেখুন ExploreBD তে: ${window.location.origin}/tracker`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Share to Facebook
  const handleShareFacebook = () => {
    const url = `${window.location.origin}/tracker`;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-slate-900 border border-emerald-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl my-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 sticky top-0 bg-slate-900/95 backdrop-blur-sm z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-950/50">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                বাংলাদেশ ভ্রমণ ম্যাপ কার্ড
              </h2>
              <p className="text-xs text-slate-400">
                সম্পূর্ণ বাংলাদেশ ম্যাপে আপনার ঘুরে দেখা জেলাসমূহ সহ HD ফটো কার্ড
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input for Custom Traveler Name */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-slate-950/80 p-3 rounded-2xl border border-white/5">
          <label className="text-xs font-semibold text-slate-300 whitespace-nowrap pl-1">
            কার্ডের জন্য নাম:
          </label>
          <input
            type="text"
            value={nameInput}
            onChange={(e) => {
              setNameInput(e.target.value);
              setTravelerName(e.target.value);
            }}
            placeholder="আপনার নাম লিখুন..."
            className="flex-1 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-semibold focus:outline-none focus:border-emerald-500"
            maxLength={25}
          />
        </div>

        {/* LIVE RENDERED SHARE CARD (This node is captured to PNG) */}
        <div className="overflow-x-auto flex justify-center py-2">
          <div
            ref={cardRef}
            className="w-[340px] sm:w-[430px] max-w-full rounded-3xl p-5 sm:p-6 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-emerald-500/40 shadow-2xl text-white relative space-y-4"
          >
            {/* Scoped CSS for full map clarity in exported image */}
            <style>{`
              .share-card-map-svg g path {
                fill: #1e293b !important;
                stroke: rgba(255, 255, 255, 0.38) !important;
                stroke-width: 1.2px !important;
                opacity: 1 !important;
              }

              /* All selected / visited districts stand out in vibrant emerald green */
              ${visitedCanonicalDistricts
                .map(
                  (name) => `
                .share-card-map-svg g[aria-label="${name}"] path {
                  fill: #10b981 !important;
                  stroke: #ffffff !important;
                  stroke-width: 2px !important;
                  opacity: 1 !important;
                  filter: drop-shadow(0 0 6px rgba(16, 185, 129, 0.9)) !important;
                }
              `
                )
                .join('\n')}

              /* Selected division accent outline (if active) */
              ${
                activeDivisionSlug
                  ? activeDivisionCanonicalNames
                      .map((name) => {
                        const isVisited = visitedCanonicalDistricts.includes(name);
                        return `
                  .share-card-map-svg g[aria-label="${name}"] path {
                    stroke: ${isVisited ? '#34d399' : '#38bdf8'} !important;
                    stroke-width: 2.4px !important;
                    ${!isVisited ? 'fill: #0891b2 !important;' : ''}
                  }
                `;
                      })
                      .join('\n')
                  : ''
              }
            `}</style>

            {/* Ambient glow in card */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Card Brand Header */}
            <div className="relative z-10 flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl overflow-hidden border-2 border-emerald-400/60 shadow-lg shadow-emerald-950/60 flex-shrink-0 bg-slate-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/logo.jpg"
                    alt="ExploreBD Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-black text-base tracking-tight text-white flex items-center gap-1">
                    <span>Explore</span>
                    <span className="text-emerald-400">BD</span>
                  </div>
                  <div className="text-[10px] text-slate-300 tracking-wider uppercase font-semibold">
                    Travel Map Log
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] font-bold text-emerald-400">বাংলাদেশ ভ্রমণ মানচিত্র</div>
                <div className="text-[9px] text-slate-400">২০২৬ এডিশন</div>
              </div>
            </div>

            {/* Traveler Headline & Level */}
            <div className="relative z-10 text-center space-y-1">
              <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                {nameInput || 'ভ্রমণপিপাসু'} এর ভ্রমণ খতিয়ান
              </h3>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-xs text-emerald-300 font-semibold">
                <span>{level.badge}</span>
                <span>{level.title}</span>
              </div>
            </div>

            {/* Big Highlights Bar */}
            <div className="relative z-10 grid grid-cols-2 gap-2 bg-slate-950/70 p-3 rounded-2xl border border-white/10">
              <div className="text-center">
                <span className="text-[10px] text-slate-400 block font-medium">ঘুরে দেখা জেলা</span>
                <span className="text-xl font-black text-emerald-400">{visitedCount}</span>
                <span className="text-[10px] text-slate-400"> / ৬৪</span>
              </div>
              <div className="text-center">
                <span className="text-[10px] text-slate-400 block font-medium">সম্পন্ন অংশ</span>
                <span className="text-xl font-black text-teal-300">{percentage}%</span>
                <span className="text-[10px] text-slate-400"> বাংলাদেশ</span>
              </div>
            </div>

            {/* The FULL Bangladesh SVG Map Frame */}
            <div className="relative z-10 w-full max-w-[290px] sm:max-w-[330px] mx-auto aspect-[1555/2140] flex items-center justify-center p-2.5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 shadow-inner">
              <Manchitro
                items={allCanonicalDistricts}
                className="w-full h-full flex items-center justify-center relative pointer-events-none"
                svgClassName="share-card-map-svg w-full h-auto drop-shadow-md"
                colors={{
                  base: '#1e293b',
                  active: '#10b981',
                  selected: '#10b981',
                  stroke: 'rgba(255, 255, 255, 0.38)',
                  selectedStroke: '#ffffff',
                }}
                renderSelected={() => null}
                renderDebug={() => null}
              />
            </div>

            {/* Clear Legend Bar */}
            <div className="relative z-10 flex items-center justify-center gap-4 text-[10px] text-slate-300 py-1 bg-slate-950/70 rounded-xl border border-white/5">
              <span className="flex items-center gap-1.5 font-bold text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                ঘুরেছি: {visitedCount} জেলা
              </span>
              <span className="flex items-center gap-1.5 font-medium text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700 border border-white/20" />
                বাকি: {64 - visitedCount} জেলা
              </span>
            </div>

            {/* Division Breakdown Pills */}
            <div className="relative z-10 grid grid-cols-4 gap-1.5 pt-0.5">
              {DIVISION_META.map((div) => {
                const count = divisionCounts[div.slug] || 0;
                const isComplete = count === div.total;
                return (
                  <div
                    key={div.slug}
                    className={`p-1.5 rounded-xl border text-center ${
                      count > 0
                        ? isComplete
                          ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                          : 'bg-teal-950/40 border-teal-500/30 text-teal-200'
                        : 'bg-slate-950/40 border-white/5 text-slate-500'
                    }`}
                  >
                    <div className="text-[9px] font-bold truncate">{div.name}</div>
                    <div className="text-[10px] font-black">
                      {count}/{div.total}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Card Footer Watermark */}
            <div className="relative z-10 flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-white/10">
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>explorebd.app</span>
              </span>
              <span>৬৪ জেলা ভ্রমণ ট্র্যাকার</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Download PNG Button */}
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-xl shadow-emerald-950/60 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? 'ইমেজ তৈরি হচ্ছে...' : 'ডাউনলোড ইমেজ (PNG)'}</span>
            </button>

            {/* Copy Image Button */}
            <button
              onClick={handleCopy}
              className="w-full py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {isCopied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                  <span className="text-emerald-400 font-bold">কপি হয়েছে!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-300" />
                  <span>ইমেজ কপি করুন</span>
                </>
              )}
            </button>
          </div>

          {/* Social Share Bar */}
          <div className="flex items-center justify-center gap-3 pt-1">
            <span className="text-xs text-slate-400 font-medium">সরাসরি শেয়ার করুন:</span>
            <button
              onClick={handleShareWhatsApp}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span>WhatsApp</span>
            </button>
            <button
              onClick={handleShareFacebook}
              className="px-3.5 py-1.5 rounded-xl bg-blue-950/80 hover:bg-blue-900 border border-blue-500/30 text-blue-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span>Facebook</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
