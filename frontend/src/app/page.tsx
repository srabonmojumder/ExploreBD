'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { ApiClient } from '@/lib/api-client';
import { PlaceCard } from '@/components/places/PlaceCard';
import { DivisionPreview } from '@/components/home/DivisionPreview';
import {
  Compass,
  MapPin,
  ChevronRight,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from 'lucide-react';

export default function HomePage() {
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [isMuted, setIsMuted] = React.useState(true);
  const [scrollProgress, setScrollProgress] = React.useState(0);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const videoSectionRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
          // Smooth scroll progress from 0 (at top) to 1 (scrolled 380px)
          const targetScroll = 380;
          const progress = Math.min(Math.max(scrollY / targetScroll, 0), 1);
          setScrollProgress(progress);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const { data: popularData, isLoading: loadingPopular } = useQuery({
    queryKey: ['popular-places-home'],
    queryFn: () => ApiClient.getPlaces({ sortBy: 'popular', limit: 6 }),
  });

  const popularPlaces = Array.isArray(popularData?.data) ? popularData.data : [];

  return (
    <div className="space-y-16 sm:space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-8 sm:pt-16 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Subtle Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-gradient-to-tr from-emerald-500/15 to-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-xs sm:text-sm font-semibold text-emerald-300">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>বাংলাদেশ ভ্রমণ ট্র্যাকার ও গাইড</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            কতটি জেলা ঘুরেছেন? <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
              নিজের ভ্রমণ মানচিত্র আঁকুন
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto leading-relaxed">
            যে যে জেলায় ভ্রমণ করেছেন সহজে চিহ্নিত করুন, আকর্ষণীয় পর্যটন স্পটগুলো খুঁজুন এবং নিজের ট্রাভেল কার্ড তৈরি করুন।
          </p>

          {/* 2 Clear, Prominent Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link
              href="/tracker"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-base shadow-xl shadow-emerald-950/60 flex items-center justify-center gap-2.5 border border-emerald-400/30 transition-all hover:scale-[1.02]"
            >
              <Compass className="w-5 h-5 text-emerald-200" />
              <span>আপনার ম্যাপ তৈরি করুন</span>
              <ChevronRight className="w-4 h-4 ml-0.5" />
            </Link>

            <Link
              href="/districts"
              className="w-full sm:w-auto px-7 py-4 rounded-xl glass-card hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-sm border border-white/10 flex items-center justify-center gap-2 transition-all"
            >
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>৬৪ জেলা অন্বেষণ</span>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-6 grid grid-cols-3 gap-3 max-w-md mx-auto border-t border-white/10">
            <div>
              <div className="text-2xl font-black text-white">৮টি</div>
              <div className="text-xs text-slate-400 font-medium">বিভাগ</div>
            </div>
            <div>
              <div className="text-2xl font-black text-emerald-400">৬৪টি</div>
              <div className="text-xs text-slate-400 font-medium">জেলা</div>
            </div>
            <div>
              <div className="text-2xl font-black text-teal-300">১০০+</div>
              <div className="text-xs text-slate-400 font-medium">পর্যটন স্পট</div>
            </div>
          </div>
        </div>

        {/* Video Tour Banner (Wide Cinematic Stage with Scroll Scale-Up) */}
        <div ref={videoSectionRef} className="pt-10 sm:pt-14 max-w-5xl lg:max-w-6xl mx-auto w-full px-2 sm:px-4">
          <div
            style={{
              transform: `scale(${0.90 + scrollProgress * 0.12})`,
              transition: 'transform 120ms ease-out',
              willChange: 'transform',
            }}
            className="relative rounded-2xl sm:rounded-3xl lg:rounded-[32px] overflow-hidden border border-emerald-500/40 shadow-2xl shadow-emerald-950/90 bg-slate-950 group ring-1 ring-white/10"
          >
            {/* Ambient Background Glow that responds to scroll */}
            <div
              style={{ opacity: 0.25 + scrollProgress * 0.35 }}
              className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-600/20 blur-2xl pointer-events-none -z-10 transition-opacity duration-300"
            />

            <div className="relative aspect-[16/9] w-full overflow-hidden">
              <video
                ref={videoRef}
                src="/video/video2.mp4"
                autoPlay
                loop
                muted={isMuted}
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-slate-950/30 pointer-events-none" />

              {/* Video controls */}
              <div className="absolute top-4 right-4 flex items-center gap-2.5 pointer-events-auto z-10">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="p-2.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 text-white hover:text-emerald-400 hover:scale-105 transition-all shadow-lg"
                  title={isPlaying ? 'Pause' : 'Play'}
                  aria-label={isPlaying ? 'Pause video' : 'Play video'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                </button>
                <button
                  type="button"
                  onClick={toggleMute}
                  className="p-2.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 text-white hover:text-emerald-400 hover:scale-105 transition-all shadow-lg"
                  title={isMuted ? 'Unmute' : 'Mute'}
                  aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-slate-300" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                </button>
              </div>

              {/* Video Info Overlay */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex items-center justify-between pointer-events-none">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-bold text-white drop-shadow text-sm sm:text-base lg:text-lg">
                      ৬৪ জেলার ডিজিটাল ভ্রমণ মানচিত্র 🇧🇩
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 hidden sm:block">
                    ExploreBD এর সাথে আপনার স্মৃতিময় জেলাগুলো সংরক্ষণ করুন
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-950/80 backdrop-blur-md border border-emerald-500/40 text-xs font-semibold text-emerald-300 shadow-lg">
                  ভিডিও প্রিভিউ
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-20">
        {/* Simple 3-Step Guide (Replaces complex English Core Capabilities) */}
        <section className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              সহজ ৩ ধাপে শুরু করুন
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              কিভাবে ব্যবহার করবেন?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="glass-card p-6 rounded-2xl space-y-2.5 border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-base">
                ১
              </div>
              <h3 className="font-bold text-lg text-white">ম্যাপে জেলা সিলেক্ট করুন</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                ইন্টারেক্টিভ বাংলাদেশ মানচিত্রে যে যে জেলায় গিয়েছেন সেখানে ক্লিক করে সবুজ চিহ্নিত করুন।
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-2.5 border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-teal-950 border border-teal-500/30 flex items-center justify-center text-teal-400 font-black text-base">
                ২
              </div>
              <h3 className="font-bold text-lg text-white">স্পটগুলো জানুন</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                পাহাড়, ঝর্ণা, সমুদ্রসৈকত ও দর্শনীয় স্থানগুলোর ছবি ও বিস্তারিত ভ্রমণ তথ্য দেখুন।
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-2.5 border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black text-base">
                ৩
              </div>
              <h3 className="font-bold text-lg text-white">ভ্রমণ কার্ড শেয়ার করুন</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                আপনার কত শতাংশ ভ্রমণ সম্পন্ন হয়েছে তা সুন্দর ইমেজ কার্ড আকারে ডাউনলোড ও শেয়ার করুন।
              </p>
            </div>
          </div>
        </section>

        {/* Popular Tourist Places Section */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>জনপ্রিয় আকর্ষণ</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
                সেরা দর্শনীয় স্থানসমূহ
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                পর্যটকদের পছন্দের শীর্ষ পাহাড়, সমুদ্রসৈকত ও দর্শনীয় স্থান
              </p>
            </div>

            <Link
              href="/places"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 self-start sm:self-auto group"
            >
              <span>সবগুলো স্থান দেখুন</span>
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
      </div>
    </div>
  );
}
