
import { useState, useEffect, useRef } from 'react';
import { Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const quotes = [
  {
    text: "Let food be thy medicine and medicine be thy food.",
    author: "Hippocrates"
  },
  {
    text: "You are what you eat, so don't be fast, cheap, easy, or fake.",
    author: "Unknown"
  },
  {
    text: "The food you eat can be either the safest and most powerful form of medicine or the slowest form of poison.",
    author: "Ann Wigmore"
  },
  {
    text: "Take care of your body. It's the only place you have to live.",
    author: "Jim Rohn"
  },
  {
    text: "Your diet is a bank account. Good food choices are good investments.",
    author: "Bethenny Frankel"
  }
];

export const QuotesCarousel = () => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);

  const handleQuoteChange = (index: number) => {
    setDirection(index > currentQuoteIndex ? 1 : -1);
    setCurrentQuoteIndex(index);
  };

  // Animation variants
  const quoteVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.5 }
      }
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.5 }
      }
    })
  };

  const iconVariants = {
    initial: { scale: 0.8, rotate: -10, opacity: 0.8 },
    animate: { 
      scale: 1, 
      rotate: 0, 
      opacity: 1,
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 200
      }
    },
    hover: { 
      scale: 1.15, 
      rotate: 5, 
      color: "#4ade80",
      transition: { duration: 0.3 }
    }
  };

  const dotVariants = {
    inactive: { scale: 1 },
    active: { 
      scale: 1.3,
      transition: { duration: 0.3 }
    },
    hover: {
      scale: 1.2,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div 
      className="bg-health-secondary/30 rounded-xl p-8 max-w-3xl mx-auto"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      ref={containerRef}
      whileHover={{ boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.1)" }}
    >
      <motion.div 
        className="flex justify-center mb-4"
        variants={iconVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
      >
        <Quote className="h-10 w-10 text-health-primary" />
      </motion.div>
      <div className="text-center overflow-hidden">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentQuoteIndex}
            custom={direction}
            variants={quoteVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="flex flex-col items-center"
          >
            <p className="text-xl md:text-2xl font-medium italic text-gray-800">
              "{quotes[currentQuoteIndex].text}"
            </p>
            <p className="mt-4 text-gray-600">— {quotes[currentQuoteIndex].author}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex justify-center mt-6 space-x-2">
        {quotes.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => handleQuoteChange(index)}
            className={`h-2 w-2 rounded-full transition-colors ${
              index === currentQuoteIndex ? 'bg-health-primary' : 'bg-gray-300'
            }`}
            aria-label={`Go to quote ${index + 1}`}
            variants={dotVariants}
            initial="inactive"
            animate={index === currentQuoteIndex ? "active" : "inactive"}
            whileHover="hover"
          />
        ))}
      </div>
    </motion.div>
  );
};
