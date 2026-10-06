'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface PlaceVisitItem {
  placeId: string;
  placeSlug: string;
  placeName: string;
  bnName?: string | null;
  districtSlug: string;
  category?: string;
  count: number;
  lastVisited?: string;
}

export interface DistrictProgressStats {
  totalPlaces: number;
  visitedPlaces: number;
  totalVisits: number;
  percentage: number;
  levelTitle: string;
  levelBadge: string;
}

interface TravelStoreState {
  travelerName: string;
  visits: Record<string, PlaceVisitItem>; // keyed by placeSlug
  
  // Actions
  setTravelerName: (name: string) => void;
  recordVisit: (item: Omit<PlaceVisitItem, 'count' | 'lastVisited'>, count?: number) => void;
  incrementVisit: (item: Omit<PlaceVisitItem, 'count' | 'lastVisited'>) => void;
  decrementVisit: (placeSlug: string) => void;
  removeVisit: (placeSlug: string) => void;
  getPlaceVisit: (placeSlug: string) => PlaceVisitItem | undefined;
  getDistrictVisits: (districtSlug: string) => PlaceVisitItem[];
  getDistrictStats: (districtSlug: string, totalPlaces: number) => DistrictProgressStats;
  getTotalVisitedCount: () => number;
  getTotalVisitsCount: () => number;
  getVisitedDistrictSlugs: () => string[];
  clearDistrictVisits: (districtSlug: string) => void;
  clearAllVisits: () => void;
}

export function calculateDistrictLevel(percentage: number): { title: string; badge: string } {
  if (percentage === 0) {
    return { title: 'ভ্রমণ শুরুর অপেক্ষায়', badge: '🌱' };
  }
  if (percentage < 25) {
    return { title: 'নবাগত অভিযাত্রী (Beginner)', badge: '🥉' };
  }
  if (percentage < 50) {
    return { title: 'ঘুরে দেখা পরিব্রাজক (Explorer)', badge: '🥈' };
  }
  if (percentage < 75) {
    return { title: 'জেলা ভ্রমণ বিশেষজ্ঞ (Specialist)', badge: '🥇' };
  }
  if (percentage < 100) {
    return { title: 'মাস্টার ট্রাভেলার (Master Explorer)', badge: '⭐' };
  }
  return { title: 'জেলার সেরা সুলতান (District Legend)', badge: '👑' };
}

export const useTravelStore = create<TravelStoreState>()(
  persist(
    (set, get) => ({
      travelerName: 'ভ্রমণপিপাসু',
      visits: {},

      setTravelerName: (name: string) => {
        set({ travelerName: name.trim() || 'ভ্রমণপিপাসু' });
      },

      recordVisit: (item, count = 1) => {
        const now = new Date().toISOString();
        set((state) => ({
          visits: {
            ...state.visits,
            [item.placeSlug]: {
              ...item,
              count: Math.max(1, count),
              lastVisited: now,
            },
          },
        }));
      },

      incrementVisit: (item) => {
        const current = get().visits[item.placeSlug];
        const newCount = current ? current.count + 1 : 1;
        const now = new Date().toISOString();

        set((state) => ({
          visits: {
            ...state.visits,
            [item.placeSlug]: {
              ...item,
              count: newCount,
              lastVisited: now,
            },
          },
        }));
      },

      decrementVisit: (placeSlug: string) => {
        const current = get().visits[placeSlug];
        if (!current) return;

        if (current.count <= 1) {
          // Remove if reduced to 0
          set((state) => {
            const next = { ...state.visits };
            delete next[placeSlug];
            return { visits: next };
          });
        } else {
          set((state) => ({
            visits: {
              ...state.visits,
              [placeSlug]: {
                ...current,
                count: current.count - 1,
              },
            },
          }));
        }
      },

      removeVisit: (placeSlug: string) => {
        set((state) => {
          const next = { ...state.visits };
          delete next[placeSlug];
          return { visits: next };
        });
      },

      getPlaceVisit: (placeSlug: string) => {
        return get().visits[placeSlug];
      },

      getDistrictVisits: (districtSlug: string) => {
        const all = Object.values(get().visits);
        return all.filter((v) => v.districtSlug === districtSlug);
      },

      getDistrictStats: (districtSlug: string, totalPlaces: number) => {
        const districtVisits = get().getDistrictVisits(districtSlug);
        const visitedPlaces = districtVisits.length;
        const totalVisits = districtVisits.reduce((sum, v) => sum + v.count, 0);
        const percentage = totalPlaces > 0 ? Math.min(100, Math.round((visitedPlaces / totalPlaces) * 100)) : 0;
        const level = calculateDistrictLevel(percentage);

        return {
          totalPlaces,
          visitedPlaces,
          totalVisits,
          percentage,
          levelTitle: level.title,
          levelBadge: level.badge,
        };
      },

      getTotalVisitedCount: () => {
        return Object.keys(get().visits).length;
      },

      getTotalVisitsCount: () => {
        return Object.values(get().visits).reduce((acc, v) => acc + v.count, 0);
      },

      getVisitedDistrictSlugs: () => {
        const districts = new Set<string>();
        Object.values(get().visits).forEach((v) => {
          if (v.districtSlug) districts.add(v.districtSlug);
        });
        return Array.from(districts);
      },

      clearDistrictVisits: (districtSlug: string) => {
        set((state) => {
          const next: Record<string, PlaceVisitItem> = {};
          Object.entries(state.visits).forEach(([k, v]) => {
            if (v.districtSlug !== districtSlug) {
              next[k] = v;
            }
          });
          return { visits: next };
        });
      },

      clearAllVisits: () => {
        set({ visits: {} });
      },
    }),
    {
      name: 'explorebd_travel_store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
