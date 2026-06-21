/**
 * Carbon Buddy Main Application Entry
 *
 * Responsible for:
 * - Sustainability platform routing
 * - Carbon awareness dashboard rendering
 * - AI-powered eco recommendation workflows
 * - Lazy-loaded page optimization
 * - Global theme orchestration
 *
 * Core Mission:
 * Helping users reduce personal carbon footprint through
 * sustainable habit tracking and intelligent eco guidance.
 */

import { lazy, Suspense } from 'react';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ThemeProvider } from './components/ThemeProvider';
import { useUserStore } from './store/userStore';

// Progressive lazy loading for optimized sustainability platform performance
const LandingPage = lazy(() =>
  import('./pages/LandingPage').then((module) => ({
    default: module.LandingPage,
  }))
);

const OnboardingPage = lazy(() =>
  import('./pages/OnboardingPage').then((module) => ({
    default: module.OnboardingPage,
  }))
);

const DashboardPage = lazy(() =>
  import('./pages/DashboardPage').then((module) => ({
    default: module.DashboardPage,
  }))
);

const DailyHabitsPage = lazy(() =>
  import('./pages/DailyHabitsPage').then((module) => ({
    default: module.DailyHabitsPage,
  }))
);

const WeeklyReflectionPage = lazy(() =>
  import('./pages/WeeklyReflectionPage').then((module) => ({
    default: module.WeeklyReflectionPage,
  }))
);

const AICoachPage = lazy(() =>
  import('./pages/AICoachPage').then((module) => ({
    default: module.AICoachPage,
  }))
);

const StreakSystemPage = lazy(() =>
  import('./pages/StreakSystemPage').then((module) => ({
    default: module.StreakSystemPage,
  }))
);

const MealSuggestionPage = lazy(() =>
  import('./pages/MealSuggestionPage').then((module) => ({
    default: module.MealSuggestionPage,
  }))
);

const EcoFinderPage = lazy(() =>
  import('./pages/EcoFinderPage').then((module) => ({
    default: module.EcoFinderPage,
  }))
);

const EarthBloomPage = lazy(() =>
  import('./pages/EarthBloomPage').then((module) => ({
    default: module.EarthBloomPage,
  }))
);

const SettingsPage = lazy(() =>
  import('./pages/SettingsPage').then((module) => ({
    default: module.SettingsPage,
  }))
);

/**
 * Core application renderer responsible for authenticated
 * sustainability dashboard navigation and public landing experience.
 */
function AppContent() {
  const userProfile = useUserStore((state) => state.profile);
  const activeCarbonBuddyView = useUserStore(
    (state) => state.currentView
  );
  const isSidebarExpanded = useUserStore(
    (state) => state.sidebarOpen
  );

  const isPublicExperienceView =
    activeCarbonBuddyView === 'landing' ||
    activeCarbonBuddyView === 'onboarding';

  /**
   * Resolves current sustainability application route.
   */
  const renderCarbonBuddyView = () => {
    switch (activeCarbonBuddyView) {
      case 'dashboard':
        return <DashboardPage />;

      case 'habits':
        return <DailyHabitsPage />;

      case 'reflection':
        return <WeeklyReflectionPage />;

      case 'coach':
        return <AICoachPage />;

      case 'meals':
        return <MealSuggestionPage />;

      case 'location':
        return <EcoFinderPage />;

      case 'bloom':
        return <EarthBloomPage />;

      case 'achievements':
        return <StreakSystemPage />;

      case 'settings':
        return <SettingsPage />;

      case 'onboarding':
        return <OnboardingPage />;

      default:
        return <LandingPage />;
    }
  };

  return (
    <div
      id="carbon-buddy-root"
      className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-100 transition-colors duration-300"
    >
      <Suspense
        fallback={
          <div className="p-8 max-w-6xl mx-auto space-y-6">
            <LoadingSkeleton
              id="carbon-route-loading"
              variant="card"
              count={2}
            />
          </div>
        }
      >
        {userProfile && !isPublicExperienceView ? (
          <>
            <Navbar id="carbon-app-navbar" />

            <div className="flex pt-16">
              <Sidebar id="carbon-app-sidebar" />

              <main
                role="main"
                aria-label="Carbon Buddy sustainability dashboard"
                className={`flex-1 p-6 sm:p-8 transition-all duration-300 ${
                  isSidebarExpanded ? 'lg:pl-64' : 'lg:pl-20'
                }`}
              >
                <div
                  id="carbon-dashboard-view"
                  className="max-w-6xl mx-auto"
                >
                  {renderCarbonBuddyView()}
                </div>
              </main>
            </div>
          </>
        ) : (
          <div
            id="carbon-public-view"
            aria-label="Carbon Buddy onboarding and public landing interface"
            className="min-h-screen w-full"
          >
            {renderCarbonBuddyView()}
          </div>
        )}
      </Suspense>
    </div>
  );
}

/**
 * Root application wrapper with global theme orchestration.
 */
export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}