import { motion } from 'motion/react';
import { ButtonProps } from '../types';

export function Button({
  id,
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  // Variant styling classes
  const variantClasses = {
    primary: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-900/10 dark:shadow-emerald-950/20 border border-emerald-500/20 font-medium',
    secondary: 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-100 shadow-sm border border-zinc-200/50 dark:border-zinc-700/50',
    ghost: 'bg-transparent hover:bg-zinc-100 text-zinc-650 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-200',
    destructive: 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-900/10 border border-rose-500/20',
    accent: 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white shadow-md border border-emerald-400/20 font-semibold',
  };

  // Size styling classes
  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5',
    md: 'text-sm px-4.5 py-2.5 rounded-xl gap-2',
    lg: 'text-base px-6 py-3.5 rounded-2xl gap-2.5',
  };

  const baseClasses = 'inline-flex items-center justify-center font-sans tracking-wide transition-colors focus:ring-2 focus:ring-emerald-500/40 focus:outline-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

  return (
    <motion.button
      id={id}
      whileHover={{ scale: disabled || isLoading ? 1 : 1.015 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.96 }}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...(props as any)}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      {!isLoading && leftIcon && <span className="flex items-center shrink-0">{leftIcon}</span>}
      <span className="truncate">{children}</span>
      {!isLoading && rightIcon && <span className="flex items-center shrink-0">{rightIcon}</span>}
    </motion.button>
  );
}
