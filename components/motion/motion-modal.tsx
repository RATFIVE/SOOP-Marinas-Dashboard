"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';
import { modalVariants, backdropVariants } from '@/lib/animation-variants';
import { useReducedMotion } from '@/lib/use-reduced-motion';
import { cn } from '@/lib/utils';

interface MotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  showBackdrop?: boolean;
}

/**
 * Animated modal with backdrop and focus management
 */
export function MotionModal({ 
  isOpen, 
  onClose, 
  children, 
  className,
  showBackdrop = true 
}: MotionModalProps) {
  const prefersReducedMotion = useReducedMotion();

  const modalAnimation = prefersReducedMotion 
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : modalVariants;

  const backdropAnimation = prefersReducedMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : backdropVariants;

  const transition = prefersReducedMotion
    ? { duration: 0.1 }
    : undefined;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {showBackdrop && (
            <motion.div
              variants={backdropAnimation}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={transition}
              onClick={onClose}
              className="absolute inset-0 bg-black/50"
            />
          )}
          <motion.div
            variants={modalAnimation}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={transition}
            className={cn(
              "relative z-10 max-h-[90vh] w-full max-w-lg overflow-auto",
              "rounded-lg border bg-background p-6 shadow-lg",
              className
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}