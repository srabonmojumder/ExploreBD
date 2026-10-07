'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Place } from '@/lib/api-client';
import { useTravelStore, calculateDistrictLevel } from '@/stores/useTravelStore';
import { X, Download, Share2, Copy, Check, Sparkles, Trophy } from 'lucide-react';

interface DistrictShareCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  districtName: string;
  districtBnName?: string | null;
  districtSlug: string;
  places: Place[];
}

export function DistrictShareCardModal({
  isOpen,
  onClose,
  districtName,
  districtBnName,
  districtSlug,
  places,
}: DistrictShareCardModalProps) {
  const { travelerName, setTravelerName, getDistrictVisits } = useTravelStore();
  const [nameInput, setNameInput] = useState(travelerName);
  const [isCopied, setIsCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const visits = getDistrictVisits(districtSlug);
  const totalPlaces = places.length;
  const visitedPlacesCount = visits.length;
  const totalVisitsCount = visits.reduce((acc, v) => acc + v.count, 0);
  const percentage = totalPlaces > 0 ? Math.round((visitedPlacesCount / totalPlaces) * 100) : 0;
  const level = calculateDistrictLevel(percentage);

  const displayName = districtBnName || districtName;

  useEffect(() => {
    setNameInput(travelerName);
  }, [travelerName]);

  // Draw the high-res canvas whenever modal opens or name changes
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Card dimensions: 1080 x 1350 (Standard 4:5 Instagram & Facebook portrait)
    const W = 1080;
    const H = 1350;
    canvas.width = W;
    canvas.height = H;

    // 1. Dark ambient background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, '#041711');
    bgGrad.addColorStop(0.4, '#09271c');
    bgGrad.addColorStop(0.8, '#0b1f18');
    bgGrad.addColorStop(1, '#020b08');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Decorative radial aura
    const radGlow = ctx.createRadialGradient(W / 2, 280, 50, W / 2, 280, 500);
    radGlow.addColorStop(0, 'rgba(16, 185, 129, 0.25)');
    radGlow.addColorStop(0.7, 'rgba(20, 184, 166, 0.08)');
    radGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = radGlow;
    ctx.fillRect(0, 0, W, H);

    // 2. Modern Rounded Border
    ctx.strokeStyle = 'rgba(52, 211, 153, 0.35)';
    ctx.lineWidth = 6;
    ctx.strokeRect(36, 36, W - 72, H - 72);

    // Subtle inner corner accents
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 10;
    const cLen = 60;
    // Top-left
    ctx.beginPath();
    ctx.moveTo(36, 36 + cLen);
    ctx.lineTo(36, 36);
    ctx.lineTo(36 + cLen, 36);
    ctx.stroke();
    // Top-right
    ctx.beginPath();
    ctx.moveTo(W - 36 - cLen, 36);
    ctx.lineTo(W - 36, 36);
    ctx.lineTo(W - 36, 36 + cLen);
    ctx.stroke();
    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(36, H - 36 - cLen);
    ctx.lineTo(36, H - 36);
    ctx.lineTo(36 + cLen, H - 36);
    ctx.stroke();
    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(W - 36 - cLen, H - 36);
    ctx.lineTo(W - 36, H - 36);
    ctx.lineTo(W - 36, H - 36 - cLen);
    ctx.stroke();

    // 3. Brand Header
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 36px "Segoe UI", Arial, sans-serif';
    ctx.fillText('EXPLORE', 80, 120);

    ctx.fillStyle = '#34d399';
    ctx.fillText('BD', 255, 120);

    // Red Bangladesh Dot
    ctx.beginPath();
    ctx.arc(315, 108, 12, 0, Math.PI * 2);
    ctx.fillStyle = '#ef4444';
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '500 24px "Segoe UI", Arial, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('বাংলাদেশ ভ্রমণ খতিয়ান', W - 80, 118);
    ctx.textAlign = 'left';

    // Divider line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(80, 160);
    ctx.lineTo(W - 80, 160);
    ctx.stroke();

    // 4. User Title & District Name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 54px "Segoe UI", Arial, sans-serif';
    ctx.fillText(`${nameInput || 'ভ্রমণপিপাসু'}-এর`, 80, 240);

    const gradTitle = ctx.createLinearGradient(80, 0, 700, 0);
    gradTitle.addColorStop(0, '#34d399');
    gradTitle.addColorStop(0.5, '#2dd4bf');
    gradTitle.addColorStop(1, '#fde047');
    ctx.fillStyle = gradTitle;
    ctx.font = '900 68px "Segoe UI", Arial, sans-serif';
    ctx.fillText(`${displayName} ভ্রমণ ট্র্যাকার`, 80, 325);

    // Level Badge Pill
    ctx.fillStyle = 'rgba(6, 78, 59, 0.7)';
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(80, 360, 480, 56, [28]);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#6ee7b7';
    ctx.font = 'bold 26px "Segoe UI", Arial, sans-serif';
    ctx.fillText(`${level.badge} ${level.title}`, 105, 398);

    // 5. Stat Metric Highlights Box (3 columns)
    const statBoxY = 445;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.65)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(80, statBoxY, W - 160, 160, [24]);
    ctx.fill();
    ctx.stroke();

    // Metric 1: Visited places
    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 22px "Segoe UI", Arial, sans-serif';
    ctx.fillText('ঘুরে দেখা স্থান', 120, statBoxY + 50);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 54px "Segoe UI", Arial, sans-serif';
    ctx.fillText(`${visitedPlacesCount}`, 120, statBoxY + 115);
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 30px "Segoe UI", Arial, sans-serif';
    ctx.fillText(` / ${totalPlaces}`, 120 + ctx.measureText(`${visitedPlacesCount}`).width + 5, statBoxY + 115);

    // Metric 2: Percentage
    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 22px "Segoe UI", Arial, sans-serif';
    ctx.fillText('সম্পন্ন মাত্রা', 440, statBoxY + 50);

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 54px "Segoe UI", Arial, sans-serif';
    ctx.fillText(`${percentage}%`, 440, statBoxY + 115);

    // Metric 3: Total Visits
    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 22px "Segoe UI", Arial, sans-serif';
    ctx.fillText('মোট ভ্রমণ সংখ্যা', 740, statBoxY + 50);

    ctx.fillStyle = '#fde047';
    ctx.font = 'bold 54px "Segoe UI", Arial, sans-serif';
    ctx.fillText(`${totalVisitsCount}`, 740, statBoxY + 115);
    ctx.fillStyle = '#eab308';
    ctx.font = 'bold 26px "Segoe UI", Arial, sans-serif';
    ctx.fillText(' বার', 740 + ctx.measureText(`${totalVisitsCount}`).width + 8, statBoxY + 115);

    // 6. Visited Spot List Grid
    const listStartY = 645;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px "Segoe UI", Arial, sans-serif';
    ctx.fillText('ভ্রমণ করা স্থানসমূহ ও ভিজিট সংখ্যা:', 80, listStartY);

    const colWidth = (W - 160 - 24) / 2;
    const itemHeight = 64;
    const maxItems = 12; // up to 12 spots shown cleanly
    const displayVisits = visits.slice(0, maxItems);

    if (displayVisits.length === 0) {
      // Empty placeholder
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '500 26px "Segoe UI", Arial, sans-serif';
      ctx.fillText('এখনো কোনো স্থান নির্বাচন করা হয়নি। যেকোনো স্পটে ঘুরেছি মার্ক করুন!', 80, listStartY + 70);
    } else {
      displayVisits.forEach((v, idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const x = 80 + col * (colWidth + 24);
        const y = listStartY + 40 + row * (itemHeight + 14);

        // Spot background item pill
        ctx.fillStyle = 'rgba(6, 95, 70, 0.25)';
        ctx.strokeStyle = 'rgba(52, 211, 153, 0.3)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(x, y, colWidth, itemHeight, [16]);
        ctx.fill();
        ctx.stroke();

        // Checkmark circle
        ctx.beginPath();
        ctx.arc(x + 30, y + itemHeight / 2, 14, 0, Math.PI * 2);
        ctx.fillStyle = '#10b981';
        ctx.fill();

        ctx.fillStyle = '#022c22';
        ctx.font = 'bold 18px "Segoe UI", Arial, sans-serif';
        ctx.fillText('✓', x + 24, y + itemHeight / 2 + 6);

        // Spot name (Bengali or English)
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 22px "Segoe UI", Arial, sans-serif';
        const spotName = v.bnName || v.placeName;
        const truncatedName = spotName.length > 18 ? spotName.slice(0, 17) + '...' : spotName;
        ctx.fillText(truncatedName, x + 58, y + itemHeight / 2 + 7);

        // Count badge
        const countText = `${v.count}x`;
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 20px "Segoe UI", Arial, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(countText, x + colWidth - 20, y + itemHeight / 2 + 7);
        ctx.textAlign = 'left';
      });
    }

    // 7. Footer & Callout
    const footerY = H - 120;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(80, footerY - 20);
    ctx.lineTo(W - 80, footerY - 20);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.font = 'bold 24px "Segoe UI", Arial, sans-serif';
    ctx.fillText('ExploreBD — The Social Travel Platform for Bangladesh', 80, footerY + 25);

    ctx.fillStyle = '#34d399';
    ctx.font = '600 22px "Segoe UI", Arial, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('explorebd.com', W - 80, footerY + 25);
    ctx.textAlign = 'left';
  }, [isOpen, nameInput, displayName, places, visits, totalPlaces, visitedPlacesCount, totalVisitsCount, percentage, level]);

  const handleDownloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsGenerating(true);
    try {
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = `ExploreBD-${districtSlug}-Travel-Card.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error('Download error:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyCaption = () => {
    const text = `আমার ${displayName} ভ্রমণ খতিয়ান! 🌿
ExploreBD-তে ${displayName}-এর ${totalPlaces}টি দর্শনীয় স্থানের মধ্যে ${visitedPlacesCount}টি স্থান ঘুরে ফেলেছি (${percentage}% সম্পন্ন)। মোট ভ্রমণ সংখ্যা: ${totalVisitsCount} বার! 🏆
আমার লেভেল: ${level.badge} ${level.title}।

আপনি আপনার জেলায় কতটুকু ঘুরেছেন? চেক করুন ExploreBD-তে!
explorebd.com/districts/${districtSlug}`;

    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto bg-slate-900 border border-emerald-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 sticky top-0 bg-slate-900/95 backdrop-blur-sm z-10">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base sm:text-lg text-white">
              {displayName} সোশ্যাল ভ্রমণ কার্ড
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Name Customization Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>কার্ডে প্রদর্শিত নাম পরিবর্তন করুন:</span>
          </label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="text"
              value={nameInput}
              onChange={(e) => {
                setNameInput(e.target.value);
                setTravelerName(e.target.value);
              }}
              placeholder="আপনার নাম লিখুন..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
              maxLength={25}
            />
            <span className="text-xs text-slate-400 font-mono self-end sm:self-auto">
              {visitedPlacesCount} স্পট সম্পন্ন
            </span>
          </div>
        </div>

        {/* Live Canvas Preview (Responsive scaling) */}
        <div className="relative w-full max-h-[46vh] aspect-[4/5] mx-auto rounded-2xl overflow-hidden border border-emerald-500/20 shadow-2xl bg-slate-950 flex items-center justify-center">
          <canvas
            ref={canvasRef}
            className="w-full h-full object-contain rounded-2xl"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={handleCopyCaption}
            className="flex-1 py-3 px-4 rounded-xl glass-card hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-white/10 flex items-center justify-center gap-2 transition-colors"
          >
            {isCopied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300">ক্যাপশন কপি হয়েছে!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-400" />
                <span>সোশ্যাল পোস্ট ক্যাপশন কপি</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownloadImage}
            disabled={isGenerating}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-xl shadow-emerald-950/60 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>ইমেজ ডাউনলোড করুন (PNG)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
