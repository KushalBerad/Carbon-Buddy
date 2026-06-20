import React from 'react';
import { motion } from 'motion/react';
import { CardProps } from '../types';

export function Card({
  id,
  children,
  interactive = false,
  outlined = true,
  glowOnHover = false,
  className = '',
  ...props
}: CardProps) {
  const baseClasses = 'relative rounded-2xl p-6 transition-all duration-300';
  
  // Theme styling
  const themeClasses = 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50';
  
  const borderClasses = outlined
    ? 'border border-zinc-100 dark:border-zinc-800/80 shadow-xs'
    : 'shadow-lg shadow-zinc-100/40 dark:shadow-zinc-950/20';

  const interactiveClasses = interactive
    ? 'cursor-pointer hover:shadow-md dark:hover:shadow-zinc-950/40 hover:border-zinc-200/80 dark:hover:border-zinc-700/80'
    : '';

  const glowClasses = glowOnHover && interactive
    ? 'hover:after:absolute hover:after:inset-0 hover:after:-z-10 hover:after:rounded-2xl hover:after:bg-emerald-500/5 hover:after:blur-md hover:after:opacity-100 hover:after:transition-colors'
    : '';

  if (interactive) {
    return (
      <motion.div
        id={id}
        whileHover={{ y: -4, scale: 1.005 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className={`${baseClasses} ${themeClasses} ${borderClasses} ${interactiveClasses} ${glowClasses} ${className}`}
        {...(props as any)}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      id={id}
      className={`${baseClasses} ${themeClasses} ${borderClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
