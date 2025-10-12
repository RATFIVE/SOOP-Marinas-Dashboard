"use client";

import { useEffect, useState } from 'react';

/**
 * Hook to detect user's reduced motion preference
 * Returns true if user prefers reduced motion, false otherwise
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check if we're on the client side
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
}

/**
 * Hook to get animation config that respects reduced motion preference
 */
export function useAnimationConfig() {
  const prefersReducedMotion = useReducedMotion();

  return {
    prefersReducedMotion,
    // Reduced animation variants
    reducedMotion: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.1 }
    }
  };
}