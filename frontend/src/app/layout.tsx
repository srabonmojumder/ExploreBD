import type { Metadata } from 'next';
import './globals.css';
import { QueryProvider } from '@/lib/query-provider';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
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
  openGraph: {
    title: 'ExploreBD — Bangladesh Travel Exploration Platform',
    description:
      'Track your journeys across 64 districts and 8 divisions of Bangladesh. Gamified travel tracking with interactive maps.',
    siteName: 'ExploreBD',
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
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen flex flex-col font-sans">
        <QueryProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
