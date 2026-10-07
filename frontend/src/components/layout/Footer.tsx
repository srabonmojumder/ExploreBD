'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Compass, Heart, MapPin, Facebook, MessageCircle, Play, Pause, Globe2, Sparkles } from 'lucide-react';

export function Footer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  // Auto-play video reliably on mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay may be restricted in some browser settings
        setIsPlaying(false);
      });
    }
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const divisions = [
    { name: 'Dhaka', bn: 'ঢাকা' },
    { name: 'Chattogram', bn: 'চট্টগ্রাম' },
    { name: 'Sylhet', bn: 'সিলেট' },
    { name: 'Rajshahi', bn: 'রাজশাহী' },
    { name: 'Khulna', bn: 'খুলনা' },
    { name: 'Barishal', bn: 'বরিশাল' },
    { name: 'Rangpur', bn: 'রংপুর' },
    { name: 'Mymensingh', bn: 'ময়মনসিংহ' },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-emerald-500/20 bg-slate-950 text-slate-300 mt-20">
      {/* Vividly Visible Looping Globe Video Background */}
      <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover object-center opacity-85 filter brightness-100 contrast-105"
        >
          <source src="/video/footer_globe.mp4" type="video/mp4" />
        </video>
        {/* Subtle Vignette Gradients to softly melt into page edges */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-transparent to-slate-950/80 pointer-events-none" />
      </div>

      {/* Main Content Layer (Framed inside user-friendly frosted glass cards) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        {/* Top Floating Bar: Globe Badge & User Play/Pause Control */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-950/75 backdrop-blur-xl border border-white/15 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Globe2 className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <p className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Explore Bangladesh from Orbit</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                  লাইভ গ্লোব
                </span>
              </p>
              <p className="text-[11px] text-slate-300">
                মহাবিশ্বের মানচিত্রে রূপসী বাংলাদেশ — ৬৪ জেলার ভ্রমণ গাইড
              </p>
            </div>
          </div>

          {/* Interactive Play/Pause Toggle Button */}
          <button
            type="button"
            onClick={togglePlay}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg btn-glitch bg-slate-900/90 hover:bg-slate-800 text-xs font-semibold text-slate-200 border border-white/15 hover:border-emerald-500/40 transition-colors shadow-lg"
            title={isPlaying ? 'ভিডিও সাময়িক পজ করুন' : 'ভিডিও প্লে করুন'}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 text-emerald-400" />
                <span>ভিডিও পজ</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-400" />
                <span>ভিডিও প্লে</span>
              </>
            )}
          </button>
        </div>

        {/* 4 User-Friendly Translucent Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Brand Info */}
          <div className="p-6 rounded-2xl bg-slate-950/80 backdrop-blur-xl border border-white/15 shadow-2xl flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-emerald-500/50 shadow-md bg-slate-900 flex-shrink-0">
                  <Image
                    src="/logo.jpg"
                    alt="ExploreBD Logo"
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <span className="font-black text-xl text-white tracking-tight">
                    Explore<span className="text-emerald-400">BD</span>
                  </span>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                    ভ্রমণ প্ল্যাটফর্ম
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                বাংলাদেশের ৬৪ জেলার পর্যটন স্পট, ভ্রমণ মানচিত্র এবং ডিজিটাল ট্র্যাকিং প্ল্যাটফর্ম।
              </p>
            </div>
            <div className="pt-2 border-t border-white/10 flex items-center gap-2 text-xs text-emerald-300 font-semibold">
              <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>৮ বিভাগ ও ৬৪ জেলা কাভারেজ</span>
            </div>
          </div>

          {/* Card 2: 8 Divisions */}
          <div className="p-6 rounded-2xl bg-slate-950/80 backdrop-blur-xl border border-white/15 shadow-2xl space-y-3">
            <h4 className="font-bold text-white text-xs tracking-wider uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>৮টি প্রশাসনিক বিভাগ</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {divisions.map((div) => (
                <Link
                  key={div.name}
                  href={`#division-${div.name.toLowerCase()}`}
                  className="p-2 rounded-lg bg-white/5 hover:bg-emerald-500/20 hover:text-white border border-white/5 hover:border-emerald-500/30 transition-colors flex items-center justify-between"
                >
                  <span className="font-medium text-slate-200">{div.bn}</span>
                  <span className="text-[10px] text-slate-400">{div.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Card 3: Quick Platform Links */}
          <div className="p-6 rounded-2xl bg-slate-950/80 backdrop-blur-xl border border-white/15 shadow-2xl space-y-3">
            <h4 className="font-bold text-white text-xs tracking-wider uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>প্ল্যাটফর্ম ফিচার</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/tracker"
                  className="block p-2 rounded-lg bg-white/5 hover:bg-emerald-500/20 hover:text-white border border-white/5 hover:border-emerald-500/30 transition-colors font-medium text-slate-200"
                >
                  🗺️ ইন্টারেক্টিভ ম্যাপ ও ট্র্যাকার
                </Link>
              </li>
              <li>
                <Link
                  href="/places"
                  className="block p-2 rounded-lg bg-white/5 hover:bg-emerald-500/20 hover:text-white border border-white/5 hover:border-emerald-500/30 transition-colors font-medium text-slate-200"
                >
                  🏞️ দর্শনীয় স্থান ও স্পট তালিকা
                </Link>
              </li>
              <li>
                <Link
                  href="/districts"
                  className="block p-2 rounded-lg bg-white/5 hover:bg-emerald-500/20 hover:text-white border border-white/5 hover:border-emerald-500/30 transition-colors font-medium text-slate-200"
                >
                  📍 ৬৪ জেলা তথ্যভাণ্ডার
                </Link>
              </li>
              <li>
                <Link
                  href="/#divisions"
                  className="block p-2 rounded-lg bg-white/5 hover:bg-emerald-500/20 hover:text-white border border-white/5 hover:border-emerald-500/30 transition-colors font-medium text-slate-200"
                >
                  🧭 বিভাগভিত্তিক অন্বেষণ
                </Link>
              </li>
            </ul>
          </div>

          {/* Card 4: Developer & Contact */}
          <div className="p-6 rounded-2xl bg-slate-950/80 backdrop-blur-xl border border-white/15 shadow-2xl space-y-4">
            <div className="space-y-1">
              <h4 className="font-bold text-white text-xs tracking-wider uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>ডেভেলপার ও যোগাযোগ</span>
              </h4>
              <p className="text-sm font-black text-white pt-1">শ্রাবণ মজুমদার (Srabon)</p>
              <p className="text-[11px] text-slate-400">ExploreBD Creator</p>
            </div>

            <div className="space-y-2 pt-1">
              {/* Facebook Link */}
              <a
                href="https://www.facebook.com/sraabonmozumder"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg btn-glitch bg-blue-950/80 hover:bg-blue-900 border border-blue-500/40 text-blue-300 text-xs font-semibold transition-colors group"
              >
                <Facebook className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>Facebook Profile</span>
              </a>

              {/* WhatsApp Link */}
              <a
                href="https://wa.me/8801827621312"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg btn-glitch bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition-colors group"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>WhatsApp: 01827621312</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Attribution */}
        <div className="p-4 rounded-2xl bg-slate-950/75 backdrop-blur-xl border border-white/15 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} ExploreBD • বাংলাদেশের প্রথম পূর্ণাঙ্গ সোশ্যাল ট্রাভেল প্ল্যাটফর্ম 🇧🇩</p>
          <div className="flex items-center gap-1.5 text-slate-300 font-medium">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline mx-0.5" />
            <span>by</span>
            <a
              href="https://www.facebook.com/sraabonmozumder"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 font-bold hover:underline"
            >
              Srabon Mozumder
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
