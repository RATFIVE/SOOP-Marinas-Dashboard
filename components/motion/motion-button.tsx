"use client";

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode, forwardRef } from 'react';
import { buttonVariants } from '@/lib/animation-variants';
import { useReducedMotion } from '@/lib/use-reduced-motion';
import { cn } from '@/lib/utils';

interface MotionButtonProps extends Omit<HTMLMotionProps<"button">, 'variants'> {
  children: ReactNode;
  disabled?: boolean;
  variant?: 'default' | 'subtle';
}

/**
 * Animated button wrapper with hover, tap, and disabled states
 */
export const MotionButton = forwardRef<HTMLButtonElement, MotionButtonProps>(
  ({ children, disabled = false, variant = 'default', className, ...props }, ref) => {
    const prefersReducedMotion = useReducedMotion();

    const variants = prefersReducedMotion ? {} : buttonVariants;
    const animate = disabled 
      ? (prefersReducedMotion ? {} : "disabled")
      : (prefersReducedMotion ? {} : "idle");

    return (
      <motion.button
        ref={ref}
        variants={variants}
        initial={prefersReducedMotion ? {} : "idle"}
        animate={animate}
        whileHover={prefersReducedMotion || disabled ? {} : "hover"}
        whileTap={prefersReducedMotion || disabled ? {} : "tap"}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

MotionButton.displayName = "MotionButton";