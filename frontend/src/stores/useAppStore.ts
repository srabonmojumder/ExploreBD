import { create } from 'zustand';

interface AppState {
  isMobileMenuOpen: boolean;
  selectedDivisionSlug: string | null;
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  setSelectedDivisionSlug: (slug: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isMobileMenuOpen: false,
  selectedDivisionSlug: null,
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  setSelectedDivisionSlug: (slug) => set({ selectedDivisionSlug: slug }),
}));
