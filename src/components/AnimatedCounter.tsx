import { useEffect, useRef, useState } from 'react';
import { AnimatedCounterProps } from '../types';

const FRAME_DURATION_MS = 1000;

export function AnimatedCounter({
  id,
  value,
  prefix = '',
  suffix = '',
  duration = 1,
  decimals = 0
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);

  const frameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const previousValueRef = useRef(0);

  useEffect(() => {
    const animationDuration = Math.max(duration, 0.2) * FRAME_DURATION_MS;
    previousValueRef.current = displayValue;
    startTimeRef.current = null;

    const animateCounter = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / animationDuration, 1);

      const easedProgress = 1 - Math.pow(1 - progress, 3);

      const nextValue =
        previousValueRef.current +
        (value - previousValueRef.current) * easedProgress;

      setDisplayValue(nextValue);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animateCounter);
      } else {
        setDisplayValue(value);
      }
    };

    frameRef.current = requestAnimationFrame(animateCounter);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [value, duration]);

  return (
    <span
      id={id}
      className="font-mono tabular-nums"
      aria-live="polite"
      aria-label={`Counter value ${displayValue.toFixed(decimals)}`}
    >
      {prefix}
      {displayValue.toFixed(decimals)}
      {suffix}
    </span>
  );
}