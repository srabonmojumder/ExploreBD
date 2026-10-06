'use client';

import React from 'react';
import { MapPin, Navigation, Sparkles } from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';

interface DivisionItem {
  name: string;
  bnName: string;
  districts: number;
  highlight: string;
  color: string;
}

const DIVISIONS: DivisionItem[] = [
  {
    name: 'Chattogram',
    bnName: 'চট্টগ্রাম',
    districts: 11,
    highlight: "Cox's Bazar, Sajek Valley, Sitakunda, Saint Martin",
    color: 'from-blue-600/20 to-emerald-600/20',
  },
  {
    name: 'Sylhet',
    bnName: 'সিলেট',
    districts: 4,
    highlight: 'Sreemangal Tea Gardens, Ratargul Swamp, Bichanakandi',
    color: 'from-emerald-600/20 to-teal-600/20',
  },
  {
    name: 'Dhaka',
    bnName: 'ঢাকা',
    districts: 13,
    highlight: 'Lalbagh Fort, Ahsan Manzil, Panam City, National Parliament',
    color: 'from-amber-600/20 to-red-600/20',
  },
  {
    name: 'Khulna',
    bnName: 'খুলনা',
    districts: 10,
    highlight: 'Sundarbans Mangrove, Sixty Dome Mosque, Kotka Beach',
    color: 'from-green-600/20 to-emerald-700/20',
  },
  {
    name: 'Rajshahi',
    bnName: 'রাজশাহী',
    districts: 8,
    highlight: 'Somapura Mahavihara, Varendra Museum, Puthia Temple Complex',
    color: 'from-orange-600/20 to-amber-600/20',
  },
  {
    name: 'Barishal',
    bnName: 'বরিশাল',
    districts: 6,
    highlight: 'Kuakata Daughter of the Sea, Floating Guava Market',
    color: 'from-cyan-600/20 to-blue-600/20',
  },
  {
    name: 'Rangpur',
    bnName: 'রংপুর',
    districts: 8,
    highlight: 'Tajhat Palace, Kantajew Temple, Ramsagar Dighi',
    color: 'from-violet-600/20 to-indigo-600/20',
  },
  {
    name: 'Mymensingh',
    bnName: 'ময়মনসিংহ',
    districts: 4,
    highlight: 'Garo Hills, Birishiri Ceramic Hills, Shashi Lodge',
    color: 'from-teal-600/20 to-cyan-700/20',
  },
];

export function DivisionPreview() {
  const { selectedDivisionSlug, setSelectedDivisionSlug } = useAppStore();

  return (
    <section id="divisions" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Discover Bangladesh</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Explore All 8 Divisions
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            From the deep mangroves of Sundarbans to the rolling green tea hills of Sylhet
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-white/5">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          <span>64 Districts Ready to Explore</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {DIVISIONS.map((div) => {
          const isSelected = selectedDivisionSlug === div.name.toLowerCase();
          return (
            <div
              key={div.name}
              onClick={() =>
                setSelectedDivisionSlug(isSelected ? null : div.name.toLowerCase())
              }
              className={`glass-card p-5 rounded-2xl cursor-pointer transition-all duration-300 relative overflow-hidden group ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-950/30 ring-1 ring-emerald-500 shadow-xl shadow-emerald-950/50'
                  : 'hover:-translate-y-1'
              }`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${div.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />

              <div className="relative z-10 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-white group-hover:text-emerald-300 transition-colors">
                      {div.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">{div.bnName}</p>
                  </div>
                  <span className="px-2 py-1 rounded-md text-[11px] font-semibold bg-emerald-950/80 border border-emerald-500/20 text-emerald-400">
                    {div.districts} Districts
                  </span>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {div.highlight}
                </p>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-400 group-hover:text-emerald-400 transition-colors">
                  <span className="font-medium">Discover places</span>
                  <Navigation className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default DivisionPreview;
