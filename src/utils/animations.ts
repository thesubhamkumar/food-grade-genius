
import { Variants } from 'framer-motion';

// Staggered animation for children elements
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Fade up animation for text and content blocks
export const fadeUp: Variants = {
  hidden: { y: 30, opacity: 0 },
  show: { 
    y: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      duration: 0.8,
      bounce: 0.4
    }
  }
};

// Fade in animation for images and cards
export const fadeIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

// Slide in from left
export const slideInLeft: Variants = {
  hidden: { x: -60, opacity: 0 },
  show: { 
    x: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      duration: 0.8,
      bounce: 0.4
    }
  }
};

// Slide in from right
export const slideInRight: Variants = {
  hidden: { x: 60, opacity: 0 },
  show: { 
    x: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      duration: 0.8,
      bounce: 0.4
    }
  }
};

// Zoom in animation
export const zoomIn: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  show: { 
    scale: 1, 
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

// Floating animation (for background elements)
export const float: Variants = {
  hidden: { y: 0, opacity: 0 },
  show: { 
    opacity: 1,
    transition: {
      duration: 1
    }
  },
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }
  }
};

// Button hover animation
export const buttonHover: Variants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  },
  tap: { 
    scale: 0.98,
    transition: {
      duration: 0.1
    }
  }
};

// Card hover animation
export const cardHover: Variants = {
  initial: { 
    y: 0,
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)" 
  },
  hover: { 
    y: -5,
    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

// Progress bar animation for scroll
export const progressBarVariants: Variants = {
  hidden: { scaleX: 0, originX: 0 },
  show: (scrollYProgress: number) => ({ 
    scaleX: scrollYProgress,
    transition: { duration: 0.1, ease: "linear" }
  })
};

// Page transition variants
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
  },
  enter: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
      when: "afterChildren",
      staggerChildren: 0.1,
    },
  },
};

// Particle animation for background elements
export const particleVariants: Variants = {
  hidden: { opacity: 0, scale: 0 },
  show: { 
    opacity: [0, 0.5, 0],
    scale: [0, 1, 1.5],
    transition: {
      duration: 3,
      repeat: Infinity,
      delay: Math.random() * 2
    }
  }
};
