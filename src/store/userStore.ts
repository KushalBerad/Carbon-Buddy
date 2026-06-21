/**
 * Carbon Buddy Global User State Store
 *
 * Centralized state management for:
 * - Sustainable habit tracking
 * - Carbon footprint reduction analytics
 * - Eco reward progression system
 * - Sustainability dashboard navigation
 * - Environmental impact scoring
 *
 * Uses Zustand persistent state architecture.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile } from '../types';

/**
 * Sustainability reward system configuration.
 */
const ECO_LEVEL_POINT_THRESHOLD = 250;
const ECO_REWARD_CONVERSION_RATE = 0.05;

/**
 * Core application user state contract.
 */
interface UserState {
  profile: UserProfile | undefined;
  sidebarOpen: boolean;
  currentView: string;

  setProfile: (profile: UserProfile | undefined) => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setCurrentView: (viewIdentifier: string) => void;

  earnPoints: (
    ecoRewardPoints: number,
    carbonReductionOffset: number
  ) => void;

  resetUser: () => void;
}

/**
 * Carbon Buddy persistent state store.
 */
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      /**
       * Initial application state.
       */
      profile: undefined,
      sidebarOpen: false,
      currentView: 'landing',

      /**
       * Updates active user sustainability profile.
       */
      setProfile: (profile) =>
        set({
          profile,
        }),

      /**
       * Controls dashboard sidebar visibility state.
       */
      setSidebarOpen: (isOpen) =>
        set({
          sidebarOpen: isOpen,
        }),

      /**
       * Updates active dashboard route.
       */
      setCurrentView: (viewIdentifier) =>
        set({
          currentView: viewIdentifier,
        }),

      /**
       * Updates sustainability reward progression
       * after successful eco-friendly user actions.
       */
      earnPoints: (
        ecoRewardPoints,
        carbonReductionOffset
      ) =>
        set((state) => {
          if (!state.profile) {
            return {};
          }

          const updatedRewardPoints =
            state.profile.points + ecoRewardPoints;

          const updatedSustainabilityLevel =
            Math.floor(
              updatedRewardPoints /
                ECO_LEVEL_POINT_THRESHOLD
            ) + 1;

          const updatedCarbonSavings =
            state.profile.carbonSavedTotal +
            carbonReductionOffset;

          const updatedMonetarySavings =
            state.profile.moneySavedTotal +
            ecoRewardPoints *
              ECO_REWARD_CONVERSION_RATE;

          return {
            profile: {
              ...state.profile,
              points: updatedRewardPoints,
              level: updatedSustainabilityLevel,
              carbonSavedTotal: updatedCarbonSavings,
              moneySavedTotal: updatedMonetarySavings,
            },
          };
        }),

      /**
       * Resets user application state
       * during logout or onboarding restart.
       */
      resetUser: () =>
        set({
          profile: undefined,
          currentView: 'landing',
          sidebarOpen: false,
        }),
    }),

    {
      /**
       * Persistent browser storage configuration.
       */
      name: 'carbon-buddy-user-store',

      /**
       * Persist only user profile data.
       * UI state remains session-bound.
       */
      partialize: (state) => ({
        profile: state.profile,
      }),
    }
  )
);