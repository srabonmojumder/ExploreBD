# ExploreBD Frontend Architecture Documentation (English)

## 1. Overview
ExploreBD frontend is built on **Next.js 15 (App Router)**, **React 19**, **Tailwind CSS**, and **TypeScript**. It offers a mobile-first, responsive dark-mode glassmorphic interface with zero-latency travel tracking.

---

## 2. Core Frontend Modules

### A. Travel Tracker & Vector Map (`/tracker`)
- **Interactive SVG Map (`BangladeshInteractiveMap.tsx`)**: Powered by `manchitro`, this allows travelers to hover and click any of the 64 districts. Visited districts light up emerald green in real-time.
- **Micro-Spot Multi-Visit Tracking**: Travelers can log repeat visits (e.g. visited 3 times, last date, notes) with instant client persistence.
- **National Map Share Modal (`NationalMapShareModal.tsx`)**: Renders high-resolution (1080x1350 PNG) travel summary cards with the traveler's custom name, completion percentage, and visited badge.

### B. 64 Districts Explorer (`/districts`)
- Division-wise pill filtering (`/districts?division=chattogram`).
- Debounced live search with Bengali and English name matching.
- Magazine-style district cards with cover images and error fallbacks.

### C. Tourist Destinations (`/places`)
- Category-based filtering (`WATERFALL`, `BEACH`, `HILL`, `FOREST`, `HISTORICAL`, `LAKE`, etc.).
- Sort options: Highest Rated, Most Visited, and Recently Added.
- Rich place detail page (`/places/[slug]`) with image gallery, GPS coordinates, Google Maps link, and multi-visit increment/decrement buttons.

---

## 3. State Management & Offline Persistence
- **Zustand (`useTravelStore.ts`)**: Persists traveler visits to `localStorage` using `persist` middleware.
  - No mandatory login required to track visits.
  - Calculates district level badges: 🌱 Beginner, 🥉 Explorer, 🥈 Specialist, 🥇 Master.
- **TanStack Query v5 (`query-provider.tsx`)**:
  - `staleTime: 5 minutes`
  - `gcTime: 1 hour`
  - Eliminates redundant API calls and loading spinners when navigating between pages.

---

## 4. UI/UX Design System
- **Lucide Icons (`lucide-react`)**: Consistent icon system across every view.
- **Typography**: Optimized via `next/font/google` (`Plus Jakarta Sans` for Latin, `Hind Siliguri` for Bengali script).
- **Responsive Viewport Modals**: Constrained max-heights (`max-h-[92vh]`) prevent clipping on smartphones and compact laptops.
- **Smart Image Fallbacks**: Remote images automatically fallback to local `/banner.jpg` via `onError` handlers.
