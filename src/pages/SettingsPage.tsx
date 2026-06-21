import {
  Moon,
  RefreshCw,
  Shield,
  Sliders,
  Sun,
  User,
} from 'lucide-react';

import { motion } from 'motion/react';

import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useTheme } from '../components/ThemeProvider';
import { useUserStore } from '../store/userStore';
import { UserProfile } from '../types';

export interface SettingsPageProps {
  profile?: UserProfile;
  onReset?: () => void;
  onUpdateProfile?: (
    profile: UserProfile
  ) => void;
}

export const SettingsPage =
  React.memo(function SettingsPage({
    profile: propProfile,
    onReset: propOnReset,
    onUpdateProfile,
  }: SettingsPageProps) {
    const storeProfile =
      useUserStore(
        (s) => s.profile
      );

    const storeResetUser =
      useUserStore(
        (s) => s.resetUser
      );

    const setProfile =
      useUserStore(
        (s) => s.setProfile
      );

    const { theme, toggleTheme } =
      useTheme();

    const profile =
      propProfile || storeProfile;

    const onReset =
      propOnReset ||
      storeResetUser;

    const [ecoReminders, setEcoReminders] =
      useState(() => {
        if (
          typeof window !==
          'undefined'
        ) {
          return (
            localStorage.getItem(
              'carbon-eco-reminders'
            ) !== 'false'
          );
        }
        return true;
      });

    const [nameInput, setNameInput] =
      useState(
        profile?.name || ''
      );

    useEffect(() => {
      localStorage.setItem(
        'carbon-eco-reminders',
        String(
          ecoReminders
        )
      );
    }, [ecoReminders]);

    if (!profile) return null;

    const handleUpdate =
      useCallback(
        (
          updates: Partial<UserProfile>
        ) => {
          const updated = {
            ...profile,
            ...updates,
          };

          if (
            onUpdateProfile
          ) {
            onUpdateProfile(
              updated
            );
          }

          setProfile(
            updated
          );
        },
        [
          profile,
          onUpdateProfile,
          setProfile,
        ]
      );

    const handleThemeLight =
      useCallback(() => {
        if (
          theme ===
          'dark'
        ) {
          toggleTheme();
        }
      }, [
        theme,
        toggleTheme,
      ]);

    const handleThemeDark =
      useCallback(() => {
        if (
          theme ===
          'light'
        ) {
          toggleTheme();
        }
      }, [
        theme,
        toggleTheme,
      ]);

    return (
      <div className="space-y-8 font-sans">

        {/* Header */}

        <div className="border-b border-zinc-200/50 pb-5 dark:border-zinc-800">

          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Settings & Profile
          </h1>

          <p className="mt-1 text-xs font-light text-zinc-500 dark:text-zinc-300">
            Update preferences,
            theme, reminders,
            and account settings.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* Left */}

          <div className="space-y-6 lg:col-span-2">

            {/* Profile */}

            <Card className="space-y-6 p-6">

              <div className="flex items-center gap-2 border-b border-zinc-200 pb-3 dark:border-zinc-800">

                <User className="h-5 w-5 text-emerald-500" />

                <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
                  Personal Profile
                </h2>
              </div>

              <div className="space-y-4">

                {/* Name */}

                <div className="space-y-2">

                  <label
                    htmlFor="settings-name"
                    className="text-xs font-semibold text-zinc-500 dark:text-zinc-300"
                  >
                    User Name
                  </label>

                  <input
                    id="settings-name"
                    type="text"
                    value={
                      nameInput
                    }
                    placeholder="Enter your name"
                    onChange={(
                      e
                    ) => {
                      setNameInput(
                        e.target.value
                      );

                      handleUpdate(
                        {
                          name: e
                            .target
                            .value,
                        }
                      );
                    }}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-800 outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                  />
                </div>

                {/* Diet */}

                <div className="space-y-2">

                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-300">
                    Diet Preference
                  </span>

                  <div className="grid grid-cols-3 gap-2">

                    {[
                      'vegetarian',
                      'vegan',
                      'omnivore',
                    ].map(
                      (
                        option
                      ) => (
                        <button
                          key={
                            option
                          }
                          type="button"
                          onClick={() =>
                            handleUpdate(
                              {
                                dietPreference:
                                  option,
                              }
                            )
                          }
                          className={`rounded-xl border px-3 py-2 text-xs font-semibold capitalize ${profile.dietPreference ===
                            option
                            ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                            : 'border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300'
                            }`}
                        >
                          {
                            option
                          }
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Commute */}

                <div className="space-y-2">

                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-300">
                    Commute Mode
                  </span>

                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">

                    {[
                      'bike',
                      'public transport',
                      'car',
                      'walking',
                    ].map(
                      (
                        option
                      ) => (
                        <button
                          key={
                            option
                          }
                          type="button"
                          onClick={() =>
                            handleUpdate(
                              {
                                commuteMode:
                                  option,
                              }
                            )
                          }
                          className={`rounded-xl border px-3 py-2 text-xs font-semibold capitalize ${profile.commuteMode ===
                            option
                            ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                            : 'border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300'
                            }`}
                        >
                          {
                            option
                          }
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Energy */}

                <div className="space-y-2">

                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-300">
                    Energy Awareness
                  </span>

                  <div className="grid grid-cols-3 gap-2">

                    {[
                      'low',
                      'medium',
                      'high',
                    ].map(
                      (
                        option
                      ) => (
                        <button
                          key={
                            option
                          }
                          type="button"
                          onClick={() =>
                            handleUpdate(
                              {
                                energyAwareness:
                                  option,
                              }
                            )
                          }
                          className={`rounded-xl border px-3 py-2 text-xs font-semibold capitalize ${profile.energyAwareness ===
                            option
                            ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                            : 'border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300'
                            }`}
                        >
                          {
                            option
                          }
                        </button>
                      )
                    )}
                  </div>
                </div>

              </div>
            </Card>

            {/* Appearance */}

            <Card className="space-y-5 p-6">

              <div className="flex items-center gap-2 border-b border-zinc-200 pb-3 dark:border-zinc-800">

                <Sliders className="h-5 w-5 text-emerald-500" />

                <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
                  Appearance & Preferences
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                {/* Theme */}

                <div className="space-y-2">

                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    Appearance Mode
                  </span>

                  <div className="grid grid-cols-2 gap-2">

                    <button
                      type="button"
                      onClick={
                        handleThemeLight
                      }
                      className={`rounded-xl border p-3 text-xs font-semibold ${theme ===
                        'light'
                        ? 'border-amber-500 bg-amber-500/10 text-amber-700'
                        : 'border-zinc-200 bg-zinc-50 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950'
                        }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Sun className="h-4 w-4" />
                        Light
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={
                        handleThemeDark
                      }
                      className={`rounded-xl border p-3 text-xs font-semibold ${theme ===
                        'dark'
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700'
                        : 'border-zinc-200 bg-zinc-50 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950'
                        }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Moon className="h-4 w-4" />
                        Dark
                      </div>
                    </button>
                  </div>
                </div>

                {/* Reminders */}

                <div className="space-y-2">

                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    Reminders
                  </span>

                  <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-950">

                    <div>

                      <p className="text-[11px] font-semibold text-zinc-800 dark:text-zinc-200">
                        Eco Reminders
                      </p>

                      <p className="text-[10px] text-zinc-500">
                        Real-time sync prompts
                      </p>
                    </div>

                    <button
                      type="button"
                      aria-label="Toggle eco reminders"
                      title="Toggle eco reminders"
                      onClick={() =>
                        setEcoReminders((prev) => !prev)
                      }
                      className={`relative flex h-6 w-10 items-center rounded-full transition-colors ${ecoReminders
                        ? 'bg-emerald-500'
                        : 'bg-zinc-400 dark:bg-zinc-700'
                        }`}
                    >
                      <span className="sr-only">
                        Eco reminders
                      </span>

                      <motion.span
                        className="absolute left-1 h-4 w-4 rounded-full bg-white"
                        animate={{
                          x: ecoReminders ? 16 : 0,
                        }}
                        transition={{
                          type: 'spring',
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    </button>
                  </div>
                </div>

              </div>
            </Card>

            {/* Privacy */}

            <Card className="border-l-4 border-l-emerald-500 p-6 space-y-3">

              <div className="flex items-center gap-2">

                <Shield className="h-5 w-5 text-emerald-500" />

                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-100">
                  Privacy & Security
                </h3>
              </div>

              <p className="text-xs font-light leading-relaxed text-zinc-500 dark:text-zinc-300">
                All profile and sustainability
                calculations are processed
                securely. No intrusive
                tracking or data resale.
              </p>
            </Card>
          </div>

          {/* Right */}

          <div className="space-y-6">

            <Card className="space-y-4 border border-rose-500/20 p-5">

              <div className="flex items-center gap-2 border-b border-rose-500/10 pb-2 text-rose-500">

                <RefreshCw className="h-4 w-4" />

                <h3 className="text-xs font-bold uppercase tracking-wider">
                  Reset Settings
                </h3>
              </div>

              <p className="text-[11px] font-light leading-relaxed text-zinc-500 dark:text-zinc-300">
                Resetting deletes progress,
                onboarding profile and
                stored preferences.
              </p>

              <Button
                variant="destructive"
                size="sm"
                className="w-full text-xs"
                onClick={onReset}
              >
                Reset Profile
              </Button>
            </Card>
          </div>
        </div>
      </div>
    );
  });