import React from 'react';
import Link from 'next/link';
import { Compass, Home, MapPin, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="glass-card p-8 sm:p-12 rounded-3xl border border-white/10 max-w-lg w-full space-y-6 shadow-2xl relative overflow-hidden">
        {/* Subtle glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="w-16 h-16 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
          <Compass className="w-8 h-8 animate-spin" style={{ animationDuration: '10s' }} />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            ৪০৪ • পথ হারানো পৃষ্ঠা
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            পেজটি খুঁজে পাওয়া যায়নি
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
            আপনি যে গন্তব্যে যেতে চেয়েছেন তা হয়তো স্থানান্তরিত হয়েছে অথবা লিংকটি সঠিক নয়।
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg btn-glitch bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>হোমে ফিরে যান</span>
          </Link>

          <Link
            href="/tracker"
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg btn-glitch bg-slate-900 border border-white/10 hover:border-emerald-500/40 text-slate-200 hover:text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>ভ্রমণ ট্র্যাকার</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
