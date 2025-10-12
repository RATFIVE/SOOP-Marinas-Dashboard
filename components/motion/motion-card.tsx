"use client";

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode, forwardRef } from 'react';
import { revealVariants } from '@/lib/animation-variants';
import { useReducedMotion } from '@/lib/use-reduced-motion';
import { cn } from '@/lib/utils';

interface MotionCardProps extends Omit<HTMLMotionProps<"div">, 'variants'> {
  children: ReactNode;
  animateOnScroll?: boolean;
  delay?: number;
}

/**
 * Animated card wrapper with reveal animation
 */
export const MotionCard = forwardRef<HTMLDivElement, MotionCardProps>(
  ({ children, animateOnScroll = true, delay = 0, className, ...props }, ref) => {
    const prefersReducedMotion = useReducedMotion();

    const variants = prefersReducedMotion 
      ? {
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 0.1 } }
        }
      : {
          ...revealVariants,
          visible: {
            ...revealVariants.visible,
            transition: {
              ...revealVariants.visible.transition,
              delay,
            }
          }
        };

    if (animateOnScroll) {
      return (
        <motion.div
          ref={ref}
          variants={variants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className={cn(
            "rounded-lg border bg-card text-card-foreground shadow-sm",
            className
          )}
          {...props}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <motion.div
        ref={ref}
        variants={variants}
        initial="hidden"
        animate="visible"
        className={cn(
          "rounded-lg border bg-card text-card-foreground shadow-sm",
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

MotionCard.displayName = "MotionCard";