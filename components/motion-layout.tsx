"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { pageVariants } from '@/lib/animation-variants';
import { useReducedMotion } from '@/lib/use-reduced-motion';

interface MotionLayoutProps {
  children: ReactNode;
}

/**
 * Global layout wrapper that handles page transitions
 * Wraps page content with motion animations
 */
export default function MotionLayout({ children }: MotionLayoutProps) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  // Use reduced motion variants if user prefers
  const variants = prefersReducedMotion 
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : pageVariants;

  const transition = prefersReducedMotion
    ? { duration: 0.1 }
    : undefined;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        transition={transition}
        className="min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}