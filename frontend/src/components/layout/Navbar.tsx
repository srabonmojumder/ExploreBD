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
      href: '/tracker',
      icon: Globe2,
    },
    {
      name: 'দর্শনীয় স্থান',
      href: '/places',
      icon: Compass,
    },
    {
      name: '৬৪ জেলা',
      href: '/districts',
      icon: MapPin,
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

            {/* Desktop Actions - Single Clear CTA Button */}
            <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
              <Link
                href="/tracker"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-sm font-bold text-white shadow-lg shadow-emerald-950/60 flex items-center gap-2 border border-emerald-400/30 transition-all hover:scale-[1.02]"
              >
                <Globe2 className="w-4 h-4 text-emerald-200" />
                {visitedCount > 0 ? (
                  <span>{visitedCount}/৬৪ জেলা সম্পন্ন</span>
                ) : (
                  <span>আপনার ম্যাপ তৈরি করুন</span>
                )}
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

      {/* Right-Side Mobile Drawer */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 lg:hidden ${
          isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        aria-modal="true"
        role="dialog"
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />

        {/* Sliding Drawer */}
        <div
          className={`fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-slate-950/98 backdrop-blur-2xl border-l border-white/10 shadow-2xl flex flex-col justify-between overflow-y-auto transition-transform duration-300 ease-out ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Header */}
          <div className="flex-shrink-0 border-b border-white/10 bg-slate-900/80 px-5 h-20 flex items-center justify-between">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3"
            >
              <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-emerald-500/50 shadow-md bg-slate-900 flex-shrink-0">
                <Image
                  src="/logo.jpg"
                  alt="ExploreBD Logo"
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-1 font-black text-lg text-white leading-none">
                  <span>Explore</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">BD</span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                  ৬৪ জেলা ভ্রমণ গাইড
                </p>
              </div>
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 border border-white/10 transition-colors"
              aria-label="মেনু বন্ধ করুন"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Links */}
          <div className="flex-1 px-5 py-6 space-y-4">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 hover:bg-emerald-950/40 border border-white/5 hover:border-emerald-500/30 text-white font-semibold transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-semibold">{link.name}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                  </Link>
                );
              })}
            </nav>

            {/* Single Primary Action in mobile menu */}
            <div className="pt-2">
              <Link
                href="/tracker"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-all"
              >
                <Compass className="w-4 h-4" />
                <span>আপনার ম্যাপ তৈরি করুন</span>
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
