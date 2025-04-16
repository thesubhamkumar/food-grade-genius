
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info } from 'lucide-react';

const facts = [
  "Eating an apple is more effective at keeping you awake than drinking a cup of coffee.",
  "Strawberries have more vitamin C than oranges by weight.",
  "Your taste buds are replaced every 1-2 weeks, so you can learn to love foods you dislike.",
  "Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old.",
  "Bananas are botanically berries, but strawberries aren't.",
  "The most expensive spice in the world is saffron, which can cost up to $5,000 per pound.",
  "Adding a small amount of salt to coffee can reduce bitterness without making it taste salty.",
];

const DidYouKnowWidget = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentFact, setCurrentFact] = useState('');
  
  useEffect(() => {
    // Show the widget after 5 seconds
    const showTimer = setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * facts.length);
      setCurrentFact(facts[randomIndex]);
      setIsVisible(true);
    }, 5000);
    
    return () => clearTimeout(showTimer);
  }, []);
  
  const variants = {
    hidden: { 
      opacity: 0, 
      y: 100,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    },
    exit: { 
      opacity: 0, 
      y: 20,
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="fixed bottom-5 right-5 bg-white shadow-lg rounded-lg p-4 max-w-xs z-50 border border-health-primary/20"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
        >
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-health-primary" />
              <h4 className="font-semibold text-health-primary">Did You Know?</h4>
            </div>
            <button 
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="text-sm text-gray-700">{currentFact}</p>
          
          <motion.div 
            className="absolute -z-10 top-0 left-0 w-full h-full bg-gradient-to-br from-health-secondary/30 to-transparent rounded-lg"
            animate={{ 
              background: [
                "linear-gradient(to bottom right, rgba(187, 247, 208, 0.3), transparent)",
                "linear-gradient(to bottom right, rgba(74, 222, 128, 0.2), transparent)",
                "linear-gradient(to bottom right, rgba(187, 247, 208, 0.3), transparent)"
              ]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              repeatType: "reverse" 
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DidYouKnowWidget;
