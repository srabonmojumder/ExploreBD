'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Compass, MapPin, Layers, Menu, X, Globe2, Sparkles, Navigation } from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';
import { useTravelStore } from '@/stores/useTravelStore';
import { useMounted } from '@/hooks/useMounted';

export function Navbar() {
  const mounted = useMounted();
  const { isMobileMenuOpen, toggleMobileMenu, setMobileMenuOpen } = useAppStore();
  const { getVisitedDistrictSlugs } = useTravelStore();

  const visitedCount = mounted ? getVisitedDistrictSlugs().length : 0;

  const navLinks = [
    { name: 'ভ্রমণ ট্র্যাকার', href: '/tracker', icon: Globe2 },
    { name: 'Places', href: '/places', icon: Compass },
    { name: 'Districts (64)', href: '/districts', icon: MapPin },
    { name: 'Divisions', href: '/#divisions', icon: Layers },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-emerald-500/50 shadow-xl shadow-emerald-950/60 group-hover:scale-105 group-hover:border-emerald-400 transition-all bg-slate-900 flex-shrink-0">
              <Image
                src="/logo.jpg"
                alt="ExploreBD Logo"
                fill
                sizes="(max-width: 640px) 52px, 64px"
                className="object-cover"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-black text-2xl sm:text-3xl tracking-tight text-white leading-none">
                <span>Explore</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">BD</span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-300/80 tracking-wider uppercase font-semibold mt-1">
                Bangladesh Travel Platform
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <Icon className="w-4 h-4 text-emerald-400" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Actions & Live Progress Badge */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/tracker"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-500/30 text-xs font-semibold text-emerald-300 transition-colors"
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
              className="px-4 py-2 rounded-lg btn-glitch bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-sm font-bold text-white shadow-lg shadow-emerald-950/60 flex items-center gap-2 border border-emerald-400/30"
            >
              <Compass className="w-4 h-4" />
              <span>অন্বেষণ শুরু করুন</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-white/10 px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-slate-200 hover:bg-white/5"
                >
                  <Icon className="w-5 h-5 text-emerald-400" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <Link
              href="/tracker"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60"
            >
              <Compass className="w-4 h-4" />
              <span>অন্বেষণ শুরু করুন (ভ্রমণ ট্র্যাকার)</span>
            </Link>
            <Link
              href="/districts"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-200 hover:text-white text-sm font-semibold flex items-center justify-center gap-2"
            >
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>৬৪ জেলা ব্রাউজ করুন</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
