'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Compass, MapPin, Layers, Menu, X, Globe2, ChevronRight, Sparkles } from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';
import { useTravelStore } from '@/stores/useTravelStore';
import { useMounted } from '@/hooks/useMounted';

export function Navbar() {
  const mounted = useMounted();
  const { isMobileMenuOpen, toggleMobileMenu, setMobileMenuOpen } = useAppStore();
  const { getVisitedDistrictSlugs } = useTravelStore();

  const visitedCount = mounted ? getVisitedDistrictSlugs().length : 0;

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen, setMobileMenuOpen]);

  const navLinks = [
    {
      name: 'ভ্রমণ ট্র্যাকার',
      desc: 'আপনার ৬৪ জেলার ভ্রমণ মানচিত্র ও লগ',
      href: '/tracker',
      icon: Globe2,
    },
    {
      name: 'স্পটসমূহ',
      desc: 'জনপ্রিয় পর্যটন স্পট ও বিস্তারিত গাইড',
      href: '/places',
      icon: Compass,
    },
    {
      name: '৬৪ জেলা',
      desc: 'বিভাগ ও জেলাভিত্তিক পূর্ণাঙ্গ তালিকা',
      href: '/districts',
      icon: MapPin,
    },
    {
      name: 'বিভাগসমূহ',
      desc: 'বিভাগ অনুযায়ী অন্বেষণ ও স্পট সংখ্যা',
      href: '/#divisions',
      icon: Layers,
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 glass-panel border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-3.5 group flex-shrink-0">
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl overflow-hidden border-2 border-emerald-500/50 shadow-xl shadow-emerald-950/60 group-hover:border-emerald-400 transition-all bg-slate-900 flex-shrink-0">
                <Image
                  src="/logo.jpg"
                  alt="ExploreBD Logo"
                  fill
                  sizes="(max-width: 640px) 48px, 56px"
                  className="object-cover"
                  priority
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-black text-xl sm:text-2xl lg:text-3xl tracking-tight text-white leading-none">
                  <span>Explore</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">BD</span>
                </div>
                <p className="text-[10px] sm:text-xs text-slate-300/80 tracking-wider uppercase font-semibold mt-1">
                  Bangladesh Travel Platform
                </p>
              </div>
            </Link>

            {/* Desktop Navigation Links (Concise, perfectly spaced) */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors whitespace-nowrap"
                  >
                    <Icon className="w-4 h-4 text-emerald-400" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Actions & Live Progress Badge */}
            <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
              <Link
                href="/tracker"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-500/30 text-xs font-semibold text-emerald-300 transition-colors whitespace-nowrap"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {visitedCount > 0 ? (
                  <span>{visitedCount}/৬৪ জেলা সম্পন্ন ✨</span>
                ) : (
                  <span>বাংলাদেশ লাইভ 🇧🇩</span>
                )}
              </Link>

              <Link
                href="/tracker"
                className="px-4 py-2 rounded-lg btn-glitch bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-sm font-bold text-white shadow-lg shadow-emerald-950/60 flex items-center gap-2 border border-emerald-400/30 whitespace-nowrap"
              >
                <Compass className="w-4 h-4" />
                <span>অন্বেষণ শুরু করুন</span>
              </Link>
            </div>

            {/* Mobile & Tablet Hamburger Button */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                type="button"
                onClick={toggleMobileMenu}
                className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors flex items-center justify-center"
                aria-label="ন্যাভিগেশন মেনু খুলুন"
              >
                <Menu className="w-6 h-6 text-emerald-400" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Right-Side Mobile Drawer with Dark Backdrop */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 lg:hidden ${
          isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        aria-modal="true"
        role="dialog"
      >
        {/* Backdrop (Click to close) */}
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />

        {/* Right-Side Sliding Drawer Container */}
        <div
          className={`fixed inset-y-0 right-0 z-50 w-full max-w-sm sm:max-w-md bg-slate-950/98 backdrop-blur-2xl border-l border-white/10 shadow-2xl flex flex-col justify-between overflow-y-auto transition-transform duration-300 ease-out ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Drawer Header with Close Button */}
          <div className="flex-shrink-0 border-b border-white/10 bg-slate-900/80 px-5 h-20 flex items-center justify-between">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3"
            >
              <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-emerald-500/50 shadow-md bg-slate-900 flex-shrink-0">
                <Image
                  src="/logo.jpg"
                  alt="ExploreBD Logo"
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-1 font-black text-xl text-white leading-none">
                  <span>Explore</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">BD</span>
                </div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mt-1">
                  ভ্রমণ প্ল্যাটফর্ম
                </p>
              </div>
            </Link>

            {/* Prominent Close Icon Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 border border-white/10 hover:border-rose-500/40 transition-colors flex items-center justify-center gap-1.5"
              aria-label="মেনু বন্ধ করুন"
            >
              <span className="text-xs font-semibold text-slate-300">বন্ধ করুন</span>
              <X className="w-5 h-5 text-rose-400" />
            </button>
          </div>

          {/* Drawer Content Body */}
          <div className="flex-1 px-5 py-6 space-y-5">
            {/* Progress Tracker Card */}
            <div className="p-4 rounded-xl glass-card border border-emerald-500/30 bg-emerald-950/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 flex-shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-300">
                    {visitedCount > 0 ? `${visitedCount}/৬৪ জেলা সম্পন্ন` : 'ভ্রমণ মানচিত্র শুরু করুন'}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {visitedCount > 0
                      ? 'আপনার ভ্রমণের রিয়েল-টাইম অগ্রগতি'
                      : 'বাংলাদেশের জেলাসমূহ চিহ্নিত করুন'}
                  </p>
                </div>
              </div>
              <Link
                href="/tracker"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition-colors flex-shrink-0"
              >
                ম্যাপ
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="space-y-2">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
                প্রধান মেনু
              </p>
              <nav className="flex flex-col space-y-2">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between p-3.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-emerald-500/30 text-slate-200 hover:text-white transition-all group"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-lg bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors flex-shrink-0">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-sm font-bold block text-white">
                            {link.name}
                          </span>
                          <span className="text-xs text-slate-400 block mt-0.5">
                            {link.desc}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2.5">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
                কুইক অ্যাকশন
              </p>
              <Link
                href="/tracker"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 rounded-lg btn-glitch bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/60 transition-colors"
              >
                <Compass className="w-4 h-4" />
                <span>ইন্টারেক্টিভ মানচিত্র ও ট্র্যাকার</span>
              </Link>

              <Link
                href="/districts"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 rounded-lg btn-glitch bg-slate-900 border border-white/10 hover:border-emerald-500/40 text-slate-200 hover:text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>৬৪ জেলার তালিকা দেখুন</span>
              </Link>
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="flex-shrink-0 p-4 border-t border-white/10 bg-slate-900/50 text-center text-xs text-slate-400">
            <p>© {new Date().getFullYear()} ExploreBD • ৬৪ জেলার ভ্রমণ গাইড 🇧🇩</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
