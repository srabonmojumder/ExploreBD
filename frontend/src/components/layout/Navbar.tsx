'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Compass, MapPin, Menu, X, Globe2, ChevronRight, Sparkles } from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';
import { useTravelStore } from '@/stores/useTravelStore';
import { useMounted } from '@/hooks/useMounted';

export function Navbar() {
  const mounted = useMounted();
  const pathname = usePathname();
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
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/75 border-b border-white/[0.08] transition-all">
        {/* Subtle accent highlight line at top */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-[68px] gap-4">
            {/* Brand Logo - Clean, border removed, modern sleek typography */}
            <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
              <div className="relative w-10 h-10 sm:w-14 sm:h-14 rounded-full overflow-hidden shadow-md shadow-black/40 group-hover:scale-105 transition-transform flex-shrink-0">
                <Image
                  src="/logo.jpg"
                  alt="ExploreBD Logo"
                  fill
                  sizes="(max-width: 640px) 40px, 44px"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1 font-black text-xl sm:text-2xl tracking-tight text-white leading-none">
                  <span>Explore</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">BD</span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium tracking-wide mt-0.5">
                  বাংলাদেশ ভ্রমণ প্ল্যাটফর্ম
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links - Modern pill states with active glow */}
            <nav className="hidden lg:flex items-center gap-1.5 p-1 rounded-full bg-white/[0.03] border border-white/[0.06]">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`relative flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${isActive
                      ? 'text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 shadow-sm shadow-emerald-950/40'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.06] border border-transparent'
                      }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span>{link.name}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop CTA Button */}
            <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
              <Link
                href="/tracker"
                className="group relative px-4 sm:px-5 py-2 rounded-full btn-glitch bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-emerald-950/70 border border-emerald-400/30 flex items-center gap-2 transition-all hover:scale-[1.03] active:scale-[0.98]"
              >
                <Globe2 className="w-4 h-4 text-emerald-200 group-hover:rotate-12 transition-transform" />
                {visitedCount > 0 ? (
                  <span>{visitedCount}/৬৪ জেলা সম্পন্ন</span>
                ) : (
                  <span>আপনার ম্যাপ তৈরি করুন</span>
                )}
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                type="button"
                onClick={toggleMobileMenu}
                className="p-2 sm:p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 hover:text-white border border-white/[0.08] transition-colors flex items-center justify-center"
                aria-label="ন্যাভিগেশন মেনু খুলুন"
              >
                <Menu className="w-5 h-5 text-emerald-400" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Modern Right-Side Mobile Drawer */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 lg:hidden ${isMobileMenuOpen
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
          }`}
        aria-modal="true"
        role="dialog"
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />

        {/* Sliding Drawer */}
        <div
          className={`fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-slate-950/95 backdrop-blur-2xl border-l border-white/[0.08] shadow-2xl flex flex-col justify-between overflow-y-auto transition-transform duration-300 ease-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          {/* Drawer Header - Clean without logo border */}
          <div className="flex-shrink-0 border-b border-white/[0.08] bg-slate-900/50 px-5 h-16 sm:h-[68px] flex items-center justify-between">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3"
            >
              <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                <Image
                  src="/logo.jpg"
                  alt="ExploreBD Logo"
                  fill
                  sizes="36px"
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
              className="p-2 rounded-lg bg-white/[0.05] hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 border border-white/[0.08] transition-colors"
              aria-label="মেনু বন্ধ করুন"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Navigation Links */}
          <div className="flex-1 px-5 py-6 space-y-4">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between p-3.5 rounded-xl transition-all group ${isActive
                      ? 'bg-emerald-500/15 border border-emerald-500/30 text-white'
                      : 'bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] text-slate-200'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${isActive
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-slate-900 border border-white/[0.08] text-slate-400 group-hover:text-emerald-400'
                        }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-semibold">{link.name}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 ${isActive ? 'text-emerald-400' : 'text-slate-500'
                      }`} />
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Primary CTA */}
            <div className="pt-2">
              <Link
                href="/tracker"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3.5 rounded-xl btn-glitch bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60 border border-emerald-400/30 transition-all"
              >
                <Compass className="w-4 h-4" />
                <span>আপনার ম্যাপ তৈরি করুন</span>
              </Link>
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="flex-shrink-0 p-4 border-t border-white/[0.08] bg-slate-900/40 text-center text-xs text-slate-400">
            <p>© {new Date().getFullYear()} ExploreBD • ৬৪ জেলার ভ্রমণ প্ল্যাটফর্ম 🇧🇩</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
