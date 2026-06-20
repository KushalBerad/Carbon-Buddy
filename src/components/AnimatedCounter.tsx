import React, { useEffect, useState, useRef } from 'react';
import { AnimatedCounterProps } from '../types';

export function AnimatedCounter({
  id,
  value,
  prefix = '',
  suffix = '',
  duration = 1.0,
  decimals = 0,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState<number>(0);
  const animationFrameId = useRef<number | null>(null);
  const startValRef = useRef<number>(0);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    // Reset or start animating when value changes
    startValRef.current = displayValue;
    startTimeRef.current = null;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = (timestamp - startTimeRef.current) / (duration * 1005);
      
      if (progress < 1) {
        const easedProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
        const currentVal = startValRef.current + (value - startValRef.current) * easedProgress;
        setDisplayValue(currentVal);
        animationFrameId.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [value, duration]);

  return (
    <span id={id} className="font-mono tabular-nums">
      {prefix}
      {displayValue.toFixed(decimals)}
      {suffix}
    </span>
  );
}
