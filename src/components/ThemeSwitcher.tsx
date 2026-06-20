import { Moon, Sun } from 'lucide-react';
import { motion } from 'motion/react';
import { useTheme } from './ThemeProvider';

export function ThemeSwitcher({ id }: { id?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      id={id}
      onClick={toggleTheme}
      className="relative w-15 h-8 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700/60 rounded-full p-1 transition-colors duration-300 flex items-center justify-between cursor-pointer outline-none focus:ring-2 focus:ring-emerald-500/20"
      aria-label="Toggle theme mode"
    >
      {/* Dynamic slider bubble */}
      <motion.div
        className="absolute w-6 h-6 bg-white dark:bg-zinc-950 rounded-full shadow-sm flex items-center justify-center border border-zinc-200/20"
        animate={{
          x: theme === 'dark' ? 26 : 0,
        }}
        transition={{ type: 'spring', stiffness: 450, damping: 28 }}
      />

      <span className="z-10 ml-1 rounded-full text-amber-500 dark:text-zinc-300 transition-colors">
        <Sun className="w-4 h-4 stroke-[2.5]" />
      </span>
      <span className="z-10 mr-1 rounded-full text-zinc-500 dark:text-sky-400 transition-colors">
        <Moon className="w-4 h-4 stroke-[2.5]" />
      </span>
    </button>
  );
}
