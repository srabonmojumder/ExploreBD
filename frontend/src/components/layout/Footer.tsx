'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Compass,
  Heart,
  MapPin,
  Facebook,
  MessageCircle,
  Mail,
  ArrowRight,
  Globe2,
  Sparkles,
  ShieldCheck,
  Check,
} from 'lucide-react';

export function Footer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Guarantee the globe video ALWAYS plays smoothly in continuous loop
  useEffect(() => {
    const playVideo = () => {
      if (videoRef.current && videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
      }
    };

    playVideo();
    window.addEventListener('scroll', playVideo, { passive: true });
    document.addEventListener('visibilitychange', playVideo);

    return () => {
      window.removeEventListener('scroll', playVideo);
      document.removeEventListener('visibilitychange', playVideo);
    };
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  // 8 Administrative Divisions of Bangladesh (Matching the 8 floating cards in reference image)
  const divisions = [
    { name: 'Dhaka', bn: 'ঢাকা', info: '১৩ জেলা • রাজধানী ও ঐতিহ্য' },
    { name: 'Chattogram', bn: 'চট্টগ্রাম', info: '১১ জেলা • পাহাড়, সাগর ও দ্বীপ' },
    { name: 'Sylhet', bn: 'সিলেট', info: '৪ জেলা • চা বাগান ও জলপ্রপাত' },
    { name: 'Rajshahi', bn: 'রাজশাহী', info: '৮ জেলা • বরেন্দ্র ও রেশম নগরী' },
    { name: 'Khulna', bn: 'খুলনা', info: '১০ জেলা • সুন্দরবন ও ম্যানগ্রোভ' },
    { name: 'Barishal', bn: 'বরিশাল', info: '৬ জেলা • নদী ও পেয়ারা বাগান' },
    { name: 'Rangpur', bn: 'রংপুর', info: '৮ জেলা • তিস্তা ও উত্তরবঙ্গ' },
    { name: 'Mymensingh', bn: 'ময়মনসিংহ', info: '৪ জেলা • গারো পাহাড় ও হাওড়' },
  ];

  return (
    <footer className="relative bg-black text-slate-300 mt-24 border-t border-white/10 overflow-hidden">
      {/* 1. TOP NEWSLETTER SUBSCRIBE BAR (Matching reference image) */}
      <div className="pt-12 pb-6 px-4 max-w-xl mx-auto text-center relative z-20">
        <p className="text-xs font-semibold text-emerald-400 tracking-wider uppercase mb-2">
          ExploreBD ট্রাভেল ডায়েরি
        </p>
        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-4">
          বাংলাদেশের নতুন সব পর্যটন আপডেট পান
        </h3>
        <form
          onSubmit={handleSubscribe}
          className="flex items-center bg-slate-900/90 border border-white/20 rounded-full p-1.5 shadow-2xl backdrop-blur-xl focus-within:border-emerald-400 transition-colors"
        >
          <div className="pl-3 text-slate-400 flex items-center">
            <Mail className="w-4 h-4" />
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="আপনার ইমেইল অ্যাড্রেস লিখুন..."
            required
            className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-950/60 transition-all flex-shrink-0"
          >
            {subscribed ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>যুক্ত হয়েছেন!</span>
              </>
            ) : (
              <>
                <span>সাবস্ক্রাইব</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* 2. THE GLOWING EARTH GLOBE WITH 8 FLOATING CARDS (Exact match to reference image) */}
      <div className="relative w-full min-h-[460px] sm:min-h-[520px] lg:min-h-[580px] flex items-center justify-center overflow-hidden py-10 px-4">
        {/* Continuous Looping Globe Video Background */}
        <div className="absolute inset-0 pointer-events-none select-none z-0 flex items-center justify-center overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover object-center opacity-90 filter brightness-110 contrast-110"
          >
            <source src="/video/footer_globe.mp4" type="video/mp4" />
          </video>
          {/* Edge vignette gradients to smoothly blend into pitch black background */}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent pointer-events-none" />
        </div>

        {/* 8 Floating Division Cards (Arranged in 2 rows of 4 over the globe horizon) */}
        <div className="relative z-10 max-w-5xl mx-auto w-full">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {divisions.map((div) => (
              <Link
                key={div.name}
                href={`#division-${div.name.toLowerCase()}`}
                className="group p-3 sm:p-4 rounded-2xl bg-slate-950/75 hover:bg-slate-900/90 backdrop-blur-md border border-cyan-500/30 hover:border-cyan-400 shadow-xl shadow-cyan-950/30 hover:shadow-[0_0_24px_rgba(6,182,212,0.45)] transition-all duration-300 flex flex-col items-center justify-center text-center"
              >
                <span className="text-sm sm:text-base font-black text-white tracking-tight group-hover:text-cyan-300 transition-colors">
                  {div.name}
                </span>
                <span className="text-[11px] sm:text-xs text-slate-300 font-semibold mt-0.5">
                  {div.bn}
                </span>
                <span className="text-[10px] text-slate-400 mt-1 line-clamp-1 group-hover:text-slate-300 transition-colors">
                  {div.info}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 3. MULTI-COLUMN NAVIGATION (Matching reference image layout) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Column 1: Important Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs tracking-wider uppercase">
              গুরুত্বপূর্ণ লিংক
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  হোমপেজ
                </Link>
              </li>
              <li>
                <Link href="/tracker" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  ভ্রমণ ট্র্যাকার
                </Link>
              </li>
              <li>
                <Link href="/places" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  দর্শনীয় স্থানসমূহ
                </Link>
              </li>
              <li>
                <Link href="/districts" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  ৬৪ জেলা ডিরেক্টরি
                </Link>
              </li>
              <li>
                <Link href="/#divisions" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  ৮টি প্রশাসনিক বিভাগ
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Travel Services */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs tracking-wider uppercase">
              ভ্রমণ সেবা
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/tracker" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  ইন্টারেক্টিভ মানচিত্র
                </Link>
              </li>
              <li>
                <Link href="/tracker" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  সোশ্যাল কার্ড জেনারেটর
                </Link>
              </li>
              <li>
                <Link href="/places" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  স্পট তথ্য ও ছবি গ্যালারি
                </Link>
              </li>
              <li>
                <Link href="/districts" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  জেলা ট্রাভেল গাইড
                </Link>
              </li>
              <li>
                <Link href="/#status" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  লাইভ সিস্টেম স্ট্যাটাস
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Explore Categories */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs tracking-wider uppercase">
              জনপ্রিয় ক্যাটাগরি
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/places?category=hill" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  পাহাড় ও ট্রেকিং
                </Link>
              </li>
              <li>
                <Link href="/places?category=sea" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  সমুদ্র সৈকত ও দ্বীপমালা
                </Link>
              </li>
              <li>
                <Link href="/places?category=historical" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  প্রত্নতাত্ত্বিক ও ঐতিহ্য
                </Link>
              </li>
              <li>
                <Link href="/places?category=nature" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  অরণ্য, হাওড় ও চা বাগান
                </Link>
              </li>
              <li>
                <Link href="/places?category=waterfall" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  ঝর্ণা ও জলপ্রপাত
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Comparison & Stats */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs tracking-wider uppercase">
              পরিসংখ্যান ও অর্জন
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/tracker" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  ৬৪ জেলার ভ্রমণ অগ্রগতি
                </Link>
              </li>
              <li>
                <Link href="/tracker" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  সোশ্যাল ব্যাজ শেয়ারিং
                </Link>
              </li>
              <li>
                <Link href="/places" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  সর্বাধিক পরিদর্শিত স্পট
                </Link>
              </li>
              <li>
                <Link href="/districts" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  বিভাগভিত্তিক অগ্রগতি
                </Link>
              </li>
              <li>
                <Link href="/tracker" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  ব্যক্তিগত ভ্রমণ ডায়েরি
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Creator & Social Connect (Matching the rightmost block) */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <h4 className="font-bold text-white text-xs tracking-wider uppercase">
              কমিউনিটি ও ডেভেলপার
            </h4>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 space-y-2.5">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Crafted by</p>
                <p className="text-sm font-bold text-white">শ্রাবণ মজুমদার (Srabon)</p>
              </div>
              <div className="flex flex-col gap-2 pt-1">
                <a
                  href="https://www.facebook.com/sraabonmozumder"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-950/70 hover:bg-blue-900 border border-blue-500/30 text-blue-300 text-xs font-semibold transition-colors"
                >
                  <Facebook className="w-3.5 h-3.5 text-blue-400" />
                  <span>Facebook Profile</span>
                </a>
                <a
                  href="https://wa.me/8801827621312"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WhatsApp: 01827621312</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 4. TRUST & VERIFICATION PARTNERS (Matching the logo row in reference) */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-2 font-bold text-white">
            <span className="text-base">🇧🇩</span>
            <span>৬৪ জেলা কাভারেজ</span>
          </div>
          <div className="flex items-center gap-2 font-bold text-emerald-400">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>১০০% ফ্রি সোশ্যাল ট্র্যাকার</span>
          </div>
          <div className="flex items-center gap-2 font-bold text-cyan-400">
            <Globe2 className="w-4 h-4 text-cyan-400" />
            <span>ইন্টারেক্টিভ মানচিত্র</span>
          </div>
          <div className="flex items-center gap-2 font-bold text-amber-400">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>যাচাইকৃত পর্যটন ডাটা</span>
          </div>
          <div className="flex items-center gap-2 font-bold text-indigo-400">
            <Compass className="w-4 h-4 text-indigo-400" />
            <span>রিয়েল-টাইম প্রোগ্রেস</span>
          </div>
        </div>

        {/* 5. COPYRIGHT & LEGAL BAR */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <Link href="/#" className="hover:text-slate-200 transition-colors">
            শর্তাবলী ও নীতিমালা
          </Link>
          <p>© {new Date().getFullYear()}, ExploreBD Platform. All Rights Reserved.</p>
          <Link href="/#" className="hover:text-slate-200 transition-colors">
            গোপনীয়তা সুরক্ষা (Privacy Policy)
          </Link>
        </div>
      </div>

      {/* 6. GIANT BRAND WATERMARK & HORIZON SCANLINE GLOW (Exact match to reference bottom watermark) */}
      <div className="relative w-full overflow-hidden select-none pointer-events-none mt-2">
        <div className="text-center font-black text-6xl sm:text-8xl md:text-9xl lg:text-[12rem] xl:text-[14rem] tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-white/15 via-emerald-500/10 to-transparent -mb-8 sm:-mb-12">
          explorebd
        </div>
        {/* Futuristic Green Horizon Scanline & Glow Bar */}
        <div className="w-full h-12 bg-gradient-to-t from-emerald-500/20 via-emerald-500/5 to-transparent relative">
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_20px_rgba(52,211,153,0.8)]" />
        </div>
      </div>
    </footer>
  );
}

export default Footer;
