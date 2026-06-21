import { Moon, Sun } from 'lucide-react';
import { motion } from 'motion/react';
import { useMemo } from 'react';
import { useTheme } from './ThemeProvider';

interface ThemeSwitcherProps {
  id?: string;
}

export function ThemeSwitcher({ id }: ThemeSwitcherProps) {
  const { theme, toggleTheme } = useTheme();

  const sliderAnimation = useMemo(
    () => ({
      x: theme === 'dark' ? 26 : 0,
    }),
    [theme],
  );

  const isDarkMode = theme === 'dark';

  return (
    <button
      aria-label={isDarkMode
        ? "Switch to light mode"
        : "Switch to dark mode"
      }
      id={id}
      type="button"
      onClick={toggleTheme}
      title={
        isDarkMode
          ? 'Switch to light mode'
          : 'Switch to dark mode'
      }
      className="relative flex h-8 w-15 cursor-pointer items-center justify-between rounded-full border border-zinc-200/60 bg-zinc-100 p-1 outline-none transition-colors duration-300 focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700/60 dark:bg-zinc-800"
    >
      <motion.div
        className="absolute flex h-6 w-6 items-center justify-center rounded-full border border-zinc-200/20 bg-white shadow-sm dark:bg-zinc-950"
        animate={sliderAnimation}
        transition={{
          type: 'spring',
          stiffness: 450,
          damping: 28,
        }}
      />

      <span className="z-10 ml-1 text-amber-500 transition-colors dark:text-zinc-300">
        <Sun className="h-4 w-4 stroke-[2.5]" />
      </span>

      <span className="z-10 mr-1 text-zinc-500 transition-colors dark:text-sky-400">
        <Moon className="h-4 w-4 stroke-[2.5]" />
      </span>
    </button>
  );
}