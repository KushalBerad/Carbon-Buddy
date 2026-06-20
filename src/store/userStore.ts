import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile } from '../types';

interface UserState {
  profile: UserProfile | undefined;
  sidebarOpen: boolean;
  currentView: string;
  setProfile: (profile: UserProfile | undefined) => void;
  setSidebarOpen: (open: boolean) => void;
  setCurrentView: (view: string) => void;
  earnPoints: (points: number, offset: number) => void;
  resetUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: undefined,
      // sidebarOpen: true,
      sidebarOpen: false,
      currentView: 'landing',
      setProfile: (profile) => set({ profile }),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      setCurrentView: (currentView) => set({ currentView }),
      earnPoints: (points, offset) =>
        set((state) => {
          if (!state.profile) return {};
          const nextPoints = state.profile.points + points;
          const nextLevel = Math.floor(nextPoints / 250) + 1;
          return {
            profile: {
              ...state.profile,
              points: nextPoints,
              level: nextLevel,
              carbonSavedTotal: state.profile.carbonSavedTotal + offset,
              moneySavedTotal: state.profile.moneySavedTotal + (points * 0.05),
            },
          };
        }),
      resetUser: () => set({ 
        profile: undefined, 
        currentView: 'landing', 
        sidebarOpen: false }),
    }),
    {
      name: 'carbon-buddy-user-store',

      partialize: (state) => ({
        profile: state.profile
      })
    }
  )
);
