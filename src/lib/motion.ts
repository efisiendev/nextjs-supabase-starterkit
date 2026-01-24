/**
 * Optimized Framer Motion Configuration
 * Centralized animation settings for better performance
 */

import type { Transition, Variants } from 'framer-motion';

// Optimized transition defaults
export const TRANSITIONS = {
  fast: { duration: 0.2, ease: 'easeOut' } satisfies Transition,
  base: { duration: 0.3, ease: 'easeOut' } satisfies Transition,
  slow: { duration: 0.5, ease: 'easeOut' } satisfies Transition,
  spring: { type: 'spring' as const, stiffness: 100, damping: 15 } satisfies Transition,
} as const;

// Reusable animation variants
export const FADE_IN_VARIANTS: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: TRANSITIONS.base },
};

export const SLIDE_UP_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: TRANSITIONS.base },
};

export const SCALE_VARIANTS: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: TRANSITIONS.base },
};

export const STAGGER_CONTAINER: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0,
    },
  },
};

// Viewport options for scroll animations
export const VIEWPORT_OPTIONS = {
  once: true,
  margin: '-50px',
  amount: 0.3,
} as const;

// Reduced motion support
export const REDUCE_MOTION_TRANSITION: Transition = {
  duration: 0.01,
};
