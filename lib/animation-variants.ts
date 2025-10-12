// Animation variants und Konfigurationen für konsistente Animationen
export const animationConfig = {
  // Durations (in seconds)
  duration: {
    micro: 0.16,
    small: 0.24,
    medium: 0.4,
    large: 0.8,
  },
  
  // Easing curves
  easing: {
    easeOut: [0.0, 0.0, 0.2, 1.0] as [number, number, number, number],
    easeIn: [0.4, 0.0, 1.0, 1.0] as [number, number, number, number],
    easeInOut: [0.4, 0.0, 0.2, 1.0] as [number, number, number, number],
    spring: { type: "spring" as const, damping: 25, stiffness: 300 },
    springBouncy: { type: "spring" as const, damping: 15, stiffness: 400 },
  },
  
  // Common delays
  stagger: 0.06,
  staggerFast: 0.04,
  staggerSlow: 0.08,
} as const;

// Page transition variants
export const pageVariants = {
  initial: { 
    opacity: 0, 
    y: 20,
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: animationConfig.duration.medium,
      ease: animationConfig.easing.easeOut,
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: {
      duration: animationConfig.duration.small,
      ease: animationConfig.easing.easeIn,
    }
  }
};

// Layout transition variants
export const layoutVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      duration: animationConfig.duration.small,
      ease: animationConfig.easing.easeOut,
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: animationConfig.duration.micro,
      ease: animationConfig.easing.easeIn,
    }
  }
};

// Card/Component reveal variants
export const revealVariants = {
  hidden: { 
    opacity: 0, 
    y: 24,
    scale: 0.98,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: animationConfig.duration.medium,
      ease: animationConfig.easing.easeOut,
    }
  }
};

// List stagger variants
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: animationConfig.stagger,
      delayChildren: 0.1,
    }
  }
};

export const staggerItem = {
  hidden: { 
    opacity: 0, 
    y: 20,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: animationConfig.duration.medium,
      ease: animationConfig.easing.easeOut,
    }
  }
};

// Button interaction variants
export const buttonVariants = {
  idle: { 
    scale: 1,
    transition: {
      duration: animationConfig.duration.micro,
      ease: animationConfig.easing.easeOut,
    }
  },
  hover: { 
    scale: 1.02,
    transition: {
      duration: animationConfig.duration.micro,
      ease: animationConfig.easing.easeOut,
    }
  },
  tap: { 
    scale: 0.98,
    transition: {
      duration: animationConfig.duration.micro,
      ease: animationConfig.easing.easeInOut,
    }
  },
  disabled: {
    scale: 1,
    opacity: 0.6,
    transition: {
      duration: animationConfig.duration.small,
      ease: animationConfig.easing.easeOut,
    }
  }
};

// Modal/Dialog variants
export const modalVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95,
    y: 10,
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: {
      duration: animationConfig.duration.medium,
      type: "spring" as const,
      damping: 15,
      stiffness: 400,
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    y: 10,
    transition: {
      duration: animationConfig.duration.small,
      ease: animationConfig.easing.easeIn,
    }
  }
};

// Backdrop variants
export const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      duration: animationConfig.duration.small,
      ease: animationConfig.easing.easeOut,
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: animationConfig.duration.small,
      ease: animationConfig.easing.easeIn,
    }
  }
};

// Toast/Notification variants
export const toastVariants = {
  hidden: { 
    opacity: 0, 
    x: 100,
    scale: 0.98,
  },
  visible: { 
    opacity: 1, 
    x: 0,
    scale: 1,
    transition: {
      duration: animationConfig.duration.medium,
      type: "spring" as const,
      damping: 15,
      stiffness: 400,
    }
  },
  exit: { 
    opacity: 0, 
    x: 100,
    scale: 0.98,
    transition: {
      duration: animationConfig.duration.small,
      ease: animationConfig.easing.easeIn,
    }
  }
};

// Navigation variants
export const navItemVariants = {
  idle: { 
    scale: 1,
    opacity: 0.8,
  },
  hover: { 
    scale: 1.05,
    opacity: 1,
    transition: {
      duration: animationConfig.duration.micro,
      ease: animationConfig.easing.easeOut,
    }
  },
  active: {
    scale: 1,
    opacity: 1,
  }
};

// Chart/Data visualization entrance
export const chartVariants = {
  hidden: { 
    opacity: 0,
    scaleY: 0.8,
  },
  visible: { 
    opacity: 1,
    scaleY: 1,
    transition: {
      duration: animationConfig.duration.large,
      ease: animationConfig.easing.easeOut,
      delay: 0.2,
    }
  }
};

// Map entrance animation
export const mapVariants = {
  hidden: { 
    opacity: 0,
    scale: 0.95,
  },
  visible: { 
    opacity: 1,
    scale: 1,
    transition: {
      duration: animationConfig.duration.medium,
      ease: animationConfig.easing.easeOut,
      delay: 0.3,
    }
  }
};