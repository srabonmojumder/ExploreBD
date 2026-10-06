'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, MapPin, Trophy, Layers, Menu, X, Globe2 } from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';

export function Navbar() {
  const { isMobileMenuOpen, toggleMobileMenu, setMobileMenuOpen } = useAppStore();

  const navLinks = [
    { name: 'Places', href: '/places', icon: Compass },
    { name: 'Districts (64)', href: '/districts', icon: MapPin },
    { name: 'Divisions', href: '/#divisions', icon: Layers },
    { name: 'Leaderboard', href: '/#leaderboard', icon: Trophy },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 shadow-lg shadow-emerald-950/40 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 text-white animate-spin-slow group-hover:rotate-45 transition-transform" />
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-600 border-2 border-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold text-xl tracking-tight text-white">
                <span>Explore</span>
                <span className="text-emerald-400">BD</span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wider uppercase font-medium">
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

          {/* Actions & Live Status Indicator */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/20 text-xs font-medium text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Phase 1 Live</span>
            </div>

            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-sm font-semibold text-white shadow-md shadow-emerald-900/30 hover:shadow-emerald-700/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Start Exploring
            </button>
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
            <button
              type="button"
              className="w-full py-2.5 rounded-lg bg-emerald-600 text-white font-semibold text-sm"
            >
              Start Exploring
            </button>
            <button
              type="button"
              className="w-full py-2.5 rounded-lg bg-slate-800 text-slate-200 text-sm font-medium"
            >
              Sign In
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
