import { Moon, RefreshCw, Shield, Sliders, Sun, User } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useTheme } from '../components/ThemeProvider';
import { useUserStore } from '../store/userStore';
import { UserProfile } from '../types';

export interface SettingsPageProps {
  profile?: UserProfile;
  onReset?: () => void;
  onUpdateProfile?: (profile: UserProfile) => void;
}

export const SettingsPage = React.memo(function SettingsPage({ profile: propProfile, onReset: propOnReset, onUpdateProfile }: SettingsPageProps) {
  const storeProfile = useUserStore((s) => s.profile);
  const storeResetUser = useUserStore((s) => s.resetUser);
  const setProfile = useUserStore((s) => s.setProfile);
  const { theme, toggleTheme } = useTheme();

  const profile = propProfile || storeProfile;
  const onReset = propOnReset || storeResetUser;

  const [ecoReminders, setEcoReminders] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('carbon-eco-reminders') !== 'false';
    }
    return true;
  });

  const [nameInput, setNameInput] = React.useState(profile?.name || '');

  React.useEffect(() => {
    localStorage.setItem('carbon-eco-reminders', String(ecoReminders));
  }, [ecoReminders]);

  if (!profile) return null;

  const handleUpdate = (updates: Partial<UserProfile>) => {
    const updated = { ...profile, ...updates };
    if (onUpdateProfile) onUpdateProfile(updated);
    setProfile(updated);
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header */}
      <div className="border-b border-zinc-200/50 dark:border-zinc-800 pb-5">
        <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          Settings & Profile Baselines
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-300 font-light mt-1">
          Polish dietary orientations, commuter preferences, theme styles, and reset parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Core items */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-150/40 dark:border-zinc-800/80">
              <User className="w-5 h-5 text-emerald-500" />
              <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">Personal Onboarding Baselines</h2>
            </div>

            <div className="space-y-4">
              {/* Name Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-300">Pioneer User Name</label>
                <input 
                  type="text" 
                  value={nameInput} 
                  onChange={(e) => {
                    setNameInput(e.target.value);
                    handleUpdate({ name: e.target.value });
                  }}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-800 dark:text-zinc-150 outline-none focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="Enter your name"
                />
              </div>

              {/* Diet preferences */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] text-zinc-500 dark:text-zinc-300 font-bold uppercase font-mono tracking-wider">Dietary Orientation</span>
                <div className="grid grid-cols-3 gap-2">
                  {['vegetarian', 'vegan', 'omnivore'].map((option) => (
                    <button
                      key={option}
                      onClick={() => handleUpdate({ dietPreference: option })}
                      className={`px-3 py-2.5 rounded-xl border capitalize text-center text-xs font-semibold cursor-pointer transition-all ${
                        profile.dietPreference === option
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500 shadow-sm'
                          : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 text-zinc-650 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900/60'
                      }`}
                      aria-label={`Select ${option} as your diet preference`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Commute Mode mapping */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] text-zinc-500 dark:text-zinc-300 font-bold uppercase font-mono tracking-wider">Commuting Mode</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['bike', 'public transport', 'car', 'walking'].map((option) => (
                    <button
                      key={option}
                      onClick={() => handleUpdate({ commuteMode: option })}
                      className={`px-3 py-2.5 rounded-xl border capitalize text-center text-xs font-semibold cursor-pointer transition-all ${
                        profile.commuteMode === option
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500 shadow-sm'
                          : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 text-zinc-650 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900/60'
                      }`}
                      aria-label={`Select ${option} as your commute preference`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Energy awareness */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] text-zinc-500 dark:text-zinc-300 font-bold uppercase font-mono tracking-wider">Energy Awareness Baseline</span>
                <div className="grid grid-cols-3 gap-2">
                  {['low', 'medium', 'high'].map((option) => (
                    <button
                      key={option}
                      onClick={() => handleUpdate({ energyAwareness: option })}
                      className={`px-3 py-2.5 rounded-xl border capitalize text-center text-xs font-semibold cursor-pointer transition-all ${
                        profile.energyAwareness === option
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500 shadow-sm'
                          : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 text-zinc-650 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900/60'
                      }`}
                      aria-label={`Select ${option} as your energy conservation preference`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </Card>

          {/* Preferences and Personalizations (Theme + Notifications) */}
          <Card className="p-6 space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-150/40 dark:border-zinc-800/80">
              <Sliders className="w-5 h-5 text-emerald-500" />
              <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">Appearance & Feed Preferences</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Appearance preferences */}
              <div className="space-y-2.5">
                <span className="text-[10px] text-zinc-500 dark:text-zinc-300 font-bold uppercase font-mono tracking-wider">Appearance Mode</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => theme === 'dark' && toggleTheme()}
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer transition-all ${
                      theme === 'light'
                        ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/80 shadow-xs'
                        : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900/60'
                    }`}
                    aria-label="Toggle light mode"
                  >
                    <Sun className="w-4 h-4 text-amber-500" /> Light Mode
                  </button>
                  <button
                    onClick={() => theme === 'light' && toggleTheme()}
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer transition-all ${
                      theme === 'dark'
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500 shadow-xs'
                        : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900/60'
                    }`}
                    aria-label="Toggle dark mode"
                  >
                    <Moon className="w-4 h-4 text-indigo-400" /> Dark Mode
                  </button>
                </div>
              </div>

              {/* Notification preferences toggle */}
              <div className="space-y-2.5">
                <span className="text-[10px] text-zinc-500 dark:text-zinc-300 font-bold uppercase font-mono tracking-wider">Reminders configuration</span>
                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50/50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800/80">
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-semibold text-zinc-850 dark:text-zinc-200">Eco Reminders</p>
                    <p className="text-[10px] text-zinc-405 dark:text-zinc-300 font-light">Real-time sync prompts</p>
                  </div>
                  <button
                    onClick={() => setEcoReminders(!ecoReminders)}
                    className={`w-10 h-6.5 rounded-full transition-colors relative outline-none flex items-center cursor-pointer ${
                      ecoReminders ? 'bg-emerald-500' : 'bg-zinc-350 dark:bg-zinc-800'
                    }`}
                    aria-label="Toggle eco email reminders"
                  >
                    <motion.span
                      className="w-4.5 h-4.5 rounded-full bg-white shadow-xs absolute left-1"
                      animate={{ x: ecoReminders ? 16 : 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>
              </div>
            </div>
          </Card>

          {/* Privacy Constraints guarantee */}
          <Card className="p-6 space-y-3 border-l-4 border-l-emerald-500">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-850 dark:text-zinc-100">Privacy & Security</h3>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-500 font-light leading-relaxed">
              We adhere strictly to client privacy covenants. There is no bank integration, real-time location telemetry logging, or intrusive data selling. All processing occurs locally in the app, or secured server-side on Google Cloud Run containers via Google Gemini pipelines.
            </p>
          </Card>
        </div>

        {/* Destruction and developer controls */}
        <div className="space-y-6">
          <Card className="p-5 space-y-4 border border-rose-500/20 dark:border-rose-950">
            <div className="flex items-center gap-2 text-rose-500 pb-2 border-b border-rose-500/10">
              <RefreshCw className="w-4.5 h-4.5" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Reset Settings</h3>
            </div>

            <p className="text-[11px] text-zinc-500 dark:text-zinc-300 font-light leading-relaxed">
              Resetting baseline deletes current points, achievements mapping, and active messages context to re-initialize onboarding wizard steps.
            </p>

            <Button
              variant="destructive"
              size="sm"
              className="w-full text-xs font-semibold"
              onClick={onReset}
              aria-label="Reset your pioneer profile and onboarding data"
            >
              Reset Pioneer Profile
            </Button>
          </Card>
        </div>

      </div>

    </div>
  );
});


