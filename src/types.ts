import { ButtonHTMLAttributes, HTMLAttributes, ReactNode, MouseEventHandler, CSSProperties } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'accent';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  id?: string;
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  style?: CSSProperties;
}

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  id?: string;
  key?: any;
  children?: ReactNode;
  interactive?: boolean;
  outlined?: boolean;
  glowOnHover?: boolean;
  className?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
  style?: CSSProperties;
}

export interface ProgressRingProps {
  id?: string;
  percentage: number;
  size?: number;
  strokeWidth?: number;
  colorClass?: string;
  backgroundColorClass?: string;
  label?: string;
  subLabel?: string;
}

export interface StatCardProps {
  id?: string;
  title: string;
  value: number;
  unit?: string;
  changeValue?: number;
  changeType?: 'positive' | 'negative' | 'neutral';
  changeLabel?: string;
  icon?: ReactNode;
  glowColor?: string;
}

export interface HabitToggleProps {
  id?: string;
  key?: any;
  label: string;
  carbonOffsetGrams: number;
  moneySaved?: number;
  checked: boolean;
  onChange: (checked: boolean) => void;
  category?: 'transport' | 'food' | 'energy' | 'waste' | 'water';
}

export interface AchievementBadgeProps {
  id?: string;
  title: string;
  description: string;
  unlockedAt?: string; // date string or null
  iconName: string; // resolved to a lucide-react icon
  points: number;
  rare?: boolean;
}

export interface AnimatedCounterProps {
  id?: string;
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number; // duration in seconds
  decimals?: number;
}

export interface ModalProps {
  id?: string;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// User Profile state
export interface UserProfile {
  name: string;
  dietPreference: string;
  commuteMode: string;
  energyAwareness: string;
  level: number;
  points: number;
  streak: number;
  carbonSavedTotal: number;
  moneySavedTotal: number;
}

// Weekly lifestyle reflection
export interface WeeklyReflection {
  weekId: string;
  date: string;
  dietScore: number;
  commuteScore: number;
  energyScore: number;
  aiFeedback: string;
}

// AI Message structure
export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

// Meal option structure
export interface MealAlternative {
  id: string;
  originalName: string;
  alternativeName: string;
  carbonOffsetGrams: number;
  priceSavedUSD: number;
  shortImpactDescription: string;
  adopted: boolean;
}

