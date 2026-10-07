import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Compass, Heart, MapPin, Facebook, MessageCircle, Phone } from 'lucide-react';

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
            <div className="flex items-center gap-3.5">
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-emerald-500/40 shadow-lg shadow-emerald-950/50 bg-slate-900 flex-shrink-0">
                <Image
                  src="/logo.jpg"
                  alt="ExploreBD Logo"
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div>
                <span className="font-black text-xl text-white tracking-tight">Explore<span className="text-emerald-400">BD</span></span>
                <p className="text-[11px] text-slate-400 font-medium">Bangladesh Travel Platform</p>
              </div>
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
                <Link href="/tracker" className="hover:text-emerald-400 transition-colors">
                  Interactive Bangladesh Map
                </Link>
              </li>
              <li>
                <Link href="/places" className="hover:text-emerald-400 transition-colors">
                  Tourist Destinations
                </Link>
              </li>
              <li>
                <Link href="/districts" className="hover:text-emerald-400 transition-colors">
                  64 Districts Explorer
                </Link>
              </li>
              <li>
                <Link href="/#status" className="hover:text-emerald-400 transition-colors">
                  System Health & Status
                </Link>
              </li>
            </ul>
          </div>

          {/* Developer & Creator Credits */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white text-sm tracking-wider uppercase mb-2">
              Developer
            </h4>
            <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-white/10 space-y-3 shadow-lg">
              <div className="space-y-0.5">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Made with ❤️ by</p>
                <p className="text-base font-bold text-white tracking-tight">Srabon Mozumder</p>
              </div>

              <div className="space-y-2 pt-1">
                {/* Facebook Link */}
                <a
                  href="https://www.facebook.com/sraabonmozumder"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg btn-glitch bg-blue-950/60 hover:bg-blue-900/70 border border-blue-500/30 text-blue-300 text-xs font-semibold transition-colors group"
                >
                  <Facebook className="w-4 h-4 text-blue-400" />
                  <span>Facebook Profile</span>
                </a>

                {/* WhatsApp Link */}
                <a
                  href="https://wa.me/8801827621312"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg btn-glitch bg-emerald-950/60 hover:bg-emerald-900/70 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-colors group"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp: 01827621312</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} ExploreBD. Crafted with pride for Bangladesh travelers.</p>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline mx-0.5" />
            <span>by</span>
            <a
              href="https://www.facebook.com/sraabonmozumder"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 font-bold hover:underline"
            >
              Srabon Mozumder
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
