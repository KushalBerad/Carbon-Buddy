import { lazy, Suspense } from 'react';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ThemeProvider } from './components/ThemeProvider';
import { useUserStore } from './store/userStore';

// Route-based progressive lazy chunk splitting
const LandingPage = lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })));
const OnboardingPage = lazy(() => import('./pages/OnboardingPage').then(m => ({ default: m.OnboardingPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const DailyHabitsPage = lazy(() => import('./pages/DailyHabitsPage').then(m => ({ default: m.DailyHabitsPage })));
const WeeklyReflectionPage = lazy(() => import('./pages/WeeklyReflectionPage').then(m => ({ default: m.WeeklyReflectionPage })));
const AICoachPage = lazy(() => import('./pages/AICoachPage').then(m => ({ default: m.AICoachPage })));
const StreakSystemPage = lazy(() => import('./pages/StreakSystemPage').then(m => ({ default: m.StreakSystemPage })));
const MealSuggestionPage = lazy(() => import('./pages/MealSuggestionPage').then(m => ({ default: m.MealSuggestionPage })));
const EcoFinderPage = lazy(() => import('./pages/EcoFinderPage').then(m => ({ default: m.EcoFinderPage })));
const EarthBloomPage = lazy(() => import('./pages/EarthBloomPage').then(m => ({ default: m.EarthBloomPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })));

function AppContent() {
  const profile = useUserStore((s) => s.profile);
  const currentView = useUserStore((s) => s.currentView);
  const sidebarOpen = useUserStore((s) => s.sidebarOpen);

  const isHomeView = currentView === 'landing' || currentView === 'onboarding';

  const renderView = () => {
    switch (currentView) {
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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-100 transition-colors duration-300">
      <Suspense fallback={
        <div className="p-8 max-w-6xl mx-auto space-y-6">
          <LoadingSkeleton id="routing-fallback" variant="card" count={2} />
        </div>
      }>
        {profile && !isHomeView ? (
          <>
            <Navbar id="app-navbar" />
            <div className="flex pt-16">
              <Sidebar id="app-sidebar" />
              <main className={`flex-1 p-6 sm:p-8 transition-all duration-300 ${sidebarOpen ? 'lg:pl-64' : 'lg:pl-20'}`}>
                <div id="view-port" className="max-w-6xl mx-auto">
                  {renderView()}
                </div>
              </main>
            </div>
          </>
        ) : (
          <div id="full-view-port" className="min-h-screen w-full">
            {renderView()}
          </div>
        )}
      </Suspense>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
