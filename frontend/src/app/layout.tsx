import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Hind_Siliguri } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/lib/query-provider';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

const hindSiliguri = Hind_Siliguri({
  subsets: ['bengali'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-bengali',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#020617',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'ExploreBD — Bangladesh Travel Exploration Platform',
  description:
    'Discover, track, and share your journeys across all 8 Divisions and 64 Districts of Bangladesh. Collect achievements, view interactive maps, and compete on the national leaderboard.',
  keywords: [
    'Bangladesh',
    'Travel Bangladesh',
    'ExploreBD',
    'Sajek Valley',
    'Coxs Bazar',
    'Sundarbans',
    'Sitakunda',
    'Bangladesh Tourism',
  ],
  authors: [{ name: 'ExploreBD Team' }],
  icons: {
    icon: '/logo.jpg',
    shortcut: '/logo.jpg',
    apple: '/logo.jpg',
  },
  openGraph: {
    title: 'ExploreBD — Bangladesh Travel Exploration Platform',
    description:
      'Track your journeys across 64 districts and 8 divisions of Bangladesh. Gamified travel tracking with interactive maps.',
    siteName: 'ExploreBD',
    images: [
      {
        url: '/banner.jpg',
        width: 1200,
        height: 630,
        alt: 'ExploreBD Bangladesh Travel Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="bn"
      className={`dark scroll-smooth ${plusJakartaSans.variable} ${hindSiliguri.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col font-sans" suppressHydrationWarning>
        <QueryProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
