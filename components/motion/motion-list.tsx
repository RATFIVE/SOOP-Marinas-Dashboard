"use client";

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode, forwardRef } from 'react';
import { staggerContainer, staggerItem } from '@/lib/animation-variants';
import { useReducedMotion } from '@/lib/use-reduced-motion';
import { cn } from '@/lib/utils';

interface MotionListProps extends Omit<HTMLMotionProps<"div">, 'variants'> {
  children: ReactNode;
  stagger?: boolean;
  animateOnScroll?: boolean;
}

interface MotionListItemProps extends Omit<HTMLMotionProps<"div">, 'variants'> {
  children: ReactNode;
}

/**
 * Animated list container with stagger support
 */
export const MotionList = forwardRef<HTMLDivElement, MotionListProps>(
  ({ children, stagger = true, animateOnScroll = true, className, ...props }, ref) => {
    const prefersReducedMotion = useReducedMotion();

    const variants = prefersReducedMotion 
      ? {
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 0.1 } }
        }
      : stagger 
        ? staggerContainer 
        : {
            hidden: { opacity: 0 },
            visible: { opacity: 1 }
          };

    if (animateOnScroll) {
      return (
        <motion.div
          ref={ref}
          variants={variants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-20px" }}
          className={className}
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
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

MotionList.displayName = "MotionList";

/**
 * Animated list item for use with MotionList
 */
export const MotionListItem = forwardRef<HTMLDivElement, MotionListItemProps>(
  ({ children, className, ...props }, ref) => {
    const prefersReducedMotion = useReducedMotion();

    const variants = prefersReducedMotion 
      ? {
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 0.1 } }
        }
      : staggerItem;

    return (
      <motion.div
        ref={ref}
        variants={variants}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

MotionListItem.displayName = "MotionListItem";