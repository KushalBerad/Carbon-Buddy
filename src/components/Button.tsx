import { motion } from 'framer-motion';
import { ButtonProps, ButtonSize, ButtonVariant } from '../types';

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
  onClick,
  style,
  title,
  type: buttonType = 'button',
  "aria-label": ariaLabel
}: ButtonProps) {
  const variantClasses: Record<ButtonVariant, string> = {
    primary:
      'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-900/10 dark:shadow-emerald-950/20 border border-emerald-500/20 font-medium',

    secondary:
      'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-100 shadow-sm border border-zinc-200/50 dark:border-zinc-700/50',

    ghost:
      'bg-transparent hover:bg-zinc-100 text-zinc-650 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-200',

    destructive:
      'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-900/10 border border-rose-500/20',

    accent:
      'bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white shadow-md border border-emerald-400/20 font-semibold',
  };

  const sizeClasses: Record<ButtonSize, string> = {
    sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5',
    md: 'text-sm px-4.5 py-2.5 rounded-xl gap-2',
    lg: 'text-base px-6 py-3.5 rounded-2xl gap-2.5',
  };

  const baseClasses =
    'inline-flex items-center justify-center font-sans tracking-wide transition-colors focus:ring-2 focus:ring-emerald-500/40 focus:outline-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

  return (
    <motion.button
      id={id}
      type={buttonType}
      onClick={onClick}
      disabled={disabled || isLoading}
      style={style}
      title={title}
      aria-label={ariaLabel}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      whileTap={{ scale: 0.97 }}
    >
      {isLoading && (
        <div
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      )}

      {!isLoading && leftIcon && (
        <span className="flex items-center shrink-0">{leftIcon}</span>
      )}

      <span className="truncate">{children}</span>

      {!isLoading && rightIcon && (
        <span className="flex items-center shrink-0">{rightIcon}</span>
      )}
    </motion.button>
  );
}