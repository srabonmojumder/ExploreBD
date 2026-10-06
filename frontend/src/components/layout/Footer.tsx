import React from 'react';
import Link from 'next/link';
import { Compass, Heart, Github, Twitter, MapPin } from 'lucide-react';

export function Footer() {
  const divisions = [
    'Dhaka',
    'Chattogram',
    'Sylhet',
    'Rajshahi',
    'Khulna',
    'Barishal',
    'Rangpur',
    'Mymensingh',
  ];

  return (
    <footer className="border-t border-white/10 bg-slate-950/80 text-slate-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Compass className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-white">ExploreBD</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              The premier social travel tracking platform built exclusively for exploring Bangladesh. Track your visits, collect achievements, and uncover the beauty of 64 districts.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <MapPin className="w-3.5 h-3.5" />
              <span>Covering all 8 Divisions & 64 Districts</span>
            </div>
          </div>

          {/* Divisions */}
          <div>
            <h4 className="font-semibold text-white text-sm tracking-wider uppercase mb-3">
              Divisions of Bangladesh
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {divisions.map((div) => (
                <Link
                  key={div}
                  href={`#division-${div.toLowerCase()}`}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {div}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white text-sm tracking-wider uppercase mb-3">
              Platform Features
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#map" className="hover:text-emerald-400 transition-colors">
                  Interactive Bangladesh Map
                </Link>
              </li>
              <li>
                <Link href="#stats" className="hover:text-emerald-400 transition-colors">
                  Travel Statistics & Badges
                </Link>
              </li>
              <li>
                <Link href="#achievements" className="hover:text-emerald-400 transition-colors">
                  Travel Achievements
                </Link>
              </li>
              <li>
                <Link href="#leaderboard" className="hover:text-emerald-400 transition-colors">
                  Explorer Leaderboards
                </Link>
              </li>
            </ul>
          </div>

          {/* Architecture & Stack */}
          <div>
            <h4 className="font-semibold text-white text-sm tracking-wider uppercase mb-3">
              Phase 1 Architecture
            </h4>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-white/5 space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span>Backend Engine:</span>
                <span className="text-emerald-400 font-mono">Express + TS</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Database:</span>
                <span className="text-emerald-400 font-mono">PostgreSQL + Prisma</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Frontend:</span>
                <span className="text-emerald-400 font-mono">Next.js 15 + Tailwind</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>State & Queries:</span>
                <span className="text-emerald-400 font-mono">TanStack Query + Zustand</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} ExploreBD. Crafted with pride for Bangladesh travelers.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline mx-0.5" />
            <span>for explorers across the nation</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
