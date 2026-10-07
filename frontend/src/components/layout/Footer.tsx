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
      {/* 1. TOP NEWSLETTER SUBSCRIBE BAR */}
      <div className="pt-14 pb-8 px-4 max-w-2xl mx-auto text-center relative z-20">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>ExploreBD ট্রাভেল ডায়েরি</span>
        </div>
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight mb-3">
          বাংলাদেশের নতুন সব পর্যটন আপডেট পান
        </h3>
        <p className="text-sm sm:text-base text-slate-300 mb-6 max-w-lg mx-auto">
          প্রতি সপ্তাহে ৬৪ জেলার নতুন দর্শনীয় স্থান, ট্রাভেল গাইড এবং স্পেশাল ভ্রমণ টিপস সরাসরি আপনার ইনবক্সে।
        </p>
        <form
          onSubmit={handleSubscribe}
          className="flex items-center bg-slate-900/90 border border-white/20 rounded-full p-2 shadow-2xl backdrop-blur-xl focus-within:border-emerald-400 transition-colors max-w-xl mx-auto"
        >
          <div className="pl-4 text-slate-400 flex items-center">
            <Mail className="w-5 h-5" />
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="আপনার ইমেইল অ্যাড্রেস লিখুন..."
            required
            className="w-full bg-transparent px-3.5 py-2.5 text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-full btn-glitch bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-950/60 transition-colors flex-shrink-0"
          >
            {subscribed ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>যুক্ত হয়েছেন!</span>
              </>
            ) : (
              <>
                <span>সাবস্ক্রাইব</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* 2. THE GLOWING EARTH GLOBE WITH 8 FLOATING CARDS */}
      <div className="relative w-full min-h-[480px] sm:min-h-[540px] lg:min-h-[600px] flex items-center justify-center overflow-hidden py-12 px-4">
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
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black to-transparent pointer-events-none" />
        </div>

        {/* 8 Floating Division Cards (Clear, Readable Typography) */}
        <div className="relative z-10 max-w-6xl mx-auto w-full">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-5">
            {divisions.map((div) => (
              <Link
                key={div.name}
                href={`#division-${div.name.toLowerCase()}`}
                className="group p-4 sm:p-5 rounded-2xl bg-slate-950/80 hover:bg-slate-900/95 backdrop-blur-md border border-cyan-500/30 hover:border-cyan-400 shadow-xl shadow-cyan-950/30 hover:shadow-[0_0_24px_rgba(6,182,212,0.45)] transition-all duration-300 flex flex-col items-center justify-center text-center"
              >
                <span className="text-base sm:text-lg font-black text-white tracking-tight group-hover:text-cyan-300 transition-colors">
                  {div.name}
                </span>
                <span className="text-xs sm:text-sm text-cyan-300 font-bold mt-1">
                  {div.bn}
                </span>
                <span className="text-xs text-slate-300 mt-1 line-clamp-1 group-hover:text-white transition-colors">
                  {div.info}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 3. MULTI-COLUMN NAVIGATION & FEATURED FACEBOOK CREATOR CARD */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Column 1: Important Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-sm sm:text-base tracking-wider uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>গুরুত্বপূর্ণ লিংক</span>
            </h4>
            <ul className="space-y-2.5 text-sm sm:text-base">
              <li>
                <Link href="/" className="text-slate-300 hover:text-emerald-400 transition-colors">
                  হোমপেজ
                </Link>
              </li>
              <li>
                <Link href="/tracker" className="text-slate-300 hover:text-emerald-400 transition-colors">
                  ভ্রমণ ট্র্যাকার ও মানচিত্র
                </Link>
              </li>
              <li>
                <Link href="/places" className="text-slate-300 hover:text-emerald-400 transition-colors">
                  দর্শনীয় পর্যটন স্থানসমূহ
                </Link>
              </li>
              <li>
                <Link href="/districts" className="text-slate-300 hover:text-emerald-400 transition-colors">
                  ৬৪ জেলা ভ্রমণ ডিরেক্টরি
                </Link>
              </li>
              <li>
                <Link href="/#divisions" className="text-slate-300 hover:text-emerald-400 transition-colors">
                  ৮টি প্রশাসনিক বিভাগ
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Travel Services */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-sm sm:text-base tracking-wider uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>ভ্রমণ সেবা ও ফিচার</span>
            </h4>
            <ul className="space-y-2.5 text-sm sm:text-base">
              <li>
                <Link href="/tracker" className="text-slate-300 hover:text-emerald-400 transition-colors">
                  ইন্টারেক্টিভ বাংলাদেশ মানচিত্র
                </Link>
              </li>
              <li>
                <Link href="/tracker" className="text-slate-300 hover:text-emerald-400 transition-colors">
                  সোশ্যাল কার্ড জেনারেটর
                </Link>
              </li>
              <li>
                <Link href="/places" className="text-slate-300 hover:text-emerald-400 transition-colors">
                  স্পট তথ্য ও ছবি গ্যালারি
                </Link>
              </li>
              <li>
                <Link href="/districts" className="text-slate-300 hover:text-emerald-400 transition-colors">
                  জেলাভিত্তিক ভ্রমণ গাইড
                </Link>
              </li>
              <li>
                <Link href="/#status" className="text-slate-300 hover:text-emerald-400 transition-colors">
                  লাইভ সিস্টেম স্ট্যাটাস
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Explore Categories */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-sm sm:text-base tracking-wider uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>জনপ্রিয় ক্যাটাগরি</span>
            </h4>
            <ul className="space-y-2.5 text-sm sm:text-base">
              <li>
                <Link href="/places?category=hill" className="text-slate-300 hover:text-emerald-400 transition-colors">
                  পাহাড় ও ট্রেকিং
                </Link>
              </li>
              <li>
                <Link href="/places?category=sea" className="text-slate-300 hover:text-emerald-400 transition-colors">
                  সমুদ্র সৈকত ও দ্বীপমালা
                </Link>
              </li>
              <li>
                <Link href="/places?category=historical" className="text-slate-300 hover:text-emerald-400 transition-colors">
                  ঐতিহাসিক ও প্রত্নতাত্ত্বিক
                </Link>
              </li>
              <li>
                <Link href="/places?category=nature" className="text-slate-300 hover:text-emerald-400 transition-colors">
                  অরণ্য, হাওড় ও চা বাগান
                </Link>
              </li>
              <li>
                <Link href="/places?category=waterfall" className="text-slate-300 hover:text-emerald-400 transition-colors">
                  ঝর্ণা ও জলপ্রপাত
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Community & Developer - PROMINENT FACEBOOK PROFILE & BANNER SHOWCASE */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-sm sm:text-base tracking-wider uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>কমিউনিটি ও ডেভেলপার</span>
            </h4>

            {/* Compact & Elegant Facebook Page Showcase Card */}
            <div className="rounded-xl bg-slate-900/95 border border-white/20 overflow-hidden shadow-xl group transition-all duration-300 hover:border-blue-500/50">
              {/* Facebook Cover Photo Banner (Compact 80px-88px height) */}
              <a
                href="https://www.facebook.com/profile.php?id=61594934441480"
                target="_blank"
                rel="noopener noreferrer"
                className="relative h-20 sm:h-22 w-full overflow-hidden bg-slate-800 block cursor-pointer"
                title="ExploreBD অফিসিয়াল ফেসবুক পেজে যান"
              >
                <Image
                  src="/cover.jpg"
                  alt="ExploreBD Official Facebook Page Cover"
                  fill
                  sizes="(max-width: 768px) 100vw, 320px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-black/20" />
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-blue-600/90 backdrop-blur-md text-[10px] font-bold text-white flex items-center gap-1 shadow border border-blue-400/30">
                  <Facebook className="w-3 h-3 fill-current" />
                  <span>পেজ</span>
                </div>
              </a>

              {/* Profile Avatar & Info Body */}
              <div className="px-3.5 pb-3.5 pt-0 relative">
                {/* Compact Overlapping Avatar */}
                <div className="flex items-end justify-between -mt-7 mb-2">
                  <a
                    href="https://www.facebook.com/profile.php?id=61594934441480"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-slate-900 overflow-hidden bg-slate-950 shadow-xl ring-2 ring-blue-500/80 hover:ring-blue-400 block transition-all flex-shrink-0"
                    title="ExploreBD অফিসিয়াল ফেসবুক পেজ"
                  >
                    <Image
                      src="/logo.jpg"
                      alt="ExploreBD Official Logo"
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </a>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-full shadow">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>অফিসিয়াল পেজ</span>
                  </div>
                </div>

                {/* Page Name, Verified Badge & Founder Info */}
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <a
                      href="https://www.facebook.com/profile.php?id=61594934441480"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base font-black text-white hover:text-blue-400 tracking-tight transition-colors"
                    >
                      ExploreBD
                    </a>
                    <div className="w-3.5 h-3.5 rounded-full bg-blue-500 flex items-center justify-center text-white flex-shrink-0" title="Verified Official Page">
                      <svg className="w-2 h-2 fill-current" viewBox="0 0 20 20">
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-300 leading-snug">
                    প্রতিষ্ঠাতা ও ডেভেলপার:{" "}
                    <a
                      href="https://www.facebook.com/sraabonmozumder/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-blue-400 font-medium underline decoration-dotted transition-colors"
                    >
                      শ্রাবণ মজুমদার
                    </a>{" "}
                    🇧🇩
                  </p>
                </div>

                {/* Social Connect Buttons (Only 2 compact buttons: Official Page & WhatsApp) */}
                <div className="space-y-2 pt-2.5">
                  {/* Official Facebook Page Button */}
                  <a
                    href="https://www.facebook.com/profile.php?id=61594934441480"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg btn-glitch bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-blue-950/40 transition-colors"
                  >
                    <Facebook className="w-3.5 h-3.5" />
                    <span>ExploreBD অফিসিয়াল পেজ</span>
                  </a>

                  {/* WhatsApp Direct Message Button */}
                  <a
                    href="https://wa.me/8801827621312"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg btn-glitch bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>WhatsApp: 01827621312</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. TRUST & VERIFICATION PARTNERS */}
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-6 text-sm text-slate-300">
          <div className="flex items-center gap-2 font-bold text-white">
            <span className="text-lg">🇧🇩</span>
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
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-400">
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
